import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { X, Equal } from 'lucide-react';

interface MissingFactorTaskProps {
  question: { n1: number; n2: number; result: number; symbol: string };
  options: number[];
  onAnswer: (answer: number) => void;
}

export function MissingFactorTask({ question, options, onAnswer }: MissingFactorTaskProps) {
  return (
    <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="bg-white/30 backdrop-blur-md rounded-[2rem] p-4 md:p-6 mb-4 border-4 border-white shadow-lg flex items-center justify-center gap-2 md:gap-4 w-full overflow-hidden">
        <div className="bg-brand-blue text-white w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-black shadow-md flex-shrink-0">
            {question.n1}
        </div>
        
        <div className="bg-white/50 p-2 md:p-3 rounded-full text-brand-blue flex-shrink-0">
            <X size={24} strokeWidth={4} className="md:w-8 md:h-8" />
        </div>

        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 border-3 border-dashed border-brand-green rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-black text-brand-green animate-pulse flex-shrink-0">
            ?
        </div>

        <div className="text-brand-blue flex-shrink-0">
            <Equal size={24} strokeWidth={4} className="md:w-8 md:h-8" />
        </div>

        <div className="bg-brand-green text-white w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-black shadow-md flex-shrink-0">
            {question.result}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto w-full">
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
