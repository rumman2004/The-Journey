import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import MateCard from '../../components/ui/MateCard';   
import { usersAPI } from '../../services/api';

// ── InView hook ───────────────────────────────────────────────────────────────
const useInView = (threshold = 0.08) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ── Skeleton Card — portrait 3:4, matches MateCard shape ─────────────────────
const SkeletonCard = ({ index }) => (
  <div
    style={{
      borderRadius: 'clamp(10px, 3vw, 16px)',
      border: '1px solid rgba(201,168,76,0.08)',
      background: '#111827',
      aspectRatio: '3 / 4',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: `
        5px 5px 14px rgba(0,0,0,0.62),
        -3px -3px 10px rgba(255,255,255,0.03),
        inset 0 1px 0 rgba(255,255,255,0.03)
      `,
      animation: `skelPulse 1.8s ease-in-out ${index * 0.1}s infinite`,
    }}
  >
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
      opacity: 0.6,
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 100%)',
    }} />
    <div style={{
      position: 'absolute', bottom: '-4%', right: '-2%',
      width: '55%', height: '40%',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '4px',
    }} />
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 'clamp(0.6rem, 3vw, 1rem)',
      display: 'flex', flexDirection: 'column',
      gap: 'clamp(0.2rem, 1vw, 0.35rem)',
    }}>
      <div style={{ height: 'clamp(10px, 3vw, 14px)', width: '70%', borderRadius: 3, background: 'rgba(240,236,228,0.1)' }} />
      <div style={{ height: 'clamp(8px, 2.2vw, 11px)', width: '55%', borderRadius: 3, background: 'rgba(180,200,225,0.07)' }} />
      <div style={{ display: 'flex', gap: 'clamp(0.22rem, 1.5vw, 0.4rem)', marginTop: 'clamp(0.1rem, 1vw, 0.25rem)' }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{
            width: 'clamp(24px, 8vw, 36px)', height: 'clamp(24px, 8vw, 36px)',
            borderRadius: 'clamp(5px, 1.5vw, 8px)', background: 'rgba(255,255,255,0.07)',
            boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
          }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Animated card wrapper ─────────────────────────────────────────────────────
const AnimatedCard = ({ member, index }) => {
  const [ref, visible] = useInView(0.05);

  const socialLinks = member.socialLinks || member.socials || {};

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `
          opacity  0.65s cubic-bezier(0.22,1,0.36,1) ${(index % 8) * 50}ms,
          transform 0.65s cubic-bezier(0.22,1,0.36,1) ${(index % 8) * 50}ms
        `,
      }}
    >
      <MateCard
        name={member.name || member.fullName || 'Batch Mate'}
        email={member.email}
        bio={member.bio}
        // Properly fetching profilePicture which comes from your DB
        profilePhoto={member.profilePicture || member.profilePhoto || member.avatar || member.photo}
        rollNumber={member.rollNumber}
        batch={member.batch || '2023-26'}
        isVerified={member.isVerified ?? member.verified ?? false}
        socialLinks={socialLinks}
        memoriesCount={member.memoriesCount ?? 0}
        photosCount={member.photosCount ?? 0}
        showEmail={false}
      />
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const TheBatch = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [headRef, headVisible] = useInView(0.2);

  useEffect(() => {
    (async () => {
      try {
        const response = await usersAPI.getUsers();
        if (response.error) {
          setError(response.error);
        } else {
          const arr = Array.isArray(response)
            ? response
            : (response.users || response.data || []);
          setUsers([...arr].sort((a, b) =>
            (a.rollNumber ?? Number.MAX_SAFE_INTEGER) - (b.rollNumber ?? Number.MAX_SAFE_INTEGER)
          ));
        }
      } catch {
        setError('Failed to load batch members');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const safeUsers = Array.isArray(users) ? users : [];

  if (error) {
    return (
      <Layout>
        <div style={{
          minHeight: '100vh', background: '#080d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 1.5rem)',
        }}>
          <div style={{
            textAlign: 'center', background: '#0e1525', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px',
            padding: 'clamp(2rem, 6vw, 3.5rem) clamp(1.5rem, 5vw, 3rem)', maxWidth: '400px', width: '100%',
            boxShadow: '8px 8px 24px rgba(0,0,0,0.6), -4px -4px 14px rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.1rem',
            }}>✕</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 700, color: '#f0ece4', marginBottom: '0.6rem' }}>
              Connection Failed
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', color: 'rgba(180,200,225,0.5)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: 'clamp(0.6rem, 2vw, 0.65rem) clamp(1.25rem, 4vw, 1.75rem)', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                color: '#080d1a', border: 'none', borderRadius: '2px', fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)', 
                fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >Try Again</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', color: '#f0ece4', overflowX: 'hidden' }}>
        <div style={{
          position: 'fixed', top: 0, right: '20%', zIndex: 0, pointerEvents: 'none',
          width: 'clamp(180px, 40vw, 480px)', height: 'clamp(180px, 40vw, 480px)',
          background: 'radial-gradient(circle, rgba(10,42,74,0.28), transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{
          position: 'fixed', top: '60%', left: '5%', zIndex: 0, pointerEvents: 'none',
          width: 'clamp(130px, 28vw, 360px)', height: 'clamp(130px, 28vw, 360px)',
          background: 'radial-gradient(circle, rgba(10,30,60,0.2), transparent 70%)', borderRadius: '50%',
        }} />

        <section ref={headRef} style={{ position: 'relative', zIndex: 1, padding: 'clamp(5rem, 14vw, 9rem) clamp(1rem, 5vw, 2rem) clamp(2rem, 5vw, 4.5rem)', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 30%, rgba(240,208,128,0.45) 50%, rgba(201,168,76,0.3) 70%, transparent)' }} />
          <p style={{
            fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.55rem, 1.5vw, 0.62rem)', fontWeight: 700, letterSpacing: '0.36em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.5)', marginBottom: 'clamp(0.65rem, 2vw, 1rem)', opacity: headVisible ? 1 : 0, transform: headVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s 0.1s, transform 0.8s 0.1s',
          }}>Class of 2023 — 2026</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2.4rem, 10vw, 6rem)', lineHeight: 1.0, letterSpacing: '-0.02em',
            margin: '0 0 clamp(0.65rem, 2vw, 1.25rem)', opacity: headVisible ? 1 : 0, transform: headVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.8s 0.22s, transform 0.8s 0.22s',
          }}>
            <span style={{ color: '#f0ece4' }}>Meet </span>
            <span style={{
              background: 'linear-gradient(135deg, #8B6914 0%, #c9a84c 30%, #f0d080 55%, #c9a84c 75%, #8B6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              backgroundSize: '200% 100%', animation: headVisible ? 'goldShimmer 5s 0.5s ease-in-out infinite' : 'none',
            }}>The Batch</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.4rem, 1.5vw, 0.75rem)', margin: '0 0 clamp(0.85rem, 2.5vw, 1.25rem)', opacity: headVisible ? 1 : 0, transition: 'opacity 0.8s 0.38s' }}>
            <div style={{ height: '1px', width: 'clamp(18px, 5vw, 55px)', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.42))' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,168,76,0.5)' }} />
            <div style={{ height: '1px', width: 'clamp(18px, 5vw, 55px)', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.42))' }} />
          </div>
          <p style={{
            fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 'clamp(0.78rem, 2.2vw, 1rem)', lineHeight: 1.85, color: 'rgba(180,200,225,0.42)',
            maxWidth: '400px', margin: '0 auto clamp(1rem, 3vw, 1.75rem)', letterSpacing: '0.022em', opacity: headVisible ? 1 : 0, transform: headVisible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.8s 0.48s, transform 0.8s 0.48s',
          }}>
            The developers, designers, and remarkable minds<br className="hide-xs" />
            who share this journey.
          </p>
          {!loading && safeUsers.length > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: 'clamp(0.35rem, 1.2vw, 0.45rem) clamp(0.8rem, 2.5vw, 1.25rem)', borderRadius: '2px', border: '1px solid rgba(201,168,76,0.2)',
              background: '#0e1525', boxShadow: '4px 4px 12px rgba(0,0,0,0.5), -2px -2px 8px rgba(255,255,255,0.03)', opacity: headVisible ? 1 : 0, transition: 'opacity 0.8s 0.62s',
            }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1rem, 3vw, 1.4rem)', background: 'linear-gradient(135deg, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{safeUsers.length}</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.58rem, 1.5vw, 0.65rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)' }}>Members</span>
            </div>
          )}
        </section>

        <section style={{ position: 'relative', zIndex: 1, padding: '0 clamp(0.75rem, 4vw, 2.5rem) clamp(3rem, 6vw, 6rem)', maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div className="members-grid">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} index={i} />)}
            </div>
          ) : safeUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'clamp(3rem, 8vw, 6rem) 1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', background: '#0e1525', boxShadow: '4px 4px 12px rgba(0,0,0,0.5), -2px -2px 8px rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'rgba(201,168,76,0.4)' }}>◇</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 700, color: '#f0ece4', marginBottom: '0.5rem' }}>No Members Found</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.75rem, 2vw, 0.82rem)', color: 'rgba(180,200,225,0.4)' }}>Stay tuned for new connections.</p>
            </div>
          ) : (
            <div className="members-grid">
              {safeUsers.map((member, i) => (
                <AnimatedCard key={member._id || i} member={member} index={i} />
              ))}
            </div>
          )}
        </section>

        <CtaSection />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

          .members-grid {
            display: grid;
            gap: clamp(0.55rem, 2vw, 1rem);
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: 768px) {
            .members-grid { grid-template-columns: repeat(3, 1fr); gap: clamp(0.75rem, 2vw, 1.1rem); }
          }
          @media (min-width: 1024px) {
            .members-grid { grid-template-columns: repeat(4, 1fr); gap: clamp(0.9rem, 1.8vw, 1.2rem); }
          }
          @media (min-width: 1280px) {
            .members-grid { grid-template-columns: repeat(5, 1fr); gap: 1.1rem; }
          }

          @keyframes goldShimmer {
            0%   { background-position: 0% center; }
            50%  { background-position: 100% center; }
            100% { background-position: 0% center; }
          }

          @keyframes skelPulse {
            0%, 100% { opacity: 0.45; }
            50%       { opacity: 0.8; }
          }

          @media (max-width: 420px) { .hide-xs { display: none; } }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

// ── CTA Section ───────────────────────────────────────────────────────────────
const CtaSection = () => {
  const [ref, visible] = useInView(0.15);
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, padding: '0 clamp(0.75rem, 5vw, 2.5rem) clamp(3.5rem, 8vw, 7rem)', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', padding: 'clamp(1.75rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3.5rem)', background: '#0e1525', border: '1px solid rgba(201,168,76,0.18)', boxShadow: '10px 10px 28px rgba(0,0,0,0.6), -6px -6px 18px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.025)', backdropFilter: 'blur(20px)', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(22px)', transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4) 30%, rgba(240,208,128,0.55) 50%, rgba(201,168,76,0.4) 70%, transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.55rem, 1.5vw, 0.62rem)', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.48)', marginBottom: 'clamp(0.6rem, 2vw, 1rem)' }}>Keep the story alive</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.3rem, 5vw, 2.25rem)', color: '#f0ece4', lineHeight: 1.2, marginBottom: '0.85rem' }}>Share Your Story</h2>
          <div style={{ height: '1px', width: 36, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)', margin: '0 auto 1.25rem' }} />
          <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 'clamp(0.75rem, 2.2vw, 0.95rem)', color: 'rgba(180,200,225,0.45)', maxWidth: '380px', margin: '0 auto clamp(1.25rem, 4vw, 2rem)', lineHeight: 1.8, letterSpacing: '0.02em' }}>
            Share memories, connect with batchmates, and keep the journey alive on the Wall.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.5rem, 2vw, 0.75rem)', justifyContent: 'center' }}>
            <Link to="/wall" style={{ textDecoration: 'none' }}>
              <button style={{ padding: 'clamp(0.6rem, 2vw, 0.85rem) clamp(1.25rem, 4vw, 2.25rem)', fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.6rem, 1.6vw, 0.72rem)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', color: '#080d1a', border: 'none', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 0 20px rgba(201,168,76,0.2)', transition: 'box-shadow 0.3s, transform 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 36px rgba(201,168,76,0.42)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.2)'; e.currentTarget.style.transform = 'none'; }}>Visit The Wall</button>
            </Link>
            <Link to="/create-memory" style={{ textDecoration: 'none' }}>
              <button style={{ padding: 'clamp(0.6rem, 2vw, 0.85rem) clamp(1.25rem, 4vw, 2.25rem)', fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.6rem, 1.6vw, 0.72rem)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: 'rgba(201,168,76,0.8)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px', cursor: 'pointer', transition: 'all 0.25s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.52)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}>Pin a Memory</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheBatch;