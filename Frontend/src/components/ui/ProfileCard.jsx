import React from 'react';
import { FiInstagram, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

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
            <div className="shrink-0 drop-shadow-md text-[#3b82f6]">
              <MdVerified size={24} />
            </div>
          </div>

          {/* Details */}
          <p className="m-0 mb-6 text-[0.95rem] font-medium text-gray-300 tracking-wide drop-shadow-sm">
            Batch {user?.batch || '2023-26'} <span className="mx-2 opacity-40">•</span> Roll: {user?.rollNumber || '#'}
          </p>

          {/* Social Links - Glass Pill Design */}
          <div className="flex items-center gap-3">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={{ color: '#ffffff' }} className="flex p-3 rounded-full bg-white/20 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <FiInstagram size={20} color="#ffffff" strokeWidth={2.5} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: '#ffffff' }} className="flex p-3 rounded-full bg-white/20 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <FiLinkedin size={20} color="#ffffff" strokeWidth={2.5} />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{ color: '#ffffff' }} className="flex p-3 rounded-full bg-white/20 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <FiGithub size={20} color="#ffffff" strokeWidth={2.5} />
              </a>
            )}
            {socialLinks.portfolio && (
              <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" style={{ color: '#ffffff' }} className="flex p-3 rounded-full bg-white/20 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                <FiGlobe size={20} color="#ffffff" strokeWidth={2.5} />
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