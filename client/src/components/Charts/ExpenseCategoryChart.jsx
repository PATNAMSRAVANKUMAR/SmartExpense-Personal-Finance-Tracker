import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getCategoryColor } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs">
        <p className="font-bold text-slate-800">{data.name}</p>
        <p className="text-rose-600 font-semibold mt-0.5">
          {formatCurrency(data.value)} ({data.payload.percentage || 0}%)
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseCategoryChart = ({ categoryExpenses = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-80 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse text-sm">Loading expense analytics...</div>
      </div>
    );
  }

  if (!categoryExpenses || categoryExpenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-80 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">No Expenses Recorded</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Add expense transactions to visualize your spending breakdown by category.
        </p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = categoryExpenses.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>
          <p className="text-xs text-slate-500 mt-0.5">Distribution of all outgoing spendings</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {chartData.length} Categories
        </span>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getCategoryColor(entry.name)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-slate-600 font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseCategoryChart;
