import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Truck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Clients Directory', path: '/clients', icon: Users },
    { label: 'Job Files', path: '/files', icon: FolderKanban },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Financial Summary', path: '/summary', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 z-40 transition-colors shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
        <div className="p-2 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-brand-500/20">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wider text-slate-900 dark:text-white">CHIMBA</h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">LOGISTICS LTD</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-medium">
          <span>System Version</span>
          <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px]">v2.0 React</span>
        </div>
      </div>
    </aside>
  );
};
