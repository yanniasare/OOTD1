// Centralized currency formatting for Ghanaian Cedi (GHS)
// Use across the app to ensure consistent currency display

const ghFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  if (amount == null || isNaN(Number(amount))) return 'GHS 0.00';
  return ghFormatter.format(Number(amount));
}

export const CURRENCY_CODE = 'GHS';
