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
      color: balance >= 0 ? 'text-emerald-600' : 'text-rose-600',
      bgColor: balance >= 0 ? 'bg-emerald-50' : 'bg-rose-50',
      borderColor: balance >= 0 ? 'border-emerald-200' : 'border-rose-200',
      badgeColor: balance >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
      BadgeIcon: balance >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Total Income',
      amount: formatCurrency(totalIncome),
      subtext: 'Incoming cash flow',
      icon: ArrowUpRight,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      badgeColor: 'bg-teal-100 text-teal-800',
      BadgeIcon: TrendingUp,
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totalExpenses),
      subtext: 'Outgoing expenditures',
      icon: ArrowDownRight,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-800',
      BadgeIcon: TrendingDown,
    },
    {
      title: 'Total Transactions',
      amount: transactionCount.toString(),
      subtext: 'Logged records',
      icon: ReceiptText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
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
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.amount}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
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
