import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-stretch overflow-hidden" style={{ background: '#020b18' }}>

      {/* === NOISE / GRAIN OVERLAY === */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.5,
        mixBlendMode: 'overlay',
      }} />

      {/* === DEEP BLUE GRADIENT BG === */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 20% 50%, #0a2a4a 0%, #020b18 60%)',
      }} />

      {/* === SUBTLE GRID LINES === */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* === ACCENT GLOW TOP-LEFT === */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none z-0" style={{
        background: 'radial-gradient(circle, rgba(10,80,140,0.35) 0%, transparent 70%)',
        transform: 'translate(-20%, -20%)',
      }} />

      {/* === GOLDEN HORIZONTAL RULE ACCENT === */}
      <div className="absolute top-0 left-0 right-0 h-px z-10" style={{
        background: 'linear-gradient(90deg, transparent, #c9a84c 40%, #f0d080 50%, #c9a84c 60%, transparent)',
        opacity: 0.6,
      }} />

      {/* ============================================================ */}
      {/* SPLIT LAYOUT                                                  */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row min-h-screen">

        {/* ===== LEFT: TEXT PANEL ===== */}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 lg:py-0">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-3 mb-8 w-fit">
            <span className="block w-8 h-px" style={{ background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#c9a84c', fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
              A Timeless Chapter
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }} className="mb-2">
            <span className="block text-5xl md:text-6xl xl:text-7xl font-light tracking-tight leading-none text-white/90">
              Where Our
            </span>
            <span className="block text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-white">
              Memories
            </span>
            <span className="block text-5xl md:text-6xl xl:text-7xl font-light tracking-tight leading-none" style={{
              background: 'linear-gradient(135deg, #8B6914 0%, #c9a84c 30%, #f0d080 50%, #c9a84c 70%, #8B6914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s ease-in-out infinite',
            }}>
              Live On.
            </span>
          </h1>

          {/* Golden Batch Tag */}
          <div className="flex items-center gap-4 mt-6 mb-8">
            <div className="px-5 py-2 rounded-sm border" style={{
              borderColor: 'rgba(201,168,76,0.5)',
              background: 'rgba(201,168,76,0.07)',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg, #8B6914, #f0d080, #c9a84c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                BATCH 23–26
              </span>
            </div>
            <span className="block flex-1 h-px max-w-[80px]" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }} />
          </div>

          {/* Subtext */}
          <p className="text-base md:text-lg leading-relaxed max-w-md mb-10" style={{
            color: 'rgba(180,200,225,0.65)',
            fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}>
            A dedicated space to preserve our college days. Upload photos,
            leave messages for friends, and relive the moments that shaped our batch.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 py-4 font-semibold text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: "'Lato', sans-serif",
                background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                color: '#0a0a0f',
                borderRadius: '2px',
                letterSpacing: '0.15em',
                boxShadow: '0 0 24px rgba(201,168,76,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.25)'}
            >
              Explore The Wall
            </button>
            <button
              className="px-8 py-4 font-semibold text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: "'Lato', sans-serif",
                background: 'transparent',
                color: 'rgba(201,168,76,0.85)',
                borderRadius: '2px',
                border: '1px solid rgba(201,168,76,0.35)',
                letterSpacing: '0.15em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
              }}
            >
              Share a Memory
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-8 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { value: '3 Yrs', label: 'Together' },
              { value: '∞', label: 'Memories' },
              { value: '1', label: 'Batch' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{s.value}</div>
                <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'rgba(180,200,225,0.4)', fontFamily: "'Lato', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT: IMAGE PANEL ===== */}
        <div className="relative w-full lg:w-[48%] xl:w-[45%] min-h-[50vh] lg:min-h-screen flex-shrink-0">

          {/* Diagonal separator overlay (left edge) */}
          <div className="absolute top-0 left-0 h-full w-20 z-20 hidden lg:block" style={{
            background: 'linear-gradient(to right, #020b18, transparent)',
          }} />

          {/* Golden border line */}
          <div className="absolute top-0 left-0 w-px h-full z-20 hidden lg:block" style={{
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.6) 30%, rgba(201,168,76,0.6) 70%, transparent)',
          }} />

          {/* The Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038019/IMG_20250223_153014291_jbotmi.jpg"
              alt="Batch 2023-26"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.6) saturate(0.9) contrast(1.05)' }}
            />
            {/* Image overlay — dark-blue tint */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, rgba(2,11,24,0.7) 0%, rgba(10,42,74,0.4) 50%, rgba(2,11,24,0.3) 100%)',
            }} />
            {/* Bottom vignette */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(2,11,24,0.85) 0%, transparent 40%)',
            }} />
          </div>

          {/* Floating Corner Badge */}
          <div className="absolute top-8 right-8 z-30 text-right">
            <div className="inline-block px-4 py-2 border backdrop-blur-md" style={{
              borderColor: 'rgba(201,168,76,0.4)',
              background: 'rgba(2,11,24,0.6)',
              borderRadius: '2px',
            }}>
              <span className="block text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: "'Lato', sans-serif" }}>The Journey</span>
              <span className="block text-lg font-bold" style={{
                fontFamily: "'Cormorant Garamond', serif",
                background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>2023 – 2026</span>
            </div>
          </div>

          {/* Bottom Overlay: Notification Card */}
          <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 w-[80%] max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3 rounded-sm backdrop-blur-xl border" style={{
              background: 'rgba(2,11,24,0.75)',
              borderColor: 'rgba(201,168,76,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{
                background: 'linear-gradient(135deg, #8B6914, #f0d080)',
                color: '#020b18',
                fontFamily: "'Lato', sans-serif",
              }}>RA</div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>New memory added!</p>
                <p className="text-xs" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: "'Lato', sans-serif" }}>Just now</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#c9a84c', boxShadow: '0 0 6px #c9a84c' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2) 50%, transparent)',
      }} />

      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;