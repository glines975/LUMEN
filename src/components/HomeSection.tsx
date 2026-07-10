import React from 'react';
import { motion } from 'motion/react';

interface HomeSectionProps {
  onPageChange: (pageId: 'home' | 'about' | 'works' | 'contact') => void;
  introCompleted?: boolean;
  currentPage: string;
}

export default function HomeSection({ onPageChange, introCompleted, currentPage }: HomeSectionProps) {
  const [isDropped, setIsDropped] = React.useState(false);

  React.useEffect(() => {
    if (introCompleted) {
      if (currentPage === 'home') {
        // Reset to up state instantly when entering home
        setIsDropped(false);
        const timer = setTimeout(() => {
          setIsDropped(true);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // Raise the curtain instantly when leaving the home page
        setIsDropped(false);
      }
    }
  }, [currentPage, introCompleted]);

  return (
    <div 
      onClick={() => setIsDropped(!isDropped)}
      className="h-full w-full flex flex-col items-center justify-center relative select-none bg-transparent cursor-pointer overflow-hidden"
      title={isDropped ? "Click to raise the curtain" : "Click to lower the curtain"}
    >
      {/* Floating interactive toggle hint when curtain is up */}
      {!isDropped && introCompleted && currentPage === 'home' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0.2, 0.6, 0.2], y: 0 }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute top-32 text-[10px] tracking-[0.3em] text-white/40 font-mono uppercase text-center w-full z-20 pointer-events-none"
        >
          [ Click anywhere to drop the curtain ]
        </motion.div>
      )}

      {/* The curtain container (text + double dark filters) */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: isDropped ? "0%" : "-100%" }}
        transition={{ 
          duration: 2.8, 
          ease: [0.16, 1, 0.3, 1] // Dramatic cubic-bezier easeOutExpo/Quart for majestic curtain flow
        }}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Lighter overlay so parallax sky/city remain visible behind text */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.15)_55%,transparent_100%)] pointer-events-none z-0" />
        
        {/* Centered content with elegant typography */}
        <div className="text-center max-w-4xl flex flex-col items-center relative z-10 px-6 md:px-16 lg:px-24">
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] text-white/90 uppercase mb-6 font-mono font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            WELCOME TO THE REALM
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-art font-bold tracking-wide leading-tight text-white sacred-glow mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          >
            I am Leah,<br />the lord of this city.
          </motion.h1>

          {/* Separator line with white glow */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.1, ease: 'easeOut' }}
            className="w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent mb-8 drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.3 }}
            className="text-xs sm:text-sm md:text-base font-sans font-bold tracking-[0.25em] text-white uppercase leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            Content Creator • Space Architect • AI Builder
          </motion.p>
          
        </div>
      </motion.div>
    </div>
  );
}

