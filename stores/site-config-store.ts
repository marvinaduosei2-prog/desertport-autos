import { create } from 'zustand';
import type { SiteConfigData } from '@/types/client';
import { fetchSiteConfig } from '@/lib/firebase/db';
import { serializeTimestamp } from '@/lib/firebase/db';

interface SiteConfigState {
  config: SiteConfigData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchConfig: () => Promise<void>;
  updateConfig: (config: SiteConfigData) => void;
}

export const useSiteConfigStore = create<SiteConfigState>((set) => ({
  config: null,
  loading: false,
  error: null,

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await fetchSiteConfig();
      
      if (config) {
        const serializedConfig = {
          ...config,
          updatedAt: serializeTimestamp(config.updatedAt),
        } as unknown as SiteConfigData;
        set({ config: serializedConfig, loading: false });
      } else{
        set({ error: 'Failed to load site configuration', loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateConfig: (config) => set({ config }),
}));

