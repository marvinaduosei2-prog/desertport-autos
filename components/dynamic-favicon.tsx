'use client';

import { useEffect } from 'react';
import { useSiteConfigStore } from '@/store/site-config';

export function DynamicFavicon() {
  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const faviconUrl = config?.branding?.faviconUrl;
    
    if (faviconUrl) {
      // Update favicon
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [config?.branding?.faviconUrl]);

  return null; // This component doesn't render anything
}


