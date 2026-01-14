'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { WhatsAppWidget } from '@/components/whatsapp-widget';
import { AIChatWidget } from '@/components/ai-chat-widget';

export default function ContactPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get contact info from config or use defaults
  const contactEmail = config?.footer?.contact?.email || 'info@desertportautos.com';
  const contactPhone = config?.footer?.contact?.phone || '+971 50 123 4567';
  const contactAddress = config?.footer?.contact?.address || 'Dubai, UAE';
  const mapLat = config?.footer?.contact?.mapLat || 25.2048;
  const mapLng = config?.footer?.contact?.mapLng || 55.2708;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
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
              Let's <span className="text-lime-500">Connect</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              We're here to answer your questions and help you find your perfect vehicle
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <ContactInfoSection 
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        contactAddress={contactAddress}
      />

      {/* Main Content - Form & Map */}
      <section className="py-16 px-6 lg:px-20 max-w-[2200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm 
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            submitting={submitting}
          />

          {/* Map & Additional Info */}
          <ContactSidebar mapLat={mapLat} mapLng={mapLng} />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
      
      {/* AI Chat Widget */}
      <AIChatWidget context={{ page: 'contact' }} />
    </div>
  );
}

function ContactInfoSection({ contactEmail, contactPhone, contactAddress }: { 
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone',
      primary: contactPhone,
      secondary: 'Available 7 days a week',
      link: `tel:${contactPhone.replace(/\s/g, '')}`
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email',
      primary: contactEmail,
      secondary: 'We respond within 24 hours',
      link: `mailto:${contactEmail}`
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location',
      primary: contactAddress,
      secondary: 'Serving African markets',
      link: null
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Support',
      primary: 'Available Daily',
      secondary: 'Flexible scheduling',
      link: null
    },
  ];

  return (
    <section ref={ref} className="py-16 px-6 lg:px-20 max-w-[2200px] mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-lime-500 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-lime-500 flex items-center justify-center text-white mb-6">
              {info.icon}
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-wide">
              {info.title}
            </h3>
            {info.link ? (
              <a href={info.link} className="block">
                <p className="text-gray-900 font-bold mb-1 hover:text-lime-600 transition-colors">
                  {info.primary}
                </p>
                <p className="text-gray-500 text-sm">
                  {info.secondary}
                </p>
              </a>
            ) : (
              <>
                <p className="text-gray-900 font-bold mb-1">
                  {info.primary}
                </p>
                <p className="text-gray-500 text-sm">
                  {info.secondary}
                </p>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ContactForm({ formData, setFormData, handleSubmit, submitting }: any) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="bg-gray-50 rounded-3xl p-8 lg:p-12"
    >
      <h2 className="text-4xl font-black text-gray-900 mb-3">
        Send Us a <span className="text-lime-600">Message</span>
      </h2>
      <p className="text-gray-600 mb-8">
        Fill out the form below and we'll get back to you as soon as possible
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all"
              placeholder="+1 (234) 567-8900"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all"
            placeholder="General Inquiry"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all resize-none"
            placeholder="Tell us how we can help you..."
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Preferred Contact Method
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="email"
                checked={formData.preferredContact === 'email'}
                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                className="w-4 h-4 text-lime-600 focus:ring-lime-500"
              />
              <span className="text-gray-700 font-medium">Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="phone"
                checked={formData.preferredContact === 'phone'}
                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                className="w-4 h-4 text-lime-600 focus:ring-lime-500"
              />
              <span className="text-gray-700 font-medium">Phone</span>
            </label>
          </div>
        </div>

        {/* Submit Button & WhatsApp */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-8 py-5 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all duration-300 shadow-lg hover:shadow-lime-500/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
          
          <WhatsAppWidget variant="inline" showText={true} className="sm:w-auto" />
        </div>
      </form>
    </motion.div>
  );
}

function ContactSidebar({ mapLat, mapLng }: { mapLat: number; mapLng: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Check if API key is available
  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Generate Google Maps embed URL from coordinates
  const mapEmbedUrl = hasApiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${mapLat},${mapLng}&zoom=14`
    : '';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-3xl overflow-hidden h-[400px] border-2 border-gray-200">
        {hasApiKey ? (
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 text-center">
            <div>
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold mb-2">Map Location</p>
              <p className="text-sm text-gray-500">
                Contact us for directions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Why Contact Us */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white">
        <h3 className="text-2xl font-black mb-6">
          Why Choose <span className="text-lime-500">DesertPort</span>?
        </h3>
        <ul className="space-y-4">
          {[
            'Expert guidance from industry professionals',
            'Personalized vehicle recommendations',
            'Transparent pricing and no hidden fees',
            'Comprehensive vehicle history reports',
            'White-glove concierge service',
            'Worldwide shipping coordination'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-lime-500 flex-shrink-0 mt-1" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function FAQSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I inquire about a vehicle?',
      answer: 'You can browse our inventory online and use the AI chat widget or contact us directly via email or phone. We\'ll provide detailed information and photos of any vehicle you\'re interested in.'
    },
    {
      question: 'Where are your vehicles sourced from?',
      answer: 'We source premium vehicles from trusted dealers and suppliers in Dubai, UAE. All vehicles undergo thorough verification before listing.'
    },
    {
      question: 'Do you ship vehicles internationally?',
      answer: 'Yes, we coordinate worldwide shipping services. Our logistics partners handle all documentation, customs clearance, and delivery to your destination.'
    },
    {
      question: 'What auto parts do you offer?',
      answer: 'We provide quality spare parts and accessories for various vehicle makes and models. Browse our spare parts section or contact us for specific part inquiries.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by destination. Typically, vehicles to African markets take 3-6 weeks. We provide tracking and regular updates throughout the shipping process.'
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 lg:px-20 max-w-[2200px] mx-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
            Frequently Asked <span className="text-lime-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Quick answers to common questions
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-lime-500 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-black text-gray-900">
                  {faq.question}
                </span>
                <span className={`text-2xl font-bold text-lime-600 transition-transform ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

