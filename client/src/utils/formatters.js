/**
 * Format numeric value as USD currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format ISO date string to human-readable format e.g. "Sep 21, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Format ISO date string to YYYY-MM-DD for HTML5 date input
 */
export const formatInputDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Color metadata per category for visual badges & charts
 */
export const CATEGORY_COLORS = {
  Food: '#f97316',          // Orange
  Shopping: '#ec4899',      // Pink
  Transportation: '#3b82f6',// Blue
  Bills: '#ef4444',         // Red
  Entertainment: '#8b5cf6', // Purple
  Education: '#06b6d4',     // Cyan
  Healthcare: '#10b981',    // Emerald
  Salary: '#22c55e',        // Green
  Freelance: '#14b8a6',     // Teal
  Business: '#6366f1',      // Indigo
  Other: '#64748b',         // Slate
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#64748b';
};
