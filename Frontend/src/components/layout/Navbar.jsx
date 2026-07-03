import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
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
        className={`fixed top-4 inset-x-4 md:inset-x-auto md:w-[95%] md:max-w-5xl md:left-1/2 md:-translate-x-1/2 z-[100] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${menuOpen ? 'rounded-2xl' : 'rounded-full'}`}
        style={{ 
          position: 'fixed',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: '1.35rem',
                letterSpacing: '0.02em',
                color: '#1F1F1F',
              }}>
                Batch 23–26
              </span>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200 group whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: isActive(to) ? '#8B6914' : 'rgba(31,31,31,0.7)',
                  }}
                >
                  {label}
                  {/* Underline accent */}
                  <span
                    className="absolute bottom-1 left-4 right-4 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{
                      background: '#8B6914',
                      opacity: isActive(to) ? 1 : 0,
                      transform: isActive(to) ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'center',
                    }}
                  />
                  <style>{`
                    a[href="${to}"]:hover span { opacity: 1 !important; transform: scaleX(1) !important; }
                    a[href="${to}"]:hover { color: #8B6914 !important; }
                  `}</style>
                </Link>
              ))}
            </div>

            {/* ── DESKTOP RIGHT ACTIONS ── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 xl:gap-4">
                  <button onClick={handleLogout} className="whitespace-nowrap px-4 xl:px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full border border-[#1f1f1f] text-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#1f1f1f] text-white hover:bg-black hover:shadow-lg transition-all">
                    Sign In Mates
                  </button>
                </Link>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-sm transition-all duration-200"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              style={{ color: '#1F1F1F' }}
            >
              <span
                className="block w-5 h-px transition-all duration-300 origin-center"
                style={{
                  background: 'currentColor',
                  transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
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
                  transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>

          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: menuOpen ? '800px' : '0',
            opacity: menuOpen ? 1 : 0,
            background: 'transparent',
            borderTop: '1px solid',
            borderTopColor: menuOpen ? 'rgba(0,0,0,0.06)' : 'transparent',
          }}
        >
          <div className="px-5 py-6 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-sans uppercase text-xs font-bold tracking-wider"
                style={{
                  color: isActive(to) ? '#8B6914' : '#1f1f1f',
                  background: isActive(to) ? 'rgba(255,255,255,0.5)' : 'transparent',
                }}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 mt-4 space-y-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="w-full px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-[#1f1f1f] text-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-white transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#1f1f1f] text-white hover:bg-black transition-colors">
                    Sign In Mates
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        /* Removed hardcoded font imports to use global variables */
      `}</style>
    </>
  );
};

export default Navbar;
