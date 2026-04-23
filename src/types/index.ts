// src/types/index.ts - Type definitions

export * from './transaction';
export * from './budget';
export * from './debt';
export * from './user';

export interface AppState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  error: string | null;
}
