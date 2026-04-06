import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import MasonryLayoutSection from '../../components/section/MasonryLayoutSection';
import Footer from '../../components/layout/Footer';

const timelineEvents = [
  {
    year: '2023', month: 'August', index: '01',
    title: 'Where It All Started',
    description: 'Fresh faces, new friendships, and the thrill of day one. None of us knew yet what the next three years would hold.',
    caption: 'The very first chapter of our story.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323674/IMG_20230823_161529733.jpg_xwb8dh.jpg'
  },
  {
    year: '2023', month: 'December', index: '02',
    title: 'The First Hurdle',
    description: 'First exams done. The stress melted instantly into shared relief, laughter, and the quiet realization we\'d survive this together.',
    caption: 'Post-exam relief and lakeside discussions.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20231207_140845010.jpg_xjtufu.jpg'
  },
  {
    year: '2024', month: 'April', index: '03',
    title: 'Unofficial Free Period',
    description: 'Controllers, combos, and one perfectly timed class bunk. Some lessons are best learned outside the syllabus.',
    caption: 'Controllers, combos, and an empty classroom.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg'
  },
  {
    year: '2024', month: 'April', index: '04',
    title: 'Impromptu Pizza Party',
    description: 'A sudden craving. No plans, no reservations — just everyone gathered around slices and stories nobody wanted to end.',
    caption: 'Unplanned moments make the best memories.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324267/IMG_20240427_140752010.jpg_wv9azn.jpg'
  },
  {
    year: '2024', month: 'August', index: '05',
    title: 'Welcoming the Newcomers',
    description: 'We became the seniors, welcoming a new batch the same way we once hoped to be welcomed. The torch passed quietly.',
    caption: 'Passing the torch and sharing the journey.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325350/IMG_20240805_115942716.jpg_favqac.jpg'
  },
  {
    year: '2025', month: 'April', index: '06',
    title: 'The Off-Period UNO Battles',
    description: 'Draw four. Skip. Reverse. Every free period became a battlefield. The loudest laughs and fiercest rivalries — all over cards.',
    caption: 'Draw four! Free periods turned into card tournaments.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325432/IMG-20250423-WA0017.jpg_i3eolj.jpg'
  },
  {
    year: '2025', month: 'April', index: '07',
    title: 'The Scholarship Treat',
    description: 'Real friendship is celebrating hard — and immediately demanding a treat. Shared pizzas, cold drinks, and pride all around.',
    caption: 'Celebrating success with the mandatory pizza party.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0008.jpg_ulglfw.jpg'
  },
  {
    year: '2025', month: 'September', index: '08',
    title: "Teacher's Day Celebration",
    description: 'Black and yellow balloons, heartfelt speeches, and a room full of gratitude. Honouring the people who never gave up on us.',
    caption: 'Celebrating the guiding lights of our college life.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326075/20250830_142311.jpg_mlxmrx.jpg'
  },
  {
    year: '2025', month: 'September', index: '09',
    title: "The Freshers' Fiesta",
    description: 'A massive group photo, a room full of energy, and the moment we truly felt like seniors. The cycle of welcome, continued.',
    caption: 'A full house! Celebrating the arrival of the junior batch.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326094/20250905_142410.jpg_gwsvn0.jpg'
  },
  {
    year: '2025', month: 'December', index: '10',
    title: 'Crossing the 5th Sem Finish Line',
    description: 'Winter air, one quick selfie, and the sudden realization: just one semester left. We\'d come further than we thought.',
    caption: '5th semester done and dusted. One more to go!',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326107/IMG-20251222-WA0122.jpg_stedxq.jpg'
  },
  {
    year: '2026', month: 'April', index: '11',
    title: 'Still Being Written',
    description: 'Final semester. Major projects. Last campus moments. This chapter is still being written — and we\'re savouring every page.',
    caption: 'The final chapter is still being written.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775402849/Screenshot_2026-04-05_205645_vwih3a.png'
  }
];

// ── Scroll-triggered InView hook ───────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ── Text Card ─────────────────────────────────────────────────────────────
const TextCard = ({ event, align }) => (
  <div
    className="group relative p-6 sm:p-8 rounded-2xl overflow-hidden h-full transition-all duration-500"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(201,168,76,0.1)',
      backdropFilter: 'blur(16px)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(201,168,76,0.045)';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)';
      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.45), 0 0 24px rgba(201,168,76,0.07)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Corner glow on hover */}
    <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
      background: 'radial-gradient(circle at top right, rgba(201,168,76,0.09), transparent 70%)',
    }} />

    {/* Meta label */}
    <div className={`flex items-center gap-2 mb-4 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <span style={{
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.28em',
        color: 'rgba(201,168,76,0.45)',
        textTransform: 'uppercase',
      }}>{event.index} · {event.month} {event.year}</span>
    </div>

    {/* Title */}
    <h3 className={align === 'right' ? 'text-right' : 'text-left'} style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 700,
      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
      lineHeight: 1.2,
      color: '#f0ece4',
      letterSpacing: '-0.01em',
      marginBottom: '0.75rem',
    }}>
      {event.title}
    </h3>

    {/* Gold accent rule */}
    <div className={`h-px w-7 mb-4 ${align === 'right' ? 'ml-auto' : ''}`} style={{
      background: 'linear-gradient(90deg, #c9a84c, transparent)',
    }} />

    {/* Description */}
    <p className={align === 'right' ? 'text-right' : 'text-left'} style={{
      fontFamily: "'Lato', sans-serif",
      fontWeight: 300,
      fontSize: '0.8rem',
      lineHeight: 1.85,
      color: 'rgba(180,200,225,0.52)',
      letterSpacing: '0.022em',
    }}>
      {event.description}
    </p>
  </div>
);

// ── Photo Card ────────────────────────────────────────────────────────────
const PhotoCard = ({ event }) => (
  <div
    className="group relative transition-all duration-500 rounded-2xl overflow-hidden"
    style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 22px 60px rgba(0,0,0,0.65), 0 0 30px rgba(201,168,76,0.12)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Polaroid frame */}
    <div className="bg-[#f4efe6] p-2.5 pb-0 rounded-2xl">
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gold tint on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.06), transparent 60%)',
        }} />
      </div>
      {/* Caption */}
      <div className="px-2 py-4 text-center">
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '0.78rem',
          color: '#4a3f30',
          letterSpacing: '0.015em',
          lineHeight: 1.45,
        }}>
          {event.caption}
        </p>
      </div>
    </div>
  </div>
);

// ── Desktop Timeline Card ─────────────────────────────────────────────────
const DesktopTimelineCard = ({ event, index }) => {
  const [ref, visible] = useInView(0.1);
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_80px_1fr] items-start gap-0">

      {/* LEFT column */}
      <div
        className={isLeft ? 'pr-8 xl:pr-12' : 'pr-8 xl:pr-12 order-3'}
        style={{
          transition: 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : `translateX(${isLeft ? '-28px' : '28px'})`,
          transitionDelay: '0.05s',
        }}
      >
        {isLeft ? <TextCard event={event} align="right" /> : <PhotoCard event={event} />}
      </div>

      {/* CENTER node column */}
      <div className="order-2 flex flex-col items-center relative">
        {/* Top line */}
        <div className="w-px flex-1 min-h-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.22))' }} />

        {/* Node */}
        <div
          className="relative flex-shrink-0 flex flex-col items-center justify-center rounded-full z-10 my-1"
          style={{
            width: '64px',
            height: '64px',
            border: '1px solid rgba(201,168,76,0.32)',
            background: 'radial-gradient(circle at center, rgba(201,168,76,0.1) 0%, rgba(8,13,26,0.97) 70%)',
            boxShadow: visible ? '0 0 22px rgba(201,168,76,0.16), inset 0 0 18px rgba(201,168,76,0.05)' : 'none',
            transition: 'box-shadow 0.9s ease',
            transitionDelay: '0.35s',
          }}
        >
          <span style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.52rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'rgba(201,168,76,0.5)',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>{event.month.slice(0, 3)}</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f0d080',
            lineHeight: 1.1,
          }}>{event.year}</span>

          {/* Animated pulse ring */}
          {visible && (
            <div className="absolute inset-0 rounded-full animate-node-pulse" style={{
              border: '1px solid rgba(201,168,76,0.35)',
            }} />
          )}
        </div>

        {/* Bottom line */}
        <div className="w-px flex-1 min-h-8" style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.22), transparent)' }} />
      </div>

      {/* RIGHT column */}
      <div
        className={isLeft ? 'pl-8 xl:pl-12 order-3' : 'pl-8 xl:pl-12'}
        style={{
          transition: 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : `translateX(${isLeft ? '28px' : '-28px'})`,
          transitionDelay: '0.15s',
        }}
      >
        {isLeft ? <PhotoCard event={event} /> : <TextCard event={event} align="left" />}
      </div>
    </div>
  );
};

// ── Mobile Timeline Card ──────────────────────────────────────────────────
const MobileTimelineCard = ({ event }) => {
  const [ref, visible] = useInView(0.07);
  return (
    <div
      ref={ref}
      className="relative pl-9"
      style={{
        transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
      }}
    >
      {/* Spine dot */}
      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full z-10 flex items-center justify-center" style={{
        background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(8,13,26,0.95) 70%)',
        border: '1px solid rgba(201,168,76,0.4)',
        boxShadow: visible ? '0 0 10px rgba(201,168,76,0.2)' : 'none',
        transition: 'box-shadow 0.6s ease',
      }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
      </div>

      {/* Date label */}
      <div className="mb-3">
        <span style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: '0.58rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: 'rgba(201,168,76,0.55)',
          textTransform: 'uppercase',
        }}>{event.month} · {event.year}</span>
      </div>

      {/* Photo */}
      <div className="mb-4 rounded-xl overflow-hidden" style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.5)' }}>
        <div className="bg-[#f4efe6] p-2 pb-0 rounded-xl">
          <img
            src={event.image}
            alt={event.title}
            className="w-full rounded-lg object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          <p className="py-3 text-center" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '0.7rem',
            color: '#4a3f30',
          }}>{event.caption}</p>
        </div>
      </div>

      {/* Text */}
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        fontSize: '1.2rem',
        color: '#f0ece4',
        lineHeight: 1.2,
        marginBottom: '0.5rem',
      }}>{event.title}</h3>
      <div style={{ height: '1px', width: '24px', background: 'linear-gradient(90deg,#c9a84c,transparent)', marginBottom: '0.6rem' }} />
      <p style={{
        fontFamily: "'Lato', sans-serif",
        fontWeight: 300,
        fontSize: '0.77rem',
        lineHeight: 1.8,
        color: 'rgba(180,200,225,0.5)',
        marginBottom: '2.5rem',
      }}>{event.description}</p>
    </div>
  );
};

// ── Section Heading ───────────────────────────────────────────────────────
const SectionHeading = () => {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} className="text-center mb-20 md:mb-28"
      style={{
        transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
      }}
    >
      <p style={{
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.5)',
        marginBottom: '1rem',
      }}>Batch 2023 — 2026</p>

      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700,
        fontSize: 'clamp(2rem, 5vw, 3.75rem)',
        color: '#f0ece4',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        marginBottom: '1.5rem',
      }}>
        Moments That Shaped Us
      </h2>

      <div className="flex items-center justify-center gap-4">
        <div className="h-px" style={{ width: 'clamp(32px,8vw,80px)', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.45))' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.5)' }} />
        <div className="h-px" style={{ width: 'clamp(32px,8vw,80px)', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.45))' }} />
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
const TheJourney = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  const sortedEvents = [...timelineEvents].sort((a, b) => {
    if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  useEffect(() => {
    // Preload timeline images quietly in background for ultra-smooth scrolling
    const preloadTimelineImages = () => {
      timelineEvents.forEach(event => {
        const img = new Image();
        img.src = event.image;
      });
    };

    // Use idle callback to not block initial render or interactions
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadTimelineImages);
    } else {
      setTimeout(preloadTimelineImages, 1000);
    }
  }, []);

  const startJourney = () => {
    document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToBatch = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => setShowLoading(true), 240);
    setTimeout(() => navigate('/batch'), 1300);
  };

  return (
    <Layout showFooter={false}>
      <div className="journey-page min-h-screen relative text-white overflow-x-hidden" style={{ background: '#080d1a' }}>

{/* ══════════════════════════════════════════════════════════ */}
        {/* HERO                                                       */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 px-4">

          <div className="absolute inset-0 z-0" style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 40%, #0d1f3c 0%, #080d1a 65%)',
          }} />

          <div className="absolute inset-0 z-0 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: 0.65,
            mixBlendMode: 'overlay',
          }} />

          <div className="absolute inset-0 z-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(4,8,18,0.9) 100%)',
          }} />

          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl mx-auto py-10">

            <p className="animate-hero-fade-in" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(0.78rem, 2vw, 1.1rem)',
              color: '#c9a84c',
              letterSpacing: '0.06em',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              opacity: 0,
              animationDelay: '0.2s',
              animationFillMode: 'forwards',
            }}>
              A Journey We'll Always Carry
            </p>

            <h1 className="animate-hero-fade-in" style={{ 
              margin: 0, 
              fontFamily: "'Cormorant Garamond', serif", 
              fontWeight: 700, 
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
              lineHeight: 1,
              opacity: 0,
              animationDelay: '0.5s',
              animationFillMode: 'forwards'
            }}>
                <span style={{ color: '#f0ece4' }}>Batch </span>
                <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>2023—26</span>
            </h1>

            {/* Divider */}
            <div className="animate-hero-fade-in" style={{
              height: '1px', width: '36px',
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
              opacity: 0, animationDelay: '0.8s', animationFillMode: 'forwards',
            }} />

            <p className="animate-hero-fade-in" style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
              lineHeight: 1.95,
              color: 'rgba(200,215,235,0.5)',
              maxWidth: '400px',
              letterSpacing: '0.025em',
              marginBottom: 'clamp(3rem, 6vw, 4.5rem)',
              opacity: 0, animationDelay: '1s', animationFillMode: 'forwards',
            }}>
              Three years of laughter, late nights, and lessons learned. Join us as we look back on the moments that defined us.
            </p>

            <div
              className="flex flex-col items-center gap-3 cursor-pointer animate-hero-fade-in group"
              onClick={startJourney}
              style={{ opacity: 0, animationDelay: '1.3s', animationFillMode: 'forwards' }}
            >
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.62rem',
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.58)',
                transition: 'color 0.3s',
              }}>
                Click to Start the Journey
              </span>
              <div className="animate-scroll-bounce" style={{ color: 'rgba(201,168,76,0.45)' }}>
                <svg width="18" height="26" viewBox="0 0 20 28" fill="none">
                  <line x1="10" y1="0" x2="10" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <polyline points="4,13 10,20 16,13" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10" style={{
            background: 'linear-gradient(to bottom, transparent, #080d1a)',
          }} />
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TIMELINE                                                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section id="timeline-section" className="relative z-10 py-20 md:py-32 px-4 sm:px-6 lg:px-10">

          {/* Ambient center glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(10,42,74,0.12) 0%, transparent 70%)',
          }} />

          <div className="max-w-6xl mx-auto">
            <SectionHeading />

            {/* ── DESKTOP: alternating 2-col with center spine ── */}
            <div className="hidden md:block relative">
              {/* Continuous spine */}
              <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.2) 8%, rgba(201,168,76,0.2) 92%, transparent 100%)',
              }} />
              <div className="space-y-4">
                {sortedEvents.map((event, i) => (
                  <DesktopTimelineCard key={`${event.year}-${event.month}-${i}`} event={event} index={i} />
                ))}
              </div>
            </div>

            {/* ── MOBILE: stacked list with left spine ── */}
            <div className="md:hidden relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.18) 5%, rgba(201,168,76,0.18) 95%, transparent 100%)',
              }} />
              <div>
                {sortedEvents.map((event, i) => (
                  <MobileTimelineCard key={`${event.year}-${event.month}-${i}`} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* PAGE TRANSITION                                            */}
        {/* ══════════════════════════════════════════════════════════ */}
        {(isExiting || showLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080d1a] opacity-0 animate-fade-in px-4 text-center">
            <div className="space-y-5">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.2)] animate-ping" />
                <div className="w-12 h-12 rounded-full border-2 border-t-[#c9a84c] border-[rgba(201,168,76,0.08)] animate-spin" />
              </div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Loading Class of '26...</p>
              <p style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.76rem',
                color: 'rgba(180,200,225,0.38)',
                letterSpacing: '0.06em',
              }}>Transporting you to the next chapter.</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASONRY                                                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      <MasonryLayoutSection />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CTA                                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
{/* ══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#050810', borderTop: '1px solid rgba(201,168,76,0.08)' }} className="py-16 md:py-20 px-5 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.48)',
              marginBottom: '0.75rem',
            }}>Continue the story</p>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              color: '#f0ece4',
              lineHeight: 1.2,
              marginBottom: '0.6rem',
            }}>The story continues beyond the wall.</h4>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 300,
              fontSize: '0.83rem',
              color: 'rgba(180,200,225,0.42)',
            }}>Follow the class, discover every voice, and keep the batch flame alive.</p>
          </div>
          <button
            onClick={goToBatch} 
            className="flex-shrink-0 px-8 py-4 text-xs font-semibold uppercase transition-all duration-300 w-full md:w-auto"
            style={{
              fontFamily: "'Lato', sans-serif",
              /* Glassmorphism Effect */
              background: 'rgba(255, 255, 255, 0.03)', 
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              /* Golden Border & Rounded Corners */
              border: '1px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '9999px',
              /* Golden Text */
              color: '#f0d080', 
              letterSpacing: '0.16em',
              /* Initial subtle shadow */
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={e => {
              /* Glows gold and brightens the border on hover */
              e.currentTarget.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.3), inset 0 0 20px rgba(201, 168, 76, 0.1)';
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.8)';
            }}
            onMouseLeave={e => {
              /* Returns to sleek glass state */
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)';
            }}
          >
            Meet The Class →
          </button>
        </div>
      </section>

      <Footer />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* GLOBAL STYLES                                              */}
      {/* ══════════════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Lato:wght@300;400;700&display=swap');

        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.45; }
          50%       { transform: translateY(7px); opacity: 0.9; }
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
        @keyframes node-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.1); opacity: 0; }
        }

        .animate-hero-fade-in  { animation: hero-fade-in 1s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-scroll-bounce { animation: scroll-bounce 2.2s ease-in-out infinite; }
        .animate-fade-in       { animation: fade-in 0.35s forwards; }
        .animate-node-pulse    { animation: node-pulse 2.2s ease-out infinite; }
      `}</style>
    </Layout>
  );
};

export default TheJourney;