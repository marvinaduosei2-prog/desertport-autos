'use client';

import { useSiteConfigStore } from '@/stores/site-config-store';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicSectionProps {
  section: 'hero' | 'footer' | 'alert';
  children?: React.ReactNode;
}

export function DynamicSection({ section, children }: DynamicSectionProps) {
  const config = useSiteConfigStore((state) => state.config);
  const loading = useSiteConfigStore((state) => state.loading);

  if (loading || !config) {
    return <div className="animate-pulse bg-white/5 h-96 rounded-2xl" />;
  }

  switch (section) {
    case 'alert':
      return <GlobalAlerts alerts={config.globalAlerts} />;
    case 'hero':
      return <HeroSection hero={config.hero} />;
    case 'footer':
      return (
        <FooterSection
          footerLinks={config.footerLinks}
          contactInfo={config.contactInfo}
          brandName={config.brandName}
        />
      );
    default:
      return children || null;
  }
}

// ==================== SUB-COMPONENTS ====================

function GlobalAlerts({ alerts }: { alerts: any[] }) {
  const enabledAlerts = alerts.filter((alert) => alert.enabled);

  if (enabledAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {enabledAlerts.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{alert.message}</p>
            {alert.link && (
              <a
                href={alert.link}
                className="text-sm font-semibold underline hover:opacity-80"
              >
                {alert.linkText || 'Learn More'}
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function HeroSection({ hero }: any) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {hero.videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback Image */}
      {hero.fallbackImageUrl && !isVideoLoaded && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.fallbackImageUrl})` }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: hero.overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6"
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-white/90 mb-8"
        >
          {hero.subheadline}
        </motion.p>
        <motion.a
          href={hero.ctaLink}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-block glass-button text-white text-lg"
        >
          {hero.ctaText}
        </motion.a>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

function FooterSection({ footerLinks, contactInfo, brandName }: any) {
  const groupedLinks = footerLinks.reduce((acc: any, link: any) => {
    if (!acc[link.section]) acc[link.section] = [];
    acc[link.section].push(link);
    return acc;
  }, {});

  return (
    <footer className="bg-black/90 backdrop-blur-lg border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{brandName}</h3>
            <p className="text-white/70 text-sm">
              Premium automotive marketplace
            </p>
          </div>

          {/* Company Links */}
          {groupedLinks.company && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {groupedLinks.company.map((link: any) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Links */}
          {groupedLinks.legal && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {groupedLinks.legal.map((link: any) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.email}</li>
              <li>{contactInfo.address}</li>
              <li className="pt-2 text-white/50">{contactInfo.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function getAlertStyles(type: string) {
  switch (type) {
    case 'info':
      return 'bg-blue-500/20 border border-blue-500/30 text-blue-100';
    case 'warning':
      return 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-100';
    case 'success':
      return 'bg-green-500/20 border border-green-500/30 text-green-100';
    case 'error':
      return 'bg-red-500/20 border border-red-500/30 text-red-100';
    default:
      return 'bg-white/10 border border-white/20 text-white';
  }
}

