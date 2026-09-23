import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, AlertCircle, PlusCircle } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const TransactionTable = ({
  transactions = [],
  loading = false,
  onDelete,
  limit = null,
  showViewAll = false,
}) => {
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteCandidate._id);
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Transactions Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
          No records match your active criteria. Try adjusting your filters or record a new transaction.
        </p>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Transaction</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Transaction</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {displayedTransactions.map((tx) => {
                const isIncome = tx.type === 'Income';
                const catColor = getCategoryColor(tx.category);

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Title and Description */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                            {tx.title}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[180px] sm:max-w-xs mt-0.5">
                              {tx.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${catColor}15`,
                          color: catColor,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                      {formatDate(tx.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-bold ${
                          isIncome ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to={`/edit/${tx._id}`}
                          title="Edit transaction"
                          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          title="Delete transaction"
                          onClick={() => setDeleteCandidate(tx)}
                          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showViewAll && transactions.length > (limit || 5) && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center">
            <Link
              to="/transactions"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
            >
              View All Transactions ({transactions.length}) →
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white text-center">Delete Transaction?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              Are you sure you want to delete &quot;<span className="font-semibold text-slate-700 dark:text-slate-200">{deleteCandidate.title}</span>&quot; ({formatCurrency(deleteCandidate.amount)})? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTable;
