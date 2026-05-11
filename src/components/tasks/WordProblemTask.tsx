import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { MessageCircleQuestion } from 'lucide-react';

interface WordProblemTaskProps {
  prompt: string;
  options: number[];
  onAnswer: (answer: number) => void;
}

export function WordProblemTask({ prompt, options, onAnswer }: WordProblemTaskProps) {
  return (
    <div className="text-center w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="bg-white/30 backdrop-blur-md rounded-[2.5rem] p-4 md:p-6 mb-4 border-4 border-white shadow-lg flex flex-col items-center gap-3 w-full">
        <div className="bg-brand-pink/20 p-3 rounded-full">
            <MessageCircleQuestion className="w-8 h-8 md:w-10 md:h-10 text-brand-pink" />
        </div>
        <h2 className="text-lg md:text-xl font-black text-slate-800 leading-tight">
            {prompt}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
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
