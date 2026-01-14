'use client';

import { useSiteConfigStore } from '@/store/site-config';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { VideoModal } from '@/components/video-modal';

export function DynamicHero() {
  const { config: siteConfig, isInitialized } = useSiteConfigStore();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  // Get headlines from config - NO DEFAULTS, wait for config
  const rawHeadlines = siteConfig?.hero?.headlines || [];
  
  // Convert to text array if it's objects
  const headlines = rawHeadlines.map((h: any) => 
    typeof h === 'string' ? h : h.text
  );
  
  const rotationSpeed = siteConfig?.hero?.rotationSpeed || 4; // seconds
  const subheadline = siteConfig?.hero?.subheadline || '';
  const heroVideoUrl = siteConfig?.hero?.videoUrl || '';
  
  // Get hero stats from config - NO DEFAULTS
  const heroStats = siteConfig?.hero?.stats?.filter((stat: any) => stat.enabled) || [];

  // Log video URL for debugging
  useEffect(() => {
    console.log('🎥 Hero Video URL:', heroVideoUrl);
  }, [heroVideoUrl]);

  // Rotate headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, rotationSpeed * 1000);

    return () => clearInterval(interval);
  }, [headlines.length, rotationSpeed]);

  // Force video to play on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Background video playing');
            setVideoLoaded(true);
          })
          .catch((err) => {
            console.warn('⚠️ Autoplay blocked, will retry on interaction:', err);
            // Retry on any user interaction
            const handleInteraction = () => {
              video.play()
                .then(() => {
                  console.log('✅ Background video playing after interaction');
                  setVideoLoaded(true);
                })
                .catch(e => console.error('Video play failed:', e));
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            };
            document.addEventListener('click', handleInteraction, { once: true });
            document.addEventListener('touchstart', handleInteraction, { once: true });
          });
      }
    };

    // Try to play after a short delay
    const timer = setTimeout(attemptPlay, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] noise-texture">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
          {/* Video Element - Dynamic from Firebase */}
          {heroVideoUrl && (
            <video
              key={heroVideoUrl}
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%230a0a0a' width='1920' height='1080'/%3E%3C/svg%3E"
              onLoadedData={() => {
                console.log('✅ Video loaded and ready');
                setVideoLoaded(true);
              }}
              onCanPlay={() => {
                setVideoLoaded(true);
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded ? 'opacity-50' : 'opacity-0'
              }`}
              style={{ objectFit: 'cover' }}
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          )}
          
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />
          
          {/* Clean Fallback Background - Solid color only */}
          <div className={`absolute inset-0 bg-[#0a0a0a] ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-500 pointer-events-none`} />
        </motion.div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto flex flex-col justify-center min-h-screen py-20 md:py-0"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime-500/30 mb-6 md:mb-8 bg-lime-500/10 backdrop-blur-xl mx-auto -mt-8 sm:-mt-0"
        >
          <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-lime-500">
            PREMIUM AUTOMOTIVE
          </span>
        </motion.div>

        {/* Headline - Rotating */}
        <div className="mb-6 md:mb-8 min-h-[120px] sm:min-h-[140px] md:min-h-[200px] lg:min-h-[250px] flex items-center justify-center">
          {isInitialized && headlines.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeadlineIndex}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl [@media(min-width:430px)]:text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tighter text-center px-4"
              >
                <span className="block text-white break-words">
                  {headlines[currentHeadlineIndex].split(' ')[0]}
                </span>
                <span className="block gradient-text neon-text break-words">
                  {headlines[currentHeadlineIndex].split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>
            </AnimatePresence>
          ) : (
            // Loading skeleton
            <div className="text-center space-y-4 animate-pulse">
              <div className="h-24 w-96 bg-white/5 rounded-2xl mx-auto" />
              <div className="h-24 w-80 bg-lime-500/5 rounded-2xl mx-auto" />
            </div>
          )}
        </div>

        {/* Subheadline */}
        {isInitialized && subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto font-light tracking-wide px-4"
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-3 md:gap-4 flex-wrap mb-12 md:mb-20 px-4"
        >
          <Link href="/inventory">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-lime-500 text-black text-xs sm:text-sm md:text-base font-black uppercase tracking-wider shadow-2xl hover:shadow-lime-500/50 framer-smooth relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-3">
                <span>EXPLORE NOW</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
          {heroVideoUrl && (
            <motion.button
              onClick={() => setShowVideoModal(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full border-2 border-white/20 text-white text-xs sm:text-sm md:text-base font-black uppercase tracking-wider backdrop-blur-sm hover:border-lime-500 hover:text-lime-500 framer-smooth"
            >
              SHOWREEL
            </motion.button>
          )}
        </motion.div>

        {/* Dynamic Stats */}
        {isInitialized && heroStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 flex-wrap px-4"
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight group-hover:text-lime-500 framer-smooth"
                >
                  {stat.value}
                </motion.div>
                <div className="text-[8px] sm:text-[9px] md:text-xs text-gray-500 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold group-hover:text-lime-500 framer-smooth">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="text-lime-500" size={20} />
        </motion.div>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent pointer-events-none z-10" />

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={heroVideoUrl}
      />
    </section>
  );
}
