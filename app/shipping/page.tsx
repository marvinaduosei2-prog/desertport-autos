'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe, Package, Shield, Truck, FileText, CheckCircle } from 'lucide-react';

export default function ShippingPage() {
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
              Worldwide <span className="text-lime-500">Shipping</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Professional vehicle transportation anywhere in the world
            </p>
          </motion.div>
        </div>
      </section>

      <ServicesSection />
      <ProcessSection />
      <RegionsSection />
      <CTASection />

      <Footer />
    </div>
  );
}

function ServicesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const services = [
    { icon: <Globe className="w-8 h-8" />, title: 'Global Network', description: 'Partnerships with premium carriers worldwide' },
    { icon: <Package className="w-8 h-8" />, title: 'Enclosed Transport', description: 'Climate-controlled and secure shipping' },
    { icon: <Shield className="w-8 h-8" />, title: 'Fully Insured', description: 'Comprehensive insurance coverage' },
    { icon: <Truck className="w-8 h-8" />, title: 'Door-to-Door', description: 'Pickup and delivery at your location' },
    { icon: <FileText className="w-8 h-8" />, title: 'Documentation', description: 'We handle all customs and paperwork' },
    { icon: <CheckCircle className="w-8 h-8" />, title: 'Real-Time Tracking', description: 'Monitor your shipment 24/7' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          Premium <span className="text-lime-600">Shipping Services</span>
        </h2>
        <p className="text-xl text-gray-600">White-glove transportation for your investment</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-lime-500 transition-all shadow-lg hover:shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-lime-500 flex items-center justify-center text-white mb-6">
              {service.icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const steps = [
    { title: 'Request Quote', description: 'Provide destination and vehicle details' },
    { title: 'Route Planning', description: 'Optimal route and carrier selection' },
    { title: 'Secure Pickup', description: 'Professional loading and inspection' },
    { title: 'In-Transit', description: 'Real-time tracking and updates' },
    { title: 'Final Delivery', description: 'White-glove delivery and inspection' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          Shipping <span className="text-lime-600">Process</span>
        </h2>
        <p className="text-xl text-gray-600">From pickup to delivery</p>
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

function RegionsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const regions = [
    { name: 'North America', coverage: 'USA, Canada, Mexico' },
    { name: 'Europe', coverage: 'EU, UK, Switzerland, Norway' },
    { name: 'Middle East', coverage: 'UAE, Saudi Arabia, Qatar, Kuwait' },
    { name: 'Asia-Pacific', coverage: 'Japan, Singapore, Australia, Hong Kong' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
          Global <span className="text-lime-600">Coverage</span>
        </h2>
        <p className="text-xl text-gray-600">We ship to over 100 countries worldwide</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {regions.map((region, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-gray-50 rounded-3xl p-8 text-center"
          >
            <h3 className="text-2xl font-black text-gray-900 mb-3">{region.name}</h3>
            <p className="text-gray-600">{region.coverage}</p>
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
          Ready to <span className="text-lime-500">Ship</span>?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Contact us for a custom shipping quote for your vehicle
        </p>
        <a href="/contact" className="inline-block px-8 py-4 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all">
          GET QUOTE
        </a>
      </div>
    </section>
  );
}

