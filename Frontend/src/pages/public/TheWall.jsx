import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import MessageFrame from '../../components/ui/MessageFrame';
import { memoriesAPI } from '../../services/api';

// ── Paper textures & tape styles ─────────────────────────────────────────────
const PAPER_VARIANTS = [
  { bg: '#fdf8f0', lineColor: 'rgba(180,155,100,0.13)', rotate: '-2.1deg',  tapeAngle: '-1.5deg', tapeColor: 'rgba(255,245,200,0.55)' },
  { bg: '#fffef5', lineColor: 'rgba(180,155,100,0.10)', rotate:  '1.8deg',  tapeAngle:  '2deg',   tapeColor: 'rgba(220,235,255,0.50)' },
  { bg: '#f8f4ef', lineColor: 'rgba(160,140,100,0.12)', rotate: '-0.9deg',  tapeAngle: '-0.8deg', tapeColor: 'rgba(255,245,200,0.55)' },
  { bg: '#fef9f9', lineColor: 'rgba(200,150,150,0.10)', rotate:  '2.4deg',  tapeAngle:  '1.5deg', tapeColor: 'rgba(255,220,220,0.50)' },
  { bg: '#f5f8f5', lineColor: 'rgba(130,170,130,0.11)', rotate: '-1.4deg',  tapeAngle: '-2deg',   tapeColor: 'rgba(200,240,200,0.45)' },
  { bg: '#f9f5ff', lineColor: 'rgba(160,130,200,0.10)', rotate:  '1.2deg',  tapeAngle:  '0.8deg', tapeColor: 'rgba(220,210,255,0.50)' },
];

const TAPE_POSITIONS = [
  { top: -13, left: '22%',  width: 56 },
  { top: -13, left: '50%',  width: 64, transform: 'translateX(-50%)' },
  { top: -13, right: '18%', width: 52 },
];

// ── Skeleton Note ─────────────────────────────────────────────────────────────
const SkeletonNote = ({ index }) => {
  const v = PAPER_VARIANTS[index % PAPER_VARIANTS.length];
  const tape = TAPE_POSITIONS[index % TAPE_POSITIONS.length];
  const lines = [75, 90, 60, 85, 45];

  return (
    <div className="note-wrap" style={{
      breakInside: 'avoid',
      marginBottom: 'var(--gap)',
      position: 'relative',
      transform: `rotate(${v.rotate})`,
      animation: `skeletonPulse 1.8s ease-in-out ${(index * 0.12)}s infinite`,
    }}>
      {/* Tape */}
      <div style={{
        position: 'absolute',
        top: tape.top,
        left: tape.left,
        right: tape.right,
        transform: tape.transform ?? `rotate(${v.tapeAngle})`,
        width: tape.width,
        height: 20,
        background: v.tapeColor,
        border: '1px solid rgba(255,255,255,0.6)',
        backdropFilter: 'blur(3px)',
        borderRadius: 2,
        zIndex: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
      }} />

      {/* Paper */}
      <div style={{
        background: v.bg,
        borderRadius: 2,
        padding: 'clamp(0.85rem, 3vw, 1.5rem)',
        boxShadow: '2px 5px 18px rgba(0,0,0,0.32), 0 1px 3px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.04)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Ruled lines bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${v.lineColor} 27px, ${v.lineColor} 28px)`,
          backgroundPositionY: '44px',
        }} />
        {/* Header shimmer */}
        <div style={{ height: 11, borderRadius: 3, marginBottom: 12, width: '55%', background: 'rgba(0,0,0,0.09)' }} />
        {lines.map((w, i) => (
          <div key={i} style={{ height: 9, borderRadius: 3, marginBottom: 7, width: `${w}%`, background: 'rgba(0,0,0,0.06)' }} />
        ))}
        <div style={{ height: 9, borderRadius: 3, width: '35%', background: 'rgba(0,0,0,0.05)', marginTop: 12 }} />
        {/* Corner fold */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 18, height: 18,
          background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.07) 50%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
};

// ── Note Card ─────────────────────────────────────────────────────────────────
const NoteCard = ({ memory, index, onUpdate }) => {
  const v = PAPER_VARIANTS[index % PAPER_VARIANTS.length];
  const tape = TAPE_POSITIONS[index % TAPE_POSITIONS.length];
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="note-wrap"
      style={{
        breakInside: 'avoid',
        marginBottom: 'var(--gap)',
        position: 'relative',
        zIndex: hovered ? 20 : 1,
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? 'rotate(0deg) translateY(-8px) scale(1.035)'
            : `rotate(${v.rotate})`
          : `rotate(${v.rotate}) translateY(22px)`,
        transition: visible
          ? `opacity 0.55s ${(index % 8) * 0.07}s ease,
             transform ${hovered ? '0.35s' : '0.55s'} ${hovered ? '0s' : `${(index % 8) * 0.07}s`} cubic-bezier(0.22,1,0.36,1),
             box-shadow 0.35s ease,
             z-index 0s`
          : 'none',
        boxShadow: hovered
          ? '6px 22px 48px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.25)'
          : '2px 5px 18px rgba(0,0,0,0.34), 0 1px 3px rgba(0,0,0,0.12)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tape strip */}
      <div style={{
        position: 'absolute',
        top: tape.top,
        left: tape.left,
        right: tape.right,
        transform: tape.transform ?? `rotate(${v.tapeAngle})`,
        width: tape.width,
        height: 20,
        background: v.tapeColor,
        border: '1px solid rgba(255,255,255,0.65)',
        backdropFilter: 'blur(4px)',
        borderRadius: 2,
        zIndex: 3,
        boxShadow: '0 1px 4px rgba(0,0,0,0.13)',
        pointerEvents: 'none',
      }} />

      {/* Tape texture lines */}
      <div style={{
        position: 'absolute',
        top: tape.top,
        left: tape.left,
        right: tape.right,
        transform: tape.transform ?? `rotate(${v.tapeAngle})`,
        width: tape.width,
        height: 20,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.18) 3px, rgba(255,255,255,0.18) 4px)',
        borderRadius: 2,
        zIndex: 4,
        pointerEvents: 'none',
      }} />

      {/* Paper body */}
      <div style={{
        position: 'relative',
        background: v.bg,
        padding: 'clamp(0.9rem, 3.5vw, 1.6rem)',
        paddingTop: 'clamp(1rem, 3.5vw, 1.75rem)',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.045)',
        overflow: 'hidden',
      }}>
        {/* Paper grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          opacity: 0.6,
        }} />

        {/* Ruled lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${v.lineColor} 27px, ${v.lineColor} 28px)`,
          backgroundPositionY: '44px',
        }} />

        {/* Left margin line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 26,
          width: 1, background: 'rgba(220,160,160,0.18)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <MessageFrame memory={memory} onUpdate={onUpdate} />
        </div>

        {/* Corner fold */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 22, height: 22,
          background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.07) 50%)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const TheWall = () => {
  const { isAuthenticated } = useAuth();
  const [memories, setMemories]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const headRef   = useRef(null);
  const [headIn, setHeadIn] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeadIn(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fetchMemories = useCallback(async (pageNum = 1, append = false) => {
    try {
      const response = await memoriesAPI.getMemories({ page: pageNum, limit: 20 });
      if (response.memories) {
        setMemories(prev => append ? [...prev, ...response.memories] : response.memories);
        setHasMore(response.memories.length === 20);
      }
    } catch {
      setError('Failed to load messages from the wall');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMemories(1, false);
      setLoading(false);
    })();
  }, [fetchMemories]);

  const handleLoadMore = async () => {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    await fetchMemories(next, true);
    setLoadingMore(false);
  };

  const handleMemoryUpdate = () => fetchMemories(1, false);

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#0a0f1e', overflowX: 'hidden' }}>

        {/* ── Background wall texture ── */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(10,35,65,0.35), transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 75%, rgba(8,25,55,0.3), transparent 60%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")
          `,
          backgroundSize: 'cover, cover, 300px 300px',
        }} />

        {/* Subtle cork board pattern */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.018,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(200,160,100,0.5) 0, rgba(200,160,100,0.5) 1px, transparent 1px, transparent 60px),
                            repeating-linear-gradient(90deg, rgba(200,160,100,0.5) 0, rgba(200,160,100,0.5) 1px, transparent 1px, transparent 60px)`,
        }} />

        {/* ── HEADER ── */}
        <header
          ref={headRef}
          style={{
            position: 'relative', zIndex: 1,
            paddingTop: 'clamp(5rem, 14vw, 9rem)',
            paddingBottom: 'clamp(1.5rem, 4vw, 3.5rem)',
            padding: 'clamp(5rem, 14vw, 9rem) clamp(1rem, 5vw, 2.5rem) clamp(1.5rem, 4vw, 3.5rem)',
            textAlign: 'center',
          }}
        >
          {/* Top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 25%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.3) 75%, transparent)',
          }} />

          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 'clamp(0.55rem, 1.5vw, 0.62rem)',
            fontWeight: 700, letterSpacing: '0.36em',
            textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)',
            marginBottom: 'clamp(0.6rem, 2vw, 1rem)',
            opacity: headIn ? 1 : 0,
            transform: headIn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s',
          }}>Batch 2023 — 2026</p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 11vw, 6.5rem)',
            lineHeight: 1.0, letterSpacing: '-0.02em',
            margin: '0 0 clamp(0.5rem, 2vw, 1rem)',
            opacity: headIn ? 1 : 0,
            transform: headIn ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s 0.22s, transform 0.7s 0.22s',
          }}>
            <span style={{ color: '#f0ece4' }}>The </span>
            <span style={{
              background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080, #c9a84c, #8B6914)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: headIn ? 'goldShimmer 5s ease-in-out infinite' : 'none',
            }}>Wall</span>
          </h1>

          {/* Ornament divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(0.4rem, 1.5vw, 0.75rem)',
            margin: '0 0 clamp(0.75rem, 2vw, 1.25rem)',
            opacity: headIn ? 1 : 0,
            transition: 'opacity 0.7s 0.38s',
          }}>
            <div style={{ height: '1px', width: 'clamp(18px, 5vw, 55px)', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4))' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,168,76,0.5)' }} />
            <div style={{ height: '1px', width: 'clamp(18px, 5vw, 55px)', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.4))' }} />
          </div>

          <p style={{
            fontFamily: "'Lato', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.78rem, 2.2vw, 1rem)',
            lineHeight: 1.85, color: 'rgba(180,200,225,0.42)',
            maxWidth: '400px', margin: '0 auto clamp(1.25rem, 4vw, 2rem)',
            letterSpacing: '0.02em',
            opacity: headIn ? 1 : 0,
            transform: headIn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s 0.48s, transform 0.7s 0.48s',
          }}>
            A living bulletin board of messages, inside jokes,<br className="hide-mobile" />
            and eternal memories from your mates.
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)',
            opacity: headIn ? 1 : 0,
            transition: 'opacity 0.7s 0.6s',
          }}>
            {isAuthenticated && (
              <Link to="/create-memory" style={{ textDecoration: 'none' }}>
                <button className="btn-pin"
                  style={{
                    padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.25rem, 4vw, 1.75rem)',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)',
                    fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                    color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(201,168,76,0.2)',
                    transition: 'box-shadow 0.3s, transform 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📌 Pin a New Message
                </button>
              </Link>
            )}

            {memories.length > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1.1rem)',
                borderRadius: '2px',
                border: '1px solid rgba(201,168,76,0.18)',
                background: 'rgba(201,168,76,0.05)',
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', color: '#f0d080',
                }}>{memories.length}</span>
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 'clamp(0.55rem, 1.6vw, 0.62rem)',
                  fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.5)',
                }}>notes pinned</span>
              </div>
            )}
          </div>
        </header>

        {/* ── WALL FEED ── */}
        <main style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(0.5rem, 2vw, 1rem) clamp(0.75rem, 4vw, 2.5rem) clamp(3rem, 6vw, 6rem)',
          maxWidth: '1700px', margin: '0 auto',
        }}>
          {error ? (
            <div style={{
              textAlign: 'center', padding: 'clamp(2rem, 6vw, 3rem) 1.5rem',
              background: 'rgba(220,80,80,0.05)', border: '1px solid rgba(220,80,80,0.18)',
              borderRadius: '12px', maxWidth: '400px', margin: '0 auto',
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', color: '#f87171', marginBottom: '0.5rem' }}>
                Connection Lost
              </h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', color: 'rgba(180,200,225,0.5)', marginBottom: '1.5rem' }}>
                {error}
              </p>
              <button onClick={() => window.location.reload()} style={{
                padding: '0.6rem 1.5rem', fontFamily: "'Lato', sans-serif",
                fontSize: 'clamp(0.6rem, 1.8vw, 0.68rem)', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #8B6914, #c9a84c)', color: '#080d1a',
                border: 'none', borderRadius: '2px', cursor: 'pointer',
              }}>Attempt Reconnect</button>
            </div>
          ) : loading ? (
            // ── Skeleton grid ──
            <div className="wall-grid">
              {[...Array(8)].map((_, i) => <SkeletonNote key={i} index={i} />)}
            </div>
          ) : memories.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 'clamp(3rem, 10vw, 6rem) 1rem',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: '12px', maxWidth: '400px', margin: '0 auto',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', margin: '0 auto 1rem',
                border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>📌</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', fontWeight: 700, color: '#f0ece4', marginBottom: '0.5rem' }}>
                The Wall is Empty
              </h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', color: 'rgba(180,200,225,0.4)', marginBottom: '1.5rem' }}>
                Grab some tape and be the first to share a message!
              </p>
              {isAuthenticated && (
                <Link to="/create-memory" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '0.65rem 1.5rem', fontFamily: "'Lato', sans-serif",
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a',
                    border: 'none', borderRadius: '2px', cursor: 'pointer',
                  }}>Pin First Message</button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="wall-grid">
                {memories.map((memory, i) => (
                  <NoteCard
                    key={memory._id}
                    memory={memory}
                    index={i}
                    onUpdate={handleMemoryUpdate}
                  />
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 5vw, 3.5rem)' }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="btn-load-more"
                    style={{
                      padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.5rem, 5vw, 2.25rem)',
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)',
                      fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      background: 'transparent', color: 'rgba(201,168,76,0.75)',
                      border: '1px solid rgba(201,168,76,0.28)',
                      borderRadius: '2px', cursor: loadingMore ? 'default' : 'pointer',
                      transition: 'all 0.25s', minWidth: 'clamp(150px, 40vw, 200px)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      opacity: loadingMore ? 0.7 : 1,
                    }}
                  >
                    {loadingMore ? (
                      <>
                        <span style={{
                          display: 'inline-block', width: 13, height: 13, borderRadius: '50%',
                          border: '2px solid rgba(201,168,76,0.3)',
                          borderTopColor: '#c9a84c', animation: 'spin 0.7s linear infinite',
                          flexShrink: 0,
                        }} />
                        Unfolding…
                      </>
                    ) : 'Load Older Notes'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* ── Bottom CTA ── */}
        {isAuthenticated && memories.length > 0 && (
          <section style={{
            position: 'relative', zIndex: 1,
            padding: '0 clamp(0.75rem, 5vw, 2.5rem) clamp(3.5rem, 8vw, 7rem)',
            maxWidth: '760px', margin: '0 auto',
          }}>
            <div style={{
              position: 'relative', borderRadius: '12px', overflow: 'hidden',
              padding: 'clamp(1.75rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem)',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(201,168,76,0.15)',
              backdropFilter: 'blur(20px)', textAlign: 'center',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 30%, rgba(240,208,128,0.55) 50%, rgba(201,168,76,0.4) 70%, transparent)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.55rem, 1.5vw, 0.6rem)', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)', marginBottom: '0.85rem' }}>
                  Leave your mark
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.3rem, 5vw, 2.25rem)', color: '#f0ece4', lineHeight: 1.2, marginBottom: '0.85rem' }}>
                  Pin Your Memory
                </h2>
                <div style={{ height: '1px', width: 36, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)', margin: '0 auto 1.25rem' }} />
                <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 'clamp(0.75rem, 2.2vw, 0.95rem)', color: 'rgba(180,200,225,0.45)', maxWidth: '360px', margin: '0 auto clamp(1.25rem, 4vw, 2rem)', lineHeight: 1.8 }}>
                  Grab a digital sticky note and pin your thoughts, inside jokes, or memories for the batch to see.
                </p>
                <Link to="/create-memory" style={{ textDecoration: 'none' }}>
                  <button className="btn-pin" style={{
                    padding: 'clamp(0.6rem, 2vw, 0.85rem) clamp(1.5rem, 5vw, 2.5rem)',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)', fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a',
                    border: 'none', borderRadius: '2px', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(201,168,76,0.2)', transition: 'box-shadow 0.3s, transform 0.2s',
                  }}>
                    📌 Pin a Message
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Global styles ── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&family=Kalam:wght@300;400;700&display=swap');

          /* ── Wall grid: responsive columns ── */
          .wall-grid {
            --gap: clamp(28px, 4vw, 40px);
            display: grid;
            gap: var(--gap);
            /* Single column on mobile */
            grid-template-columns: 1fr;
            /* Stagger slightly on mobile via nth-child */
          }

          /* Slight alternating tilt on mobile for realism */
          @media (max-width: 559px) {
            .wall-grid .note-wrap:nth-child(even) {
              margin-left: clamp(8px, 4vw, 24px);
            }
            .wall-grid .note-wrap:nth-child(3n) {
              margin-right: clamp(8px, 4vw, 20px);
            }
          }

          @media (min-width: 560px) {
            .wall-grid {
              /* CSS columns for natural masonry on medium+ */
              display: block;
              columns: 2;
              column-gap: clamp(20px, 3vw, 32px);
            }
            .wall-grid .note-wrap { break-inside: avoid; }
          }

          @media (min-width: 900px) {
            .wall-grid { columns: 3; }
          }

          @media (min-width: 1280px) {
            .wall-grid { columns: 4; }
          }

          @media (min-width: 1600px) {
            .wall-grid { columns: 5; }
          }

          /* ── Note sizing on mobile ── */
          @media (max-width: 559px) {
            .note-wrap {
              /* Slightly smaller padding handled via clamp already */
              max-width: 100%;
            }
          }

          /* ── Button states ── */
          .btn-pin:hover {
            box-shadow: 0 0 36px rgba(201,168,76,0.42) !important;
            transform: translateY(-1px);
          }
          .btn-pin:active {
            transform: translateY(0);
          }

          .btn-load-more:hover {
            background: rgba(201,168,76,0.07) !important;
            border-color: rgba(201,168,76,0.5) !important;
          }

          /* ── Animations ── */
          @keyframes goldShimmer {
            0%   { background-position: 0% center; }
            50%  { background-position: 100% center; }
            100% { background-position: 0% center; }
          }

          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.5; }
            50%       { opacity: 0.85; }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes noteReveal {
            from { opacity: 0; transform: translateY(20px) rotate(var(--rot, -1deg)); }
            to   { opacity: 1; transform: translateY(0)    rotate(var(--rot, -1deg)); }
          }

          /* ── Hide br on mobile ── */
          @media (max-width: 480px) {
            .hide-mobile { display: none; }
          }

          /* ── Touch device: disable hover lift (avoid sticky hover) ── */
          @media (hover: none) {
            .note-wrap { transition: opacity 0.55s ease, transform 0.55s ease !important; }
          }

          /* ── Reduced motion ── */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default TheWall;