import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlyTrendChart = ({ monthlySummary = [], loading = false }) => {
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-80 flex items-center justify-center">
        <div className="text-slate-400 dark:text-slate-500 animate-pulse text-sm">Loading monthly trends...</div>
      </div>
    );
  }

  if (!monthlySummary || monthlySummary.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-80 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Historical Data</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Transactions will automatically generate monthly income vs. expense comparisons here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Cash Flow</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Income vs. Expense comparison over time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> Income
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Expenses
          </span>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlySummary}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#475569' : '#cbd5e1' }}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
