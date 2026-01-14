'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface SiteConfig {
  siteName?: string;
  siteTagline?: string;
  branding?: {
    logoUrl?: string;
    faviconUrl?: string;
    showSiteName?: boolean;
  };
  hero?: {
    videoUrl?: string;
    subheadline?: string;
    rotationSpeed?: number;
    headlines?: Array<{ id: string; text: string }>;
    stats?: Array<{ id: string; value: string; label: string }>;
  };
  categories?: {
    items?: Array<any>;
  };
  testimonials?: {
    items?: Array<any>;
  };
  about?: {
    heading?: string;
    subheading?: string;
    cards?: Array<any>;
  };
  experience?: {
    features?: Array<any>;
    benefits?: string[];
    imageUrl?: string;
    stats?: {
      satisfaction?: string;
      availability?: string;
      countries?: string;
      clients?: string;
    };
  };
  footer?: {
    contact?: {
      email?: string;
      phone?: string;
      whatsapp?: string;
      address?: string;
      mapLat?: number;
      mapLng?: number;
    };
    quickLinks?: Array<any>;
    serviceLinks?: Array<any>;
    socialLinks?: Array<any>;
  };
  design?: {
    colors?: {
      primary?: string;
      accent?: string;
    };
  };
}

interface SiteConfigStore {
  config: SiteConfig | null;
  loading: boolean;
  isInitialized: boolean;
  fetchConfig: () => Promise<void>;
}

export const useSiteConfigStore = create<SiteConfigStore>()(
  persist(
    (set) => ({
      config: null,
      loading: false,
      isInitialized: false,
      fetchConfig: async () => {
        set({ loading: true });
        try {
          const docRef = doc(db, 'site_config', 'main');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const newConfig = docSnap.data() as SiteConfig;
            console.log('📦 Config fetched:', newConfig);
            set({ config: newConfig, loading: false, isInitialized: true });
          } else {
            console.log('⚠️ No config document found');
            set({ loading: false, isInitialized: true });
          }
        } catch (error) {
          console.error('Error fetching config:', error);
          set({ loading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'site-config-storage',
      partialize: (state) => ({ 
        config: state.config,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

