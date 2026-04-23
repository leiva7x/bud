// src/services/database.ts - Dexie database setup

import Dexie, { Table } from 'dexie';
import { Transaction, Budget, Debt, UserSettings } from '../types';

export class FinanceDB extends Dexie {
  transactions!: Table<Transaction>;
  budgets!: Table<Budget>;
  debts!: Table<Debt>;
  settings!: Table<UserSettings>;

  constructor() {
    super('BudgetDB');
    this.version(1).stores({
      transactions: '++id, date, category, type',
      budgets: '++id, month',
      debts: '++id, type',
      settings: 'userId',
    });
  }
}

export const db = new FinanceDB();

// Transaction queries
export async function getAllTransactions(): Promise<Transaction[]> {
  return db.transactions.toArray();
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.transactions.add({
    ...transaction,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Transaction);
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<number> {
  return db.transactions.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  return db.transactions.delete(id);
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
  return db.transactions
    .where('date')
    .between(startDate, endDate)
    .toArray();
}

export async function getTransactionsByCategory(category: string): Promise<Transaction[]> {
  return db.transactions.where('category').equals(category).toArray();
}

// Budget queries
export async function getAllBudgets(): Promise<Budget[]> {
  return db.budgets.toArray();
}

export async function getBudgetByMonth(month: string): Promise<Budget | undefined> {
  return db.budgets.where('month').equals(month).first();
}

export async function addBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.budgets.add({
    ...budget,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Budget);
}

export async function updateBudget(id: string, updates: Partial<Budget>): Promise<number> {
  return db.budgets.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteBudget(id: string): Promise<void> {
  return db.budgets.delete(id);
}

// Debt queries
export async function getAllDebts(): Promise<Debt[]> {
  return db.debts.toArray();
}

export async function addDebt(debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  return db.debts.add({
    ...debt,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Debt);
}

export async function updateDebt(id: string, updates: Partial<Debt>): Promise<number> {
  return db.debts.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteDebt(id: string): Promise<void> {
  return db.debts.delete(id);
}

// Settings queries
export async function getSettings(userId: string): Promise<UserSettings | undefined> {
  return db.settings.where('userId').equals(userId).first();
}

export async function saveSettings(settings: UserSettings): Promise<string> {
  const existing = await db.settings.where('userId').equals(settings.userId).first();
  if (existing) {
    return db.settings.update(settings.userId, settings);
  }
  return db.settings.add(settings);
}

// Bulk operations
export async function clearAllData(): Promise<void> {
  await db.transactions.clear();
  await db.budgets.clear();
  await db.debts.clear();
}

export async function exportData(): Promise<object> {
  return {
    transactions: await db.transactions.toArray(),
    budgets: await db.budgets.toArray(),
    debts: await db.debts.toArray(),
    settings: await db.settings.toArray(),
    exportedAt: new Date(),
  };
}

export async function importData(data: any): Promise<void> {
  try {
    if (data.transactions) {
      await db.transactions.bulkAdd(data.transactions);
    }
    if (data.budgets) {
      await db.budgets.bulkAdd(data.budgets);
    }
    if (data.debts) {
      await db.debts.bulkAdd(data.debts);
    }
    if (data.settings) {
      for (const setting of data.settings) {
        await saveSettings(setting);
      }
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
