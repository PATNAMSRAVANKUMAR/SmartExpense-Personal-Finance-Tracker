import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/api';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    categoryExpenses: [],
    monthlySummary: [],
    recentTransactions: [],
  });
  const [categories, setCategories] = useState({
    expense: ['Food', 'Shopping', 'Transportation', 'Bills', 'Entertainment', 'Education', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Business', 'Other'],
    all: [],
  });
  const [filters, setFiltersState] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sort: 'newest',
  });
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Fetch summary analytics
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await transactionService.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load summary:', err.message);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch transactions with current filters
  const fetchTransactions = useCallback(async (customFilters = null) => {
    setLoading(true);
    try {
      const activeFilters = customFilters || filters;
      const res = await transactionService.getAll(activeFilters);
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err.message);
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await transactionService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err.message);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchSummary();
  }, [fetchCategories, fetchSummary]);

  // Refetch transactions whenever filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Update filters
  const setFilters = (updater) => {
    setFiltersState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return updated;
    });
  };

  const resetFilters = () => {
    setFiltersState({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      sort: 'newest',
    });
  };

  // Add transaction
  const addTransaction = async (txData) => {
    try {
      const res = await transactionService.create(txData);
      showNotification('success', 'Transaction added successfully!');
      // Refresh list & calculations automatically
      await Promise.all([fetchTransactions(), fetchSummary()]);
      return res.data;
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (id, txData) => {
    try {
      const res = await transactionService.update(id, txData);
      showNotification('success', 'Transaction updated successfully!');
      // Refresh list & calculations automatically
      await Promise.all([fetchTransactions(), fetchSummary()]);
      return res.data;
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      showNotification('success', 'Transaction deleted successfully!');
      // Refresh list & calculations automatically
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      showNotification('error', err.message);
      throw err;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        categories,
        filters,
        loading,
        summaryLoading,
        notification,
        showNotification,
        closeNotification,
        setFilters,
        resetFilters,
        fetchTransactions,
        fetchSummary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
