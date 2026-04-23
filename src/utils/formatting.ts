import { format } from 'date-fns';

// Convierte un número a moneda (ej: 1000 -> $1,000.00)
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Formatea fechas de forma consistente
export const formatDate = (date: Date | number, pattern = 'MMM dd, yyyy') => {
  return format(date, pattern);
};

// Convierte a porcentaje (ej: 0.5 -> 50%)
export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};
