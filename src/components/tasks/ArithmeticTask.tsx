import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { TaskType } from '../../types';
import { Plus, Minus, Equal, X, Divide } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ArithmeticTaskProps {
  type: TaskType;
  question: { n1: number; n2: number; icon?: string; symbol?: string };
  options: number[];
  onAnswer: (answer: number) => void;
}

export function ArithmeticTask({ type, question, options, onAnswer }: ArithmeticTaskProps) {
  // Dynamic scaling for arithmetic icons
  const getIconSize = (count: number) => {
    if (count > 80) return 'text-sm md:text-lg';
    if (count > 50) return 'text-lg md:text-xl';
    if (count > 30) return 'text-xl md:text-2xl';
    if (count > 15) return 'text-2xl md:text-3xl';
    return 'text-3xl md:text-5xl';
  };

  const isMental = !question.icon;

  const renderVisual = (count: number, icon: string) => (
    <div className="flex flex-wrap justify-center gap-1 max-w-[250px] md:max-w-[400px] mb-4 min-h-[60px]">
        {Array.from({ length: count }).map((_, i) => (
            <motion.span 
                key={i} 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: Math.min(i * 0.005, 0.4) }}
                className={cn("leading-none", getIconSize(count))}
            >
                {icon}
            </motion.span>
        ))}
    </div>
  );

  const getOperator = () => {
    switch (type) {
        case TaskType.ADDITION: return <Plus size={28} strokeWidth={4} />;
        case TaskType.SUBTRACTION: return <Minus size={28} strokeWidth={4} />;
        case TaskType.MULTIPLICATION: return <X size={28} strokeWidth={4} />;
        case TaskType.DIVISION: return <Divide size={28} strokeWidth={4} />;
        default: return <Plus size={28} strokeWidth={4} />;
    }
  };

  return (
    <div className="text-center w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className={cn(
        "mb-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 p-2 no-scrollbar w-full",
        isMental ? "min-h-[120px]" : "min-h-[200px] overflow-y-auto max-h-[40vh]"
      )}>
        {/* First Number */}
        <div className={cn(
            "flex flex-col items-center bg-white/30 rounded-[2rem] border-2 border-white/20 w-full md:w-auto transition-all",
            isMental ? "p-6 md:p-8" : "p-3 md:p-4"
        )}>
            {!isMental && renderVisual(question.n1, question.icon!)}
            <div className={cn(
                "bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black shadow-lg shrink-0 transition-all",
                isMental ? "w-20 h-20 md:w-24 md:h-24 text-4xl md:text-5xl" : "w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl"
            )}>{question.n1}</div>
        </div>

        {/* Operator */}
        <div className="p-2 md:p-3 bg-white/50 backdrop-blur-sm rounded-full text-brand-blue shadow-lg border-2 border-white shrink-0">
            {getOperator()}
        </div>

        {/* Second Number */}
        <div className={cn(
            "flex flex-col items-center bg-white/30 rounded-[2rem] border-2 border-white/20 w-full md:w-auto transition-all",
            isMental ? "p-6 md:p-8" : "p-3 md:p-4"
        )}>
            {!isMental && renderVisual(question.n2, question.icon!)}
            <div className={cn(
                "bg-brand-green text-white rounded-2xl flex items-center justify-center font-black shadow-lg shrink-0 transition-all",
                isMental ? "w-20 h-20 md:w-24 md:h-24 text-4xl md:text-5xl" : "w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl"
            )}>{question.n2}</div>
        </div>

        <div className="p-1 md:p-2 text-white drop-shadow-md shrink-0">
            <Equal size={28} strokeWidth={4} />
        </div>

        {/* Result Box */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/40 backdrop-blur-md border-4 border-dashed border-white shadow-xl rounded-3xl flex items-center justify-center">
            <span className="text-3xl md:text-4xl text-white font-black animate-pulse">?</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl">
        {options.map((option) => (
          <Button
            key={option}
            size="xl"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-xl md:text-2xl min-h-[3.5rem] md:min-h-[4rem] py-2"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
