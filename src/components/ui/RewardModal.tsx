import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Star, Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStarTier } from '../../lib/utils';

interface RewardModalProps {
  isOpen: boolean;
  stars: number;
  completions: number;
  onNext: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export function RewardModal({ isOpen, stars, completions, onNext, onRetry, onClose }: RewardModalProps) {
  const tier = getStarTier(completions);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: [tier.fill, '#FFFFFF', '#FF8400']
      });
    }
  }, [isOpen, tier]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center kid-shadow relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-yellow/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brand-blue/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-brand-yellow rounded-full mb-6 kid-shadow"
              >
                <Trophy size={48} className="text-white" />
              </motion.div>

               <h2 className="text-3xl font-black text-slate-800 mb-2 whitespace-nowrap">¡EXCELENTE TRABAJO!</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className={`text-xl font-black uppercase tracking-tighter ${tier.color}`}>
                    {tier.name}
                </span>
                <Sparkles size={20} className={tier.color} />
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <Star 
                      size={54} 
                      style={{ fill: i <= stars ? tier.fill : '#E2E8F0' }}
                      className={i <= stars ? "drop-shadow-lg" : "text-slate-200"} 
                    />
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                <p className="text-slate-500 font-bold italic text-sm">
                    Has completado este nivel <span className="text-brand-purple font-black">{completions}</span> {completions === 1 ? 'vez' : 'veces'}
                </p>
              </div>

              <div className="space-y-4">
                <Button variant="primary" size="lg" className="w-full" onClick={onNext}>
                  SIGUIENTE NIVEL <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" size="md" className="w-full text-slate-400 border-slate-200" onClick={onClose}>
                  VOLVER AL MAPA
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
