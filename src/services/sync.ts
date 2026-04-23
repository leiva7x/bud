// src/services/sync.ts - Offline sync management

import { storage } from './storage';

interface SyncQueue {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'transaction' | 'budget' | 'debt';
  data: any;
  timestamp: number;
  synced: boolean;
}

export class SyncService {
  private queueKey = 'sync_queue';

  addToQueue(action: SyncQueue['action'], entityType: SyncQueue['entityType'], data: any): void {
    const queue = this.getQueue();
    const item: SyncQueue = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      entityType,
      data,
      timestamp: Date.now(),
      synced: false,
    };
    queue.push(item);
    storage.set(this.queueKey, queue);
  }

  getQueue(): SyncQueue[] {
    return storage.get<SyncQueue[]>(this.queueKey) || [];
  }

  getPendingQueue(): SyncQueue[] {
    return this.getQueue().filter((item) => !item.synced);
  }

  markAsSynced(id: string): void {
    const queue = this.getQueue();
    const item = queue.find((item) => item.id === id);
    if (item) {
      item.synced = true;
      storage.set(this.queueKey, queue);
    }
  }

  clearSyncedItems(): void {
    const queue = this.getQueue().filter((item) => !item.synced);
    storage.set(this.queueKey, queue);
  }

  clearQueue(): void {
    storage.remove(this.queueKey);
  }

  getSyncStatus(): { pending: number; synced: number; total: number } {
    const queue = this.getQueue();
    const synced = queue.filter((item) => item.synced).length;
    return {
      pending: queue.filter((item) => !item.synced).length,
      synced,
      total: queue.length,
    };
  }
}

export const syncService = new SyncService();

// Online/Offline detection
export class OfflineDetector {
  private isOnlineKey = 'is_online';
  private listeners: Set<(isOnline: boolean) => void> = new Set();

  constructor() {
    window.addEventListener('online', () => this.setOnline(true));
    window.addEventListener('offline', () => this.setOnline(false));
    this.setOnline(navigator.onLine);
  }

  private setOnline(isOnline: boolean): void {
    storage.set(this.isOnlineKey, isOnline);
    this.notify(isOnline);
  }

  private notify(isOnline: boolean): void {
    this.listeners.forEach((listener) => listener(isOnline));
  }

  isOnline(): boolean {
    return storage.get<boolean>(this.isOnlineKey) ?? navigator.onLine;
  }

  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const offlineDetector = new OfflineDetector();
