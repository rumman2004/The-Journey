import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';

const processDownload = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download', err);
    alert('Failed to download image.');
  }
};

const STATIC_PHOTOS = [
  { id: '1',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323676/IMG_20230923_132556033.jpg_t1mqkh.jpg',  semester: '1st sem' },
  { id: '2',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323675/IMG_20230922_104145200.jpg_lbzkkb.jpg',  semester: '1st sem' },
  { id: '3',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323673/IMG_20230810_132557542.jpg_bvipxe.jpg',  semester: '1st sem' },
  { id: '4',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323674/IMG_20230823_161529733.jpg_xwb8dh.jpg',  semester: '1st sem' },
  { id: '5',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323673/IMG_20230911_130321569.jpg_tqz66d.jpg',  semester: '1st sem' },
  { id: '6',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20230819_151208494.jpg_jlslnt.jpg',  semester: '1st sem' },
  { id: '7',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20231207_140845010.jpg_xjtufu.jpg',  semester: '1st sem' },
  { id: '8',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20230908_124613518.jpg_whoian.jpg',  semester: '1st sem' },
  { id: '9',  imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323667/IMG_20230823_123754807.jpg_sb6rhx.jpg',  semester: '1st sem' },
  { id: '10', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323665/IMG_20231118_112705395.jpg_q5lt1m.jpg',  semester: '1st sem' },
  { id: '11', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323664/IMG_20230819_150421790.jpg_gsq6sa.jpg',  semester: '1st sem' },
  { id: '12', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323663/IMG_20230810_132619463.jpg_q3ggvu.jpg',  semester: '1st sem' },
  { id: '13', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323661/IMG_20230923_133716463.jpg_oucd7j.jpg',  semester: '1st sem' },
  { id: '14', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323661/IMG_20230818_113357474.jpg_veolor.jpg',  semester: '1st sem' },
  { id: '15', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg',  semester: '2nd sem' },
  { id: '16', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324276/IMG_20240427_140846544.jpg_eddvza.jpg',  semester: '2nd sem' },
  { id: '17', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324268/IMG_20240427_140741449.jpg_vmtvro.jpg',  semester: '2nd sem' },
  { id: '18', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg',  semester: '2nd sem' },
  { id: '19', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123201658.jpg_sbt9nl.jpg',  semester: '2nd sem' },
  { id: '20', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325358/IMG_20240919_140858039.jpg_l2p9kp.jpg',  semester: '3rd sem' },
  { id: '21', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325357/IMG_20240813_115840291.jpg_sqosmc.jpg',  semester: '3rd sem' },
  { id: '22', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325354/IMG_20240819_122644698.jpg_otjey3.jpg',  semester: '3rd sem' },
  { id: '23', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325350/IMG_20240805_115942716.jpg_favqac.jpg',  semester: '3rd sem' },
  { id: '24', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325348/IMG_20240805_120726584.jpg_mmdthd.jpg',  semester: '3rd sem' },
  { id: '25', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325436/IMG-20250522-WA0027.jpg_e769b1.jpg',    semester: '4th sem' },
  { id: '26', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG_20250326_130236634.jpg_axpwhg.jpg',  semester: '4th sem' },
  { id: '27', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG-20250522-WA0028.jpg_rh56im.jpg',    semester: '4th sem' },
  { id: '28', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG_20250223_152804538.jpg_v2k7qx.jpg',  semester: '4th sem' },
  { id: '29', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325433/IMG-20250423-WA0016.jpg_ibglfu.jpg',    semester: '4th sem' },
  { id: '30', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325430/IMG_20250619_150929689.jpg_wy9dqh.jpg',  semester: '4th sem' },
  { id: '31', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0008.jpg_ulglfw.jpg',    semester: '4th sem' },
  { id: '32', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0005.jpg_zajiyl.jpg',    semester: '4th sem' },
  { id: '33', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325424/IMG-20250308-WA0006.jpg_olz97s.jpg',    semester: '4th sem' },
  { id: '34', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325424/IMG_20250423_123916686.jpg_x0e3c5.jpg',  semester: '4th sem' },
  { id: '35', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325413/IMG_20250223_152920525.jpg_yb4ic2.jpg',  semester: '4th sem' },
  { id: '36', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325398/20250522_134900.jpg_azbosj.jpg',         semester: '4th sem' },
  { id: '37', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325382/20250308_130449.jpg_fps3zc.jpg',         semester: '4th sem' },
  { id: '38', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325399/20250522_134904.jpg_a4tlei.jpg',         semester: '4th sem' },
  { id: '39', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325402/20250617_125521.jpg_eb0v83.jpg',         semester: '4th sem' },
  { id: '40', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325390/20250424_125421.jpg_ykeehv.jpg',         semester: '4th sem' },
  { id: '41', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325418/IMG_20250513_104947215.jpg_qu8wir.jpg',  semester: '4th sem' },
  { id: '42', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325413/IMG_20250308_120931474.jpg_mkpnpq.jpg',  semester: '4th sem' },
  { id: '43', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326075/20250830_142311.jpg_mlxmrx.jpg',         semester: '5th sem' },
  { id: '44', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326089/20251031_125103.jpg_nvusfy.jpg',         semester: '5th sem' },
  { id: '45', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326077/20250905_103230.jpg_jgp6uw.jpg',         semester: '5th sem' },
  { id: '46', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326094/20250905_142410.jpg_gwsvn0.jpg',         semester: '5th sem' },
  { id: '47', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326085/20250905_140629.jpg_dtdilx.jpg',         semester: '5th sem' },
  { id: '48', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326085/20251222_144708.jpg_psmoif.jpg',         semester: '5th sem' },
  { id: '49', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326095/20251222_145020.jpg_yhsh91.jpg',         semester: '5th sem' },
  { id: '50', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326099/IMG-20251222-WA0069.jpg_ztl1b0.jpg',    semester: '5th sem' },
  { id: '51', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326096/IMG_20250905_134003830.jpg_znbtoc.jpg',  semester: '5th sem' },
  { id: '52', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394993/IMG-20251228-WA0011_jjsltp.jpg',        semester: '5th sem' },
  { id: '53', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394997/IMG_20251228_075358069_vownxm.jpg',     semester: '5th sem' },
  { id: '54', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394998/IMG_20251228_151554302_pkfom8.jpg',     semester: '5th sem' },
  { id: '55', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG-20251228-WA0014_fdcvem.jpg',        semester: '5th sem' },
  { id: '56', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG_20251228_083648683_haeygj.jpg',     semester: '5th sem' },
  { id: '57', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG_20251228_062129992_rsk2xv.jpg',     semester: '5th sem' },
  { id: '58', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG-20251228-WA0019_eag8vj.jpg',        semester: '5th sem' },
  { id: '59', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG_20251228_100947032_rdzviq.jpg',     semester: '5th sem' },
  { id: '60', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG-20251228-WA0024_qwoljw.jpg',        semester: '5th sem' },
  { id: '61', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG-20251228-WA0023_tqt55l.jpg',        semester: '5th sem' },
  { id: '62', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395001/IMG-20251228-WA0164_idyv3v.jpg',        semester: '5th sem' },
  { id: '63', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395003/IMG-20251228-WA0166_av33wn.jpg',        semester: '5th sem' },
  { id: '64', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395003/IMG-20251228-WA0250_kjkccv.jpg',        semester: '5th sem' },
  { id: '65', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395004/IMG-20251229-WA0107_nspjks.jpg',        semester: '5th sem' },
  { id: '66', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395004/IMG-20251229-WA0005_gtkbvk.jpg',        semester: '5th sem' },
  { id: '67', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251230-WA0148_thfb4n.jpg',        semester: '5th sem' },
  { id: '68', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0137_elksim.jpg',        semester: '5th sem' },
  { id: '69', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0140_dakoxq.jpg',        semester: '5th sem' },
  { id: '70', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0008_bsut6b.jpg',        semester: '5th sem' },
  { id: '71', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251230-WA0149_ahp5xe.jpg',        semester: '5th sem' },
  { id: '72', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251229-WA0138_tzkwa4.jpg',        semester: '5th sem' },
  { id: '73', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251229-WA0104_n4fa2p.jpg',        semester: '5th sem' },
  { id: '74', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395009/IMG-20251230-WA0392_swha8p.jpg',        semester: '5th sem' },
  { id: '75', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395009/IMG-20251230-WA0458_lj8eou.jpg',        semester: '5th sem' },
  { id: '76', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775397739/IMG-20260401-WA0003.jpg_uskpav.jpg',    semester: '6th sem' },
  { id: '77', imageUrl: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775397739/IMG-20260401-WA0000.jpg_rar9og.jpg',    semester: '6th sem' },
];

const CATEGORIES = ['All', '1st sem', '2nd sem', '3rd sem', '4th sem', '5th sem', '6th sem'];

const SEM_LABELS = {
  'All': 'All Semesters',
  '1st sem': 'Semester I',
  '2nd sem': 'Semester II',
  '3rd sem': 'Semester III',
  '4th sem': 'Semester IV',
  '5th sem': 'Semester V',
  '6th sem': 'Semester VI',
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ photo, photos, onClose, onNav, allowDownload }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  const currentIndex = photos.findIndex(p => p.id === photo.id);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4, 6, 16, 0.96)',
        backdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'lb-fade-in 0.25s ease forwards',
        padding: '1rem',
      }}
    >
      {/* Counter */}
      <div style={{
        position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Lato', sans-serif",
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.5)',
        zIndex: 10,
      }}>
        {currentIndex + 1} / {photos.length}
      </div>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, display: 'flex', gap: '0.75rem' }}>
        {/* Download */}
        {allowDownload && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              processDownload(photo.imageUrl, photo.caption || 'memory.jpg');
            }}
            aria-label="Download"
            title="Download memory"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(8,13,26,0.8)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'rgba(201,168,76,0.8)',
              cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(8,13,26,0.8)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
            }}
          >
            ↓
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(8,13,26,0.8)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: 'rgba(201,168,76,0.8)',
            cursor: 'pointer', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(8,13,26,0.8)';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
          }}
        >
          ✕
        </button>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        aria-label="Previous"
        style={{
          position: 'absolute', left: 'clamp(0.5rem, 3vw, 1.5rem)', zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(8,13,26,0.7)',
          border: '1px solid rgba(201,168,76,0.2)',
          color: 'rgba(201,168,76,0.75)',
          cursor: 'pointer', fontSize: '1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(8,13,26,0.7)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
        }}
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        aria-label="Next"
        style={{
          position: 'absolute', right: 'clamp(0.5rem, 3vw, 1.5rem)', zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(8,13,26,0.7)',
          border: '1px solid rgba(201,168,76,0.2)',
          color: 'rgba(201,168,76,0.75)',
          cursor: 'pointer', fontSize: '1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(8,13,26,0.7)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
        }}
      >
        ›
      </button>

      {/* Image panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          maxWidth: '860px', width: '100%',
          animation: 'lb-scale-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
      >
        {/* Photo frame */}
        <div style={{
          background: '#f4efe6',
          padding: '10px 10px 0 10px',
          borderRadius: '12px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.1)',
          width: '100%',
        }}>
          <img
            src={photo.imageUrl}
            alt={photo.caption || 'Batch photo'}
            style={{
              width: '100%',
              maxHeight: '72vh',
              objectFit: 'contain',
              borderRadius: '6px',
              display: 'block',
              background: '#1a1510',
            }}
          />
          {/* Caption strip */}
          <div style={{ padding: '14px 8px 16px', textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: '#4a3f30',
              margin: 0,
            }}>{photo.caption}</p>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8a7a60',
              marginTop: '4px',
            }}>{SEM_LABELS[photo.semester] || photo.semester}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Photo Card ────────────────────────────────────────────────────────────────
const PhotoCard = ({ photo, onClick, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View: ${photo.caption}`}
      style={{
        breakInside: 'avoid',
        marginBottom: 'var(--gap)',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid rgba(201,168,76,0.08)',
        background: 'rgba(8,13,26,0.6)',
        transition: 'transform 0.4s cubic-bezier(0.25,1,0.5,1), box-shadow 0.4s ease, border-color 0.3s',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: inView ? `${(index % 6) * 40}ms` : '0ms',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.015)';
        e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.55), 0 0 20px rgba(201,168,76,0.08)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)';
      }}
    >
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(90deg, rgba(201,168,76,0.04) 25%, rgba(201,168,76,0.08) 50%, rgba(201,168,76,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          minHeight: '120px',
        }} />
      )}

      <img
        src={photo.imageUrl}
        alt={photo.caption}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Hover overlay */}
      <div className="photo-overlay" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,13,26,0.88) 0%, rgba(8,13,26,0.2) 50%, transparent 100%)',
        opacity: 0,
        transition: 'opacity 0.35s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '14px 12px',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '0.78rem',
          color: '#f0ece4',
          margin: 0,
          lineHeight: 1.3,
        }}>{photo.caption}</p>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.65)',
          marginTop: '3px',
        }}>{SEM_LABELS[photo.semester]}</p>
      </div>
    </div>
  );
};

// ── Main Album Page ───────────────────────────────────────────────────────────
const Album = () => {
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Simulate backend fetch delay
    const timer = setTimeout(() => {
      setPhotos(STATIC_PHOTOS);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const visible = filter === 'All'
    ? photos
    : photos.filter((p) => p.semester === filter);

  const handleNav = useCallback((dir) => {
    if (!selected) return;
    const idx = visible.findIndex(p => p.id === selected.id);
    const next = (idx + dir + visible.length) % visible.length;
    setSelected(visible[next]);
  }, [selected, visible]);

  // Photo count per sem
  const semCount = (sem) => sem === 'All'
    ? photos.length
    : photos.filter(p => p.semester === sem).length;

  return (
    <Layout>
      <div style={{ background: '#080d1a', minHeight: '100vh' }}>

        {/* ── PAGE HERO ── */}
        <section style={{
          paddingTop: 'clamp(5rem, 12vw, 8rem)',
          paddingBottom: 'clamp(2rem, 5vw, 4rem)',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '300px',
            background: 'radial-gradient(ellipse at top, rgba(10,42,74,0.3), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)',
          }} />

          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.5)',
            marginBottom: '1rem',
            animation: 'fade-up 0.8s 0.1s both',
          }}>Batch 2023 — 2026</p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 9vw, 6rem)',
            lineHeight: 1.0,
            marginBottom: '1rem',
            animation: 'fade-up 0.8s 0.25s both',
          }}>
            <span style={{ color: '#f0ece4' }}>The </span>
            <span style={{
              background: 'linear-gradient(135deg, #8B6914 0%, #c9a84c 30%, #f0d080 55%, #c9a84c 75%, #8B6914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: 'fade-up 0.8s 0.25s both, gold-shimmer 5s 1s ease-in-out infinite',
            }}>
              Album
            </span>
          </h1>

          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.82rem, 2vw, 1rem)',
            color: 'rgba(180,200,225,0.45)',
            maxWidth: '380px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
            letterSpacing: '0.02em',
            animation: 'fade-up 0.8s 0.4s both',
          }}>
            Every frame, a memory. Every pixel, a story.
          </p>

          {/* ── FILTER TABS ── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            maxWidth: '720px',
            margin: '0 auto',
            animation: 'fade-up 0.8s 0.55s both',
          }}>
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '2px',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: active ? 700 : 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    background: active
                      ? 'linear-gradient(135deg, rgba(139,105,20,0.3), rgba(201,168,76,0.2))'
                      : 'rgba(255,255,255,0.03)',
                    border: active
                      ? '1px solid rgba(201,168,76,0.45)'
                      : '1px solid rgba(255,255,255,0.07)',
                    color: active ? '#f0d080' : 'rgba(180,200,225,0.45)',
                    boxShadow: active ? '0 0 16px rgba(201,168,76,0.1)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
                      e.currentTarget.style.color = 'rgba(240,208,128,0.7)';
                      e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.color = 'rgba(180,200,225,0.45)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }
                  }}
                >
                  {cat === 'All' ? '✦ All' : cat.replace(' sem', ' Sem')}
                  <span style={{
                    marginLeft: '0.4rem',
                    fontSize: '0.55rem',
                    color: active ? 'rgba(240,208,128,0.6)' : 'rgba(180,200,225,0.25)',
                  }}>({semCount(cat)})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── MASONRY GRID ── */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(0.75rem, 3vw, 2.5rem) clamp(3rem, 6vw, 6rem)',
        }}>
          {isLoading ? (
            <div style={{
              '--gap': 'clamp(6px, 1.5vw, 12px)',
              columns: 'var(--col-count)',
              columnGap: 'var(--gap)',
            }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  marginBottom: 'var(--gap)',
                  borderRadius: '10px',
                  height: `${160 + (i % 4) * 60}px`,
                  background: 'linear-gradient(90deg, rgba(8,13,26,0.6) 0%, rgba(201,168,76,0.06) 50%, rgba(8,13,26,0.6) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  border: '1px solid rgba(201,168,76,0.05)',
                  breakInside: 'avoid',
                }} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div style={{
              '--gap': 'clamp(6px, 1.5vw, 12px)',
              columns: 'var(--col-count)',
              columnGap: 'var(--gap)',
            }}>
              {visible.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={() => setSelected(photo)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>◇</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem',
                color: '#f0ece4',
                marginBottom: '0.5rem',
              }}>No photos yet</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)' }}>
                Check back soon for memories.
              </p>
            </div>
          )}

          {/* Count footer */}
          {visible.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)', marginBottom: '1.5rem' }} />
              <p style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.62rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.3)',
              }}>
                {visible.length} {visible.length === 1 ? 'photograph' : 'photographs'} · {filter === 'All' ? 'All Semesters' : SEM_LABELS[filter]}
              </p>
            </div>
          )}
        </section>

        {/* Lightbox */}
        {selected && (
          <Lightbox
            photo={selected}
            photos={visible}
            onClose={() => setSelected(null)}
            onNav={handleNav}
            allowDownload={isAuthenticated}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Lato:wght@300;400;700&display=swap');

          /* ── Column count: CSS custom property set here as we can't use media queries in inline styles ── */
          div[style*="--col-count"] {
            --col-count: 2;
          }
          @media (min-width: 480px) {
            div[style*="--col-count"] { --col-count: 3; }
          }
          @media (min-width: 768px) {
            div[style*="--col-count"] { --col-count: 4; }
          }
          @media (min-width: 1100px) {
            div[style*="--col-count"] { --col-count: 5; }
          }

          div[style*="--gap"] {
            --gap: clamp(6px, 1.5vw, 12px);
          }

          /* ── Hover overlay visibility ── */
          div:hover > .photo-overlay { opacity: 1 !important; }

          /* ── Keyframes ── */
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes lb-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes lb-scale-in {
            from { opacity: 0; transform: scale(0.96); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position:  200% 0; }
          }
          @keyframes gold-shimmer {
            0%   { background-position: 0% center; }
            50%  { background-position: 100% center; }
            100% { background-position: 0% center; }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Album;