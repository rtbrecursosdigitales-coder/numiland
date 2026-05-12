import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

import { cn } from '../../lib/utils';

interface AlgebraTaskProps {
  question: string;
  options: number[];
  onAnswer: (answer: number) => void;
}

export function AlgebraTask({ question, options, onAnswer }: AlgebraTaskProps) {
  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-12 mb-12 border-4 border-white shadow-xl flex flex-col items-center gap-8">
        <h2 className={cn(
            "font-black text-slate-800 tracking-tighter",
            question.length > 8 ? "text-3xl md:text-5xl" : 
            question.length > 5 ? "text-4xl md:text-6xl" : "text-6xl md:text-8xl"
        )}>
            {question.replace(/x/g, '?')}
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <Button
            key={option}
            size="xl"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-4xl min-h-[6rem] py-4"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
