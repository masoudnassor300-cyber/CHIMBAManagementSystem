import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Truck,
  User,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Clients Directory', path: '/clients', icon: Users },
    { label: 'Job Files', path: '/files', icon: FolderKanban },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Financial Summary', path: '/summary', icon: BarChart3 },
  ];

  // Dismiss profile popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-screen shrink-0 backdrop-blur-lg bg-white/10 dark:bg-slate-900/40 border-r border-white/10 dark:border-slate-800/50 shadow-2xl p-4 flex flex-col justify-between z-40 relative select-none">
      {/* Top Section: Brand Header & Nav Links */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2.5 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-brand-500/25 border border-white/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider text-slate-900 dark:text-white drop-shadow-sm">CHIMBA</h1>
            <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold tracking-tight">LOGISTICS LTD</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Main Navigation
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/20 dark:bg-white/10 text-brand-600 dark:text-brand-400 shadow-md border border-white/20 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Accent Vertical Line */}
                    {isActive && (
                      <span className="w-1 h-5 bg-brand-500 rounded-r-full absolute left-0 top-1/2 -translate-y-1/2 shadow-sm shadow-brand-500" />
                    )}
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Profile Section */}
      <div ref={profileRef} className="relative pt-4 border-t border-white/10 dark:border-slate-800/50">
        {/* Floating Glass Context Popover Menu */}
        {isProfileOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-3 backdrop-blur-lg bg-white/70 dark:bg-slate-900/80 border border-white/30 dark:border-slate-700/40 p-2 rounded-2xl shadow-2xl z-50 animate-fadeIn space-y-1">
            <div className="px-3 py-2 border-b border-slate-900/10 dark:border-white/10 mb-1">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">Admin Account</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">admin@chimba.co.tz</p>
            </div>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all"
            >
              <User className="w-4 h-4 text-brand-500" />
              <span>View Profile</span>
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all"
            >
              <Settings className="w-4 h-4 text-indigo-500" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Profile Card Button */}
        <button
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/30 transition-all border border-transparent hover:border-white/10 dark:hover:border-slate-800/50 text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-brand-500/25 border border-white/20 shrink-0">
              CL
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">Admin User</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">admin@chimba.co.tz</div>
            </div>
          </div>
          <div className="p-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
            {isProfileOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>
    </aside>
  );
};



