import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorScheme?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  subtitle?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    iconBg: 'bg-blue-600 text-white shadow-blue-500/30',
  },
  indigo: {
    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-600 text-white shadow-amber-500/30',
  },
  rose: {
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    iconBg: 'bg-rose-600 text-white shadow-rose-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/30',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorScheme = 'blue',
  subtitle,
}) => {
  const styles = colorMap[colorScheme];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group overflow-hidden min-w-0">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate block">
            {title}
          </span>
          <h3 className="text-lg sm:text-xl xl:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans tracking-tight truncate" title={String(value)}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl shadow-lg transition-transform group-hover:scale-105 shrink-0 ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
