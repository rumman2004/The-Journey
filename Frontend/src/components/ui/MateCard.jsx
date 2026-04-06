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

// ── Inline SVG icons (no dep needed) ─────────────────────────────────────────
const Icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
        0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
        -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
        .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
        -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844
        c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
        .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
        0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  ),
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@300;400;700&display=swap');

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
          background: #111827;
          /* Portrait aspect ratio */
          aspect-ratio: 3 / 4;
          width: 100%;
          display: flex;
          flex-direction: column;
          /* Dark neumorphism */
          border: 1px solid rgba(201,168,76,0.18);
          box-shadow:
            5px 5px 14px rgba(0,0,0,0.62),
            -3px -3px 10px rgba(255,255,255,0.035),
            inset 0 1px 0 rgba(255,255,255,0.04);
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
            box-shadow:
              8px 20px 38px rgba(0,0,0,0.68),
              -3px -3px 12px rgba(255,255,255,0.04),
              0 0 0 1px rgba(201,168,76,0.28);
            border-color: rgba(201,168,76,0.38);
          }
        }

        .mc-root:active {
          transform: scale(0.97) !important;
          box-shadow:
            3px 3px 10px rgba(0,0,0,0.65),
            -2px -2px 7px rgba(255,255,255,0.025) !important;
        }

        .mc-root:focus-visible {
          border-color: rgba(201,168,76,0.5);
          box-shadow:
            5px 5px 14px rgba(0,0,0,0.6),
            0 0 0 3px rgba(201,168,76,0.24);
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

        /* Gradient overlay: clear top, dark bottom */
        .mc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.04) 0%,
            rgba(0,0,0,0.12) 35%,
            rgba(0,0,0,0.62) 60%,
            rgba(0,0,0,0.90) 80%,
            rgba(0,0,0,0.97) 100%
          );
          z-index: 1;
        }

        /* ── Watermark initials ── */
        .mc-watermark {
          position: absolute;
          bottom: -2%;
          right: -3%;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
          /* Scale with container width */
          font-size: clamp(3rem, 30cqw, 8rem);
          line-height: 1;
          color: rgba(255,255,255,0.07);
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
          font-family: 'Cormorant Garamond', Georgia, serif;
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
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: clamp(0.55rem, 3.4cqw, 0.78rem);
          color: rgba(180,200,225,0.62);
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
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.11);
          color: rgba(200,218,240,0.72);
          text-decoration: none;
          flex-shrink: 0;
          /* Inset neumorphic */
          box-shadow:
            inset 1px 1px 3px rgba(0,0,0,0.42),
            inset -1px -1px 2px rgba(255,255,255,0.04);
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
            background: rgba(201,168,76,0.18);
            border-color: rgba(201,168,76,0.42);
            color: #f0d080;
            transform: translateY(-2px);
          }
        }
        .mc-icon-btn:active { transform: scale(0.90); }

        /* ── No social fallback ── */
        .mc-no-social {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: clamp(0.52rem, 2.9cqw, 0.68rem);
          color: rgba(180,200,225,0.3);
          font-style: italic;
          letter-spacing: 0.01em;
          padding: clamp(0.2rem, 1.5cqw, 0.38rem) clamp(0.4rem, 2.5cqw, 0.7rem);
          border-radius: clamp(5px, 2cqw, 8px);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.42);
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