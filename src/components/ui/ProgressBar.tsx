import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  className?: string;
}

export function ProgressBar({ current, total, color = 'bg-brand-green', className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className={cn("w-full h-4 bg-slate-200 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn("h-full", color)}
      />
    </div>
  );
}
