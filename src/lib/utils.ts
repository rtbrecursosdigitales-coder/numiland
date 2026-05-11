import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStarTier = (completions: number = 0) => {
    if (completions >= 8) return { name: 'Maestro', color: 'text-[#9966CC]', fill: '#9966CC' };
    if (completions >= 6) return { name: 'Rubí', color: 'text-[#E0115F]', fill: '#E0115F' };
    if (completions >= 4) return { name: 'Diamante', color: 'text-[#B9F2FF]', fill: '#B9F2FF' };
    if (completions >= 3) return { name: 'Oro', color: 'text-brand-yellow', fill: '#FFD93D' };
    if (completions >= 2) return { name: 'Plata', color: 'text-slate-300', fill: '#CBD5E1' };
    return { name: 'Bronce', color: 'text-brand-orange', fill: '#FF8400' };
};
