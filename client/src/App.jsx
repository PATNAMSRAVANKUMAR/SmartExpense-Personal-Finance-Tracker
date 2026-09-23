import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <TransactionProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/add" element={<AddTransaction />} />
                <Route path="/edit/:id" element={<EditTransaction />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  SmartExpense – Personal Finance Tracker
                </p>
                <p className="text-slate-400 dark:text-slate-500">
                  Built with React.js, Express.js, Node.js & MongoDB
                </p>
              </div>
            </footer>

            <NotificationToast />
          </div>
        </TransactionProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
