'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';
import { WhatsAppWidget } from '@/components/whatsapp-widget';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get contact info from config or use defaults
  const contactEmail = config?.footer?.contact?.email || 'info@desertportautos.com';
  const contactPhone = config?.footer?.contact?.phone || '+971 50 123 4567';
  const contactAddress = config?.footer?.contact?.address || 'Dubai, UAE';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              <span className="text-lime-500">DESERT</span>PORT
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Curating automotive excellence for discerning clients worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-lime-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-500 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/inventory" className="text-gray-400 hover:text-lime-500 transition">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-lime-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-lime-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/consignment" className="text-gray-400 hover:text-lime-500 transition">
                  Consignment
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-lime-500 transition">
                  Worldwide Shipping
                </Link>
              </li>
              <li>
                <Link href="/spare-parts" className="text-gray-400 hover:text-lime-500 transition">
                  Auto Spare Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-lime-500 flex-shrink-0 mt-1" />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-lime-500 flex-shrink-0" />
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-lime-500 transition">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-lime-500 flex-shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-lime-500 transition">
                  {contactEmail}
                </a>
              </li>
              <li className="mt-4">
                <WhatsAppWidget variant="inline" showText={true} className="w-full justify-center" />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} DesertPort Autos. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-lime-500 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-lime-500 transition">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-lime-500 transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

