import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const NotificationToast = () => {
  const { notification, closeNotification } = useTransactions();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <aside
      aria-label="Notification"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border transition-all animate-bounce-short max-w-md bg-white dark:bg-slate-900 ${
        isSuccess
          ? 'border-emerald-300 dark:border-emerald-700/80'
          : 'border-rose-300 dark:border-rose-700/80'
      }`}
    >
      <div
        className={`p-1.5 rounded-xl ${
          isSuccess
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>

      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex-1">
        {notification.message}
      </div>

      <button
        type="button"
        onClick={closeNotification}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

export default NotificationToast;
