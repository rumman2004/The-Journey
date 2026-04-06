import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Card, { CardContent } from '../../components/ui/Card';
import { memoriesAPI, photosAPI } from '../../services/api';

// ── Multi-drop zone ───────────────────────────────────────────────────────────
const MultiDropZone = ({ files, onAddFiles, onRemoveFile }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const validate = (list) => {
    const valid = list.filter(f => {
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
        alert(`${f.name} is not a valid image or video file.`); return false;
      }
      if (f.size > 50 * 1024 * 1024) { alert(`${f.name} is too large. Max 50 MB.`); return false; }
      return true;
    });
    if (valid.length) onAddFiles(valid);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); validate(Array.from(e.dataTransfer.files)); }}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`,
          borderRadius: '8px', padding: 'clamp(1.25rem, 4vw, 2rem) 1rem',
          textAlign: 'center', cursor: 'pointer',
          background: dragOver ? 'rgba(201,168,76,0.04)' : 'rgba(8,13,26,0.5)',
          transition: 'all 0.25s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files.length) validate(Array.from(e.target.files)); e.target.value = ''; }} />
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
        }}>📸</div>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1rem', color: '#f0ece4' }}>
          Drop photos here
        </p>
        <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', color: 'rgba(180,200,225,0.4)' }}>
          or <span style={{ color: 'rgba(201,168,76,0.7)', textDecoration: 'underline' }}>browse files</span> — up to 50 MB each
        </p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {files.map((file, i) => (
            <div key={i} style={{ position: 'relative', width: 72, height: 72, borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.18)' }}>
              {file.type.startsWith('image/')
                ? <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <video src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              }
              <button type="button" onClick={() => onRemoveFile(i)} style={{
                position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(220,80,80,0.9)', color: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem',
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Small inline buttons ──────────────────────────────────────────────────────
const GoldBtn = ({ children, type = 'button', onClick, disabled, outline }) => (
  <button type={type} onClick={onClick} disabled={disabled} style={{
    padding: '0.5rem 1.1rem', fontFamily: "'Lato', sans-serif",
    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    background: outline ? 'transparent' : disabled ? 'rgba(139,105,20,0.35)' : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
    color: outline ? 'rgba(201,168,76,0.75)' : '#080d1a',
    border: outline ? '1px solid rgba(201,168,76,0.3)' : 'none',
    borderRadius: '2px', cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: outline || disabled ? 'none' : '0 0 14px rgba(201,168,76,0.15)',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  }}>{children}</button>
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.4rem' }}>{children}</p>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const AddMessage = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [editMode, setEditMode]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [formData, setFormData]   = useState({
    title: '', content: '', category: 'personal', tags: '',
    memoryDate: new Date().toISOString().split('T')[0], isPublic: true,
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoUrls, setPhotoUrls]           = useState([]);
  const [errors, setErrors]                 = useState({});
  const [history, setHistory]               = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await memoriesAPI.getMyHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch { setHistory([]); }
    finally { setHistoryLoading(false); }
  };

  useEffect(() => { if (user) fetchHistory(); }, [user]);
  if (!user) return null;

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const resetForm = () => {
    setEditMode(false); setEditId(null);
    setFormData({ title: '', content: '', category: 'personal', tags: '', memoryDate: new Date().toISOString().split('T')[0], isPublic: true });
    setSelectedPhotos([]); setPhotoUrls([]); setErrors({});
  };

  const handleEditClick = mem => {
    setEditMode(true); setEditId(mem._id);
    setFormData({ title: mem.title, content: mem.content, category: mem.category || 'personal', tags: mem.tags ? mem.tags.join(', ') : '', memoryDate: mem.memoryDate ? new Date(mem.memoryDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], isPublic: mem.isPublic });
    setPhotoUrls(mem.photos || []); setSelectedPhotos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async id => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    try { await memoriesAPI.deleteMemory(id); fetchHistory(); if (editId === id) resetForm(); }
    catch (e) { alert('Failed to delete: ' + e.message); }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhotos.length) return;
    setPhotoUploading(true);
    try {
      const urls = [];
      for (const photo of selectedPhotos) {
        const r = await photosAPI.uploadPhotos([photo], { album: 'memories', isPublic: formData.isPublic });
        if (r.photos?.[0]) urls.push(r.photos[0].imageUrl);
      }
      setPhotoUrls(p => [...p, ...urls]); setSelectedPhotos([]);
    } catch { alert('Failed to upload photos. Please try again.'); }
    finally { setPhotoUploading(false); }
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim())   e.title   = 'Title is required';
    if (!formData.content.trim()) e.content  = 'Content is required';
    if (!formData.memoryDate)     e.memoryDate = 'Date is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({}); setLoading(true);
    try {
      const payload = { ...formData, photos: photoUrls, tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (editMode) { await memoriesAPI.updateMemory(editId, payload); resetForm(); fetchHistory(); }
      else { const r = await memoriesAPI.createMemory(payload); if (r._id) { resetForm(); fetchHistory(); } else setErrors({ general: 'Failed to create memory' }); }
    } catch (e) { setErrors({ general: e.message || 'Failed to process request' }); }
    finally { setLoading(false); }
  };

  const GoldPanel = ({ children }) => (
    <div style={{
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(201,168,76,0.12)',
      borderRadius: '12px', padding: 'clamp(1.25rem, 4vw, 2rem)',
      backdropFilter: 'blur(14px)',
    }}>{children}</div>
  );

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', color: '#f0ece4', overflowX: 'hidden' }}>

        <section style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2.5rem) clamp(3rem, 8vw, 6rem)',
          maxWidth: '1300px', margin: '0 auto',
          animation: 'page-fade 0.5s ease forwards',
        }}>
          {/* Top rule */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)' }} />

          {/* Back */}
          <Link to="/wall" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(180,200,225,0.4)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = 'rgba(201,168,76,0.7)'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(180,200,225,0.4)'}
          >← Back to Wall</Link>

          {/* Split grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 'clamp(1.5rem, 4vw, 4rem)', alignItems: 'start' }}>

            {/* ── LEFT: FORM ── */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <SectionLabel>Mates Only</SectionLabel>
                <h1 style={{
                  margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                  background: 'linear-gradient(135deg, #f0ece4, #c9a84c)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {editMode ? 'Edit Memory' : 'Share a Memory'}
                </h1>
                <p style={{ margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(180,200,225,0.45)' }}>
                  {editMode ? 'Update the details of your memory.' : 'Create a lasting memory of your college experience.'}
                </p>
              </div>

              <GoldPanel>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {errors.general && (
                    <div style={{ background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.2)', color: '#f87171', borderRadius: '6px', padding: '0.65rem 1rem', fontSize: '0.78rem', fontFamily: "'Lato', sans-serif" }}>{errors.general}</div>
                  )}

                  <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} placeholder="Give your memory a title…" />
                  <TextArea label="Memory Content" name="content" value={formData.content} onChange={handleInputChange} error={errors.content} placeholder="Share details of your college memory…" rows={5} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,190px),1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '0.4rem' }}>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} style={{
                        width: '100%', padding: '0.65rem 0.9rem',
                        background: 'rgba(8,13,26,0.7)', color: '#f0ece4',
                        border: '1px solid rgba(201,168,76,0.15)', borderRadius: '6px',
                        fontFamily: "'Lato', sans-serif", fontSize: '0.82rem', outline: 'none',
                      }}>
                        <option value="personal">Personal</option>
                        <option value="event">Event</option>
                        <option value="achievement">Achievement</option>
                        <option value="group">Group Memory</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input label="Memory Date" name="memoryDate" type="date" value={formData.memoryDate} onChange={handleInputChange} error={errors.memoryDate} />
                  </div>

                  <Input label="Tags (Optional)" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. hackathon, friends" />

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', padding: '0.6rem 0.8rem', borderRadius: '6px', background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleInputChange} style={{ width: 16, height: 16, accentColor: '#c9a84c', cursor: 'pointer' }} />
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: 'rgba(180,200,225,0.6)' }}>
                      Make this memory <strong style={{ color: '#f0ece4' }}>public</strong>
                    </span>
                  </label>

                  {/* Photos */}
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                    <SectionLabel>Photos (Optional)</SectionLabel>
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.18), transparent)', marginBottom: '0.85rem' }} />
                    <MultiDropZone files={selectedPhotos} onAddFiles={f => setSelectedPhotos(p => [...p, ...f])} onRemoveFile={i => setSelectedPhotos(p => p.filter((_, idx) => idx !== i))} />
                    {selectedPhotos.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <GoldBtn onClick={handlePhotoUpload} disabled={photoUploading}>{photoUploading ? 'Uploading…' : '↑ Upload Photos'}</GoldBtn>
                      </div>
                    )}
                    {photoUrls.length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {photoUrls.map((url, i) => (
                          <div key={i} style={{ position: 'relative', width: 56, height: 56, borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
                            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => setPhotoUrls(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 2, right: 2, width: 15, height: 15, borderRadius: '50%', background: 'rgba(220,80,80,0.9)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem' }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,76,0.08)', flexWrap: 'wrap' }}>
                    <GoldBtn outline onClick={editMode ? resetForm : () => navigate('/wall')}>{editMode ? 'Cancel Edit' : 'Cancel'}</GoldBtn>
                    <GoldBtn type="submit" disabled={loading || photoUploading}>{loading ? 'Saving…' : editMode ? 'Update Memory' : 'Save Memory'}</GoldBtn>
                  </div>
                </form>
              </GoldPanel>
            </div>

            {/* ── RIGHT: HISTORY ── */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <SectionLabel>Manage</SectionLabel>
                  <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: '#f0ece4' }}>Your Memory History</h2>
                </div>
                <GoldBtn outline onClick={fetchHistory} disabled={historyLoading}>↻ Refresh</GoldBtn>
              </div>

              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: 'rgba(180,200,225,0.4)' }}>Loading history…</div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(201,168,76,0.12)', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', color: 'rgba(180,200,225,0.4)' }}>You haven't posted any memories yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {history.map(mem => (
                    <div key={mem._id} style={{
                      padding: 'clamp(0.9rem, 2.5vw, 1.25rem)',
                      borderRadius: '8px',
                      background: editId === mem._id ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${editId === mem._id ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`,
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ margin: '0 0 2px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#f0ece4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mem.title}</h3>
                          <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.62rem', color: 'rgba(180,200,225,0.38)', letterSpacing: '0.06em' }}>
                            {new Date(mem.createdAt).toLocaleDateString()} · {mem.isPublic ? 'Public' : 'Private'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          <button onClick={() => handleEditClick(mem)} title="Edit" style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)', color: '#c9a84c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '0.75rem' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.18)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'; }}
                          >✎</button>
                          <button onClick={() => handleDeleteClick(mem._id)} title="Delete" style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '0.7rem' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,80,80,0.18)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,80,80,0.08)'; }}
                          >✕</button>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 0.6rem', fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(180,200,225,0.5)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.7 }}>
                        {mem.content}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(201,168,76,0.07)' }}>
                        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)' }}>
                          {mem.category}{mem.photos?.length > 0 ? ` · ${mem.photos.length} photo${mem.photos.length > 1 ? 's' : ''}` : ''}
                        </span>
                        {mem.photos?.length > 0 && (
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {mem.photos.slice(0, 3).map((url, i) => (
                              <div key={i} style={{ width: 22, height: 22, borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                            {mem.photos.length > 3 && (
                              <div style={{ width: 22, height: 22, borderRadius: '3px', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'rgba(201,168,76,0.5)' }}>+{mem.photos.length - 3}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          @keyframes page-fade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
          /* Collapse to single column on mobile */
          @media (max-width: 860px) {
            section > div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default AddMessage;