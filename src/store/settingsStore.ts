// src/store/settingsStore.ts - Zustand store for user settings

import { create } from 'zustand';
import { UserSettings } from '../types';
import { getSettings, saveSettings } from '../services/database';
import { storage } from '../services/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadSettings: (userId: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  updateTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  loadSettings: async (userId) => {
    set({ loading: true, error: null });
    try {
      let settings = await getSettings(userId);
      if (!settings) {
        settings = {
          userId,
          ...DEFAULT_SETTINGS,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await saveSettings(settings);
      }
      set({ settings });
      storage.set('currentUser', userId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load settings' });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (updates) => {
    try {
      const current = get().settings;
      if (!current) throw new Error('Settings not loaded');

      const updated: UserSettings = {
        ...current,
        ...updates,
        updatedAt: new Date(),
      };

      await saveSettings(updated);
      set({ settings: updated });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
    }
  },

  resetSettings: async () => {
    try {
      const current = get().settings;
      if (!current) throw new Error('Settings not loaded');

      const reset: UserSettings = {
        ...DEFAULT_SETTINGS,
        userId: current.userId,
        createdAt: current.createdAt,
        updatedAt: new Date(),
      };

      await saveSettings(reset);
      set({ settings: reset });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reset settings' });
    }
  },

  updateCurrency: async (currency) => {
    await get().updateSettings({ currency });
  },

  updateTheme: async (theme) => {
    await get().updateSettings({ theme });
  },
}));
