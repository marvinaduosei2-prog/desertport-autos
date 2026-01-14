'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';

export function TestimonialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get testimonials from Firebase - NO DEFAULTS
  const testimonials = config?.testimonials?.items || [];

  // If no testimonials, don't render section
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32 lg:pt-24 lg:pb-40">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Centered Header - UNIQUE STYLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
            Trusted by <span className="text-gray-500">Discerning Clients</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Real stories from those who've experienced automotive excellence
          </p>
        </motion.div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group relative"
            >
              {/* Subtle Glow */}
              <div className="absolute -inset-0.5 bg-white/5 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Compact Card */}
              <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-xl p-6 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.04]">
                
                {/* Quote Icon - Smaller */}
                <Quote size={32} className="text-white/10 mb-4" strokeWidth={1.5} />

                {/* Star Rating - Compact */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className="text-white/80" 
                      fill="white" 
                      fillOpacity={0.8}
                      strokeWidth={0} 
                    />
                  ))}
                </div>

                {/* Testimonial Text - Compact */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
                  "{testimonial.content}"
                </p>

                {/* Divider - Thinner */}
                <div className="w-10 h-[1px] bg-white/20 mb-6" />

                {/* Author - Compact */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
