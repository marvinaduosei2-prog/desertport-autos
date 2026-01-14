import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GarageItemData } from '@/types/client';

interface GarageState {
  items: GarageItemData[];
  
  // Actions
  setItems: (items: GarageItemData[]) => void;
  addItem: (item: GarageItemData) => void;
  removeItem: (itemId: string) => void;
  clearGarage: () => void;
  isInGarage: (vehicleId: string) => boolean;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (items) => set({ items }),

      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      })),

      clearGarage: () => set({ items: [] }),

      isInGarage: (vehicleId) => {
        const { items } = get();
        return items.some((item) => item.vehicleId === vehicleId);
      },
    }),
    {
      name: 'garage-storage',
    }
  )
);

