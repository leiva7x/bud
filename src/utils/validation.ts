// src/utils/validation.ts - Form and data validation

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateAmount(amount: any): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

export function validateCurrency(currency: string): boolean {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  return validCurrencies.includes(currency.toUpperCase());
}

export function validateDate(date: any): boolean {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function validateInterestRate(rate: any): boolean {
  const num = parseFloat(rate);
  return !isNaN(num) && num >= 0 && num <= 100;
}

export function validateMonth(month: string): boolean {
  return /^\d{4}-\d{2}$/.test(month);
}

export function validatePositiveNumber(value: any): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateTransactionForm(data: {
  amount?: any;
  category?: string;
  type?: string;
  description?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateAmount(data.amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount must be a positive number',
    });
  }

  if (!data.category || data.category.trim() === '') {
    errors.push({
      field: 'category',
      message: 'Category is required',
    });
  }

  if (!data.type || !['income', 'expense', 'transfer'].includes(data.type)) {
    errors.push({
      field: 'type',
      message: 'Valid transaction type is required',
    });
  }

  if (!data.description || data.description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  }

  return errors;
}

export function validateBudgetForm(data: {
  totalIncome?: any;
  allocations?: any[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateAmount(data.totalIncome)) {
    errors.push({
      field: 'totalIncome',
      message: 'Total income must be a positive number',
    });
  }

  if (!Array.isArray(data.allocations) || data.allocations.length === 0) {
    errors.push({
      field: 'allocations',
      message: 'At least one allocation is required',
    });
  }

  return errors;
}

export function validateDebtForm(data: {
  name?: string;
  originalAmount?: any;
  interestRate?: any;
  minimumPayment?: any;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Debt name is required',
    });
  }

  if (!validateAmount(data.originalAmount)) {
    errors.push({
      field: 'originalAmount',
      message: 'Original amount must be a positive number',
    });
  }

  if (!validateInterestRate(data.interestRate)) {
    errors.push({
      field: 'interestRate',
      message: 'Interest rate must be between 0 and 100',
    });
  }

  if (!validateAmount(data.minimumPayment)) {
    errors.push({
      field: 'minimumPayment',
      message: 'Minimum payment must be a positive number',
    });
  }

  return errors;
}
