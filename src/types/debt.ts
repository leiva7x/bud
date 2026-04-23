// src/types/debt.ts

export type DebtType = 'credit-card' | 'personal-loan' | 'student-loan' | 'mortgage' | 'auto-loan' | 'other';
export type RepaymentStrategy = 'snowball' | 'avalanche' | 'equal';

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  originalAmount: number;
  currentBalance: number;
  interestRate: number; // annual percentage
  minimumPayment: number;
  monthlyPayment: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtPaymentPlan {
  debtId: string;
  strategy: RepaymentStrategy;
  monthlyPayment: number;
  extraPayment: number;
  projectedPayoffDate: Date;
  totalInterestPaid: number;
  monthlyBreakdown: DebtPaymentMonth[];
}

export interface DebtPaymentMonth {
  month: number;
  principalPaid: number;
  interestPaid: number;
  balanceRemaining: number;
  totalPayment: number;
}

export interface DebtProjection {
  currentDebt: Debt[];
  totalDebt: number;
  totalMonthlyPayment: number;
  strategy: RepaymentStrategy;
  projectedFreedomDate: Date;
  totalInterestIfMinimum: number;
  totalInterestWithExtraPayment: number;
  interestSavings: number;
  monthsToFreedom: number;
  timeline: DebtPaymentMonth[];
}

export interface HybridDebtSimulator {
  scenarios: DebtScenario[];
  selectedScenario: string;
}

export interface DebtScenario {
  id: string;
  name: string;
  strategy: RepaymentStrategy;
  monthlyPayment: number;
  extraPayment: number;
  startDate: Date;
  projections: DebtProjection;
}
