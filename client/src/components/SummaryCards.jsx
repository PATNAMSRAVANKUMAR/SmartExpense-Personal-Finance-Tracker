import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, ReceiptText, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = ({ summary = {}, loading = false }) => {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    balance = 0,
    transactionCount = 0,
  } = summary;

  const cards = [
    {
      title: 'Current Balance',
      amount: formatCurrency(balance),
      subtext: balance >= 0 ? 'Net positive savings' : 'Net deficit',
      icon: Wallet,
      color: balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
      bgColor: balance >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-rose-50 dark:bg-rose-950/50',
      borderColor: balance >= 0 ? 'border-emerald-200 dark:border-emerald-800/50' : 'border-rose-200 dark:border-rose-800/50',
      badgeColor: balance >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      BadgeIcon: balance >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Total Income',
      amount: formatCurrency(totalIncome),
      subtext: 'Incoming cash flow',
      icon: ArrowUpRight,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/50',
      borderColor: 'border-teal-200 dark:border-teal-800/50',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      BadgeIcon: TrendingUp,
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totalExpenses),
      subtext: 'Outgoing expenditures',
      icon: ArrowDownRight,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      borderColor: 'border-rose-200 dark:border-rose-800/50',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      BadgeIcon: TrendingDown,
    },
    {
      title: 'Total Transactions',
      amount: transactionCount.toString(),
      subtext: 'Logged records',
      icon: ReceiptText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-800/50',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      BadgeIcon: ReceiptText,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const BadgeIcon = card.BadgeIcon;

        return (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.amount}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${card.badgeColor}`}>
                <BadgeIcon className="w-3 h-3" />
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
