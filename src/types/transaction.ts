// src/types/transaction.ts

export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory = 
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'shopping'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
}

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  category?: TransactionCategory;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  byCategory: Record<TransactionCategory, number>;
  transactionCount: number;
}
