'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsVideoLoaded(false);
    }
  }, [isOpen]);

  // Auto-play when opened and loaded
  useEffect(() => {
    if (isOpen && videoRef.current && isVideoLoaded) {
      videoRef.current.play().catch(err => console.error('Video play error:', err));
    }
  }, [isOpen, isVideoLoaded]);

  if (!videoUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[9999]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl aspect-video bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white hover:bg-gray-50 text-gray-900 flex items-center justify-center backdrop-blur-xl border-2 border-gray-200 hover:border-lime-500 transition-all duration-300 shadow-lg"
              >
                <X size={24} />
              </motion.button>

              {/* Loading Spinner - Only show when not loaded */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-gray-200 border-t-lime-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 font-medium">Loading video...</p>
                  </div>
                </div>
              )}

              {/* Video Player */}
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-cover"
                onLoadedData={() => {
                  console.log('✅ Video loaded and ready');
                  setIsVideoLoaded(true);
                }}
                onCanPlay={() => {
                  console.log('✅ Video can play');
                  setIsVideoLoaded(true);
                }}
                style={{ display: isVideoLoaded ? 'block' : 'none' }}
              >
                Your browser does not support the video tag.
              </video>

              {/* Gradient Border Glow - Premium White Theme */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent bg-gradient-to-r from-lime-500/20 via-lime-400/20 to-lime-500/20" style={{ 
                maskImage: 'linear-gradient(to right, transparent, white, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)'
              }} />
            </motion.div>

            {/* Instruction Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-gray-700 text-sm font-medium bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-lg">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-gray-900 font-mono text-xs mx-1">ESC</kbd> to close
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

