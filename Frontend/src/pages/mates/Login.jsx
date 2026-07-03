import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { FiBookOpen, FiArrowLeft } from 'react-icons/fi';

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
    <div style={{ minHeight: '100vh', background: 'var(--color-luxury-ivory)', overflowX: 'hidden', position: 'relative' }}>

      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)', background: 'rgba(201,168,76,0.06)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 'clamp(150px, 35vw, 400px)', height: 'clamp(150px, 35vw, 400px)', background: 'rgba(201,168,76,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2) 30%, rgba(201,168,76,0.4) 50%, rgba(201,168,76,0.2) 70%, transparent)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '0 auto', padding: 'clamp(5rem, 12vw, 7rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 8vw, 5rem)', animation: 'lgn-fade 0.5s ease forwards' }}>

        {/* Back button */}
        <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem',
              fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'transparent',
              color: '#8B6914',
              border: '1px solid rgba(139,105,20,0.3)',
              borderRadius: '2px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,105,20,0.5)'; e.currentTarget.style.background = 'rgba(201,168,76,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,105,20,0.3)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <FiArrowLeft /> Back
            </button>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{
              width: 'clamp(52px, 10vw, 64px)', height: 'clamp(52px, 10vw, 64px)', margin: '0 auto',
              borderRadius: '12px',
              background: 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiBookOpen size={28} color="#8B6914" />
            </div>
          </Link>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#8B6914', margin: '0 0 0.4rem' }}>Mates Only</p>
          <h1 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', lineHeight: 1.1, color: '#1f1f1f' }}>
            Sign in to your{' '}
            <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>echoes</span>
          </h1>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', color: 'rgba(31,31,31,0.6)' }}>
            Welcome back to the college constellation
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FCFBF8',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {errors.general && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '6px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.25)', color: '#dc2626', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                {errors.general}
              </div>
            )}

            {/* Roll Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(31,31,31,0.6)' }}>
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
                  fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  background: 'rgba(0,0,0,0.02)',
                  border: `1px solid ${errors.rollNumber ? 'rgba(220,80,80,0.4)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '6px', color: '#1f1f1f',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,105,20,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.rollNumber ? 'rgba(220,80,80,0.4)' : 'rgba(0,0,0,0.08)'}
              />
              {errors.rollNumber && <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#dc2626' }}>{errors.rollNumber}</p>}
            </div>

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(31,31,31,0.6)' }}>
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
                  fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  background: 'rgba(0,0,0,0.02)',
                  border: `1px solid ${errors.name ? 'rgba(220,80,80,0.4)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '6px', color: '#1f1f1f',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,105,20,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(220,80,80,0.4)' : 'rgba(0,0,0,0.08)'}
              />
              {errors.name && <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#dc2626' }}>{errors.name}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: 'clamp(0.65rem, 2.5vw, 0.8rem) 1.5rem',
                fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.68rem, 2.5vw, 0.75rem)',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: loading ? 'rgba(139,105,20,0.4)' : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                color: '#080d1a', border: 'none', borderRadius: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(201,168,76,0.15)',
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
        @keyframes lgn-fade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes lgn-spin { to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(31,31,31,0.3); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

export default Login;