import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

interface VisualMultiplicationTaskProps {
  question: { groups: number; itemsPerGroup: number; icon: string };
  options: number[];
  onAnswer: (answer: number) => void;
}

export function VisualMultiplicationTask({ question, options, onAnswer }: VisualMultiplicationTaskProps) {
  const { groups, itemsPerGroup, icon } = question;

  // Create groups array
  const groupArray = Array.from({ length: groups }, (_, i) => i);
  const itemsArray = Array.from({ length: itemsPerGroup }, (_, i) => i);

  return (
    <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="bg-white/30 backdrop-blur-md rounded-[2rem] p-3 md:p-6 mb-3 border-4 border-white shadow-lg w-full">
        <h2 className="text-lg md:text-2xl font-black text-slate-800 mb-2 flex items-center justify-center gap-2">
             {groups} grupos de {itemsPerGroup} {icon}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 overflow-y-auto max-h-[35vh] p-2">
            {groupArray.map((g) => (
                <div key={g} className="bg-white/60 p-2 md:p-3 rounded-2xl border-2 border-slate-100 shadow-inner flex flex-wrap max-w-[120px] justify-center gap-1">
                    {itemsArray.map((i) => (
                        <span key={i} className="text-xl md:text-2xl">{icon}</span>
                    ))}
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto w-full">
        {options.map((option) => (
          <Button
            key={option}
            size="xl"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-xl md:text-2xl h-14 md:h-16"
          >
            {option}
          </Button>
        ))}
      </div>
      
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
        Escribe el total o usa la multiplicación: {groups} x {itemsPerGroup}
      </p>
    </div>
  );
}
