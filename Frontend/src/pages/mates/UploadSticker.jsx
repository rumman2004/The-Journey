import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Card, { CardContent } from '../../components/ui/Card';
import { photosAPI } from '../../services/api';

// ── Drop zone ────────────────────────────────────────────────────────────────
const DropZone = ({ file, onFile }) => {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const validate = f => {
    if (!f.type.startsWith('image/')) { alert('Only image files are accepted.'); return; }
    if (f.size > 4 * 1024 * 1024) { alert('Max file size is 4 MB.'); return; }
    onFile(f);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) validate(e.dataTransfer.files[0]); }}
      role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      style={{
        border: `2px dashed ${drag ? '#c9a84c' : 'rgba(201,168,76,0.2)'}`,
        borderRadius: '10px', padding: 'clamp(2rem, 6vw, 3rem) 1rem',
        textAlign: 'center', cursor: 'pointer',
        background: drag ? 'rgba(201,168,76,0.04)' : 'rgba(8,13,26,0.5)',
        transition: 'all 0.25s', minHeight: 180,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && validate(e.target.files[0])} />

      {file ? (
        <>
          <img src={URL.createObjectURL(file)} alt="Preview" style={{ maxHeight: 'clamp(100px, 20vw, 140px)', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} />
          <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', color: 'rgba(180,200,225,0.45)' }}>
            {file.name} · {(file.size / 1024).toFixed(0)} KB
          </p>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', color: 'rgba(201,168,76,0.45)', letterSpacing: '0.06em' }}>Click or drop to replace</span>
        </>
      ) : (
        <>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🖼️</div>
          <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#f0ece4' }}>Drop your sticker here</p>
          <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', color: 'rgba(180,200,225,0.4)' }}>
            or <span style={{ color: 'rgba(201,168,76,0.65)', textDecoration: 'underline' }}>browse files</span> — PNG, GIF, WebP · max 4 MB
          </p>
        </>
      )}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const UploadSticker = () => {
  const navigate  = useNavigate();
  const [file, setFile]         = useState(null);
  const [caption, setCaption]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) { setError('Please select an image first.'); return; }
    setError(''); setUploading(true);
    try {
      const r = await photosAPI.uploadPhotos([file], { album: 'stickers', caption: caption.trim() || undefined });
      if (r?.photos?.length || r?._id) { setSuccess(true); setTimeout(() => navigate('/stickers'), 1500); }
      else setError('Upload failed. Please try again.');
    } catch (e) { setError(e.message || 'Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', overflowX: 'hidden' }}>
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 8vw, 6rem)', maxWidth: '580px', margin: '0 auto', animation: 'up-fade 0.5s ease forwards' }}>
          {/* Top rule */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)' }} />

          {/* Back */}
          <Link to="/stickers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(180,200,225,0.38)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = 'rgba(201,168,76,0.65)'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(180,200,225,0.38)'}
          >← Back to Sticker Wall</Link>

          {/* Title */}
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.5rem' }}>Mates Only</p>
            <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6vw, 2.75rem)', lineHeight: 1 }}>
              <span style={{ color: '#f0ece4' }}>Upload a </span>
              <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sticker</span>
            </h1>
            <p style={{ margin: '0.5rem 0 0', fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)' }}>Share a sticker with your batchmates.</p>
          </div>

          {/* Panel */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '12px', padding: 'clamp(1.25rem, 4vw, 2rem)', backdropFilter: 'blur(14px)' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 3rem) 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: '#86efac', margin: '0 0 0.4rem' }}>Sticker uploaded!</h2>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: 'rgba(180,200,225,0.4)' }}>Redirecting to the sticker wall…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {error && (
                  <div style={{ background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.22)', color: '#f87171', borderRadius: '6px', padding: '0.65rem 1rem', fontFamily: "'Lato', sans-serif", fontSize: '0.78rem' }}>{error}</div>
                )}

                <DropZone file={file} onFile={f => { setFile(f); setError(''); }} />
                <Input label="Caption (optional)" name="caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a short caption…" maxLength={100} />

                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                  <button type="button" onClick={() => navigate('/stickers')} style={{ padding: '0.55rem 1.1rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'transparent', color: 'rgba(201,168,76,0.7)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '2px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={uploading || !file} style={{ padding: '0.55rem 1.25rem', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: !file || uploading ? 'rgba(139,105,20,0.35)' : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: !file || uploading ? 'not-allowed' : 'pointer', boxShadow: '0 0 14px rgba(201,168,76,0.15)' }}>
                    {uploading ? 'Uploading…' : '↑ Upload'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          @keyframes up-fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        `}</style>
      </div>
    </Layout>
  );
};

export default UploadSticker;