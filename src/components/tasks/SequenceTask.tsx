import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface SequenceTaskProps {
  question: (number | null)[];
  options: number[];
  onAnswer: (answer: number) => void;
}

export function SequenceTask({ question, options, onAnswer }: SequenceTaskProps) {
  const isIcons = question.length > 0 && typeof question[0] === 'string' && (question[0] as string).length > 0;
  const count = question.length;

  // Dynamic sizing
  const iconSizeClass = count > 50 ? 'text-2xl md:text-4xl' : 
                        count > 20 ? 'text-3xl md:text-5xl' : 
                        'text-5xl md:text-7xl';
  
  const numSizeClass = count > 50 ? 'w-10 h-10 text-xl' :
                       count > 20 ? 'w-14 h-14 text-2xl' :
                       'w-20 h-20 md:w-32 md:h-32 text-4xl md:text-6xl';

  return (
    <div className="text-center w-full">
      <div className={cn(
        "mb-12 flex flex-wrap items-center justify-center gap-4 min-h-[200px] overflow-y-auto max-h-[50vh] p-4 no-scrollbar bg-white/20 rounded-3xl",
      )}>
        {question.map((num, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.5), type: 'spring' }}
            className={cn(
              "rounded-2xl flex items-center justify-center font-black shrink-0",
              isIcons 
                ? iconSizeClass
                : `${numSizeClass} bg-brand-purple text-white shadow-lg`,
              num === null && "bg-slate-100 border-4 border-dashed border-slate-300 text-transparent shadow-none"
            )}
          >
            {num}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {options.map((option) => (
          <Button
            key={option}
            size="lg"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-3xl"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
