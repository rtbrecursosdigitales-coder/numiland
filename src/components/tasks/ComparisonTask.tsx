import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ComparisonTaskProps {
  question: number[];
  onAnswer: (answer: number) => void;
}

export function ComparisonTask({ question, onAnswer }: ComparisonTaskProps) {
  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-8 mb-8 pt-8 md:pt-12">
        {question.map((num, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(num)}
            className="bg-white rounded-[2.5rem] p-12 shadow-inner border-4 border-white/50 cursor-pointer flex flex-col items-center justify-center gap-6 group"
          >
            <div className={cn(
                "font-black text-brand-orange group-hover:scale-110 transition-transform",
                num >= 100 ? "text-5xl md:text-7xl" : "text-7xl md:text-8xl"
            )}>
              {num}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
