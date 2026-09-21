import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3500, // Quick timeout so fallback activates instantly on static hosts like GitHub Pages
});

// Default sample data for offline/static GitHub Pages demo
const DEFAULT_SAMPLE_DATA = [
  {
    _id: '66ef71a2b1c3d4e5f6000001',
    title: 'Monthly Tech Salary',
    amount: 5200.00,
    type: 'Income',
    category: 'Salary',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    description: 'Direct deposit monthly engineering salary'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000002',
    title: 'UI/UX Freelance Project',
    amount: 1450.00,
    type: 'Income',
    category: 'Freelance',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    description: 'Landing page redesign milestone payout'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000003',
    title: 'Whole Foods Grocery Run',
    amount: 142.50,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description: 'Weekly organic groceries, vegetables, and pantry items'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000004',
    title: 'Apartment Rent & Water',
    amount: 1650.00,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    description: 'Monthly apartment rent lease payment'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000005',
    title: 'High-Speed Internet Fiber',
    amount: 79.99,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    description: 'Gigabit fiber optic home connection'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000006',
    title: 'Gas & EV Fast Charging',
    amount: 54.20,
    type: 'Expense',
    category: 'Transportation',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    description: 'Commute fuel and highway toll reload'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000007',
    title: 'Dinner at Italian Bistro',
    amount: 86.40,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    description: 'Weekend family dinner'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000008',
    title: 'Online Course & Books',
    amount: 65.00,
    type: 'Expense',
    category: 'Education',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    description: 'Cloud Architecture certification preparation'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000009',
    title: 'Weekend Cinema & Streaming',
    amount: 45.00,
    type: 'Expense',
    category: 'Entertainment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    description: 'Movie tickets and quarterly streaming renewal'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000010',
    title: 'Ergonomic Chair Upgrade',
    amount: 289.00,
    type: 'Expense',
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    description: 'Home office desk chair for posture support'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000011',
    title: 'Prescription & Vitamins',
    amount: 38.50,
    type: 'Expense',
    category: 'Healthcare',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    description: 'Monthly vitamins and prescription refill'
  },
  {
    _id: '66ef71a2b1c3d4e5f6000012',
    title: 'E-commerce Affiliate Commission',
    amount: 320.00,
    type: 'Income',
    category: 'Business',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    description: 'Monthly digital affiliate sales payout'
  }
];

const LOCAL_STORAGE_KEY = 'smartexpense_transactions';

const getLocalTransactions = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_DATA));
      return [...DEFAULT_SAMPLE_DATA];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [...DEFAULT_SAMPLE_DATA];
  }
};

const saveLocalTransactions = (data) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const EXPENSE_CATEGORIES = [
  'Food', 'Shopping', 'Transportation', 'Bills', 'Entertainment', 'Education', 'Healthcare', 'Other'
];
const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Other'
];

/**
 * Client-side calculations for offline / GitHub Pages mode
 */
const calculateLocalSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryExpensesMap = {};
  const monthlyMap = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount);
    const txDate = new Date(tx.date);
    const monthYear = txDate.toLocaleString('default', { month: 'short', year: 'numeric' });

    if (!monthlyMap[monthYear]) {
      monthlyMap[monthYear] = {
        month: monthYear,
        income: 0,
        expenses: 0,
        timestamp: new Date(txDate.getFullYear(), txDate.getMonth(), 1).getTime(),
      };
    }

    if (tx.type === 'Income') {
      totalIncome += amount;
      monthlyMap[monthYear].income += amount;
    } else if (tx.type === 'Expense') {
      totalExpenses += amount;
      categoryExpensesMap[tx.category] = (categoryExpensesMap[tx.category] || 0) + amount;
      monthlyMap[monthYear].expenses += amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  const categoryExpenses = Object.entries(categoryExpensesMap).map(([category, amount]) => ({
    category,
    amount: Math.round(amount * 100) / 100,
    percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);

  const monthlySummary = Object.values(monthlyMap)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ month, income, expenses }) => ({
      month,
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      net: Math.round((income - expenses) * 100) / 100,
    }));

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    balance: Math.round(balance * 100) / 100,
    transactionCount: transactions.length,
    categoryExpenses,
    monthlySummary,
    recentTransactions,
  };
};

/**
 * Exported transactionService:
 * Connects to live Express REST backend first.
 * If backend is unavailable (e.g. static GitHub Pages), seamlessly falls back
 * to in-browser localStorage database with all 12 realistic sample transactions!
 */
export const transactionService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/transactions', { params });
      return res.data;
    } catch (err) {
      console.info('📡 Backend unavailable, serving from local store (GitHub Pages / Offline mode)');
      let list = getLocalTransactions();

      if (params.type && ['Income', 'Expense'].includes(params.type)) {
        list = list.filter((t) => t.type === params.type);
      }
      if (params.category) {
        list = list.filter((t) => t.category === params.category);
      }
      if (params.startDate) {
        list = list.filter((t) => new Date(t.date) >= new Date(params.startDate));
      }
      if (params.endDate) {
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter((t) => new Date(t.date) <= end);
      }
      if (params.search && params.search.trim()) {
        const q = params.search.trim().toLowerCase();
        list = list.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }

      if (params.sort === 'oldest') {
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (params.sort === 'amount-high') {
        list.sort((a, b) => b.amount - a.amount);
      } else if (params.sort === 'amount-low') {
        list.sort((a, b) => a.amount - b.amount);
      } else {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      return { success: true, count: list.length, data: list };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/transactions/${id}`);
      return res.data;
    } catch (err) {
      const list = getLocalTransactions();
      const item = list.find((t) => String(t._id) === String(id));
      if (!item) throw new Error('Transaction not found');
      return { success: true, data: item };
    }
  },

  create: async (data) => {
    try {
      const res = await api.post('/transactions', data);
      return res.data;
    } catch (err) {
      const list = getLocalTransactions();
      const newDoc = {
        _id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newDoc);
      saveLocalTransactions(list);
      return { success: true, data: newDoc, message: 'Transaction created successfully' };
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/transactions/${id}`, data);
      return res.data;
    } catch (err) {
      const list = getLocalTransactions();
      const index = list.findIndex((t) => String(t._id) === String(id));
      if (index === -1) throw new Error('Transaction not found');
      const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() };
      list[index] = updated;
      saveLocalTransactions(list);
      return { success: true, data: updated, message: 'Transaction updated successfully' };
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/transactions/${id}`);
      return res.data;
    } catch (err) {
      let list = getLocalTransactions();
      list = list.filter((t) => String(t._id) !== String(id));
      saveLocalTransactions(list);
      return { success: true, message: 'Transaction deleted successfully' };
    }
  },

  getSummary: async () => {
    try {
      const res = await api.get('/transactions/summary');
      return res.data;
    } catch (err) {
      const list = getLocalTransactions();
      return { success: true, data: calculateLocalSummary(list) };
    }
  },

  getCategories: async () => {
    try {
      const res = await api.get('/transactions/categories');
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: {
          expense: EXPENSE_CATEGORIES,
          income: INCOME_CATEGORIES,
          all: [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES],
        },
      };
    }
  },
};

export default api;
