// src/store/debtStore.ts - Zustand store for debts

import { create } from 'zustand';
import { Debt, DebtScenario, DebtProjection } from '../types';
import {
  getAllDebts,
  addDebt,
  updateDebt,
  deleteDebt,
} from '../services/database';
import {
  calculateDebtProjection,
  calculateSnowballStrategy,
  calculateAvalancheStrategy,
  calculateTotalInterest,
  calculateDebtPayoffDate,
} from '../utils/calculations';
import { syncService } from '../services/sync';

interface DebtState {
  debts: Debt[];
  scenarios: DebtScenario[];
  loading: boolean;
  error: string | null;

  // Actions
  loadDebts: () => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  createSnowballScenario: (name: string, monthlyPayment: number, extraPayment: number) => void;
  createAvalancheScenario: (name: string, monthlyPayment: number, extraPayment: number) => void;
  getProjectedFreedomDate: () => Date | null;
  getTotalDebt: () => number;
}

export const useDebtStore = create<DebtState>((set, get) => ({
  debts: [],
  scenarios: [],
  loading: false,
  error: null,

  loadDebts: async () => {
    set({ loading: true, error: null });
    try {
      const debts = await getAllDebts();
      set({ debts });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load debts' });
    } finally {
      set({ loading: false });
    }
  },

  addDebt: async (debt) => {
    try {
      const id = await addDebt(debt);
      syncService.addToQueue('create', 'debt', { ...debt, id });
      await get().loadDebts();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add debt' });
    }
  },

  updateDebt: async (id, updates) => {
    try {
      await updateDebt(id, updates);
      syncService.addToQueue('update', 'debt', { id, ...updates });
      await get().loadDebts();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update debt' });
    }
  },

  deleteDebt: async (id) => {
    try {
      await deleteDebt(id);
      syncService.addToQueue('delete', 'debt', { id });
      await get().loadDebts();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete debt' });
    }
  },

  createSnowballScenario: (name, monthlyPayment, extraPayment) => {
    try {
      const debts = calculateSnowballStrategy(get().debts);
      const timeline: any[] = [];
      
      debts.forEach((debt) => {
        const projection = calculateDebtProjection(debt, monthlyPayment, extraPayment);
        timeline.push(...projection);
      });

      const scenario: DebtScenario = {
        id: `snowball-${Date.now()}`,
        name,
        strategy: 'snowball',
        monthlyPayment,
        extraPayment,
        startDate: new Date(),
        projections: {
          currentDebt: debts,
          totalDebt: debts.reduce((sum, d) => sum + d.currentBalance, 0),
          totalMonthlyPayment: monthlyPayment + extraPayment,
          strategy: 'snowball',
          projectedFreedomDate: new Date(Date.now() + timeline.length * 30 * 24 * 60 * 60 * 1000),
          totalInterestIfMinimum: 0,
          totalInterestWithExtraPayment: calculateTotalInterest(timeline),
          interestSavings: 0,
          monthsToFreedom: timeline.length,
          timeline,
        },
      };

      set((state) => ({ scenarios: [...state.scenarios, scenario] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create scenario' });
    }
  },

  createAvalancheScenario: (name, monthlyPayment, extraPayment) => {
    try {
      const debts = calculateAvalancheStrategy(get().debts);
      const timeline: any[] = [];

      debts.forEach((debt) => {
        const projection = calculateDebtProjection(debt, monthlyPayment, extraPayment);
        timeline.push(...projection);
      });

      const scenario: DebtScenario = {
        id: `avalanche-${Date.now()}`,
        name,
        strategy: 'avalanche',
        monthlyPayment,
        extraPayment,
        startDate: new Date(),
        projections: {
          currentDebt: debts,
          totalDebt: debts.reduce((sum, d) => sum + d.currentBalance, 0),
          totalMonthlyPayment: monthlyPayment + extraPayment,
          strategy: 'avalanche',
          projectedFreedomDate: new Date(Date.now() + timeline.length * 30 * 24 * 60 * 60 * 1000),
          totalInterestIfMinimum: 0,
          totalInterestWithExtraPayment: calculateTotalInterest(timeline),
          interestSavings: 0,
          monthsToFreedom: timeline.length,
          timeline,
        },
      };

      set((state) => ({ scenarios: [...state.scenarios, scenario] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create scenario' });
    }
  },

  getProjectedFreedomDate: () => {
    const scenarios = get().scenarios;
    if (scenarios.length === 0) return null;
    return scenarios[0].projections.projectedFreedomDate;
  },

  getTotalDebt: () => {
    return get().debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  },
}));
