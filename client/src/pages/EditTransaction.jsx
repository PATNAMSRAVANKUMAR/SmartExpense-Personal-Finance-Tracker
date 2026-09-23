import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactionService } from '../services/api';
import TransactionForm from '../components/TransactionForm';
import { Edit2, ArrowLeft, AlertCircle } from 'lucide-react';

const EditTransaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTarget = async () => {
      setLoading(true);
      try {
        const res = await transactionService.getById(id);
        if (res.success && res.data) {
          setTransaction(res.data);
        } else {
          setError('Transaction could not be found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load transaction details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTarget();
    }
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Edit2 className="w-3.5 h-3.5" />
            Update Record
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Edit Transaction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Modify the details, category, or amount for this transaction
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading transaction details...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Error Loading Record</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{error}</p>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
            >
              Return to Transactions
            </Link>
          </div>
        ) : (
          <TransactionForm initialData={transaction} isEdit={true} />
        )}
      </div>
    </div>
  );
};

export default EditTransaction;
