import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Square, RectangleHorizontal } from 'lucide-react';

import { cn } from '../../lib/utils';

interface GeometryTaskProps {
  question: string;
  options: number[];
  onAnswer: (answer: number) => void;
}

export function GeometryTask({ question, options, onAnswer }: GeometryTaskProps) {
  const isSquare = question.toLowerCase().includes('cuadrado');
  
  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-12 mb-12 border-4 border-white shadow-xl flex flex-col items-center gap-8">
        <div className="bg-brand-purple/20 p-8 rounded-3xl mb-4">
            {isSquare ? (
                <Square className="w-32 h-32 text-brand-purple" strokeWidth={3} />
            ) : (
                <RectangleHorizontal className="w-48 h-32 text-brand-purple" strokeWidth={3} />
            )}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
            {question}
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
