// ═══════════════════════════════════════════════════════════
// StickersDisplay.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import { photosAPI } from '../../services/api';
import { FiDownload, FiX, FiUploadCloud, FiImage } from 'react-icons/fi';

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
        background: '#FCFBF8',
        border: `1px solid ${hover ? 'rgba(139,105,20,0.3)' : 'rgba(0,0,0,0.06)'}`,
        transform: hover ? 'translateY(-5px) scale(1.02)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
        boxShadow: hover ? '0 14px 44px rgba(0,0,0,0.08), 0 0 20px rgba(139,105,20,0.07)' : '0 4px 18px rgba(0,0,0,0.04)',
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
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.75rem', color: 'rgba(31,31,31,0.6)' }}>{sticker.caption}</p>
        </div>
      )}

      {/* Author */}
      {sticker.uploadedBy?.name && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #8B6914, #f0d080)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.55rem', color: '#080d1a',
          }}>{sticker.uploadedBy.name[0]?.toUpperCase()}</div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'rgba(31,31,31,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sticker.uploadedBy.name}
          </span>
        </div>
      )}

      {/* Hover actions */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '0.35rem', opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }}>
        <button onClick={e => { e.stopPropagation(); processDownload(sticker.imageUrl, sticker.caption || 'sticker.png'); }} title="Download"
          style={{ width: 26, height: 26, borderRadius: '50%', background: '#FCFBF8', border: '1px solid rgba(0,0,0,0.1)', color: '#8B6914', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,105,20,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
        ><FiDownload /></button>
        {isOwner && (
          <button onClick={async () => { if (!confirm('Remove this sticker?')) return; setDeleting(true); await onDelete(sticker._id); setDeleting(false); }} disabled={deleting} title="Delete"
            style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(220,80,80,0.05)', border: '1px solid rgba(220,80,80,0.15)', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >{deleting ? '…' : <FiX />}</button>
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
      <div style={{ minHeight: '100vh', background: 'var(--color-luxury-ivory)', overflowX: 'hidden' }}>
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2.5rem) clamp(3rem, 8vw, 6rem)', maxWidth: '1100px', margin: '0 auto', animation: 'stk-fade 0.5s ease forwards' }}>
          {/* Top rule */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2) 30%, rgba(201,168,76,0.4) 50%, rgba(201,168,76,0.2) 70%, transparent)' }} />

          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#8B6914', margin: '0 0 0.4rem' }}>Mates Only</p>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1 }}>
                <span style={{ color: '#1f1f1f' }}>Sticker </span>
                <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wall</span>
              </h1>
              <p style={{ margin: '0.4rem 0 0', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '0.82rem', color: 'rgba(31,31,31,0.6)' }}>Stickers shared by your batchmates.</p>
            </div>
            <Link to="/upload-sticker" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '0.6rem 1.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,105,20,0.15)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FiUploadCloud size={14} /> Upload Sticker</button>
            </Link>
          </div>

          {error && <div style={{ padding: '2rem', borderRadius: '8px', textAlign: 'center', background: 'rgba(220,80,80,0.06)', border: '1px solid rgba(220,80,80,0.18)', color: '#dc2626', fontFamily: 'var(--font-sans)', fontSize: '0.82rem' }}>{error}</div>}

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 18vw, 180px), 1fr))', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ height: 160, borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', animation: 'pulse-sk 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {!loading && !error && stickers.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'clamp(3rem, 8vw, 6rem) 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5, color: '#8B6914', display: 'flex', justifyContent: 'center' }}><FiImage /></div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#1f1f1f', marginBottom: '0.5rem' }}>No stickers yet</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(31,31,31,0.6)', marginBottom: '1.5rem' }}>Be the first to share one!</p>
              <Link to="/upload-sticker" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '0.65rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}><FiUploadCloud size={14} /> Upload Sticker</button>
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
          @keyframes stk-fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
          @keyframes pulse-sk { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        `}</style>
      </div>
    </Layout>
  );
};

export default StickersDisplay;