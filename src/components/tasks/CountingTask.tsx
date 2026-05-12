import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CountingTaskProps {
  question: string[];
  options: number[];
  onAnswer: (answer: number) => void;
}

export function CountingTask({ question, options, onAnswer }: CountingTaskProps) {
  const count = question.length;
  
  // Dynamic sizing based on item count
  const sizeClass = count > 80 ? 'w-8 h-8 text-lg md:w-10 md:h-10 md:text-xl' :
                    count > 50 ? 'w-9 h-9 text-xl md:w-12 md:h-12 md:text-2xl' : 
                    count > 25 ? 'w-10 h-10 text-2xl md:w-14 md:h-14 md:text-3xl' :
                    count > 12 ? 'w-14 h-14 text-3xl md:w-18 md:h-18 md:text-4xl' : 
                    'w-16 h-16 text-4xl md:w-24 md:h-24 md:text-6xl';

  return (
    <div className="text-center w-full flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-4 min-h-[150px] md:min-h-[200px] overflow-y-auto max-h-[40vh] p-2 md:p-4 bg-white/30 rounded-3xl no-scrollbar border-4 border-white/20 w-full">
        {question.map((icon, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: Math.min(i * 0.01, 0.5), type: 'spring', stiffness: 200, damping: 20 }}
            className={cn(
              "bg-white rounded-2xl flex items-center justify-center shadow-inner border-2 border-white/50 transform hover:scale-110 transition-transform cursor-default shrink-0",
              sizeClass
            )}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto w-full">
        {options.map((option) => (
          <Button
            key={option}
            size="lg"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-2xl min-h-[3.5rem] md:min-h-[4rem] py-2"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
