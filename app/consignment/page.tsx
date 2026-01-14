'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Shield, Users, Star, DollarSign, Clock } from 'lucide-react';

export default function ConsignmentPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter">
              Consignment <span className="text-lime-500">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Sell your luxury vehicle hassle-free with our expert consignment service
            </p>
          </motion.div>
        </div>
      </section>

      <BenefitsSection />
      <ProcessSection />
      <CTASection />

      <Footer />
    </div>
  );
}

function BenefitsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const benefits = [
    { icon: <DollarSign className="w-8 h-8" />, title: 'Maximum Profit', description: 'Achieve higher sale prices than traditional trade-ins' },
    { icon: <Shield className="w-8 h-8" />, title: 'Zero Hassle', description: 'We handle everything from marketing to paperwork' },
    { icon: <Users className="w-8 h-8" />, title: 'Expert Marketing', description: 'Professional photography and premium listing exposure' },
    { icon: <Star className="w-8 h-8" />, title: 'Secure Process', description: 'Your vehicle is safely stored and fully insured' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          Why Choose Our <span className="text-lime-600">Consignment</span>
        </h2>
        <p className="text-xl text-gray-600">The smart way to sell your premium vehicle</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-lime-500 transition-all shadow-lg hover:shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center text-white mb-6">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const steps = [
    { title: 'Submit Vehicle', description: 'Provide details and photos of your vehicle' },
    { title: 'Appraisal', description: 'Our experts evaluate and set competitive pricing' },
    { title: 'Professional Marketing', description: 'Premium listing with professional photos' },
    { title: 'Secure Sale', description: 'We handle negotiations and paperwork' },
    { title: 'Get Paid', description: 'Receive payment quickly and securely' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          How It <span className="text-lime-600">Works</span>
        </h2>
        <p className="text-xl text-gray-600">Simple process, maximum results</p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-lime-500 text-white flex items-center justify-center text-2xl font-black mx-auto mb-4">
              {index + 1}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Ready to <span className="text-lime-500">Consign</span>?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Contact us today to get started with our premium consignment service
        </p>
        <a href="/contact" className="inline-block px-8 py-4 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all">
          GET STARTED
        </a>
      </div>
    </section>
  );
}

