import React from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import SummaryCards from '../components/SummaryCards';
import ExpenseCategoryChart from '../components/Charts/ExpenseCategoryChart';
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart';
import TransactionTable from '../components/TransactionTable';
import { PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { summary, summaryLoading, deleteTransaction } = useTransactions();

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Financial Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {todayFormatted} • Monitor your cash flow and spending trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Transaction</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseCategoryChart
          categoryExpenses={summary?.categoryExpenses || []}
          loading={summaryLoading}
        />
        <MonthlyTrendChart
          monthlySummary={summary?.monthlySummary || []}
          loading={summaryLoading}
        />
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest recorded income and expenses</p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable
          transactions={summary?.recentTransactions || []}
          loading={summaryLoading}
          onDelete={deleteTransaction}
          limit={5}
          showViewAll={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
