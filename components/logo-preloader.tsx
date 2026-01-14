'use client';

import { useEffect } from 'react';
import { useSiteConfigStore } from '@/store/site-config';

export function LogoPreloader() {
  const { config } = useSiteConfigStore();

  useEffect(() => {
    const logoUrl = config?.branding?.logoUrl;
    
    if (logoUrl) {
      // Preload the logo image
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = logoUrl;
      document.head.appendChild(link);

      // Also create an Image object to force browser to cache it
      const img = new Image();
      img.src = logoUrl;
      
      console.log('🚀 Preloading logo:', logoUrl);
    }
  }, [config?.branding?.logoUrl]);

  return null;
}


