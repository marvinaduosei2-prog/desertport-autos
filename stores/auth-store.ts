import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import type { UserData } from '@/types/client';
import { onAuthChanged, getCurrentUser, getUserRole } from '@/lib/firebase/auth';

interface AuthState {
  user: FirebaseUser | null;
  userData: UserData | null;
  role: 'user' | 'admin';
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (userData: UserData | null) => void;
  setRole: (role: 'user' | 'admin') => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  refreshUserData: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  role: 'user',
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    if (get().initialized) return;

    set({ initialized: true });

    // Listen to auth state changes
    onAuthChanged(async (user) => {
      set({ user, loading: true });

      if (user) {
        // Fetch user data from Firestore
        const userData = await getCurrentUser();
        const role = await getUserRole();

        if (userData) {
          set({
            userData: {
              ...userData,
              createdAt: userData.createdAt.toDate().toISOString(),
              updatedAt: userData.updatedAt.toDate().toISOString(),
            } as UserData,
            role,
            loading: false,
          });
        } else {
          set({ userData: null, role: 'user', loading: false });
        }
      } else {
        // User signed out - close chat session
        if (typeof window !== 'undefined') {
          // Dynamically import to avoid circular dependency
          import('@/stores/ai-chat-store').then(({ useAIChatStore }) => {
            const closeSession = useAIChatStore.getState().closeSession;
            closeSession();
          });
        }
        set({ userData: null, role: 'user', loading: false });
      }
    });
  },

  refreshUserData: async () => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });
    const userData = await getCurrentUser();
    const role = await getUserRole();

    if (userData) {
      set({
        userData: {
          ...userData,
          createdAt: userData.createdAt.toDate().toISOString(),
          updatedAt: userData.updatedAt.toDate().toISOString(),
        } as UserData,
        role,
        loading: false,
      });
    } else {
      set({ loading: false });
    }
  },

  clearAuth: () => {
    set({ user: null, userData: null, role: 'user', loading: false });
  },
}));

