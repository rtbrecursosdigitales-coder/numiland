import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

interface MatchingTaskProps {
  question: { count: number; icon: string };
  options: number[];
  onAnswer: (answer: number) => void;
}

export function MatchingTask({ question, options, onAnswer }: MatchingTaskProps) {
  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-12 mb-12 border-4 border-white shadow-xl flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: question.count }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-6xl md:text-8xl drop-shadow-md"
            >
              {question.icon}
            </motion.span>
          ))}
        </div>
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
