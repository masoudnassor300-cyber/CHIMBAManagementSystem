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
    iconBg: 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 glow-brand',
  },
  indigo: {
    iconBg: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40',
  },
  emerald: {
    iconBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 glow-emerald',
  },
  amber: {
    iconBg: 'bg-amber-600 text-white shadow-lg shadow-amber-500/40 glow-amber',
  },
  rose: {
    iconBg: 'bg-rose-600 text-white shadow-lg shadow-rose-500/40 glow-rose',
  },
  purple: {
    iconBg: 'bg-purple-600 text-white shadow-lg shadow-purple-500/40',
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
    <div className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group overflow-hidden min-w-0">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate block">
            {title}
          </span>
          <h3 className="text-lg sm:text-xl xl:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans tracking-tight truncate drop-shadow-sm" title={String(value)}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110 shrink-0 border border-white/20 ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

