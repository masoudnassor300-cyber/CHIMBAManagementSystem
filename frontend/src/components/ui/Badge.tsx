import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
  size?: 'sm' | 'md';
}

const variantStyles = {
  blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 backdrop-blur-sm shadow-sm',
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 backdrop-blur-sm shadow-sm',
  amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 backdrop-blur-sm shadow-sm',
  rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 backdrop-blur-sm shadow-sm',
  slate: 'bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-900/10 dark:border-white/10 backdrop-blur-sm shadow-sm',
  purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 backdrop-blur-sm shadow-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${variantStyles[variant]} ${sizeStyles}`}
    >
      {children}
    </span>
  );
};
