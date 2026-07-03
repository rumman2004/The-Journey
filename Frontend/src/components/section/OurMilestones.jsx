import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: '2023', month: 'August', index: '01',
    title: 'Where It All Started',
    description: 'Fresh faces, new friendships, and the thrill of day one. None of us knew yet what the next three years would hold.',
    caption: 'The very first chapter of our story.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323674/IMG_20230823_161529733.jpg_xwb8dh.jpg'
  },
  {
    year: '2023', month: 'December', index: '02',
    title: 'The First Hurdle',
    description: 'First exams done. The stress melted instantly into shared relief, laughter, and the quiet realization we\'d survive this together.',
    caption: 'Post-exam relief and lakeside discussions.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20231207_140845010.jpg_xjtufu.jpg'
  },
  {
    year: '2024', month: 'April', index: '03',
    title: 'Unofficial Free Period',
    description: 'Controllers, combos, and one perfectly timed class bunk. Some lessons are best learned outside the syllabus.',
    caption: 'Controllers, combos, and an empty classroom.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg'
  },
  {
    year: '2024', month: 'April', index: '04',
    title: 'Impromptu Pizza Party',
    description: 'A sudden craving. No plans, no reservations — just everyone gathered around slices and stories nobody wanted to end.',
    caption: 'Unplanned moments make the best memories.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324267/IMG_20240427_140752010.jpg_wv9azn.jpg'
  },
  {
    year: '2024', month: 'August', index: '05',
    title: 'Welcoming the Newcomers',
    description: 'We became the seniors, welcoming a new batch the same way we once hoped to be welcomed. The torch passed quietly.',
    caption: 'Passing the torch and sharing the journey.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325350/IMG_20240805_115942716.jpg_favqac.jpg'
  },
  {
    year: '2025', month: 'April', index: '06',
    title: 'The Off-Period UNO Battles',
    description: 'Draw four. Skip. Reverse. Every free period became a battlefield. The loudest laughs and fiercest rivalries — all over cards.',
    caption: 'Draw four! Free periods turned into card tournaments.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325432/IMG-20250423-WA0017.jpg_i3eolj.jpg'
  },
  {
    year: '2025', month: 'April', index: '07',
    title: 'The Scholarship Treat',
    description: 'Real friendship is celebrating hard — and immediately demanding a treat. Shared pizzas, cold drinks, and pride all around.',
    caption: 'Celebrating success with the mandatory pizza party.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0008.jpg_ulglfw.jpg'
  },
  {
    year: '2025', month: 'September', index: '08',
    title: "Teacher's Day Celebration",
    description: 'Black and yellow balloons, heartfelt speeches, and a room full of gratitude. Honouring the people who never gave up on us.',
    caption: 'Celebrating the guiding lights of our college life.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326075/20250830_142311.jpg_mlxmrx.jpg'
  },
  {
    year: '2025', month: 'September', index: '09',
    title: "The Freshers' Fiesta",
    description: 'A massive group photo, a room full of energy, and the moment we truly felt like seniors. The cycle of welcome, continued.',
    caption: 'A full house! Celebrating the arrival of the junior batch.',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326094/20250905_142410.jpg_gwsvn0.jpg'
  },
  {
    year: '2025', month: 'December', index: '10',
    title: 'Crossing the 5th Sem Finish Line',
    description: 'Winter air, one quick selfie, and the sudden realization: just one semester left. We\'d come further than we thought.',
    caption: '5th semester done and dusted. One more to go!',
    image: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326107/IMG-20251222-WA0122.jpg_stedxq.jpg'
  },
  {
    year: '2026', month: 'June', index: '26',
    title: 'The Journey Concludes',
    description: 'The culmination of our academic years. Through final projects and lasting campus memories, we close this chapter with gratitude—ready to carry our legacy forward.',
    caption: 'The end of an era, and the foundation of our future.',
    image: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1782942768/IMG-20260625-WA0035_htdgnr.jpg'
  }
];

const OurMilestones = () => {
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  const containerRef = useRef(null);

  useEffect(() => {
    // Preload images for smooth scrolling
    const preloadTimelineImages = () => {
      timelineEvents.forEach(event => {
        const img = new Image();
        img.src = event.image;
      });
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadTimelineImages);
    } else {
      setTimeout(preloadTimelineImages, 1000);
    }

    // GSAP ScrollTrigger Animations
    const ctx = gsap.context(() => {
      const milestones = gsap.utils.toArray('.milestone-item');
      
      milestones.forEach((milestone, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(milestone, 
          { opacity: 0, x: isLeft ? -60 : 60, y: 40 },
          { 
            opacity: 1, 
            x: 0, 
            y: 0,
            duration: 1.4, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: milestone,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline-section" className="py-32 md:py-48 px-5 max-w-7xl mx-auto overflow-hidden bg-transparent">
      
      {/* Header */}
      <div className="text-center mb-32 relative z-10">
        <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-full backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
          <span className="font-sans text-[0.7rem] md:text-sm font-bold tracking-[0.25em] uppercase text-[#8B6914]">
            Our Milestones
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
        </div>
        <h2 className="font-serif text-5xl md:text-[5rem] text-luxury-graphite mb-6 leading-tight tracking-tight drop-shadow-sm">
          The <span className="italic text-[#c9a84c]">Moments</span> That Made Us
        </h2>
      </div>
      
      {/* Timeline Container */}
      <div className="relative" ref={containerRef}>
        {/* Liquid Glass Timeline Spine */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[4px] backdrop-blur-md bg-white/40 border-x border-white/50 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.03)]"></div>
        
        <div className="space-y-28 md:space-y-44 relative pl-16 md:pl-0 pt-10">
          {sortedEvents.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className={`milestone-item flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between group relative z-10`}>
                
                {/* Glass Text Content Card */}
                <div className={`w-full md:w-[45%] mb-8 md:mb-0`}>
                  <div className={`p-8 md:p-12 backdrop-blur-2xl bg-white/50 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-white/60 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
                    <h3 className="font-sans text-xs md:text-sm text-[#8B6914] mb-4 font-bold tracking-[0.25em] uppercase">
                      {event.month} {event.year}
                    </h3>
                    <h4 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-luxury-graphite mb-5 leading-tight font-medium">
                      {event.title}
                    </h4>
                    <p className="font-sans text-base md:text-lg text-luxury-charcoal/80 leading-relaxed font-light tracking-wide inline-block">
                      {event.description}
                    </p>
                  </div>
                </div>
                
                {/* Liquid Glass Node */}
                <div className="absolute left-[-24px] md:static flex items-center justify-center w-14 h-14 my-4 md:my-0 z-20 shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-xl bg-white/50 border border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] group-hover:scale-110 transition-transform duration-500 ease-out">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8B6914] to-[#f0d080] shadow-[0_0_15px_rgba(201,168,76,0.6)] animate-pulse"></div>
                  </div>
                </div>
                
                {/* Glass Image Card (Original Ratio) */}
                <div className="w-full md:w-[45%]">
                  <div className="p-3 md:p-4 backdrop-blur-2xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:bg-white/50 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
                    {/* The image is completely unconstrained in height so it dictates its own aspect ratio! */}
                    <img 
                      className="w-full h-auto object-contain rounded-2xl transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]" 
                      src={event.image} 
                      alt={event.title} 
                      loading="lazy"
                    />
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurMilestones;
