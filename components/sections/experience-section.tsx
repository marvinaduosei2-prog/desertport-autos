'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';
import Link from 'next/link';

export function ExperienceSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get benefits and image from Firebase with defaults
  const benefits = config?.experience?.benefits || [
    'Concierge service for seamless transactions',
    'Comprehensive vehicle history and certification',
    'Flexible financing and trade-in options',
    'White-glove delivery to your doorstep',
    'Lifetime support and vehicle care guidance',
    'Exclusive access to pre-launch inventory',
  ];
  const experienceImage = config?.experience?.imageUrl || '';
  
  // Get dynamic stats from config
  const experienceStats = {
    satisfaction: config?.experience?.stats?.satisfaction || '98%',
    availability: config?.experience?.stats?.availability || '24/7 Available',
    countries: config?.experience?.stats?.countries || '15+',
    clients: config?.experience?.stats?.clients || '5,000+',
  };

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-24 lg:py-32">
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs - toned down */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-400/3 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.2) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Content wrapper with 80% scale (20% smaller) - DESKTOP ONLY */}
      <div className="relative w-full flex items-center justify-center">
        <div className="w-full desktop-scale-80">
          <div className="w-full px-6 lg:px-12 xl:px-16 max-w-[2000px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Premium Image with Curves */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-2 lg:order-1"
            >
              {/* Decorative Elements - subtle */}
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t border-l border-lime-500/20 rounded-tl-3xl" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b border-r border-lime-500/20 rounded-br-3xl" />
              
              {/* Main Image Container with Premium Curves */}
              <div className="relative group">
                {/* Subtle Glow - much reduced */}
                <div className="absolute -inset-2 bg-gradient-to-r from-lime-500/5 via-lime-400/5 to-lime-500/5 rounded-[32px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
                
                {/* Image Frame */}
                <div className="relative rounded-[32px] overflow-hidden border border-lime-500/10 shadow-xl shadow-black/20">
                  {/* Premium curved mask for image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {experienceImage ? (
                      <>
                        <img
                          src={experienceImage}
                          alt="Luxury Experience"
                          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[1500ms] ease-out"
                        />
                        {/* Subtle gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-black/50 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                        <p className="text-gray-600 text-sm">Add image in admin panel</p>
                      </div>
                    )}
                  </div>

                  {/* Premium Overlay Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <div className="relative group/badge">
                      <div className="absolute -inset-1 bg-lime-500/20 rounded-lg blur-md group-hover/badge:bg-lime-500/30 transition duration-500" />
                      <div className="relative flex items-center gap-2 px-3 py-2 bg-black/90 backdrop-blur-xl rounded-lg border border-lime-500/30 shadow-lg">
                        <Sparkles className="w-3 h-3 text-lime-400" />
                        <span className="text-[9px] font-black text-white tracking-[0.15em] uppercase">PREMIUM</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Decorative corner accent */}
                  <div className="absolute bottom-4 right-4 w-12 h-12">
                    <div className="absolute inset-0 border-b border-r border-lime-500/30 rounded-br-xl" />
                  </div>
                </div>

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute -bottom-4 -right-4 lg:-right-6 z-10"
                >
                  <div className="relative">
                    <div className="absolute -inset-1.5 bg-lime-500/20 rounded-xl blur-lg" />
                    <div className="relative px-5 py-3 bg-black/95 backdrop-blur-xl rounded-xl border border-lime-500/20 shadow-xl">
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">{experienceStats.satisfaction}</div>
                      <div className="text-[10px] text-gray-500 font-medium">Satisfaction</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Premium Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                {/* Premium Subtitle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <div className="h-[1px] w-10 bg-gradient-to-r from-lime-500 to-transparent" />
                  <span className="text-lime-400 text-[10px] font-black tracking-[0.25em] uppercase">Excellence Redefined</span>
                </motion.div>

                {/* Main Heading - Compact */}
                <h2 className="mb-4 leading-[0.9]">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="block text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
                  >
                    The DesertPort
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative inline-block"
                  >
                    <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500 tracking-tight">
                      Experience
                    </span>
                    <div className="absolute -bottom-1 left-0 w-1/2 h-[2px] bg-gradient-to-r from-lime-500 to-transparent rounded-full" />
                  </motion.span>
                </h2>

                {/* Description - Compact */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-base md:text-lg text-gray-400 mb-6 leading-relaxed"
                >
                  We've transcended conventional automotive excellence. Every detail meticulously crafted for those who accept{' '}
                  <span className="text-lime-400 font-semibold">nothing but perfection</span>.
                </motion.p>

                {/* Compact Benefits List */}
                <div className="space-y-2 mb-6">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                      className="group relative"
                    >
                      <div className="relative flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-lime-500/20 transition-all duration-300">
                        {/* Compact Check Icon */}
                        <div className="relative flex-shrink-0">
                          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-lg shadow-lime-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Check size={16} className="text-black font-bold" strokeWidth={3} />
                          </div>
                        </div>
                        
                        {/* Benefit Text */}
                        <p className="flex-1 text-sm md:text-base text-gray-400 group-hover:text-gray-200 transition-colors duration-300 font-medium">
                          {benefit}
                        </p>

                        {/* Arrow */}
                        <ArrowRight className="w-4 h-4 text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" strokeWidth={2} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Compact CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  {/* Primary Button */}
                  <Link href="/contact" className="group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-400 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" />
                    <div className="absolute -inset-1 bg-lime-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
                    
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3 border border-lime-300/20">
                      <span className="text-black font-bold text-base">
                        Begin Your Journey
                      </span>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                    </div>
                  </Link>

                  {/* Secondary Button */}
                  <Link href="/inventory" className="group relative overflow-hidden rounded-xl border border-gray-800 hover:border-lime-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-lime-500/5 transition duration-300" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3">
                      <span className="text-white font-semibold text-base">
                        View Inventory
                      </span>
                      <ArrowRight className="w-4 h-4 text-lime-400 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
                    </div>
                  </Link>
                </motion.div>

                {/* Compact Trust Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-6 pt-6 border-t border-gray-800/50"
                >
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                      <span className="text-gray-500">{experienceStats.availability}</span>
                    </div>
                    <div className="h-3 w-px bg-gray-800" />
                    <div className="text-gray-500">
                      <span className="text-lime-400 font-bold">{experienceStats.countries}</span> Countries
                    </div>
                    <div className="h-3 w-px bg-gray-800" />
                    <div className="text-gray-500">
                      <span className="text-lime-400 font-bold">{experienceStats.clients}</span> Clients
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
