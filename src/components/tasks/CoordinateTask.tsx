import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

interface CoordinateTaskProps {
  question: { x: number; y: number };
  options: string[];
  onAnswer: (answer: string) => void;
}

export function CoordinateTask({ question, options, onAnswer }: CoordinateTaskProps) {
  const gridSize = 5;
  const cells = [];
  for (let y = gridSize - 1; y >= 0; y--) {
    for (let x = 0; x < gridSize; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-8 mb-12 border-4 border-white shadow-xl flex flex-col items-center gap-6">
        <div className="relative bg-white/50 p-4 rounded-xl border-2 border-slate-200">
            {/* Grid */}
            <div className="grid grid-cols-5 gap-1 border-b-2 border-l-2 border-slate-800 p-1">
                {cells.map((cell, i) => (
                    <div key={i} className="w-12 h-12 border border-slate-300 relative flex items-center justify-center">
                        {cell.x === question.x && cell.y === question.y && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-brand-pink rounded-full border-2 border-white shadow-md z-10"
                            />
                        )}
                        {cell.x === 0 && <span className="absolute -left-5 text-[10px] text-slate-400 font-bold">{cell.y}</span>}
                        {cell.y === 0 && <span className="absolute -bottom-5 text-[10px] text-slate-400 font-bold">{cell.x}</span>}
                    </div>
                ))}
            </div>
            {/* Axis labels */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-black text-slate-800 uppercase tracking-widest">Eje X</div>
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-black text-slate-800 uppercase tracking-widest">Eje Y</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((option) => (
          <Button
            key={option}
            size="xl"
            variant="secondary"
            onClick={() => onAnswer(option)}
            className="text-2xl min-h-[6rem] py-4"
          >
            ({option})
          </Button>
        ))}
      </div>
    </div>
  );
}
