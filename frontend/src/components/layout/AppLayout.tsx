import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-logistics-animated text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors">
      {/* Moving Background Grid Overlay - Automatic Theme Adaptable */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
