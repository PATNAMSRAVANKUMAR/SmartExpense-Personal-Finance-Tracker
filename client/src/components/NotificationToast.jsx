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
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border transition-all animate-bounce-short max-w-md bg-white"
      style={{
        borderColor: isSuccess ? '#86efac' : '#fca5a5',
      }}
    >
      <div
        className={`p-1.5 rounded-xl ${
          isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>

      <div className="text-xs font-semibold text-slate-800 flex-1">
        {notification.message}
      </div>

      <button
        type="button"
        onClick={closeNotification}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

export default NotificationToast;
