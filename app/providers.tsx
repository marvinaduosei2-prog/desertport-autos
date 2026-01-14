'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useSiteConfigStore } from '@/stores/site-config-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const fetchSiteConfig = useSiteConfigStore((state) => state.fetchConfig);

  useEffect(() => {
    // Initialize auth state listener
    initializeAuth();
    
    // Fetch site configuration
    fetchSiteConfig();
  }, [initializeAuth, fetchSiteConfig]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

