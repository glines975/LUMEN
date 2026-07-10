import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const COLS = 12;
const ROWS = 8;
const TOTAL_CELLS = COLS * ROWS;

export default function LumenIntro({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showLetters, setShowLetters] = useState(false);
  const [startDissipate, setStartDissipate] = useState(false);
  const [hideUnderlay, setHideUnderlay] = useState(false);

  // Generate grid cell metadata for both entrance and dissipation
  const cells = React.useMemo(() => {
    return Array.from({ length: TOTAL_CELLS }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      
      // Entrance delay: beautiful diagonal wave (top-left to bottom-right)
      const entranceDistance = col + row;
      const entranceDelay = entranceDistance * 0.09 + Math.random() * 0.08;

      // Dissipation delay: wave propagating outward from center line (cols 5 & 6)
      // Center column average is 5.5
      const distanceFromCenter = Math.abs(col - 5.5);
      const dissipateDelay = distanceFromCenter * 0.06 + Math.random() * 0.03;

      return {
        id: i,
        entranceDelay,
        dissipateDelay,
      };
    });
  }, []);

  useEffect(() => {
    // Disable scrolling during the intro animation to maintain theatrical control
    document.body.style.overflow = 'hidden';

    // 1. Show the golden letters after the white grid blocks have fully covered the background (around 3.0s)
    const lettersTimer = setTimeout(() => {
      setShowLetters(true);
    }, 3000);

    // 2. Hide the black underlay at 4.4s (since white blocks already fully cover the screen).
    // This allows the homepage to be visible directly behind the white blocks when they dissipate.
    const underlayTimer = setTimeout(() => {
      setHideUnderlay(true);
    }, 4400);

    // 3. Start central dissipation of the white blocks immediately as letters finish fading (around 7.6s)
    // Letters enter at 3.0s, play for 6.0s (ending at 9.0s).
    const dissipateTimer = setTimeout(() => {
      setStartDissipate(true);
    }, 7600);

    // 4. Complete animation entirely, cleanup DOM, restore browser scroll (around 9.8s to fully allow 1.4s transition)
    const endTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 9800);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(lettersTimer);
      clearTimeout(underlayTimer);
      clearTimeout(dissipateTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    document.body.style.overflow = '';
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div
        id="intro-mask"
        onClick={handleSkip}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-transparent"
      >
        {/* SOLID BLACK UNDERLAY:
            Hides the homepage completely at the very beginning of the page load.
            Fades out once the white grid is fully solid, so that the homepage is ready behind the blocks. */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: hideUnderlay ? 0 : 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[#0c0c0c] z-0"
        />

        {/* CONTIGUOUS WHITE GRID:
            Forms the pure white canvas, then dissolves from the center outward. */}
        <div 
          className="absolute inset-0 grid z-10 pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              initial={{ scale: 0, opacity: 0, borderRadius: '12px' }}
              animate={{ 
                // Before dissipation: scale 1.05 and opacity 1.
                // When dissipation starts: fade out to 0, scale down slightly, and round corners for organic dissolution.
                scale: startDissipate ? 0.85 : 1.05, 
                opacity: startDissipate ? 0 : 1, 
                borderRadius: startDissipate ? '16px' : '0px'
              }}
              transition={{
                // Use entrance properties before dissipation, use dissipation delay after.
                duration: startDissipate ? 1.4 : 1.5,
                delay: startDissipate ? cell.dissipateDelay : cell.entranceDelay,
                ease: startDissipate ? [0.4, 0, 1, 1] : [0.16, 1, 0.3, 1], // easeIn for exit, easeOutExpo for entry
              }}
              className="bg-white w-full h-full"
            />
          ))}
        </div>

        {/* Golden LUMEN Letters Layer - Perfectly centered horizontally & vertically */}
        {showLetters && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.1em', filter: 'blur(15px)', scale: 0.9, y: 20 }}
              animate={{
                // Cinematic 6.0s animation curve:
                // 0.0s - 1.2s: Smooth fade in & sharpen
                // 1.2s - 4.8s: Perfectly clear, solid golden hold in the exact center (~3.6s hold!)
                // 4.8s - 6.0s: Elegant feather-light dissipation
                opacity: [0, 1, 1, 0],
                letterSpacing: ['0.1em', '0.35em', '0.38em', '0.52em'],
                filter: ['blur(15px)', 'blur(0px)', 'blur(0px)', 'blur(20px)'],
                scale: [0.9, 1.0, 1.002, 1.03],
                y: [20, 0, -0.5, -8],
              }}
              transition={{
                duration: 6.0,
                times: [0, 0.20, 0.80, 1.0],
                ease: [0.25, 1, 0.5, 1],
              }}
              className="font-art text-6xl md:text-8xl font-semibold text-gradient-ethereal sacred-glow select-none text-center"
            >
              LUMEN
            </motion.h1>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
}
