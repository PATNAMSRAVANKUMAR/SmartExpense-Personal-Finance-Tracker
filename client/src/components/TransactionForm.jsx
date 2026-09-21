import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { formatInputDate } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Save, ArrowLeft, AlertCircle } from 'lucide-react';

const TransactionForm = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const { categories, addTransaction, updateTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'Expense',
    category: '',
    date: formatInputDate(new Date()),
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? initialData.amount.toString() : '',
        type: initialData.type || 'Expense',
        category: initialData.category || '',
        date: formatInputDate(initialData.date),
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  // Determine available categories based on currently selected type
  const availableCategories =
    formData.type === 'Income' ? categories.income : categories.expense;

  // Set default category if not selected or invalid for current type
  useEffect(() => {
    if (!formData.category || !availableCategories.includes(formData.category)) {
      if (availableCategories.length > 0) {
        setFormData((prev) => ({ ...prev, category: availableCategories[0] }));
      }
    }
  }, [formData.type, availableCategories]);

  // Client-side validation
  const validate = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      errs.title = 'Title cannot exceed 100 characters';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount)) {
      errs.amount = 'Please enter a valid numeric amount';
    } else if (numAmount <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }

    if (!formData.type || !['Income', 'Expense'].includes(formData.type)) {
      errs.type = 'Please select either Income or Expense';
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
    }

    if (!formData.date) {
      errs.date = 'Please select a valid date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error upon typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => {
      const newCategories = newType === 'Income' ? categories.income : categories.expense;
      return {
        ...prev,
        type: newType,
        category: newCategories[0] || '',
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        description: formData.description.trim(),
      };

      if (isEdit && initialData?._id) {
        await updateTransaction(initialData._id, payload);
      } else {
        await addTransaction(payload);
      }

      navigate('/transactions');
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Segmented Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Transaction Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleTypeChange('Expense')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              formData.type === 'Expense'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className={`p-1 rounded-lg ${formData.type === 'Expense' ? 'bg-rose-50' : ''}`}>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('Income')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              formData.type === 'Income'
                ? 'bg-white text-teal-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className={`p-1 rounded-lg ${formData.type === 'Income' ? 'bg-teal-50' : ''}`}>
              <ArrowUpRight className="w-4 h-4 text-teal-600" />
            </div>
            <span>Income</span>
          </button>
        </div>
        {errors.type && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.type}
          </p>
        )}
      </div>

      {/* Grid: Title & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Title / Payee <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder={formData.type === 'Income' ? 'e.g., Client Invoice, Monthly Salary' : 'e.g., Grocery Store, Coffee, Rent'}
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
              errors.title
                ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400 focus:border-rose-400'
                : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Amount ($) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
              $
            </span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                errors.amount
                  ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400 focus:border-rose-400'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.amount}
            </p>
          )}
        </div>
      </div>

      {/* Grid: Category & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-white transition-all cursor-pointer ${
              errors.category
                ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
            }`}
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              errors.date
                ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
            }`}
          />
          {errors.date && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
            </p>
          )}
        </div>
      </div>

      {/* Description / Notes (Optional) */}
      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Description / Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Add any extra notes or memo for this transaction..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Form Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEdit ? 'Update Transaction' : 'Save Transaction'}</span>
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
