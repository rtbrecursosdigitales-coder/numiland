import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { RotateCcw, Home, XCircle, Clock } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  reason: 'lives' | 'time';
  onRetry: () => void;
  onClose: () => void;
}

export function GameOverModal({ isOpen, reason, onRetry, onClose }: GameOverModalProps) {
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
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-pink" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-brand-pink/10 rounded-full mb-6"
              >
                {reason === 'lives' ? (
                  <XCircle size={64} className="text-brand-pink" />
                ) : (
                  <Clock size={64} className="text-brand-pink" />
                )}
              </motion.div>

               <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">
                {reason === 'lives' ? '¡CASI LO LOGRAS!' : '¡SE ACABÓ EL TIEMPO!'}
               </h2>
               <p className="text-lg font-bold text-slate-500 mb-8 leading-tight">
                {reason === 'lives' 
                  ? 'Te has quedado sin vidas. ¡Sigue practicando para mejorar!' 
                  : 'Fuiste muy lento esta vez. ¡Inténtalo de nuevo más rápido!'}
               </p>
               
               <div className="text-7xl mb-8">
                  {reason === 'lives' ? '💔' : '⏰'}
               </div>

              <div className="space-y-4">
                <Button variant="primary" size="lg" className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white border-brand-orange/30" onClick={onRetry}>
                  REINTENTAR <RotateCcw className="ml-2" />
                </Button>
                <Button variant="outline" size="md" className="w-full text-slate-400 border-slate-200" onClick={onClose}>
                  VOLVER AL MAPA <Home className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
