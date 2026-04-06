import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const baseLinks = [
    { to: '/',        label: 'Journey' },
    { to: '/album',   label: 'Album' },
    { to: '/wall',    label: 'The Wall' },
    { to: '/batch',   label: 'The Batch' },
  ];

  const authLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/create-memory', label: 'Add Message' },
    { to: '/stickers', label: 'Stickers' },
  ];

  const navLinks = isAuthenticated ? [...baseLinks, ...authLinks] : baseLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(8, 13, 26, 0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Top golden rule — always visible */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 40%, rgba(240,208,128,0.7) 50%, rgba(201,168,76,0.5) 60%, transparent)',
        }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '0.06em',
                background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Batch 23–26
              </span>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: '0.06em',
                    color: isActive(to) ? '#f0d080' : 'rgba(200,215,235,0.65)',
                  }}
                >
                  {label}
                  {/* Underline accent */}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px transition-all duration-300"
                    style={{
                      background: 'linear-gradient(90deg, #c9a84c, #f0d080)',
                      opacity: isActive(to) ? 1 : 0,
                      transform: isActive(to) ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                  <style>{`
                    a[href="${to}"]:hover span { opacity: 1 !important; transform: scaleX(1) !important; }
                    a[href="${to}"]:hover { color: rgba(240,208,128,0.9) !important; }
                  `}</style>
                </Link>
              ))}
            </div>

            {/* ── DESKTOP RIGHT ACTIONS ── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '0.8rem',
                    color: 'rgba(200,215,235,0.5)',
                    letterSpacing: '0.04em',
                  }}>
                    Hi, {user?.name}
                  </span>
                  <GoldOutlineButton onClick={handleLogout}>Logout</GoldOutlineButton>
                </div>
              ) : (
                <Link to="/login">
                  <GoldSolidButton>Sign In Mates</GoldSolidButton>
                </Link>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-sm transition-all duration-200"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              style={{ color: 'rgba(201,168,76,0.8)' }}
            >
              <span
                className="block w-5 h-px transition-all duration-300 origin-center"
                style={{
                  background: 'currentColor',
                  transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  background: 'currentColor',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-300 origin-center"
                style={{
                  background: 'currentColor',
                  transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
                }}
              />
            </button>

          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-400"
          style={{
            maxHeight: menuOpen ? '400px' : '0',
            background: 'rgba(8,13,26,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: menuOpen ? '1px solid rgba(201,168,76,0.1)' : 'none',
          }}
        >
          <div className="px-5 py-6 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-3 rounded-sm transition-all duration-200"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  color: isActive(to) ? '#f0d080' : 'rgba(200,215,235,0.6)',
                  borderLeft: isActive(to) ? '2px solid #c9a84c' : '2px solid transparent',
                  background: isActive(to) ? 'rgba(201,168,76,0.05)' : 'transparent',
                }}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 mt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              {isAuthenticated ? (
                <>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', color: 'rgba(200,215,235,0.4)', letterSpacing: '0.04em' }}>
                    Signed in as {user?.name}
                  </p>
                    <GoldOutlineButton onClick={handleLogout} fullWidth>Logout</GoldOutlineButton>
                </>
              ) : (
                <Link to="/login" className="block">
                  <GoldSolidButton fullWidth>Sign In Mates</GoldSolidButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
      `}</style>
    </>
  );
};

// ── Internal button helpers ──────────────────────────────────────────────────

const GoldSolidButton = ({ children, onClick, fullWidth }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${fullWidth ? 'w-full' : ''}`}
    style={{
      fontFamily: "'Lato', sans-serif",
      background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
      color: '#080d1a',
      borderRadius: '2px',
      letterSpacing: '0.12em',
      boxShadow: '0 0 16px rgba(201,168,76,0.2)',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(201,168,76,0.45)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(201,168,76,0.2)'}
  >
    {children}
  </button>
);

const GoldOutlineButton = ({ children, onClick, fullWidth }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${fullWidth ? 'w-full' : ''}`}
    style={{
      fontFamily: "'Lato', sans-serif",
      background: 'transparent',
      color: 'rgba(201,168,76,0.8)',
      border: '1px solid rgba(201,168,76,0.3)',
      borderRadius: '2px',
      letterSpacing: '0.12em',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
    }}
  >
    {children}
  </button>
);

export default Navbar;