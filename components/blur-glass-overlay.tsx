'use client';

/**
 * Adaptive Blur Glass Overlay
 * Uses backdrop-filter to intelligently adapt to any background
 * Creates a frosted glass effect that works on any color
 */
export function BlurGlassOverlay() {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-20"
      style={{
        height: '280px',
        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
        maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)',
      }}
    >
      {/* Adaptive Blur - Works on any background */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(8px) saturate(120%)',
          WebkitBackdropFilter: 'blur(8px) saturate(120%)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
        }}
      />
    </div>
  );
}

