import { create } from 'zustand';
import { storage } from '../services/storage';

interface SettingsState {
  currency: string;
  theme: 'light' | 'dark';
  setCurrency: (currency: string) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currency: storage.get('currency') || 'USD',
  theme: storage.get('theme') || 'light',

  setCurrency: (currency) => {
    storage.set('currency', currency);
    set({ currency });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      storage.set('theme', newTheme);
      return { theme: newTheme };
    });
  },
}));
