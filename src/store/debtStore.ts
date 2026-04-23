import { create } from 'zustand';
import { Debt } from '../types/debt';
import { db } from '../services/database';

interface DebtState {
  debts: Debt[];
  isLoading: boolean;
  loadDebts: () => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id'>) => Promise<void>;
  deleteDebt: (id: number) => Promise<void>;
}

export const useDebtStore = create<DebtState>((set, get) => ({
  debts: [],
  isLoading: false,

  loadDebts: async () => {
    set({ isLoading: true });
    const data = await db.debts.toArray();
    set({ debts: data, isLoading: false });
  },

  addDebt: async (debtData) => {
    const id = await db.debts.add(debtData as Debt);
    const newDebt = { ...debtData, id } as Debt;
    set({ debts: [...get().debts, newDebt] });
  },

  deleteDebt: async (id) => {
    await db.debts.delete(id);
    set({ debts: get().debts.filter((d) => d.id !== id) });
  },
}));
