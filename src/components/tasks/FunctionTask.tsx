import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

interface FunctionTaskProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
}

export function FunctionTask({ question, options, onAnswer }: FunctionTaskProps) {
  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-12 mb-12 border-4 border-white shadow-xl flex flex-col items-center gap-8">
        <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight italic">
            {question}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Button
            key={option}
            size="xl"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-2xl min-h-[6rem] py-4 font-black"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
