'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Award, TrendingUp, Users, Target, Heart, Zap, Clock } from 'lucide-react';
import { AIChatWidget } from '@/components/ai-chat-widget';
import { WhatsAppWidget } from '@/components/whatsapp-widget';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter">
              Your Premium <br />
              <span className="text-lime-500">Automotive Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto">
              Connecting you with exceptional vehicles from Dubai to markets across Africa with unmatched service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Our Story */}
      <OurStorySection />

      {/* Core Values */}
      <CoreValuesSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
      
      {/* Floating Widgets */}
      <AIChatWidget context={{ page: 'about' }} />
      <WhatsAppWidget variant="floating" />
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '1000+', label: 'Happy Clients' },
    { value: '2500+', label: 'Vehicles Sold' },
    { value: '98%', label: 'Customer Satisfaction' },
  ];

  return (
    <section ref={ref} className="py-24 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center"
          >
            <h3 className="text-5xl md:text-6xl font-black text-lime-600 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function OurStorySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop"
            alt="Luxury car showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
            Our <span className="text-lime-600">Story</span>
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              DesertPort Autos was founded with a vision to bridge the gap between Dubai's thriving automotive market and discerning buyers across Africa.
            </p>
            <p>
              Operating from Dubai, UAE, we specialize in sourcing premium vehicles and quality auto parts from trusted suppliers, ensuring every listing meets the highest standards of quality and value.
            </p>
            <p>
              We've built our reputation on transparency, reliability, and exceptional service. From vehicle sourcing to international shipping coordination, we handle every aspect of your purchase with professionalism and care.
            </p>
            <p className="text-lime-600 font-bold text-xl">
              Your trusted gateway to premium automotive solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CoreValuesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Integrity',
      description: 'Transparency and honesty in every transaction, building trust that lasts a lifetime.'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Excellence',
      description: 'Uncompromising standards in vehicle selection, service, and customer experience.'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Passion',
      description: 'A genuine love for automotive artistry drives everything we do.'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Innovation',
      description: 'Embracing technology and new approaches to enhance the buying experience.'
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto bg-gray-50">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter"
        >
          Our Core <span className="text-lime-600">Values</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          The principles that guide every decision and interaction
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-200 hover:border-lime-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-lime-500/10 flex items-center justify-center text-lime-600 mb-6">
              {value.icon}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              {value.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const reasons = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Verified Listings',
      description: 'Every vehicle carefully sourced and verified for quality and authenticity.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Transparent Process',
      description: 'Clear documentation and detailed vehicle information for informed decisions.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Premium Service',
      description: 'Professional support from inquiry to delivery at your destination.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Competitive Pricing',
      description: 'Direct sourcing from Dubai ensures the best value for your investment.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Worldwide Shipping',
      description: 'Reliable international shipping to African markets and beyond.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Ongoing Support',
      description: 'Continuous assistance and guidance throughout your ownership journey.'
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter"
        >
          Why Choose <span className="text-lime-600">DesertPort</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          The DesertPort difference in every interaction
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-lime-500 flex items-center justify-center text-white">
              {reason.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600">
                {reason.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-16 text-center relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.3) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Find Your <span className="text-lime-500">Dream Car</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Let our team of experts guide you to the perfect vehicle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/inventory" className="px-8 py-4 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all duration-300 shadow-lg hover:shadow-lime-500/50">
              BROWSE INVENTORY
            </a>
            <a href="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-black rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20">
              CONTACT US
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

