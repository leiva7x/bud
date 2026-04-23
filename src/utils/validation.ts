export const validateAmount = (amount: number): string | null => {
  if (amount <= 0) return 'Amount must be greater than zero';
  if (isNaN(amount)) return 'Invalid amount';
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};
