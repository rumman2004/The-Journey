// ═══════════════════════════════════════════════════════════
// StickersDisplay.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import { photosAPI } from '../../services/api';

const processDownload = async (url, filename) => {
  try {
    const r = await fetch(url);
    const blob = await r.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl; a.download = filename || 'sticker.png';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch { alert('Failed to download.'); }
};

// ── Sticker Card ──────────────────────────────────────────────────────────────
const StickerCard = ({ sticker, onDelete, isOwner }) => {
  const [hover, setHover]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: '10px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${hover ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`,
        backdropFilter: 'blur(12px)',
        transform: hover ? 'translateY(-5px) scale(1.02)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
        boxShadow: hover ? '0 14px 44px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.07)' : '0 4px 18px rgba(0,0,0,0.35)',
      }}
    >
      {/* Image area */}
      <div style={{ padding: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 110 }}>
        <img
          src={sticker.imageUrl} alt={sticker.caption || 'Sticker'}
          style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', borderRadius: '4px' }}
          loading="lazy"
        />
      </div>

      {/* Caption */}
      {sticker.caption && (
        <div style={{ padding: '0 0.85rem 0.6rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.75rem', color: 'rgba(180,200,225,0.55)' }}>{sticker.caption}</p>
        </div>
      )}

      {/* Author */}
      {sticker.uploadedBy?.name && (
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #8B6914, #f0d080)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '0.55rem', color: '#080d1a',
          }}>{sticker.uploadedBy.name[0]?.toUpperCase()}</div>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', color: 'rgba(180,200,225,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sticker.uploadedBy.name}
          </span>
        </div>
      )}

      {/* Hover actions */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '0.35rem', opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }}>
        <button onClick={e => { e.stopPropagation(); processDownload(sticker.imageUrl, sticker.caption || 'sticker.png'); }} title="Download"
          style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(8,13,26,0.85)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
        >↓</button>
        {isOwner && (
          <button onClick={async () => { if (!confirm('Remove this sticker?')) return; setDeleting(true); await onDelete(sticker._id); setDeleting(false); }} disabled={deleting} title="Delete"
            style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(220,80,80,0.15)', border: '1px solid rgba(220,80,80,0.3)', color: '#f87171', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >{deleting ? '…' : '✕'}</button>
        )}
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
export const StickersDisplay = () => {
  const { user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await photosAPI.getPhotos({ album: 'stickers' });
        setStickers(Array.isArray(data) ? data : (data.photos ?? []));
      } catch (e) { setError('Could not load stickers.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async id => {
    try { await photosAPI.deletePhoto(id); setStickers(p => p.filter(s => s._id !== id)); }
    catch { /* silent */ }
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', overflowX: 'hidden' }}>
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2.5rem) clamp(3rem, 8vw, 6rem)', maxWidth: '1100px', margin: '0 auto', animation: 'stk-fade 0.5s ease forwards' }}>
          {/* Top rule */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)' }} />

          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.4rem' }}>Mates Only</p>
              <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1 }}>
                <span style={{ color: '#f0ece4' }}>Sticker </span>
                <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wall</span>
              </h1>
              <p style={{ margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)' }}>Stickers shared by your batchmates.</p>
            </div>
            <Link to="/upload-sticker" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '0.6rem 1.4rem', fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 0 16px rgba(201,168,76,0.2)', whiteSpace: 'nowrap' }}>↑ Upload Sticker</button>
            </Link>
          </div>

          {error && <div style={{ padding: '2rem', borderRadius: '8px', textAlign: 'center', background: 'rgba(220,80,80,0.06)', border: '1px solid rgba(220,80,80,0.18)', color: '#f87171', fontFamily: "'Lato', sans-serif", fontSize: '0.82rem' }}>{error}</div>}

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 18vw, 180px), 1fr))', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ height: 160, borderRadius: '10px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.06)', animation: 'pulse-sk 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {!loading && !error && stickers.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'clamp(3rem, 8vw, 6rem) 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎨</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: '#f0ece4', marginBottom: '0.5rem' }}>No stickers yet</h2>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)', marginBottom: '1.5rem' }}>Be the first to share one!</p>
              <Link to="/upload-sticker" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '0.65rem 1.5rem', fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer' }}>↑ Upload Sticker</button>
              </Link>
            </div>
          )}

          {!loading && !error && stickers.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 18vw, 180px), 1fr))', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
              {stickers.map(s => <StickerCard key={s._id} sticker={s} onDelete={handleDelete} isOwner={user?._id === s.uploadedBy?._id} />)}
            </div>
          )}
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          @keyframes stk-fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
          @keyframes pulse-sk { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        `}</style>
      </div>
    </Layout>
  );
};

export default StickersDisplay;