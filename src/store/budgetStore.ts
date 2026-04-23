import { create } from 'zustand';
import { Budget } from '../types/budget';
import { db } from '../services/database';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  loadBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: number, budget: Partial<Budget>) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,

  loadBudgets: async () => {
    set({ isLoading: true });
    const data = await db.budgets.toArray();
    set({ budgets: data, isLoading: false });
  },

  addBudget: async (budgetData) => {
    const id = await db.budgets.add(budgetData as Budget);
    const newBudget = { ...budgetData, id } as Budget;
    set({ budgets: [...get().budgets, newBudget] });
  },

  updateBudget: async (id, updates) => {
    await db.budgets.update(id, updates);
    set({
      budgets: get().budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  },
}));
