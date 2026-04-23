// src/utils/constants.ts - App constants

export const TRANSACTION_CATEGORIES = [
  'salary',
  'freelance',
  'investment',
  'food',
  'transport',
  'utilities',
  'entertainment',
  'healthcare',
  'education',
  'shopping',
  'other',
] as const;

export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'] as const;

export const DEBT_TYPES = [
  'credit-card',
  'personal-loan',
  'student-loan',
  'mortgage',
  'auto-loan',
  'other',
] as const;

export const REPAYMENT_STRATEGIES = ['snowball', 'avalanche', 'equal'] as const;

export const BUDGET_MODELS = ['50-30-20', 'zero-based', 'digital-envelope', 'percentage-based'] as const;

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'] as const;

export const THEMES = ['light', 'dark', 'auto'] as const;

export const BUDGET_ALERT_THRESHOLDS = [50, 75, 90, 100] as const;

export const DEFAULT_SETTINGS = {
  currency: 'USD',
  theme: 'light' as const,
  language: 'en-US',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  decimalSeparator: '.' as const,
  thousandsSeparator: ',' as const,
  notifications: {
    budgetAlerts: true,
    debtReminders: true,
    savingsGoals: true,
    transactionNotifications: false,
    syncNotifications: true,
  },
  dataRetention: 365, // days
};

export const CATEGORY_COLORS: Record<string, string> = {
  salary: '#4CAF50',
  freelance: '#8BC34A',
  investment: '#2196F3',
  food: '#FF9800',
  transport: '#FF6F00',
  utilities: '#9C27B0',
  entertainment: '#E91E63',
  healthcare: '#F44336',
  education: '#00BCD4',
  shopping: '#FF1744',
  other: '#9E9E9E',
};

export const CATEGORY_ICONS: Record<string, string> = {
  salary: '💼',
  freelance: '🎨',
  investment: '📈',
  food: '🍔',
  transport: '🚗',
  utilities: '💡',
  entertainment: '🎬',
  healthcare: '🏥',
  education: '📚',
  shopping: '🛍️',
  other: '📌',
};

export const FEATURE_FLAGS = {
  ENABLE_CLOUD_SYNC: false,
  ENABLE_MULTI_CURRENCY: true,
  ENABLE_INVESTMENT_TRACKING: false,
  ENABLE_SAVINGS_GOALS: false,
  ENABLE_BEHAVIORAL_NUDGES: true,
};

export const API_ENDPOINTS = {
  SYNC: '/api/sync',
  BACKUP: '/api/backup',
  RESTORE: '/api/restore',
  EXPORT: '/api/export',
};
