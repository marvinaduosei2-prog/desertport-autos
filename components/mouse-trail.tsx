'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * 2060 Advanced Mouse Trail
 * Sophisticated, minimal, no artifacts
 * Clean fade, subtle glow, futuristic feel
 */
export function MouseTrail() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  
  const trailPositions = useRef<Array<{ x: number; y: number; id: number }>>([]);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    let animationId: number;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Throttled trail creation - only every 50ms for smooth, artifact-free trail
      const now = Date.now();
      if (now - lastTime > 50) {
        const newTrail = {
          x: e.clientX,
          y: e.clientY,
          id: counterRef.current++
        };
        
        trailPositions.current = [...trailPositions.current, newTrail].slice(-8); // Keep only 8 dots
        setTrails(trailPositions.current);
        lastTime = now;
      }
    };

    // Clean up trails periodically
    const cleanupInterval = setInterval(() => {
      if (trailPositions.current.length > 0) {
        trailPositions.current = trailPositions.current.slice(1);
        setTrails([...trailPositions.current]);
      }
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Trail Dots - Clean Fade */}
      {trails.map((trail, index) => {
        const opacity = (index + 1) / trails.length; // Fade based on position
        const scale = 0.3 + (opacity * 0.7); // Scale from 0.3 to 1
        
        return (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: opacity * 0.6, scale }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              left: trail.x,
              top: trail.y,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
            className="w-2 h-2 rounded-full bg-lime-500 blur-[1px]"
          />
        );
      })}

      {/* Main Cursor - Minimal Ring */}
      <motion.div
        style={{
          left: smoothCursorX,
          top: smoothCursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed pointer-events-none z-[9999]"
      >
        {/* Outer Ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 border border-lime-500/40 rounded-full"
        />
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-lime-500 rounded-full shadow-lg shadow-lime-500/50" />
      </motion.div>
    </>
  );
}

