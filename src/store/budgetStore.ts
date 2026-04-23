// src/store/budgetStore.ts - Zustand store for budgets

import { create } from 'zustand';
import { Budget, BudgetAllocation } from '../types';
import {
  getAllBudgets,
  getBudgetByMonth,
  addBudget,
  updateBudget,
  deleteBudget,
} from '../services/database';
import { calculate50_30_20 } from '../utils/calculations';
import { syncService } from '../services/sync';

interface BudgetState {
  budgets: Budget[];
  currentMonth: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadBudgets: () => Promise<void>;
  getCurrentBudget: () => Budget | undefined;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  setCurrentMonth: (month: string) => void;
  generate50_30_20Budget: (income: number, month: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  loading: false,
  error: null,

  loadBudgets: async () => {
    set({ loading: true, error: null });
    try {
      const budgets = await getAllBudgets();
      set({ budgets });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load budgets' });
    } finally {
      set({ loading: false });
    }
  },

  getCurrentBudget: () => {
    const { budgets, currentMonth } = get();
    return budgets.find((b) => b.month === currentMonth);
  },

  addBudget: async (budget) => {
    try {
      const id = await addBudget(budget);
      syncService.addToQueue('create', 'budget', { ...budget, id });
      await get().loadBudgets();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add budget' });
    }
  },

  updateBudget: async (id, updates) => {
    try {
      await updateBudget(id, updates);
      syncService.addToQueue('update', 'budget', { id, ...updates });
      await get().loadBudgets();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update budget' });
    }
  },

  deleteBudget: async (id) => {
    try {
      await deleteBudget(id);
      syncService.addToQueue('delete', 'budget', { id });
      await get().loadBudgets();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete budget' });
    }
  },

  setCurrentMonth: (month) => set({ currentMonth: month }),

  generate50_30_20Budget: async (income, month) => {
    try {
      const allocation = calculate50_30_20(income);
      const allocations: BudgetAllocation[] = [
        {
          category: 'Needs',
          allocated: allocation.needs,
          spent: 0,
          percentage: 50,
        },
        {
          category: 'Wants',
          allocated: allocation.wants,
          spent: 0,
          percentage: 30,
        },
        {
          category: 'Savings',
          allocated: allocation.savings,
          spent: 0,
          percentage: 20,
        },
      ];

      const budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'> = {
        model: '50-30-20',
        month,
        currency: 'USD',
        allocations,
        totalIncome: income,
        totalAllocated: income,
        totalSpent: 0,
        alerts: [],
      };

      await get().addBudget(budget);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to generate budget' });
    }
  },
}));
