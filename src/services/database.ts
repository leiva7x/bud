import Dexie, { Table } from 'dexie';
import { Transaction } from '../types/transaction';
import { Budget } from '../types/budget';
import { Debt } from '../types/debt';

// 1. Definimos la clase de la base de datos
export class BudDatabase extends Dexie {
  // 2. Declaramos nuestras tablas y sus tipos
  transactions!: Table<Transaction>;
  budgets!: Table<Budget>;
  debts!: Table<Debt>;

  constructor() {
    super('BudDatabase'); // Nombre de la DB en el navegador

    // 3. Definimos el esquema (las tablas y sus índices)
    this.version(1).stores({
      transactions: '++id, date, category, type', // '++id' es autoincrementable
      budgets: '++id, month, model',
      debts: '++id, name, type'
    });
  }
}

// 4. Exportamos una única instancia para usarla en toda la app
export const db = new BudDatabase();
