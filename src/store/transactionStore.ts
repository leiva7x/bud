// src/store/transactionStore.ts - Zustand store for transactions

import { create } from 'zustand';
import { Transaction, TransactionFilter, TransactionSummary } from '../types';
import {
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
  getTransactionsByCategory,
} from '../services/database';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  groupTransactionsByCategory,
} from '../utils/calculations';
import { syncService } from '../services/sync';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filter: TransactionFilter | null;
  
  // Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilter: (filter: TransactionFilter | null) => void;
  getFilteredTransactions: () => Transaction[];
  getSummary: () => TransactionSummary;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  filter: null,

  loadTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const transactions = await getAllTransactions();
      set({ transactions });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load transactions' });
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      const id = await addTransaction(transaction);
      syncService.addToQueue('create', 'transaction', { ...transaction, id });
      await get().loadTransactions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add transaction' });
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      await updateTransaction(id, updates);
      syncService.addToQueue('update', 'transaction', { id, ...updates });
      await get().loadTransactions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update transaction' });
    }
  },

  deleteTransaction: async (id) => {
    try {
      await deleteTransaction(id);
      syncService.addToQueue('delete', 'transaction', { id });
      await get().loadTransactions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete transaction' });
    }
  },

  setFilter: (filter) => set({ filter }),

  getFilteredTransactions: () => {
    const { transactions, filter } = get();
    if (!filter) return transactions;

    return transactions.filter((t) => {
      if (filter.startDate && t.date < filter.startDate) return false;
      if (filter.endDate && t.date > filter.endDate) return false;
      if (filter.category && t.category !== filter.category) return false;
      if (filter.type && t.type !== filter.type) return false;
      if (filter.minAmount && t.amount < filter.minAmount) return false;
      if (filter.maxAmount && t.amount > filter.maxAmount) return false;
      if (filter.searchText && !t.description.toLowerCase().includes(filter.searchText.toLowerCase())) return false;
      return true;
    });
  },

  getSummary: () => {
    const transactions = get().getFilteredTransactions();
    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    const netBalance = calculateNetBalance(transactions);
    const byCategory = groupTransactionsByCategory(transactions);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      byCategory,
      transactionCount: transactions.length,
    };
  },
}));
