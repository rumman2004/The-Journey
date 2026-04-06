import React from 'react';

// Icons for social links
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const WebsiteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const VerifiedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.96 2C10.74 2 9.57 2.48 8.61 3.2L8.2 3.5C7.3 4.22 6.09 4.41 5 4.02L4.68 3.9C3.12 3.38 1.41 4.2 0.88 5.76C0.67 6.41 0.69 7.12 0.94 7.74L1.08 8.08C1.51 9.13 1.34 10.36 0.64 11.23L0.39 11.53C-0.54 12.69 -0.54 14.39 0.39 15.55L0.64 15.85C1.34 16.73 1.51 17.95 1.08 19L0.94 19.34C0.4 20.67 1.07 22.18 2.39 22.75C3.06 23.04 3.82 23.04 4.49 22.75L4.81 22.61C5.89 22.16 7.14 22.33 8.07 23.05L8.47 23.36C9.53 24.19 11.08 24.32 12.27 23.68C12.87 23.36 13.38 22.85 13.7 22.25L13.88 21.93C14.41 20.97 15.53 20.44 16.64 20.6L17 20.65C18.67 20.89 20.24 19.78 20.48 18.11C20.52 17.84 20.52 17.57 20.48 17.3L20.43 16.95C20.21 15.84 20.66 14.71 21.56 14.12L21.84 13.93C23.16 13.06 23.51 11.27 22.65 9.94C22.26 9.33 21.67 8.92 20.99 8.78L20.65 8.71C19.53 8.48 18.66 7.55 18.5 6.42L18.45 6.07C18.23 4.41 16.75 3.23 15.09 3.42L14.73 3.47C13.62 3.61 12.51 3.08 11.96 2.11ZM10.59 16.59L6.5 12.5L7.91 11.09L10.59 13.77L16.09 8.27L17.5 9.68L10.59 16.59Z" fill="#3b82f6" />
  </svg>
);

const ProfileCard = ({ user }) => {
  const bgImage = user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff&size=512`;
  const socialLinks = user?.socialLinks || {};

  return (
    <div className="relative w-full max-w-[400px] aspect-[4/5] mx-auto rounded-[2.5rem] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-500 bg-[#121218] border border-white/10">
      
      {/* Background Image with Hover Zoom */}
      <img 
        src={bgImage} 
        alt={user?.name || 'Profile'} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Top Subtle Gradient (Prevents bright images from looking cut off at the top) */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent"></div>

      {/* Liquid Glass Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 pt-24 pb-8 px-6 sm:px-8 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent">
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-end h-full">
          
          {/* Name & Verification */}
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="m-0 text-3xl sm:text-4xl font-extrabold text-white tracking-tight line-clamp-1 drop-shadow-md">
              {user?.name || 'Sophie Bennett'}
            </h1>
            <div className="shrink-0 drop-shadow-md">
              <VerifiedIcon />
            </div>
          </div>

          {/* Details */}
          <p className="m-0 mb-6 text-[0.95rem] font-medium text-gray-300 tracking-wide drop-shadow-sm">
            Batch {user?.batch || '2023-26'} <span className="mx-2 opacity-40">•</span> Roll: {user?.rollNumber || '#'}
          </p>

          {/* Social Links - Glass Pill Design */}
          <div className="flex items-center gap-3">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="flex p-3 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <InstagramIcon />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex p-3 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <LinkedinIcon />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex p-3 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <GithubIcon />
              </a>
            )}
            {socialLinks.portfolio && (
              <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="flex p-3 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <WebsiteIcon />
              </a>
            )}
            
            {/* Fallback Message */}
            {(!socialLinks.instagram && !socialLinks.linkedin && !socialLinks.github && !socialLinks.portfolio) && (
              <p className="m-0 text-sm italic text-white/50 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                No social links added yet.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;