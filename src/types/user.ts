// src/types/user.ts

export interface UserSettings {
  userId: string;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.';
  notifications: NotificationSettings;
  dataRetention: number; // days
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  debtReminders: boolean;
  savingsGoals: boolean;
  transactionNotifications: boolean;
  syncNotifications: boolean;
}

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  settings: UserSettings;
  synced?: boolean;
}

export interface BackupData {
  version: string;
  timestamp: Date;
  userId: string;
  data: {
    transactions: any[];
    budgets: any[];
    debts: any[];
    settings: UserSettings;
  };
}
