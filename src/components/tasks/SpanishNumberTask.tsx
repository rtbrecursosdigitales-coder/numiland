import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GameTask } from '../../types';
import { Button } from '../ui/Button';

interface SpanishNumberTaskProps {
  task: GameTask;
  onAnswer: (correct: boolean) => void;
}

export function SpanishNumberTask({ task, onAnswer }: SpanishNumberTaskProps) {
  const { question, answer, options = [] } = task;
  const { number, word, subType } = question;

  const [typedAnswer, setTypedAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear state on task change
  useEffect(() => {
    setTypedAnswer('');
    setErrorMessage('');
    if (subType === 'type-name') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [task, subType]);

  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD") // separate accent from base letters
      .replace(/[\u0300-\u036f]/g, "") // remove accent marks
      .replace(/[^a-z0-9]/g, ""); // remove spaces, dashes, special punctuation to be extra forgiving
  };

  const handleSubmitTyped = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedAnswer.trim()) return;

    const isCorrect = normalize(typedAnswer) === normalize(answer as string);
    if (!isCorrect) {
      setErrorMessage('¡Casi! Inténtalo de nuevo 💡');
      onAnswer(false);
    } else {
      onAnswer(true);
    }
  };

  // Helper chips based on the target number for interactive composing
  const getHelperChips = () => {
    const basicWords = ['y', 'cien', 'ciento', 'mil', 'un', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    // Filter to words likely needed or present in correct word
    const correctWords = word.toLowerCase().split(/\s+/);
    // Grab 3 random useful distractors
    const unusedBasics = basicWords.filter(w => !correctWords.includes(w));
    const randomDistractors = [...unusedBasics].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Merge, deduplicate, and sort alphabetically
    return Array.from(new Set([...correctWords, ...randomDistractors])).sort();
  };

  const handleChipClick = (wordChip: string) => {
    setTypedAnswer(prev => {
      const current = prev.trim();
      if (!current) return wordChip;
      // If we clicked a 'y' or similar suffix, handle spacing elegantly
      return `${current} ${wordChip}`;
    });
    inputRef.current?.focus();
  };

  if (subType === 'select-name') {
    return (
      <div className="w-full max-w-xl mx-auto space-y-8 p-4">
        {/* Big styled number display card */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-brand-blue to-blue-500 flex items-center justify-center border-8 border-white shadow-2xl relative"
          >
            {/* Soft inner glow indicator */}
            <div className="absolute inset-4 rounded-[2rem] border-2 border-white/20 pointer-events-none" />
            <span className="text-7xl font-extrabold text-white font-mono tracking-tighter drop-shadow-lg">
              {number}
            </span>
          </motion.div>
        </div>

        {/* Option Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, idx) => {
            const isWord = typeof option === 'string';
            const displayLabel = isWord ? option : option.toString();

            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(option === answer)}
                className="w-full bg-white hover:bg-slate-50 border-4 border-slate-200 hover:border-brand-blue p-5 rounded-[2rem] text-lg sm:text-xl font-black text-slate-700 uppercase tracking-tight shadow-md hover:shadow-xl transition-all active:translate-y-0.5 text-center leading-snug"
              >
                {displayLabel}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (subType === 'select-digit') {
    return (
      <div className="w-full max-w-xl mx-auto space-y-8 p-4">
        {/* Big styled Spanish text card */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full min-h-36 bg-gradient-to-br from-brand-green to-emerald-500 rounded-[2.5rem] p-6 lg:p-8 flex flex-col items-center justify-center border-8 border-white shadow-2xl relative"
          >
            <div className="absolute inset-3 rounded-[1.8rem] border-2 border-white/10 pointer-events-none" />
            <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-[0.2em] font-black mb-1">Escribe o lee del número:</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight leading-none uppercase drop-shadow-md">
              "{word}"
            </span>
          </motion.div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((option, idx) => {
            const displayLabel = option.toString();

            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onAnswer(option === answer)}
                className="bg-white hover:bg-slate-50 border-4 border-slate-200 hover:border-brand-green p-6 rounded-[2rem] text-3xl font-black text-slate-700 tracking-tighter shadow-md hover:shadow-xl transition-all"
              >
                {displayLabel}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Type Name (Escribir)
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-4">
      {/* Target card */}
      <div className="flex justify-center mb-4">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-brand-orange to-amber-500 flex items-center justify-center border-6 border-white shadow-xl relative"
        >
          <div className="absolute inset-3 rounded-[1.8rem] border-2 border-white/15 pointer-events-none" />
          <span className="text-6xl font-black text-white font-mono tracking-tighter drop-shadow-md">
            {number}
          </span>
        </motion.div>
      </div>

      <form onSubmit={handleSubmitTyped} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe el nombre aquí..."
            value={typedAnswer}
            onChange={(e) => {
              setTypedAnswer(e.target.value);
              setErrorMessage('');
            }}
            className="w-full px-6 py-5 bg-white border-4 border-slate-200 focus:border-brand-orange rounded-3xl text-xl md:text-2xl font-black text-slate-800 placeholder:text-slate-300 outline-none transition-all shadow-inner text-center uppercase tracking-wide"
          />
          {typedAnswer.trim() && (
            <button
              type="button"
              onClick={() => setTypedAnswer('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 font-extrabold uppercase text-xs"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Interactive assist word chips */}
        <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 space-y-2">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider text-center">
            💡 Tocá las palabras para armar la respuesta más rápido:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {getHelperChips().map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 bg-white hover:bg-brand-orange/10 border-2 border-slate-200 hover:border-brand-orange/40 text-slate-600 hover:text-brand-orange rounded-2xl text-sm font-bold uppercase tracking-tight shadow-sm transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm font-black text-red-500 uppercase tracking-wider text-center animate-bounce">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          size="xl"
          disabled={!typedAnswer.trim()}
          className="w-full h-16 text-xl font-extrabold bg-brand-orange hover:bg-brand-orange/90 text-white shadow-xl"
        >
          COMPROBAR RESPUESTA
        </Button>
      </form>
    </div>
  );
}
