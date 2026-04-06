import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const Login = () => {
  const [formData, setFormData] = useState({ rollNumber: '', name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.rollNumber) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (isNaN(formData.rollNumber)) {
      newErrors.rollNumber = 'Roll number must be a valid number';
    }
    if (!formData.name) newErrors.name = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await login(formData.rollNumber, formData.name);
      if (result.success) navigate('/');
      else setErrors({ general: result.error });
    } catch {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080d1a', overflowX: 'hidden', position: 'relative' }}>

      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)', background: 'rgba(161,150,206,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 'clamp(150px, 35vw, 400px)', height: 'clamp(150px, 35vw, 400px)', background: 'rgba(201,168,76,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '0 auto', padding: 'clamp(5rem, 12vw, 7rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 8vw, 5rem)', animation: 'lgn-fade 0.5s ease forwards' }}>

        {/* Back button */}
        <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem',
              fontFamily: "'Lato', sans-serif", fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'transparent',
              color: 'rgba(201,168,76,0.7)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '2px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.color = '#c9a84c'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = 'rgba(201,168,76,0.7)'; }}
            >
              ← Back
            </button>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{
              width: 'clamp(52px, 10vw, 64px)', height: 'clamp(52px, 10vw, 64px)', margin: '0 auto',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.03))',
              border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(201,168,76,0.08)',
            }}>
              <svg width="28" height="28" fill="none" stroke="#c9a84c" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </Link>

          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.4rem' }}>Mates Only</p>
          <h1 style={{ margin: '0 0 0.4rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', lineHeight: 1.1, color: '#f0ece4' }}>
            Sign in to your{' '}
            <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>echoes</span>
          </h1>
          <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: 'rgba(180,200,225,0.4)' }}>
            Welcome back to the college constellation
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(201,168,76,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {errors.general && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '6px', background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.25)', color: '#f87171', fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.02em' }}>
                {errors.general}
              </div>
            )}

            {/* Roll Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>
                Roll Number
              </label>
              <input
                name="rollNumber"
                type="number"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 1"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.7rem 1rem',
                  fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.rollNumber ? 'rgba(220,80,80,0.4)' : 'rgba(201,168,76,0.15)'}`,
                  borderRadius: '6px', color: '#f0ece4',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.rollNumber ? 'rgba(220,80,80,0.4)' : 'rgba(201,168,76,0.15)'}
              />
              {errors.rollNumber && <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', color: '#f87171' }}>{errors.rollNumber}</p>}
            </div>

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.7rem 1rem',
                  fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.name ? 'rgba(220,80,80,0.4)' : 'rgba(201,168,76,0.15)'}`,
                  borderRadius: '6px', color: '#f0ece4',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(220,80,80,0.4)' : 'rgba(201,168,76,0.15)'}
              />
              {errors.name && <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: '0.72rem', color: '#f87171' }}>{errors.name}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: 'clamp(0.65rem, 2.5vw, 0.8rem) 1.5rem',
                fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.68rem, 2.5vw, 0.75rem)',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                color: '#080d1a', border: 'none', borderRadius: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 20px rgba(201,168,76,0.2)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                width: '100%',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(8,13,26,0.4)', borderTopColor: '#080d1a', animation: 'lgn-spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing In...
                </>
              ) : 'Sign In Mates'}
            </button>

          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        @keyframes lgn-fade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes lgn-spin { to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(180,200,225,0.25); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

export default Login;