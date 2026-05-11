import { motion, useMotionValue, useTransform } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';

interface NumberLineTaskProps {
  question: { start: number; end: number };
  answer: number;
  onAnswer: (answer: number) => void;
}

export function NumberLineTask({ question, answer, onAnswer }: NumberLineTaskProps) {
  const [value, setValue] = useState(question.start);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMove = (e: React.MouseEvent | React.TouchEvent | any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    const relativeX = Math.max(0, Math.min(x - rect.left, rect.width));
    const percentage = relativeX / rect.width;
    const newValue = Math.round(question.start + percentage * (question.end - question.start));
    setValue(newValue);
  };

  return (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-12 mb-12 kid-shadow border-4 border-white/50">
        <h3 className="text-2xl font-black text-slate-400 mb-12 uppercase tracking-wide">
          Desliza hasta el <span className="text-brand-blue text-4xl">{answer}</span>
        </h3>
        
        <div 
          ref={containerRef}
          className="relative h-2 bg-slate-200 rounded-full my-20 cursor-pointer"
          onMouseDown={(e) => {
            handleMove(e);
            const onMouseMove = (ev: MouseEvent) => handleMove(ev);
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
          onTouchStart={(e) => {
            handleMove(e);
            const onTouchMove = (ev: TouchEvent) => handleMove(ev);
            const onTouchEnd = () => {
              window.removeEventListener('touchmove', onTouchMove);
              window.removeEventListener('touchend', onTouchEnd);
            };
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
          }}
        >
          {/* Marks */}
          <div className="absolute inset-0 flex justify-between px-1">
            {Array.from({ length: question.end - question.start + 1 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-1 h-4 bg-slate-300 -mt-1" />
                <span className="mt-4 text-sm font-bold text-slate-400">
                  {i % 2 === 0 ? question.start + i : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Current Value Indicator */}
          <motion.div
            animate={{ left: `${((value - question.start) / (question.end - question.start)) * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 -ml-6 w-12 h-12 bg-brand-blue rounded-full kid-shadow border-4 border-white flex items-center justify-center text-white font-black text-xl z-10"
          >
            {value}
          </motion.div>
        </div>
      </div>

      <Button
        size="xl"
        variant="primary"
        onClick={() => onAnswer(value)}
        className="w-full"
      >
        ¡LISTO!
      </Button>
    </div>
  );
}
