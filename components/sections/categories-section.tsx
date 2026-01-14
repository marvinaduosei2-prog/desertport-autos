'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';

export function CategoriesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get categories from Firebase - NO DEFAULTS, must be set in admin
  const categories = config?.categories?.items?.map(cat => ({
    title: cat.name,
    description: cat.description,
    image: cat.imageUrl || cat.image || '', // Use imageUrl or image field
    count: cat.count,
    link: cat.link || '/inventory'
  })) || [];

  // Get heading and subheading from config
  const heading = config?.categories?.heading || 'Premium Collections';
  const subheading = config?.categories?.subheading || 'Explore our meticulously curated categories of the world\'s finest automobiles';

  // If no categories, show message to add them in admin
  if (categories.length === 0) {
    return (
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-8 px-0 overflow-hidden bg-gray-50 w-full">
        <div className="relative w-full px-6 lg:px-12 max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No categories configured. Please add categories in the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative py-12 sm:py-16 md:py-24 lg:py-0 px-0 overflow-hidden bg-gray-50 w-full">
      <div className="relative w-full desktop-scale-80">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12 md:mb-16 lg:mb-24 px-4 sm:px-6 lg:px-20 max-w-[2200px] mx-auto"
          >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-[1px] w-10 bg-gradient-to-r from-lime-500 to-transparent" />
            <span className="text-lime-600 text-[10px] font-black tracking-[0.25em] uppercase">Curated Excellence</span>
          </motion.div>

          {/* Title and Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 lg:gap-20">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.1] tracking-tighter lg:max-w-[50%] break-words"
            >
              {heading.split(' ').map((word, index) => 
                index === heading.split(' ').length - 1 ? (
                  <span key={index} className="text-lime-600">{word}</span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-md font-light leading-relaxed lg:mt-2"
            >
              {subheading}
            </motion.p>
          </div>
          </motion.div>

          {/* 2 Rows x 3 Columns Grid - ULTRA WIDE FULL SCREEN Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 px-4 sm:px-6 lg:px-20 max-w-[2200px] mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Link href={category.link}>
                <div className="group relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden cursor-pointer">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
                  </div>

                  {/* Glassmorphism Overlay on Hover with Blur */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-lime-500/10 backdrop-blur-md"
                  />

                  {/* Lime Green Border on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 border-4 border-lime-500 rounded-3xl pointer-events-none neon-glow"
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 z-10">
                    <div className="flex items-end justify-end">
                      <span className="text-white font-black px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-xl text-sm sm:text-base group-hover:bg-lime-500/20 group-hover:border-lime-500 group-hover:text-lime-500 framer-smooth">
                        {category.count}
                      </span>
                    </div>

                    <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px] sm:group-hover:translate-y-[-16px]">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tighter group-hover:text-lime-500 framer-smooth">
                        {category.title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 font-light group-hover:text-lime-500/80 framer-smooth line-clamp-2">
                        {category.description}
                      </p>
                      <div className="inline-flex items-center text-white font-black text-xs sm:text-sm lg:text-base uppercase tracking-wider group-hover:text-lime-500 framer-smooth">
                        <span>EXPLORE</span>
                        <motion.span
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2 sm:ml-3 text-lg sm:text-2xl"
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-lime-500/30 via-lime-400/30 to-lime-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
      </div>
    </section>
  );
}
