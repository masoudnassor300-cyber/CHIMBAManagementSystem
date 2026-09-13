import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-900/10 dark:bg-white/10 backdrop-blur-sm rounded-lg ${className}`}
    />
  );
};
