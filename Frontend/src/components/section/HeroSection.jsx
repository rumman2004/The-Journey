import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate images
      gsap.fromTo('.hero-img',
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
      );

      // Animate text elements staggered
      gsap.fromTo('.hero-text-elem',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[500px] overflow-hidden bg-[#f4f3f0]">

      {/* Images anchored to the bottom */}
      <div className="absolute bottom-0 left-0 w-full">

        {/* Mobile (sm) Image: Shows by default, hides on md and up */}
        <img
          src="https://res.cloudinary.com/dtbytfxzs/image/upload/v1783098184/sm_kg4nym.png"
          alt="Batch 2023–2026 students - Mobile"
          className="hero-img w-full h-auto block md:hidden opacity-0"
          loading="eager"
        />

        {/* Tablet (md) Image: Shows on md, hides on lg and up */}
        <img
          src="https://res.cloudinary.com/dtbytfxzs/image/upload/v1783026047/ChatGPT_Image_Jul_3_2026_02_28_45_AM_ke208o.png"
          alt="Batch 2023–2026 students - Tablet"
          className="hero-img w-full h-auto hidden md:block lg:hidden opacity-0"
          loading="eager"
        />

        {/* Desktop (lg) Image: Shows on lg and up */}
        <img
          src="https://res.cloudinary.com/dtbytfxzs/image/upload/v1783100483/ChatGPT_Image_Jul_3_2026_02_28_45_AM_re4o7s.png"
          alt="Batch 2023–2026 students - Desktop"
          className="hero-img w-full h-auto hidden lg:block opacity-0 lg:translate-y-12 xl:translate-y-[10%]"
          loading="eager"
        />

      </div>

      {/* Container for headings so they sit perfectly in the space above the people */}
      <div className="relative z-10 w-full h-[55vh] md:h-[60vh] lg:h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-20 lg:pt-24">
        {/* Badge */}
        <div className="hero-text-elem inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#0e1525]/5 backdrop-blur-sm border border-[#c9a84c]/30 mb-6 sm:mb-8 shadow-sm opacity-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse"></span>
          <span className="text-[0.65rem] sm:text-xs font-bold tracking-[0.25em] text-[#8B6914] uppercase font-sans">
            Class of 2023—2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-text-elem font-serif text-[3.25rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight text-center max-w-4xl mx-auto opacity-0"
          style={{
            background: 'linear-gradient(135deg, #8B6914 0%, #c9a84c 30%, #f0d080 55%, #c9a84c 75%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 100%'
          }}
        >
          The Journey,<br />
          We'll Remember.
        </h1>

        {/* Sub-text */}
        <p className="hero-text-elem mt-5 md:mt-8 max-w-sm sm:max-w-md md:max-w-xl text-[#8B6914]/80 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-sans font-light tracking-wide text-center mx-auto opacity-0">
          Every moment. Every memory. Every person.<br />
          Explore the legacy of our batch.
        </p>
      </div>

    </section>
  );
};

export default HeroSection;
