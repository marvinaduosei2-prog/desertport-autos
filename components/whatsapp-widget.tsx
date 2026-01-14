'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteConfigStore } from '@/store/site-config';
import { useEffect } from 'react';

interface WhatsAppWidgetProps {
  variant?: 'floating' | 'button' | 'inline';
  className?: string;
  showText?: boolean;
}

export function WhatsAppWidget({ 
  variant = 'button', 
  className = '',
  showText = true 
}: WhatsAppWidgetProps) {
  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const whatsappNumber = config?.footer?.contact?.whatsapp || '+971501234567';
  
  // Remove all non-digit characters for WhatsApp URL
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  const handleWhatsAppClick = () => {
    // Default message (can be customized)
    const message = encodeURIComponent('Hello! I\'m interested in your services.');
    
    // Try to detect if user is on mobile (more likely to have WhatsApp app)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // WhatsApp deep link (tries to open app first)
    const whatsappDeepLink = `whatsapp://send?phone=${cleanNumber}&text=${message}`;
    
    // WhatsApp web link (fallback)
    const whatsappWebLink = `https://wa.me/${cleanNumber}?text=${message}`;
    
    if (isMobile) {
      // On mobile, try deep link first
      window.location.href = whatsappDeepLink;
      
      // Fallback to web after short delay if app doesn't open
      setTimeout(() => {
        window.open(whatsappWebLink, '_blank');
      }, 1000);
    } else {
      // On desktop, use wa.me which handles app/web automatically
      window.open(whatsappWebLink, '_blank');
    }
  };

  // Floating variant (bottom-right)
  if (variant === 'floating') {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        className={`fixed z-[90] w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-2xl transition-all duration-300 ${className}`}
        style={{
          bottom: '2rem',
          right: '6rem', // Next to AI chat widget
        }}
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.824.741 5.476 2.038 7.768L0 32l8.401-2.002A15.943 15.943 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.455c-2.508 0-4.905-.689-6.937-1.886l-.496-.294-5.152 1.228 1.238-5.044-.324-.516A13.39 13.39 0 0 1 2.545 16C2.545 8.556 8.556 2.545 16 2.545S29.455 8.556 29.455 16 23.444 29.455 16 29.455z" />
          <path d="M23.607 19.68c-.397-.198-2.349-1.158-2.713-1.29-.364-.132-.628-.198-.893.199-.264.396-.992 1.29-1.222 1.554-.231.264-.463.297-.86.099-.397-.198-1.674-.617-3.188-1.967-1.179-1.05-1.975-2.347-2.206-2.744-.231-.397-.025-.611.174-.809.178-.178.397-.463.595-.694.198-.231.264-.397.396-.661.132-.264.066-.496-.033-.694-.099-.198-.893-2.151-1.223-2.945-.322-.773-.649-.668-.893-.681-.231-.012-.496-.015-.76-.015s-.694.099-1.058.496c-.364.397-1.388 1.356-1.388 3.309s1.421 3.838 1.619 4.102c.198.264 2.795 4.267 6.774 5.984.947.408 1.686.651 2.261.834.95.302 1.815.259 2.497.157.762-.113 2.349-.96 2.679-1.887.331-.927.331-1.721.231-1.887-.099-.165-.364-.264-.76-.463z" />
        </svg>
      </motion.button>
    );
  }

  // Inline variant (next to other content)
  if (variant === 'inline') {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`flex items-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.824.741 5.476 2.038 7.768L0 32l8.401-2.002A15.943 15.943 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.455c-2.508 0-4.905-.689-6.937-1.886l-.496-.294-5.152 1.228 1.238-5.044-.324-.516A13.39 13.39 0 0 1 2.545 16C2.545 8.556 8.556 2.545 16 2.545S29.455 8.556 29.455 16 23.444 29.455 16 29.455z" />
          <path d="M23.607 19.68c-.397-.198-2.349-1.158-2.713-1.29-.364-.132-.628-.198-.893.199-.264.396-.992 1.29-1.222 1.554-.231.264-.463.297-.86.099-.397-.198-1.674-.617-3.188-1.967-1.179-1.05-1.975-2.347-2.206-2.744-.231-.397-.025-.611.174-.809.178-.178.397-.463.595-.694.198-.231.264-.397.396-.661.132-.264.066-.496-.033-.694-.099-.198-.893-2.151-1.223-2.945-.322-.773-.649-.668-.893-.681-.231-.012-.496-.015-.76-.015s-.694.099-1.058.496c-.364.397-1.388 1.356-1.388 3.309s1.421 3.838 1.619 4.102c.198.264 2.795 4.267 6.774 5.984.947.408 1.686.651 2.261.834.95.302 1.815.259 2.497.157.762-.113 2.349-.96 2.679-1.887.331-.927.331-1.721.231-1.887-.099-.165-.364-.264-.76-.463z" />
        </svg>
        {showText && <span>Chat on WhatsApp</span>}
      </button>
    );
  }

  // Button variant (default)
  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      {showText && <span>WhatsApp</span>}
    </button>
  );
}


