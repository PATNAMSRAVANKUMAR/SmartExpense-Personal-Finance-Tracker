import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isDark
          ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700/80 shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 shadow-sm'
      } active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-slate-600" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
