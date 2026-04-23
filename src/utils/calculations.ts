import { Transaction } from '../types/transaction';

// Calcula el balance total (Ingresos - Gastos)
export const calculateTotalBalance = (transactions: Transaction[]) => {
  return transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);
};

// Calcula el progreso de un presupuesto
export const getBudgetProgress = (spent: number, limit: number) => {
  if (limit === 0) return 0;
  return Math.min((spent / limit) * 100, 100);
};
