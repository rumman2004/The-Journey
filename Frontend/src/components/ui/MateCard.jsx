import { useState } from 'react';

/**
 * MateCard — Profile card matching the app design
 * Props:
 * name          {string}
 * email         {string}
 * bio           {string}
 * profilePhoto  {string}        – photo URL (optional)
 * rollNumber    {number|string}
 * batch         {string}        – e.g. "2023-26"
 * isVerified    {boolean}
 * socialLinks   {object}        – { instagram, linkedin, github, website }
 * memoriesCount {number}
 * photosCount   {number}
 * showEmail     {boolean}
 * onClick       {fn}
 * className     {string}
 */

import { FiInstagram, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  instagram: <FiInstagram />,
  linkedin: <FiLinkedin />,
  github: <FiGithub />,
  website: <FiGlobe />,
  verified: (
    <svg viewBox="0 0 24 24" fill="#3b9eff">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618
        3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
        0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  ),
};

const MateCard = ({
  name = 'Batch Mate',
  email,
  bio,
  profilePhoto,
  rollNumber,
  batch = '2023-26',
  isVerified = false,
  socialLinks = {},
  memoriesCount = 0,
  photosCount = 0,
  showEmail = false,
  onClick,
  className = '',
}) => {
  // Added error state to catch broken DB links
  const [imgError, setImgError] = useState(false);

  // Extract initials for the watermark design
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  // Use DB photo, but if none exists OR if the link throws an error, use UI Avatars
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=512`;
  const bgImage = (profilePhoto && !imgError) ? profilePhoto : fallbackImage;

  const socials = [
    { key: 'instagram', href: socialLinks?.instagram, icon: Icons.instagram, label: 'Instagram' },
    { key: 'linkedin',  href: socialLinks?.linkedin,  icon: Icons.linkedin,  label: 'LinkedIn'  },
    { key: 'github',    href: socialLinks?.github,    icon: Icons.github,    label: 'GitHub'    },
    { key: 'website',   href: socialLinks?.website,   icon: Icons.website,   label: 'Website'   },
  ].filter((s) => s.href);

  return (
    <>
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
        className={`mc-root ${className}`}
      >
        {/* ── Background: photo or generated avatar ── */}
        <div className="mc-bg">
          <img
            src={bgImage}
            alt={name}
            className="mc-photo"
            draggable={false}
            onError={() => setImgError(true)} // Crucial fix for broken DB links
          />

          {/* Progressive dark overlay — heavy at bottom */}
          <div className="mc-overlay" />

          {/* Film Grain Texture Overlay */}
          <div className="mc-texture" />

          {/* Watermark initials — decorative, bottom-right */}
          <div className="mc-watermark" aria-hidden="true">{initials}</div>
        </div>

        {/* ── Info panel pinned to bottom ── */}
        <div className="mc-panel">
          {/* Name + verified badge */}
          <div className="mc-name-row">
            <span className="mc-name">{name}</span>
            {isVerified && (
              <span className="mc-badge" title="Verified" aria-label="Verified">
                {Icons.verified}
              </span>
            )}
          </div>

          {/* Batch · Roll */}
          <p className="mc-meta">
            Batch {batch}
            {rollNumber != null && (
              <><span className="mc-sep" aria-hidden="true"> · </span>Roll: {rollNumber}</>
            )}
          </p>

          {/* Social links OR fallback */}
          <div className="mc-socials">
            {socials.length > 0 ? (
              socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="mc-icon-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  {s.icon}
                </a>
              ))
            ) : (
              <span className="mc-no-social">No social links added yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* Container query context so everything scales with card width */
        .mc-root {
          container-type: inline-size;
          container-name: mc;
        }

        /* ── Card shell ── */
        .mc-root {
          position: relative;
          border-radius: clamp(10px, 3cqw, 16px);
          overflow: hidden;
          cursor: ${onClick ? 'pointer' : 'default'};
          background: #FCFBF8;
          /* Portrait aspect ratio */
          aspect-ratio: 3 / 4;
          width: 100%;
          display: flex;
          flex-direction: column;
          /* Light neumorphism */
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.2);
          transition:
            transform 0.32s cubic-bezier(0.25,1,0.5,1),
            box-shadow 0.32s ease,
            border-color 0.28s;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        @media (hover: hover) {
          .mc-root:hover {
            transform: translateY(-5px) scale(1.015);
            box-shadow: 0 16px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3);
            border-color: rgba(139,105,20,0.4);
          }
        }

        .mc-root:active {
          transform: scale(0.97) !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03) !important;
        }

        .mc-root:focus-visible {
          border-color: rgba(139,105,20,0.5);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 0 0 3px rgba(139,105,20,0.2);
        }

        /* ── Background ── */
        .mc-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .mc-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* Gradient overlay: clear top, dark bottom (reduced height) */
        .mc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.0) 0%,
            rgba(0, 0, 0, 0.0) 70%,
            rgba(0, 0, 0, 0.5) 82%,
            rgba(0, 0, 0, 0.85) 92%,
            rgba(5, 5, 5, 0.98) 100%
          );
          z-index: 1;
        }

        /* ── Film Grain Texture ── */
        .mc-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        /* ── Watermark initials ── */
        .mc-watermark {
          position: absolute;
          bottom: -2%;
          right: -3%;
          font-family: var(--font-serif);
          font-weight: 700;
          /* Scale with container width */
          font-size: clamp(3rem, 30cqw, 8rem);
          line-height: 1;
          color: rgba(255,255,255,0.05);
          user-select: none;
          pointer-events: none;
          z-index: 2;
          letter-spacing: -0.04em;
        }

        /* ── Bottom panel ── */
        .mc-panel {
          position: relative;
          z-index: 3;
          margin-top: auto;
          padding:
            clamp(0.5rem, 5cqw, 0.9rem)
            clamp(0.6rem, 5cqw, 1rem)
            clamp(0.5rem, 4.5cqw, 0.85rem);
          display: flex;
          flex-direction: column;
          gap: clamp(0.15rem, 1.5cqw, 0.3rem);
        }

        /* ── Name row ── */
        .mc-name-row {
          display: flex;
          align-items: center;
          gap: clamp(0.2rem, 1.5cqw, 0.38rem);
        }

        .mc-name {
          font-family: var(--font-serif);
          font-weight: 700;
          /* 5.5cqw so it always fills the card proportionally */
          font-size: clamp(0.75rem, 5.5cqw, 1.25rem);
          color: #f0ece4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.15;
          letter-spacing: 0.01em;
          min-width: 0;
          flex: 1;
        }

        /* Verified icon */
        .mc-badge {
          flex-shrink: 0;
          width: clamp(13px, 4cqw, 19px);
          height: clamp(13px, 4cqw, 19px);
          display: flex;
          align-items: center;
        }
        .mc-badge svg { width: 100%; height: 100%; }

        /* ── Meta text ── */
        .mc-meta {
          margin: 0;
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(0.55rem, 3.4cqw, 0.78rem);
          color: rgba(240,236,228,0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.01em;
          line-height: 1.3;
        }

        .mc-sep { opacity: 0.45; }

        /* ── Social row ── */
        .mc-socials {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: clamp(0.22rem, 2cqw, 0.45rem);
          margin-top: clamp(0.1rem, 1.2cqw, 0.28rem);
          overflow: hidden;
        }

        .mc-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          /* Square icon button, scales with card */
          width: clamp(24px, 8.5cqw, 38px);
          height: clamp(24px, 8.5cqw, 38px);
          border-radius: clamp(5px, 2cqw, 9px);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          flex-shrink: 0;
          /* Drop shadow to pop from dark background */
          box-shadow: 0 2px 6px rgba(0,0,0,0.2), inset 1px 1px 3px rgba(255,255,255,0.1);
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.18s;
        }

        .mc-icon-btn svg {
          /* Icon is 52% of button width */
          width: clamp(11px, 4.4cqw, 18px);
          height: clamp(11px, 4.4cqw, 18px);
          display: block;
          flex-shrink: 0;
        }

        @media (hover: hover) {
          .mc-icon-btn:hover {
            background: rgba(139,105,20,0.1);
            border-color: rgba(139,105,20,0.3);
            color: #8B6914;
            transform: translateY(-2px);
          }
        }
        .mc-icon-btn:active { transform: scale(0.90); }

        /* ── No social fallback ── */
        .mc-no-social {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(0.52rem, 2.9cqw, 0.68rem);
          color: rgba(255,255,255,0.6);
          font-style: italic;
          letter-spacing: 0.01em;
          padding: clamp(0.2rem, 1.5cqw, 0.38rem) clamp(0.4rem, 2.5cqw, 0.7rem);
          border-radius: clamp(5px, 2cqw, 8px);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* ── Accessibility / motion ── */
        @media (prefers-reduced-motion: reduce) {
          .mc-root,
          .mc-icon-btn { transition: none !important; }
        }
      `}</style>
    </>
  );
};

export default MateCard;