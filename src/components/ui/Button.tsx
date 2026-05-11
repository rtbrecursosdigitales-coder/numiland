import React, { ReactNode } from 'react';
import { HTMLMotionProps, motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand-blue text-white shadow-[0_8px_0_#0B5D77] active:shadow-none active:translate-y-1',
    secondary: 'bg-brand-yellow text-white shadow-[0_8px_0_#e6bc5c] active:shadow-none active:translate-y-1 border-4 border-white/50',
    success: 'bg-brand-green text-white shadow-[0_8px_0_#04A87D] active:shadow-none active:translate-y-1',
    danger: 'bg-brand-pink text-white shadow-[0_8px_0_#c43a5b] active:shadow-none active:translate-y-1',
    outline: 'bg-white/80 backdrop-blur-sm border-2 border-white text-slate-600 shadow-lg active:translate-y-1 active:shadow-md',
    ghost: 'bg-transparent hover:bg-white/20 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-2xl',
    md: 'px-6 py-3 text-lg font-black rounded-2xl',
    lg: 'px-8 py-4 text-xl font-black rounded-3xl',
    xl: 'px-10 py-6 text-3xl font-black rounded-[2.5rem]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center transition-all focus:outline-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
