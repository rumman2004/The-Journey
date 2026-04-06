import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import { photosAPI } from '../../services/api';

const SEMESTERS = [
  { value: '1st sem', label: 'Semester I' },
  { value: '2nd sem', label: 'Semester II' },
  { value: '3rd sem', label: 'Semester III' },
  { value: '4th sem', label: 'Semester IV' },
  { value: '5th sem', label: 'Semester V' },
  { value: '6th sem', label: 'Semester VI' },
];

const SEM_LABELS = {
  '1st sem': 'Sem I', '2nd sem': 'Sem II', '3rd sem': 'Sem III',
  '4th sem': 'Sem IV', '5th sem': 'Sem V', '6th sem': 'Sem VI',
  'General': 'General',
};

const MAX_FILES = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isVideoFile = (file) => file.type.startsWith('video/');

const isVideoUrl = (url) => {
  if (!url) return false;
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'mov', 'ogg'].includes(ext);
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

// ── Drop Zone ────────────────────────────────────────────────────────────────
const DropZone = ({ files, onAdd, onRemove }) => {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const validate = useCallback((incoming) => {
    const errors = [];
    const accepted = [];
    const currentCount = files.length;

    for (const f of incoming) {
      if (currentCount + accepted.length >= MAX_FILES) {
        errors.push(`Max ${MAX_FILES} files — "${f.name}" skipped.`);
        continue;
      }
      if (!ACCEPTED_TYPES.includes(f.type)) {
        errors.push(`"${f.name}" — unsupported format.`);
        continue;
      }
      const limit = isVideoFile(f) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      if (f.size > limit) {
        errors.push(`"${f.name}" exceeds ${isVideoFile(f) ? '50' : '10'} MB.`);
        continue;
      }
      if (files.some(existing => existing.name === f.name && existing.size === f.size)) {
        errors.push(`"${f.name}" already added.`);
        continue;
      }
      accepted.push(f);
    }

    if (errors.length) alert(errors.join('\n'));
    if (accepted.length) onAdd(accepted);
  }, [files, onAdd]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); validate([...e.dataTransfer.files]); }}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`,
          borderRadius: '10px',
          padding: files.length ? 'clamp(1rem, 3vw, 1.5rem) 1rem' : 'clamp(2rem, 6vw, 3rem) 1rem',
          textAlign: 'center', cursor: 'pointer',
          background: drag ? 'rgba(201,168,76,0.04)' : 'rgba(8,13,26,0.5)',
          transition: 'all 0.25s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
      >
        <input
          ref={inputRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files.length) validate([...e.target.files]); e.target.value = ''; }}
        />
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>📷</div>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: '#f0ece4' }}>
          {files.length ? 'Add more files' : 'Drop images & videos here'}
        </p>
        <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.7rem', color: 'rgba(180,200,225,0.4)' }}>
          or <span style={{ color: 'rgba(201,168,76,0.65)', textDecoration: 'underline' }}>browse files</span> — Images up to 10 MB · Videos up to 50 MB
        </p>
        {files.length > 0 && (
          <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)' }}>
            {files.length}/{MAX_FILES} files selected
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} style={{
              position: 'relative', borderRadius: '8px', overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(8,13,26,0.7)', aspectRatio: '1',
            }}>
              {isVideoFile(file) ? (
                <div style={{
                  width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(139,105,20,0.08), rgba(8,13,26,0.9))', gap: '0.25rem',
                }}>
                  <span style={{ fontSize: '1.6rem' }}>🎬</span>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.5rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Video</span>
                </div>
              ) : (
                <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '0.3rem 0.35rem', lineHeight: 1.2 }}>
                <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.48rem', color: 'rgba(240,236,228,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.42rem', color: 'rgba(201,168,76,0.5)' }}>{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                aria-label={`Remove ${file.name}`}
                style={{
                  position: 'absolute', top: '3px', right: '3px', width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(201,168,76,0.3)',
                  color: 'rgba(201,168,76,0.8)', fontSize: '0.6rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1, padding: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,80,80,0.25)'; e.currentTarget.style.borderColor = 'rgba(220,80,80,0.5)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,13,26,0.85)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.color = 'rgba(201,168,76,0.8)'; }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Semester Selector ────────────────────────────────────────────────────────
const SemesterSelect = ({ value, onChange }) => (
  <div style={{ marginBottom: '0.2rem' }}>
    <label style={{
      display: 'block', marginBottom: '0.45rem',
      fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)',
    }}>Semester *</label>
    <select value={value} onChange={e => onChange(e.target.value)} required style={{
      width: '100%', padding: '0.65rem 0.85rem',
      fontFamily: "'Lato', sans-serif", fontSize: '0.82rem',
      background: 'rgba(23,21,45,0.7)', color: value ? '#f0ece4' : 'rgba(180,200,225,0.4)',
      border: '1px solid rgba(201,168,76,0.18)', borderRadius: '6px',
      cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s', appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='%23c9a84c' opacity='0.5'%3E%3Cpath d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center', backgroundSize: '10px',
    }}
      onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'}
      onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'}
    >
      <option value="" disabled style={{ background: '#0e1225', color: 'rgba(180,200,225,0.4)' }}>Select semester…</option>
      {SEMESTERS.map(s => (
        <option key={s.value} value={s.value} style={{ background: '#0e1225', color: '#f0ece4' }}>{s.label}</option>
      ))}
    </select>
  </div>
);

// ── Upload Progress ──────────────────────────────────────────────────────────
const UploadProgress = ({ current, total }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div style={{ height: 4, borderRadius: 2, background: 'rgba(201,168,76,0.1)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 2,
        background: 'linear-gradient(90deg, #8B6914, #c9a84c, #f0d080)',
        width: `${(current / total) * 100}%`, transition: 'width 0.4s ease',
      }} />
    </div>
    <p style={{ margin: 0, textAlign: 'center', fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(201,168,76,0.6)' }}>
      Uploading {current} of {total}…
    </p>
  </div>
);

// ── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ photo, onConfirm, onCancel, deleting }) => (
  <div
    onClick={onCancel}
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(4,6,16,0.92)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'up-fade 0.2s ease forwards',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: 'rgba(14,18,37,0.98)', border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: '14px', padding: 'clamp(1.5rem, 5vw, 2rem)',
        maxWidth: '400px', width: '100%', textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 72, height: 72, borderRadius: '10px', overflow: 'hidden',
        margin: '0 auto 1rem', border: '1px solid rgba(201,168,76,0.15)',
      }}>
        {isVideoUrl(photo.imageUrl) ? (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(139,105,20,0.15), rgba(8,13,26,0.95))',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🎬</span>
          </div>
        ) : (
          <img src={photo.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 700,
        color: '#f0ece4', margin: '0 0 0.4rem',
      }}>Delete this upload?</h3>
      <p style={{
        fontFamily: "'Lato', sans-serif", fontSize: '0.75rem', color: 'rgba(180,200,225,0.4)',
        margin: '0 0 1.25rem', lineHeight: 1.5,
      }}>
        This will permanently remove it from the album. This action cannot be undone.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
        <button
          onClick={onCancel}
          disabled={deleting}
          style={{
            padding: '0.55rem 1.2rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem',
            fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'transparent', color: 'rgba(201,168,76,0.7)',
            border: '1px solid rgba(201,168,76,0.25)', borderRadius: '2px', cursor: 'pointer',
          }}
        >Cancel</button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          style={{
            padding: '0.55rem 1.3rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem',
            fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: deleting ? 'rgba(220,80,80,0.3)' : 'linear-gradient(135deg, #b91c1c, #dc2626, #ef4444)',
            color: '#fff', border: 'none', borderRadius: '2px',
            cursor: deleting ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 14px rgba(220,80,80,0.2)', transition: 'all 0.2s',
          }}
        >
          {deleting ? 'Deleting…' : '🗑 Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ── History Card ─────────────────────────────────────────────────────────────
const HistoryCard = ({ photo, onDelete, index }) => {
  const [loaded, setLoaded] = useState(false);
  const videoItem = isVideoUrl(photo.imageUrl);

  return (
    <div style={{
      position: 'relative', borderRadius: '10px', overflow: 'hidden',
      border: '1px solid rgba(201,168,76,0.1)', background: 'rgba(8,13,26,0.6)',
      transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      animation: `up-fade 0.4s ${index * 50}ms ease both`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Media */}
      <div style={{ position: 'relative', aspectRatio: '1', background: '#0a0e1a' }}>
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(201,168,76,0.04) 25%, rgba(201,168,76,0.08) 50%, rgba(201,168,76,0.04) 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
          }} />
        )}
        {videoItem ? (
          <>
            <video
              src={photo.imageUrl} muted preload="metadata"
              onLoadedData={() => setLoaded(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
            />
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              border: '2px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(240,208,128,0.85)', marginLeft: '2px' }}>▶</span>
            </div>
          </>
        ) : (
          <img
            src={photo.imageUrl} alt={photo.caption || 'upload'} loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
          />
        )}

        {/* Semester badge */}
        <div style={{
          position: 'absolute', top: '6px', left: '6px',
          padding: '2px 8px', borderRadius: '3px',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(201,168,76,0.2)',
          fontFamily: "'Lato', sans-serif", fontSize: '0.5rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(240,208,128,0.8)',
        }}>
          {SEM_LABELS[photo.semester] || photo.semester}
        </div>
      </div>

      {/* Info footer */}
      <div style={{ padding: '0.55rem 0.65rem', borderTop: '1px solid rgba(201,168,76,0.06)' }}>
        <p style={{
          margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.6rem',
          color: 'rgba(180,200,225,0.5)', lineHeight: 1.4,
        }}>
          {formatDate(photo.createdAt)}
          <span style={{ color: 'rgba(201,168,76,0.3)', margin: '0 0.3rem' }}>·</span>
          {formatTime(photo.createdAt)}
        </p>
        {photo.caption && (
          <p style={{
            margin: '0.2rem 0 0', fontFamily: "'Lato', sans-serif", fontSize: '0.58rem',
            color: 'rgba(180,200,225,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{photo.caption}</p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(photo)}
        aria-label="Delete upload"
        title="Delete this upload"
        style={{
          position: 'absolute', top: '6px', right: '6px',
          width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(220,80,80,0.25)',
          color: 'rgba(220,80,80,0.7)', fontSize: '0.65rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1, padding: 0,
          opacity: 0.7,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(220,80,80,0.2)';
          e.currentTarget.style.borderColor = 'rgba(220,80,80,0.5)';
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(8,13,26,0.8)';
          e.currentTarget.style.borderColor = 'rgba(220,80,80,0.25)';
          e.currentTarget.style.color = 'rgba(220,80,80,0.7)';
          e.currentTarget.style.opacity = '0.7';
        }}
      >🗑</button>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const UploadToAlbum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [semester, setSemester] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── History state ──
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch user's upload history ──
  const fetchHistory = useCallback(async () => {
    if (!user?._id) return;
    setHistoryLoading(true);
    try {
      const res = await photosAPI.getPhotos({ album: 'album', uploadedBy: user._id, limit: 100 });
      setHistory(res?.photos || []);
    } catch (err) {
      console.error('Failed to fetch upload history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ── File handlers ──
  const addFiles = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  }, []);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ── Upload ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) { setError('Please select at least one file.'); return; }
    if (!semester) { setError('Please select a semester.'); return; }

    setError('');
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const batchSize = 10;
      let uploaded = 0;

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const result = await photosAPI.uploadPhotos(batch, { semester, album: 'album' });

        if (!result?.photos?.length) {
          throw new Error(result?.message || 'Upload failed for some files.');
        }
        uploaded += batch.length;
        setUploadProgress({ current: uploaded, total: files.length });
      }

      setSuccess(true);
      setFiles([]);
      setSemester('');
      // Refresh history
      fetchHistory();
      // Auto-reset success after a few seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await photosAPI.deletePhoto(deleteTarget._id);
      setHistory(prev => prev.filter(p => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || 'Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', overflowX: 'hidden' }}>
        <section style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 8vw, 6rem)',
          maxWidth: '700px', margin: '0 auto',
          animation: 'up-fade 0.5s ease forwards',
        }}>
          {/* Top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)',
          }} />

          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '500px', height: '250px',
            background: 'radial-gradient(ellipse at top, rgba(139,105,20,0.12), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Back link */}
          <Link to="/album" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(180,200,225,0.38)',
            textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.color = 'rgba(201,168,76,0.65)'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(180,200,225,0.38)'}
          >← Back to Album</Link>

          {/* Title */}
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{
              fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)', margin: '0 0 0.5rem',
            }}>Mates Only</p>
            <h1 style={{
              margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: 'clamp(1.8rem, 6vw, 2.75rem)', lineHeight: 1,
            }}>
              <span style={{ color: '#f0ece4' }}>Upload to </span>
              <span style={{
                background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Album</span>
            </h1>
            <p style={{
              margin: '0.5rem 0 0', fontFamily: "'Lato', sans-serif", fontWeight: 300,
              fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)',
            }}>Share your memories — images and videos — with the batch.</p>
          </div>

          {/* ── Upload Panel ── */}
          <div style={{
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: '12px', padding: 'clamp(1.25rem, 4vw, 2rem)', backdropFilter: 'blur(14px)',
          }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 2.5rem) 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem',
                  fontWeight: 700, color: '#86efac', margin: '0 0 0.4rem',
                }}>Upload complete!</h2>
                <p style={{
                  fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: 'rgba(180,200,225,0.4)',
                }}>Your memories have been added to the album.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {error && (
                  <div style={{
                    background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.22)',
                    color: '#f87171', borderRadius: '6px', padding: '0.65rem 1rem',
                    fontFamily: "'Lato', sans-serif", fontSize: '0.78rem',
                  }}>{error}</div>
                )}

                <SemesterSelect value={semester} onChange={setSemester} />
                <DropZone files={files} onAdd={addFiles} onRemove={removeFile} />
                {uploading && <UploadProgress current={uploadProgress.current} total={uploadProgress.total} />}

                <div style={{
                  display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', flexWrap: 'wrap',
                  paddingTop: '0.5rem', borderTop: '1px solid rgba(201,168,76,0.08)',
                }}>
                  <button type="button" onClick={() => navigate('/album')} style={{
                    padding: '0.55rem 1.1rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem',
                    fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: 'transparent', color: 'rgba(201,168,76,0.7)',
                    border: '1px solid rgba(201,168,76,0.25)', borderRadius: '2px', cursor: 'pointer',
                  }}>Cancel</button>
                  <button type="submit" disabled={uploading || !files.length || !semester} style={{
                    padding: '0.55rem 1.25rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem',
                    fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: (!files.length || !semester || uploading)
                      ? 'rgba(139,105,20,0.35)'
                      : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                    color: '#080d1a', border: 'none', borderRadius: '2px',
                    cursor: (!files.length || !semester || uploading) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 14px rgba(201,168,76,0.15)', transition: 'all 0.2s',
                  }}>
                    {uploading ? 'Uploading…' : `↑ Upload ${files.length ? `(${files.length})` : ''}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Upload History ── */}
          <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem',
            }}>
              <div style={{
                flex: 1, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2))',
              }} />
              <h2 style={{
                margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#f0ece4', whiteSpace: 'nowrap',
              }}>
                Your <span style={{
                  background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Uploads</span>
              </h2>
              <div style={{
                flex: 1, height: '1px',
                background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)',
              }} />
            </div>

            {historyLoading ? (
              // Skeleton
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem',
              }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    borderRadius: '10px', overflow: 'hidden',
                    border: '1px solid rgba(201,168,76,0.06)',
                  }}>
                    <div style={{
                      aspectRatio: '1',
                      background: 'linear-gradient(90deg, rgba(201,168,76,0.04) 25%, rgba(201,168,76,0.08) 50%, rgba(201,168,76,0.04) 75%)',
                      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                    }} />
                    <div style={{ padding: '0.5rem 0.6rem' }}>
                      <div style={{
                        height: 8, width: '60%', borderRadius: 4,
                        background: 'rgba(201,168,76,0.06)', marginBottom: '0.35rem',
                      }} />
                      <div style={{ height: 6, width: '40%', borderRadius: 3, background: 'rgba(201,168,76,0.04)' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              // Empty state
              <div style={{
                textAlign: 'center', padding: 'clamp(2rem, 6vw, 3rem) 1rem',
                background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(201,168,76,0.06)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.6rem', opacity: 0.35 }}>◇</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem',
                  color: '#f0ece4', margin: '0 0 0.3rem', fontWeight: 600,
                }}>No uploads yet</h3>
                <p style={{
                  fontFamily: "'Lato', sans-serif", fontSize: '0.75rem', color: 'rgba(180,200,225,0.35)', margin: 0,
                }}>Your uploaded photos and videos will appear here.</p>
              </div>
            ) : (
              <>
                {/* Count */}
                <p style={{
                  margin: '0 0 0.75rem', fontFamily: "'Lato', sans-serif", fontSize: '0.6rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)',
                }}>
                  {history.length} {history.length === 1 ? 'upload' : 'uploads'}
                </p>

                {/* Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '0.75rem',
                }}>
                  {history.map((photo, i) => (
                    <HistoryCard
                      key={photo._id}
                      photo={photo}
                      index={i}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tips */}
          <div style={{
            marginTop: '1.5rem', padding: '1rem 1.1rem',
            background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)',
            borderRadius: '8px',
          }}>
            <p style={{
              margin: '0 0 0.5rem', fontFamily: "'Lato', sans-serif", fontSize: '0.62rem',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)',
            }}>Quick Tips</p>
            <ul style={{
              margin: 0, paddingLeft: '1rem', fontFamily: "'Lato', sans-serif",
              fontSize: '0.72rem', lineHeight: 1.8, color: 'rgba(180,200,225,0.35)',
            }}>
              <li>Select the <strong style={{ color: 'rgba(201,168,76,0.55)' }}>semester</strong> before uploading</li>
              <li>Upload up to <strong style={{ color: 'rgba(201,168,76,0.55)' }}>10 files</strong> at once</li>
              <li>Images: JPG, PNG, WebP, GIF — max 10 MB each</li>
              <li>Videos: MP4, WebM — max 50 MB each</li>
              <li>You can <strong style={{ color: 'rgba(220,80,80,0.6)' }}>delete</strong> your own uploads anytime</li>
            </ul>
          </div>
        </section>

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <DeleteModal
            photo={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => !deleting && setDeleteTarget(null)}
            deleting={deleting}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          @keyframes up-fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        `}</style>
      </div>
    </Layout>
  );
};

export default UploadToAlbum;
