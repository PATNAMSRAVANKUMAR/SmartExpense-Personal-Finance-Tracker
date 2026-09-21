import React from 'react';
import TransactionForm from '../components/TransactionForm';
import { PlusCircle } from 'lucide-react';

const AddTransaction = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <PlusCircle className="w-3.5 h-3.5" />
          New Entry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Add Transaction
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Record a newly received income or an expense with categories and details
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <TransactionForm isEdit={false} />
      </div>
    </div>
  );
};

export default AddTransaction;
