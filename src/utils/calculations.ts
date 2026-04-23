// src/utils/calculations.ts - Financial calculations

import { Transaction, Debt, DebtProjection, DebtPaymentMonth } from '../types';

// Debt calculations
export function calculateDebtPayoffDate(
  balance: number,
  monthlyPayment: number,
  annualInterestRate: number
): Date {
  const monthlyRate = annualInterestRate / 100 / 12;
  let remainingBalance = balance;
  let months = 0;

  while (remainingBalance > 0 && months < 600) { // max 50 years
    const interestCharge = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestCharge;

    if (principalPayment <= 0) {
      return new Date(); // Payment insufficient
    }

    remainingBalance -= principalPayment;
    months++;
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);
  return payoffDate;
}

export function calculateDebtProjection(
  debt: Debt,
  monthlyPayment: number,
  extraPayment: number = 0
): DebtPaymentMonth[] {
  const monthlyRate = debt.interestRate / 100 / 12;
  let remainingBalance = debt.currentBalance;
  const timeline: DebtPaymentMonth[] = [];
  let month = 0;

  while (remainingBalance > 0 && month < 600) {
    const interestPaid = remainingBalance * monthlyRate;
    const totalPayment = monthlyPayment + extraPayment;
    const principalPaid = Math.min(totalPayment - interestPaid, remainingBalance);

    remainingBalance -= principalPaid;

    timeline.push({
      month: month + 1,
      principalPaid,
      interestPaid,
      balanceRemaining: Math.max(0, remainingBalance),
      totalPayment: principalPaid + interestPaid,
    });

    month++;
  }

  return timeline;
}

export function calculateSnowballStrategy(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => a.currentBalance - b.currentBalance);
}

export function calculateAvalancheStrategy(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => b.interestRate - a.interestRate);
}

export function calculateTotalInterest(timeline: DebtPaymentMonth[]): number {
  return timeline.reduce((sum, month) => sum + month.interestPaid, 0);
}

// Budget calculations
export function calculateBudgetPercentage(spent: number, allocated: number): number {
  if (allocated === 0) return 0;
  return (spent / allocated) * 100;
}

export function calculateRemainingBudget(allocated: number, spent: number): number {
  return Math.max(0, allocated - spent);
}

export function calculate50_30_20(income: number): { needs: number; wants: number; savings: number } {
  return {
    needs: income * 0.5,
    wants: income * 0.3,
    savings: income * 0.2,
  };
}

// Transaction calculations
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateNetBalance(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

export function calculateAverageTransaction(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return total / transactions.length;
}

export function groupTransactionsByCategory(transactions: Transaction[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  transactions.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });
  return grouped;
}

export function groupTransactionsByMonth(transactions: Transaction[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  transactions.forEach((t) => {
    const month = t.date.toISOString().slice(0, 7); // YYYY-MM
    grouped[month] = (grouped[month] || 0) + t.amount;
  });
  return grouped;
}
