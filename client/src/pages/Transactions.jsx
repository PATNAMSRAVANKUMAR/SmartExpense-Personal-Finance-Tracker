import React from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import TransactionTable from '../components/TransactionTable';
import { PlusCircle, Download, RotateCcw, ArrowUpDown, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Transactions = () => {
  const {
    transactions,
    categories,
    filters,
    setFilters,
    resetFilters,
    loading,
    deleteTransaction,
  } = useTransactions();

  // Export current list to CSV
  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;

    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Description'];
    const rows = transactions.map((t) => [
      t._id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      `"${t.category}"`,
      `"${formatDate(t.date)}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartexpense_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine available categories based on currently filtered type
  const availableCategories =
    filters.type === 'Income'
      ? categories.income
      : filters.type === 'Expense'
      ? categories.expense
      : categories.all && categories.all.length > 0
      ? categories.all
      : [...categories.expense, ...categories.income];

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.type) ||
    Boolean(filters.category) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.sort !== 'newest';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, filter, and organize all your financial records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </Link>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <SearchBar
            value={filters.search}
            onChange={(val) => setFilters({ search: val })}
          />

          {/* Type Toggle Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {['', 'Income', 'Expense'].map((typeOption) => (
              <button
                key={typeOption || 'all'}
                type="button"
                onClick={() => setFilters({ type: typeOption, category: '' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.type === typeOption
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {typeOption === '' ? 'All Types' : typeOption}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <CategoryFilter
            value={filters.category}
            onChange={(val) => setFilters({ category: val })}
            categories={availableCategories}
            currentType={filters.type}
          />
        </div>

        {/* Second Row: Date Filters, Sort, and Reset */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Start Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">From:</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ startDate: e.target.value })}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">To:</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ endDate: e.target.value })}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 ml-auto sm:ml-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value })}
              className="bg-transparent text-slate-800 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="ml-auto text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{transactions.length}</strong> transactions
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        onDelete={deleteTransaction}
      />
    </div>
  );
};

export default Transactions;
