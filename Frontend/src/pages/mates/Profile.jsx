import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import ProfileCard from '../../components/ui/ProfileCard';
import { usersAPI } from '../../services/api';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

// ── Stat chip ────────────────────────────────────────────────────────────────
const StatChip = ({ label, value }) => (
  <div style={{
    background: 'rgba(201,168,76,0.05)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: '8px',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
    textAlign: 'center',
    flex: 1,
    minWidth: 0,
  }}>
    <p style={{
      margin: 0, fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 700, fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
      background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    }}>{value}</p>
    <p style={{
      margin: '2px 0 0', fontFamily: "'Lato', sans-serif",
      fontSize: 'clamp(0.58rem, 1.5vw, 0.68rem)', fontWeight: 700,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(180,200,225,0.4)',
    }}>{label}</p>
  </div>
);

// ── Gold panel ───────────────────────────────────────────────────────────────
const Panel = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: '12px',
    padding: 'clamp(1.25rem, 4vw, 2rem)',
    backdropFilter: 'blur(14px)',
    ...style,
  }}>
    {children}
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing,     setEditing]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl,   setPreviewUrl]   = useState(user?.profilePicture ?? '');
  const [form, setForm] = useState({
    name:      user?.name ?? '',
    instagram: user?.socialLinks?.instagram ?? '',
    linkedin:  user?.socialLinks?.linkedin  ?? '',
    github:    user?.socialLinks?.github    ?? '',
    portfolio: user?.socialLinks?.portfolio ?? '',
  });

  if (!user) return null;

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setSaveError(''); setSaveSuccess(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setSaveError('Name cannot be empty.'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('socialLinks', JSON.stringify({
      instagram: form.instagram.trim(), linkedin: form.linkedin.trim(),
      github: form.github.trim(),       portfolio: form.portfolio.trim(),
    }));
    if (selectedFile) fd.append('profilePicture', selectedFile);
    const result = await updateProfile(fd);
    setSaving(false);
    if (result.success) { setSaveSuccess(true); setEditing(false); }
    else setSaveError(result.error || 'Failed to update profile.');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const socialFields = [
    { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
    { name: 'linkedin',  label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/in/...' },
    { name: 'github',    label: 'GitHub URL',    placeholder: 'https://github.com/...' },
    { name: 'portfolio', label: 'Portfolio URL', placeholder: 'https://yourwebsite.com' },
  ];

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#080d1a', color: '#f0ece4', overflowX: 'hidden' }}>

        {/* Ambient glow */}
        <div style={{
          position: 'fixed', top: '10%', right: '20%', zIndex: 0, pointerEvents: 'none',
          width: 'clamp(200px, 40vw, 450px)', height: 'clamp(200px, 40vw, 450px)',
          background: 'radial-gradient(circle, rgba(10,42,74,0.22), transparent 70%)',
          borderRadius: '50%',
        }} />

        <section style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(5.5rem, 14vw, 8rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 8vw, 6rem)',
          maxWidth: '780px', margin: '0 auto',
          animation: 'prof-fade 0.6s ease forwards',
        }}>
          {/* Top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)',
          }} />

          {/* ── Profile Card ── */}
          {!editing && (
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.75rem)' }}>
              <ProfileCard user={user} />
            </div>
          )}

          {/* ── Stats Row ── */}
          <div style={{
            display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.85rem)',
            marginBottom: 'clamp(1rem, 3vw, 1.75rem)',
            flexWrap: 'wrap',
          }}>
            <StatChip label="Memories" value={user.memoriesCount ?? 0} />
            <StatChip label="Photos"   value={user.photosCount   ?? 0} />
            <StatChip label="Stickers" value={user.stickersCount ?? 0} />
          </div>

          {/* ── Edit / Actions Panel ── */}
          <Panel>
            {/* Feedback banners */}
            {saveSuccess && (
              <div style={{
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)',
                color: '#86efac', borderRadius: '6px', padding: '0.7rem 1rem',
                fontFamily: "'Lato', sans-serif", fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}>✓ Profile updated successfully</div>
            )}
            {saveError && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                color: '#f87171', borderRadius: '6px', padding: '0.7rem 1rem',
                fontFamily: "'Lato', sans-serif", fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}>{saveError}</div>
            )}

            {editing ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* Section label */}
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: 0 }}>
                  Edit Profile
                </p>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)', marginBottom: '0.25rem' }} />

                {/* Avatar upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                    background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.1rem', color: '#080d1a',
                    boxShadow: '0 0 14px rgba(201,168,76,0.2)',
                  }}>
                    {previewUrl
                      ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : getInitials(user.name)
                    }
                  </div>
                  <label style={{
                    fontFamily: "'Lato', sans-serif", fontSize: '0.72rem',
                    color: 'rgba(201,168,76,0.65)', cursor: 'pointer',
                    border: '1px solid rgba(201,168,76,0.25)', borderRadius: '2px',
                    padding: '0.45rem 0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
                  >
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Name */}
                <Input label="Display Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />

                {/* Social links grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '0.85rem' }}>
                  {socialFields.map(f => (
                    <Input key={f.name} label={f.label} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
                  ))}
                </div>

                {/* Form actions */}
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                  <GoldOutlineBtn type="button" onClick={() => { setEditing(false); setSaveError(''); }}>Cancel</GoldOutlineBtn>
                  <GoldSolidBtn type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</GoldSolidBtn>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.75rem' }}>
                  Actions
                </p>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <GoldOutlineBtn onClick={() => { setEditing(true); setSaveSuccess(false); }}>✎ Edit Profile</GoldOutlineBtn>
                  <Link to="/create-memory" style={{ textDecoration: 'none' }}><GoldSolidBtn>+ Add Message</GoldSolidBtn></Link>
                  <Link to="/upload-sticker" style={{ textDecoration: 'none' }}><GoldOutlineBtn>↑ Upload Sticker</GoldOutlineBtn></Link>
                </div>
              </div>
            )}
          </Panel>

          {/* ── Logout ── */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: "'Lato', sans-serif", fontSize: '0.68rem',
                fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'rgba(220,80,80,0.08)', color: 'rgba(248,113,113,0.8)',
                border: '1px solid rgba(220,80,80,0.2)', borderRadius: '2px',
                padding: '0.55rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(220,80,80,0.15)';
                e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(220,80,80,0.08)';
                e.currentTarget.style.borderColor = 'rgba(220,80,80,0.2)';
              }}
            >
              Sign Out
            </button>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          @keyframes prof-fade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        `}</style>
      </div>
    </Layout>
  );
};

const GoldSolidBtn = ({ children, type = 'button', onClick, disabled }) => (
  <button type={type} onClick={onClick} disabled={disabled} style={{
    padding: '0.55rem 1.25rem', fontFamily: "'Lato', sans-serif",
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
    background: disabled ? 'rgba(139,105,20,0.4)' : 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)',
    color: '#080d1a', border: 'none', borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 0 16px rgba(201,168,76,0.18)',
    transition: 'box-shadow 0.3s', whiteSpace: 'nowrap',
  }}>{children}</button>
);

const GoldOutlineBtn = ({ children, type = 'button', onClick }) => (
  <button type={type} onClick={onClick} style={{
    padding: '0.55rem 1.25rem', fontFamily: "'Lato', sans-serif",
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
    background: 'transparent', color: 'rgba(201,168,76,0.75)',
    border: '1px solid rgba(201,168,76,0.28)', borderRadius: '2px',
    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)';
  }}
  >{children}</button>
);

export default Profile;