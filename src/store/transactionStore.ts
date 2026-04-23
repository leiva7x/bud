import { create } from 'zustand';
import { Transaction } from '../types/transaction';
import { db } from '../services/database';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  loadTransactions: async () => {
    set({ isLoading: true });
    const data = await db.transactions.toArray();
    set({ transactions: data, isLoading: false });
  },

  addTransaction: async (transactionData) => {
    const id = await db.transactions.add(transactionData as Transaction);
    const newTransaction = { ...transactionData, id } as Transaction;
    set({ transactions: [newTransaction, ...get().transactions] });
  },

  deleteTransaction: async (id) => {
    await db.transactions.delete(id);
    set({ transactions: get().transactions.filter(t => t.id !== id) });
  },
}));
