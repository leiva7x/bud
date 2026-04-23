// src/types/budget.ts

export type BudgetModel = '50-30-20' | 'zero-based' | 'digital-envelope' | 'percentage-based';

export interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
}

export interface Budget {
  id: string;
  model: BudgetModel;
  month: string; // YYYY-MM format
  currency: string;
  allocations: BudgetAllocation[];
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
  alerts: BudgetAlert[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAlert {
  id: string;
  category: string;
  threshold: number; // percentage
  severity: 'warning' | 'critical';
  message: string;
  triggered: boolean;
  triggeredAt?: Date;
}

export interface BudgetModel50_30_20 {
  needs: number; // 50%
  wants: number; // 30%
  savings: number; // 20%
}

export interface ZeroBasedBudget {
  categories: {
    [key: string]: {
      allocated: number;
      spent: number;
    };
  };
  totalIncome: number;
  totalAllocated: number;
  unallocated: number;
}

export interface DigitalEnvelope {
  envelopes: {
    [key: string]: {
      limit: number;
      balance: number;
      spent: number;
      transactions: string[]; // transaction IDs
    };
  };
}
