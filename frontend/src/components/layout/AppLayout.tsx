import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors relative">
      {/* Ambient glow orbs — visible in both themes to create glass depth */}
      <div className="fixed top-[-8%] left-[-4%] w-[48rem] h-[48rem] bg-brand-500/25 dark:bg-brand-600/18 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-8%] right-[-4%] w-[42rem] h-[42rem] bg-indigo-500/20 dark:bg-indigo-600/18 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[38%] right-[22%] w-[32rem] h-[32rem] bg-sky-400/15 dark:bg-purple-600/12 rounded-full blur-[130px] pointer-events-none z-0" />


      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto z-10 relative">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

