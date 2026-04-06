import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/rumman.ig', // Replace with specific link
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: 'https://github.com/rumman2004',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/rummanahmed04',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <footer style={{ background: '#050810', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top ethereal golden line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), rgba(240,208,128,0.4), rgba(201,168,76,0.1), transparent)',
      }} />

      {/* Ambient glow centered */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 rounded-full" style={{
        background: 'radial-gradient(ellipse, rgba(139,105,20,0.06), transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-5xl mx-auto px-6 pt-20 pb-10 flex flex-col items-center relative z-10">
        {/* ── BEAUTIFUL QUOTE ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 relative">
          <span className="absolute -top-6 -left-6 text-6xl opacity-20 select-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#c9a84c' }}>"</span>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            lineHeight: 1.5,
            background: 'linear-gradient(to bottom right, #f0ece4, #c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.02em',
          }}>
            Memories are the architecture of our identity, capturing the silent poetry of the moments we never want to forget.
          </p>
          <span className="absolute -bottom-10 -right-4 text-6xl opacity-20 select-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#c9a84c' }}>"</span>
        </div>

        {/* ── SOCIAL LINKS (Using Lucide) ── */}
        <div className="flex items-center justify-center gap-6 mb-16">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                background: 'rgba(201,168,76,0.15)',
                filter: 'blur(8px)',
                transform: 'scale(1.2)',
              }} />
              
              <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center transition-all duration-300" style={{
                background: 'rgba(8,13,26,0.6)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: 'rgba(201,168,76,0.6)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f0d080';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
                e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(201,168,76,0.6)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
                e.currentTarget.style.background = 'rgba(8,13,26,0.6)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                {icon}
              </div>
            </a>
          ))}
        </div>

        <div className="w-full h-px mb-8" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
        }} />

        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            color: 'rgba(180,200,225,0.3)',
            textTransform: 'uppercase',
            margin: 0
          }}>
            © {year} College Memories · All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            
            {/* PORTFOLIO LINK */}
            <a 
              href="https://rumman-portfolio-ryuu.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(201,168,76,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f0d080'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,168,76,0.6)'}
              className="flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              Developer Portfolio
            </a>

            <div className="hidden sm:block w-px h-4" style={{ background: 'rgba(201,168,76,0.2)' }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'rgba(201,168,76,0.8)',
              letterSpacing: '0.02em',
              margin: 0,
            }}>
              Made with <span style={{ color: '#e25555', fontStyle: 'normal', padding: '0 2px' }}>♥</span> by <span style={{ fontWeight: 600, color: '#f0d080' }}>Rumman Ahmed</span>
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,800&family=Lato:wght@300;400;700&display=swap');
      `}</style>
    </footer>
  );
};

export default Footer;