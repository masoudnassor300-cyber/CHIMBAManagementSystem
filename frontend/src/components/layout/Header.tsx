import React from 'react';
import { Sun, Moon, Bell, Search, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 glass-header px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-slate-900/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>CHIMBA LOGISTICS LTD • TIN: 140-456-160</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-xl transition-all relative backdrop-blur-md border border-transparent hover:border-slate-900/10 dark:hover:border-white/10"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        {/* Notifications Icon */}
        <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-xl transition-all relative backdrop-blur-md border border-transparent hover:border-slate-900/10 dark:hover:border-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full shadow-sm shadow-brand-500"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-900/10 dark:bg-white/10 mx-1"></div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-brand-500/25 border border-white/20">
            CL
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">Admin User</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Logistics Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

