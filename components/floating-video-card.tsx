'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useSiteConfigStore } from '@/store/site-config';
import { useAIChatStore } from '@/stores/ai-chat-store';
import { useNavigationStore } from '@/stores/navigation-store';

interface FloatingVideoCardProps {
  videoUrl?: string;
}

export function FloatingVideoCard({ 
  videoUrl
}: FloatingVideoCardProps) {
  const { config, fetchConfig } = useSiteConfigStore();
  const { isOpen: isChatOpen } = useAIChatStore();
  const { isMenuOpen } = useNavigationStore();
  const finalVideoUrl = videoUrl || config?.hero?.floatingVideoUrl || 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4';
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Determine if floating video should be hidden
  const shouldHide = isChatOpen || isMenuOpen;

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load(); // Force reload the video with new source
      video.play().catch(err => console.warn('Video autoplay:', err));
    }
  }, [finalVideoUrl]); // Re-run when video URL changes

  useEffect(() => {
    console.log('🎬 Floating Video URL:', finalVideoUrl);
    console.log('🎬 Full Config:', config);
  }, [finalVideoUrl, config]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: shouldHide ? 0.15 : 1, 
        scale: shouldHide ? 0.95 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed bottom-32 right-6 group transition-all duration-400 ${
        shouldHide ? 'z-[40] pointer-events-none' : 'z-[80] pointer-events-auto'
      }`}
      style={{
        width: '280px',
        aspectRatio: '16/9',
      }}
    >
      {/* Minimal Glass Card */}
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Video */}
        <video
          key={finalVideoUrl}
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={finalVideoUrl} type="video/mp4" />
        </video>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Minimal Live Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-bold uppercase tracking-wider opacity-60">
            LIVE
          </span>
        </div>

        {/* Subtle Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 border border-lime-500/30 rounded-xl" />
        </div>
      </div>

      {/* Ambient Glow - More subtle */}
      <div className="absolute -inset-2 bg-lime-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

