'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSiteConfigStore } from '@/store/site-config';
import { useAIChatStore } from '@/stores/ai-chat-store';
import { useNavigationStore } from '@/stores/navigation-store';
import { X, Minimize2, Maximize2, Eye, EyeOff } from 'lucide-react';

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
  
  // State for hiding/showing video and fullscreen
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Determine if floating video should be dimmed
  const shouldDim = isChatOpen || isMenuOpen;
  
  // Load hidden state from localStorage on mount
  useEffect(() => {
    const hidden = localStorage.getItem('floatingVideoHidden') === 'true';
    setIsHidden(hidden);
  }, []);
  
  // Toggle hide/show
  const toggleHidden = () => {
    const newHidden = !isHidden;
    setIsHidden(newHidden);
    localStorage.setItem('floatingVideoHidden', String(newHidden));
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      const elem = videoRef.current;
      if (elem) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen(); // Safari
        } else if ((elem as any).mozRequestFullScreen) {
          (elem as any).mozRequestFullScreen(); // Firefox
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen(); // IE/Edge
        }
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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

  if (isHidden) {
    // Show only the toggle button when hidden
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleHidden}
        className="fixed bottom-32 right-6 z-[80] bg-black/80 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/90 hover:border-lime-500/50 transition shadow-lg"
        title="Show floating video"
      >
        <Eye className="w-5 h-5 text-white" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: shouldDim ? 0.15 : 1, 
          scale: shouldDim ? 0.95 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed bottom-32 right-6 group transition-all duration-400 ${
          shouldDim ? 'z-[40] pointer-events-none' : 'z-[80] pointer-events-auto'
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

          {/* Control Buttons (Show on hover or on mobile) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {/* Hide Button */}
            <button
              onClick={toggleHidden}
              className="bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/80 transition"
              title="Hide video"
            >
              <EyeOff className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Subtle Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 border border-lime-500/30 rounded-xl" />
          </div>
        </div>

        {/* Ambient Glow - More subtle */}
        <div className="absolute -inset-2 bg-lime-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </>
  );
}

