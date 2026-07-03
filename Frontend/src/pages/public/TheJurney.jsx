import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../../components/layout/Layout';
import HeroSection from '../../components/section/HeroSection';
import OurMilestones from '../../components/section/OurMilestones';
import MasonryLayoutSection from '../../components/section/MasonryLayoutSection';

gsap.registerPlugin(ScrollTrigger);

const TheJourney = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo('.cta-elem', 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            stagger: 0.15, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  const startJourney = () => {
    document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToBatch = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => setShowLoading(true), 240);
    setTimeout(() => navigate('/batch'), 1300);
  };

  return (
    <Layout noPaddingTop={true}>
      <div className="min-h-screen font-sans bg-luxury-ivory text-luxury-charcoal journey-page overflow-x-hidden">
             
        {/* HERO */}
        <HeroSection />

        {/* TIMELINE */}
        <OurMilestones />

        {/* MASONRY */}
        <MasonryLayoutSection />

        {/* CTA (Sleek Minimal Dark Layout) */}
        <section ref={ctaRef} className="py-24 px-6 md:px-12 w-full bg-[#0a0b10] border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <span className="cta-elem text-[#8B6914] text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-0">
                Continue the story
              </span>
              <h2 className="cta-elem font-serif text-4xl md:text-5xl text-white mb-4 tracking-wide opacity-0">
                The story continues beyond the wall.
              </h2>
              <p className="cta-elem font-sans text-white/50 text-sm md:text-base font-light opacity-0">
                Follow the class, discover every voice, and keep the batch flame alive.
              </p>
            </div>
            
            {/* Right Content (Button) */}
            <div className="cta-elem shrink-0 mt-4 md:mt-0 opacity-0">
              <button 
                onClick={goToBatch} 
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#c9a84c]/40 bg-transparent text-[#c9a84c] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#c9a84c]/10 transition-all duration-300"
              >
                Meet The Class
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
            
          </div>
        </section>

        {/* PAGE TRANSITION OVERLAY */}
        {(isExiting || showLoading) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ivory opacity-0 animate-fade-in px-4 text-center">
            <div className="space-y-6 fade-up">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border border-luxury-gold/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-t-luxury-gold border-luxury-gold/10 animate-spin" />
              </div>
              <p className="font-serif text-3xl text-luxury-graphite">Loading Class of '26...</p>
              <p className="font-sans text-luxury-charcoal/60 text-sm uppercase tracking-[0.2em]">Transporting you to the next chapter</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TheJourney;