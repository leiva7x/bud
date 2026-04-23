// src/services/storage.ts - Local storage wrapper

interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

export class LocalStorageService {
  private prefix = 'bud_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T, expirationMinutes?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
      };

      if (expirationMinutes) {
        item.expiresAt = Date.now() + expirationMinutes * 60 * 1000;
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;

      const item: StorageItem<T> = JSON.parse(stored);

      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }

  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
      return keys;
    } catch (error) {
      console.error(`Error getting all keys from localStorage:`, error);
      return [];
    }
  }
}

export const storage = new LocalStorageService();
