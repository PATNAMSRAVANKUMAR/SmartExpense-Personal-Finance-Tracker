import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for clear error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(message));
  }
);

export const transactionService = {
  // Fetch transactions with query parameters (search, type, category, startDate, endDate, sort)
  getAll: (params = {}) => api.get('/transactions', { params }),

  // Get single transaction
  getById: (id) => api.get(`/transactions/${id}`),

  // Create new transaction
  create: (data) => api.post('/transactions', data),

  // Update transaction
  update: (id, data) => api.put(`/transactions/${id}`, data),

  // Delete transaction
  delete: (id) => api.delete(`/transactions/${id}`),

  // Get summary and analytics
  getSummary: () => api.get('/transactions/summary'),

  // Get predefined categories
  getCategories: () => api.get('/transactions/categories'),
};

export default api;
