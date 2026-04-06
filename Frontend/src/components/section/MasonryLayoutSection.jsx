import React, { useEffect } from 'react';

const masonryImages = [
  // --- Original Masonry Images ---
  { id: 1, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038636/IMG-20251230-WA0439_pcjegh.jpg', alt: 'Campus evening' },
  { id: 2, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038622/IMG-20251230-WA0414_nembv0.jpg', alt: 'Study session' },
  { id: 3, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038559/IMG_20251228_100947032_nzyuxf.jpg', alt: 'Friendship group' },
  { id: 4, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038046/IMG_20250223_154014721_zwwj4d.jpg', alt: 'Festive night' },
  { id: 5, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038019/IMG_20250223_153014291_jbotmi.jpg', alt: 'Graduation moment' },
  { id: 6, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775036764/IMG-20250830-WA0039_yl9w8z.jpg', alt: 'Group project' },
  { id: 7, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775036633/IMG-20250830-WA0092_u2p3hl.jpg', alt: 'Sports day' },
  { id: 8, src: 'https://res.cloudinary.com/dtbytfxzs/image/upload/v1775038595/IMG-20251228-WA0010_wsijoc.jpg', alt: 'Road trip' },

  // --- 1st Semester ---
  { id: 9, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323676/IMG_20230923_132556033.jpg_t1mqkh.jpg', alt: 'Orientation Day' },
  { id: 10, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323675/IMG_20230922_104145200.jpg_lbzkkb.jpg', alt: 'First Day of Class' },
  { id: 11, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323673/IMG_20230810_132557542.jpg_bvipxe.jpg', alt: 'Campus Tour' },
  { id: 12, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323674/IMG_20230823_161529733.jpg_xwb8dh.jpg', alt: 'Campus Tour' },
  { id: 13, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323673/IMG_20230911_130321569.jpg_tqz66d.jpg', alt: 'Campus Tour' },
  { id: 14, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20230819_151208494.jpg_jlslnt.jpg', alt: 'Campus Tour' },
  { id: 15, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20231207_140845010.jpg_xjtufu.jpg', alt: 'Campus Tour' },
  { id: 16, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323670/IMG_20230908_124613518.jpg_whoian.jpg', alt: 'Campus Tour' },
  { id: 17, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323667/IMG_20230823_123754807.jpg_sb6rhx.jpg', alt: 'Campus Tour' },
  { id: 18, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323665/IMG_20231118_112705395.jpg_q5lt1m.jpg', alt: 'Campus Tour' },
  { id: 19, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323664/IMG_20230819_150421790.jpg_gsq6sa.jpg', alt: 'Campus Tour' },
  { id: 20, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323663/IMG_20230810_132619463.jpg_q3ggvu.jpg', alt: 'Campus Tour' },
  { id: 21, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323661/IMG_20230923_133716463.jpg_oucd7j.jpg', alt: 'Campus Tour' },
  { id: 22, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775323661/IMG_20230818_113357474.jpg_veolor.jpg', alt: 'Campus Tour' },

  // --- 2nd Semester ---
  { id: 23, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg', alt: 'Lab Session' },
  { id: 24, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324276/IMG_20240427_140846544.jpg_eddvza.jpg', alt: 'Study Group' },
  { id: 25, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324268/IMG_20240427_140741449.jpg_vmtvro.jpg', alt: 'Assignments' },
  { id: 26, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123146429.jpg_fniksb.jpg', alt: 'Midterm Project' },
  { id: 27, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775324265/IMG_20240422_123201658.jpg_sbt9nl.jpg', alt: 'Midterm Project' },

  // --- 3rd Semester ---
  { id: 28, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325358/IMG_20240919_140858039.jpg_l2p9kp.jpg', alt: 'Workshop' },
  { id: 29, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325357/IMG_20240813_115840291.jpg_sqosmc.jpg', alt: 'Exams' },
  { id: 30, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325354/IMG_20240819_122644698.jpg_otjey3.jpg', alt: 'Exams' },
  { id: 31, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325350/IMG_20240805_115942716.jpg_favqac.jpg', alt: 'Exams' },
  { id: 32, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325348/IMG_20240805_120726584.jpg_mmdthd.jpg', alt: 'Exams' },

  // --- 4th Semester ---
  { id: 33, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325436/IMG-20250522-WA0027.jpg_e769b1.jpg', alt: 'Cultural Event' },
  { id: 34, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG_20250326_130236634.jpg_axpwhg.jpg', alt: 'Sports Meet' },
  { id: 35, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG-20250522-WA0028.jpg_rh56im.jpg', alt: 'Sports Meet' },
  { id: 36, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325434/IMG_20250223_152804538.jpg_v2k7qx.jpg', alt: 'Sports Meet' },
  { id: 37, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325433/IMG-20250423-WA0016.jpg_ibglfu.jpg', alt: 'Sports Meet' },
  { id: 38, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325430/IMG_20250619_150929689.jpg_wy9dqh.jpg', alt: 'Sports Meet' },
  { id: 39, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0008.jpg_ulglfw.jpg', alt: 'Scholarship Treat' },
  { id: 40, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325428/IMG-20250404-WA0005.jpg_zajiyl.jpg', alt: 'Sports Meet' },
  { id: 41, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325424/IMG-20250308-WA0006.jpg_olz97s.jpg', alt: 'Sports Meet' },
  { id: 42, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325424/IMG_20250423_123916686.jpg_x0e3c5.jpg', alt: 'Sports Meet' },
  { id: 43, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325413/IMG_20250223_152920525.jpg_yb4ic2.jpg', alt: 'Sports Meet' },
  { id: 44, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325398/20250522_134900.jpg_azbosj.jpg', alt: 'Sports Meet' },
  { id: 45, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325382/20250308_130449.jpg_fps3zc.jpg', alt: 'Sports Meet' },
  { id: 46, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325399/20250522_134904.jpg_a4tlei.jpg', alt: 'Sports Meet' },
  { id: 47, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325402/20250617_125521.jpg_eb0v83.jpg', alt: 'Sports Meet' },
  { id: 48, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325390/20250424_125421.jpg_ykeehv.jpg', alt: 'Sports Meet' },
  { id: 49, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325418/IMG_20250513_104947215.jpg_qu8wir.jpg', alt: 'Sports Meet' },
  { id: 50, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775325413/IMG_20250308_120931474.jpg_mkpnpq.jpg', alt: 'Sports Meet' },

  // --- 5th Semester ---
  { id: 51, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326075/20250830_142311.jpg_mlxmrx.jpg', alt: "Teacher's Day" },
  { id: 52, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326089/20251031_125103.jpg_nvusfy.jpg', alt: 'Tech Fest' },
  { id: 53, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326077/20250905_103230.jpg_jgp6uw.jpg', alt: 'Tech Fest' },
  { id: 54, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326094/20250905_142410.jpg_gwsvn0.jpg', alt: "Freshers' Fiesta" },
  { id: 55, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326085/20250905_140629.jpg_dtdilx.jpg', alt: 'Tech Fest' },
  { id: 56, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326085/20251222_144708.jpg_psmoif.jpg', alt: 'Tech Fest' },
  { id: 57, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326095/20251222_145020.jpg_yhsh91.jpg', alt: 'Tech Fest' },
  { id: 58, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326099/IMG-20251222-WA0069.jpg_ztl1b0.jpg', alt: 'Tech Fest' },
  { id: 59, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775326096/IMG_20250905_134003830.jpg_znbtoc.jpg', alt: 'Tech Fest' },
  { id: 60, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394993/IMG-20251228-WA0011_jjsltp.jpg', alt: 'Tech Fest' },
  { id: 61, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394997/IMG_20251228_075358069_vownxm.jpg', alt: 'Tech Fest' },
  { id: 62, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394998/IMG_20251228_151554302_pkfom8.jpg', alt: 'Tech Fest' },
  { id: 63, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG-20251228-WA0014_fdcvem.jpg', alt: 'Tech Fest' },
  { id: 64, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG_20251228_083648683_haeygj.jpg', alt: 'Tech Fest' },
  { id: 65, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG_20251228_062129992_rsk2xv.jpg', alt: 'Tech Fest' },
  { id: 66, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775394999/IMG-20251228-WA0019_eag8vj.jpg', alt: 'Tech Fest' },
  { id: 67, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG_20251228_100947032_rdzviq.jpg', alt: 'Tech Fest' },
  { id: 68, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG-20251228-WA0024_qwoljw.jpg', alt: 'Tech Fest' },
  { id: 69, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395000/IMG-20251228-WA0023_tqt55l.jpg', alt: 'Tech Fest' },
  { id: 70, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395001/IMG-20251228-WA0164_idyv3v.jpg', alt: 'Tech Fest' },
  { id: 71, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395003/IMG-20251228-WA0166_av33wn.jpg', alt: 'Tech Fest' },
  { id: 72, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395003/IMG-20251228-WA0250_kjkccv.jpg', alt: 'Tech Fest' },
  { id: 73, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395004/IMG-20251229-WA0107_nspjks.jpg', alt: 'Tech Fest' },
  { id: 74, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395004/IMG-20251229-WA0005_gtkbvk.jpg', alt: 'Tech Fest' },
  { id: 75, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251230-WA0148_thfb4n.jpg', alt: 'Tech Fest' },
  { id: 76, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0137_elksim.jpg', alt: 'Tech Fest' },
  { id: 77, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0140_dakoxq.jpg', alt: 'Tech Fest' },
  { id: 78, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395007/IMG-20251229-WA0008_bsut6b.jpg', alt: 'Tech Fest' },
  { id: 79, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251230-WA0149_ahp5xe.jpg', alt: 'Tech Fest' },
  { id: 80, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251229-WA0138_tzkwa4.jpg', alt: 'Tech Fest' },
  { id: 81, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395008/IMG-20251229-WA0104_n4fa2p.jpg', alt: 'Tech Fest' },
  { id: 82, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395009/IMG-20251230-WA0392_swha8p.jpg', alt: 'Tech Fest' },
  { id: 83, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775395009/IMG-20251230-WA0458_lj8eou.jpg', alt: 'Tech Fest' },

  // --- 6th Semester ---
  { id: 84, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775397739/IMG-20260401-WA0003.jpg_uskpav.jpg', alt: 'Farewell Prep' },
  { id: 85, src: 'https://res.cloudinary.com/ddil24vfs/image/upload/v1775397739/IMG-20260401-WA0000.jpg_rar9og.jpg', alt: 'Graduation Day' },
];

// This maps the irregular block pattern to the elements
const getCardStyles = (index) => {
  const styles = [
    // 0: Wide, standard height, shifted slightly up
    "w-72 sm:w-80 h-64 rounded-[2rem] -translate-y-6",
    // 1: Medium, short, shifted down, starts darker (simulating the black block)
    "w-56 sm:w-64 h-48 rounded-[1.5rem] translate-y-12 before:absolute before:inset-0 before:bg-black/60 before:z-10 before:transition-opacity before:duration-500 group-hover/card:before:opacity-0",
    // 2: Tall, standard width, shifted heavily up
    "w-64 sm:w-72 h-80 rounded-[2rem] -translate-y-12",
    // 3: Wide, asymmetrical borders, shifted down
    "w-80 sm:w-96 h-72 rounded-[2rem_4rem_1rem_3rem] translate-y-8",
    // 4: Massive block, extreme borders, shifted up
    "w-80 sm:w-[28rem] h-96 rounded-[4rem_1rem_4rem_1rem] -translate-y-16",
    // 5: Medium square, simple border, shifted down slightly
    "w-56 sm:w-64 h-64 rounded-[2rem] translate-y-6",
    // 6: Wide, short height, shifted up
    "w-72 sm:w-80 h-48 rounded-[1rem_3rem_1rem_3rem] -translate-y-8",
    // 7: Tall, shifted heavily down
    "w-64 sm:w-72 h-80 rounded-[3rem_1rem_3rem_1rem] translate-y-14"
  ];
  return styles[index % styles.length];
};

const InfiniteGallerySection = ({ title = 'Our Journey Gallery' }) => {
  useEffect(() => {
    // Preload masonry images in background for ultra-smooth scrolling
    const preloadMasonryImages = () => {
      // Preload first 20 images specifically for the initial viewport
      masonryImages.slice(0, 20).forEach(item => {
        const img = new Image();
        img.src = item.src;
      });
      // The rest can be preloaded gradually
      setTimeout(() => {
        masonryImages.slice(20).forEach(item => {
          const img = new Image();
          img.src = item.src;
        });
      }, 2000);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadMasonryImages);
    } else {
      setTimeout(preloadMasonryImages, 1500);
    }
  }, []);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-transparent" style={{ animation: 'stk-fade 0.5s ease forwards' }}>
      
      {/* Top rule matching StickersDisplay theme */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35) 30%, rgba(240,208,128,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent)' }} />

      {/* Header Area */}
      <div className="mb-20 text-left px-4 max-w-[1100px] mx-auto mt-4">
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', margin: '0 0 0.4rem' }}>
          Through The Years
        </p>
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1 }}>
          <span style={{ color: '#f0ece4' }}>Journey </span>
          <span style={{ background: 'linear-gradient(135deg, #8B6914, #c9a84c, #f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Gallery</span>
        </h2>
        <p style={{ margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(180,200,225,0.4)' }}>
          A snapshot from every year; scroll the life of our batch.
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex w-full items-center overflow-hidden group py-16">
        
        {/* Track 1 */}
        <div className="flex shrink-0 items-center animate-marquee gap-6 pr-6">
          {masonryImages.map((item, index) => (
            <div 
              key={`track1-${item.id}`} 
              className={`relative flex-none p-2 bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:bg-white/10 group/card overflow-hidden ${getCardStyles(index)}`}
            >
              <div className="w-full h-full relative rounded-inherit overflow-hidden" style={{ borderRadius: 'inherit' }}>
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Track 2 (Exact Duplicate) */}
        <div className="flex shrink-0 items-center animate-marquee gap-6 pr-6" aria-hidden="true">
          {masonryImages.map((item, index) => (
            <div 
              key={`track2-${item.id}`} 
              className={`relative flex-none p-2 bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:bg-white/10 group/card overflow-hidden ${getCardStyles(index)}`}
            >
              <div className="w-full h-full relative rounded-inherit overflow-hidden" style={{ borderRadius: 'inherit' }}>
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-20" />
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        
        @keyframes stk-fade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default InfiniteGallerySection;