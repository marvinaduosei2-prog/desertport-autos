'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Award, TrendingUp, Star, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';

// Map icon names to actual icons (case-insensitive)
const iconMap: Record<string, any> = {
  Shield,
  Award,
  TrendingUp,
  Star,
  Heart,
  CheckCircle,
  // Lowercase versions
  shield: Shield,
  award: Award,
  trendingup: TrendingUp,
  star: Star,
  heart: Heart,
  checkcircle: CheckCircle,
  check: CheckCircle,
};

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get features from Firebase or use defaults
  // Handle both "icon" and "iconName" fields (case-insensitive)
  const features = config?.about?.cards?.map(card => ({
    icon: iconMap[card.iconName || card.icon] || Shield,
    title: card.title,
    description: card.description,
  })) || [
    {
      icon: Shield,
      title: 'Certified Quality',
      description: 'Every vehicle undergoes rigorous inspection and certification',
    },
    {
      icon: Award,
      title: 'Premium Selection',
      description: 'Curated collection of the world\'s finest automobiles',
    },
    {
      icon: TrendingUp,
      title: 'Investment Grade',
      description: 'Vehicles that appreciate and hold their value over time',
    },
  ];

  const heading = config?.about?.heading || 'Where Luxury Meets Performance';
  const subheading = config?.about?.subheading || 'We don\'t just sell vehicles. We curate automotive masterpieces for those who appreciate the pinnacle of engineering, design, and exclusivity.';

  // Different colors for each card
  const cardColors = [
    {
      gradient: 'from-lime-500/10 to-lime-600/5',
      borderHover: 'group-hover:border-lime-500',
      iconBg: 'bg-lime-500/10 group-hover:bg-lime-500/20',
      iconBorder: 'border-lime-500/20 group-hover:border-lime-500',
      icon: 'text-lime-600',
      glow: 'from-lime-500 to-lime-400',
      textHover: 'group-hover:text-lime-600',
      shadow: 'group-hover:shadow-lime-500/20'
    },
    {
      gradient: 'from-blue-500/10 to-blue-600/5',
      borderHover: 'group-hover:border-blue-500',
      iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20',
      iconBorder: 'border-blue-500/20 group-hover:border-blue-500',
      icon: 'text-blue-600',
      glow: 'from-blue-500 to-blue-400',
      textHover: 'group-hover:text-blue-600',
      shadow: 'group-hover:shadow-blue-500/20'
    },
    {
      gradient: 'from-purple-500/10 to-purple-600/5',
      borderHover: 'group-hover:border-purple-500',
      iconBg: 'bg-purple-500/10 group-hover:bg-purple-500/20',
      iconBorder: 'border-purple-500/20 group-hover:border-purple-500',
      icon: 'text-purple-600',
      glow: 'from-purple-500 to-purple-400',
      textHover: 'group-hover:text-purple-600',
      shadow: 'group-hover:shadow-purple-500/20'
    },
  ];

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-20 lg:py-28">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full">
        <div className="w-full px-6 lg:px-12 xl:px-16 max-w-[2000px] mx-auto">
          
          {/* Header - Similar to Experience Section */}
          <div className="mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1px] w-10 bg-gradient-to-r from-lime-500 to-transparent" />
              <span className="text-lime-600 text-[10px] font-black tracking-[0.25em] uppercase">Unmatched Excellence</span>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="leading-[0.9]"
              >
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight">
                  Where{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-500">
                    Luxury
                  </span>
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mt-2">
                  Meets Performance
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed lg:pb-2"
              >
                {subheading}
              </motion.p>
            </div>
          </div>

          {/* 3 Premium Cards - Strategic Spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const colors = cardColors[index % cardColors.length];
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.5 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  {/* Glow Effect on Hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${colors.glow} rounded-[32px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                  
                  {/* Card */}
                  <div className={`relative h-full rounded-[32px] border border-gray-200 ${colors.borderHover} bg-white shadow-lg ${colors.shadow} p-8 lg:p-10 transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-2`}>
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-500`} />
                    
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={`inline-flex items-center justify-center w-16 h-16 ${colors.iconBg} ${colors.iconBorder} border-2 rounded-2xl transition-all duration-300`}
                      >
                        <feature.icon size={32} className={`${colors.icon} transition-colors duration-300`} strokeWidth={2} />
                      </motion.div>
                      
                      {/* Floating Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg"
                      >
                        <ArrowRight size={14} className={colors.icon} strokeWidth={3} />
                      </motion.div>
                    </div>
                    
                    {/* Content */}
                    <h3 className={`relative text-2xl lg:text-3xl font-black text-gray-900 mb-4 tracking-tight ${colors.textHover} transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    <p className="relative text-gray-600 text-base leading-relaxed font-light group-hover:text-gray-700 transition-colors duration-300 mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Loading Bar - Inside the Box */}
                    <div className="relative mt-auto">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.7 + index * 0.15 }}
                          className={`h-full bg-gradient-to-r ${colors.glow} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[32px]`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
