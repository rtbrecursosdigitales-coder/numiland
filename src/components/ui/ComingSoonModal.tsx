import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center kid-shadow relative overflow-hidden"
          >
            {/* Background patterns */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center w-20 h-20 bg-brand-yellow/20 rounded-2xl mb-6 shadow-sm"
              >
                <div className="relative">
                  <ShoppingBag size={40} className="text-brand-yellow" />
                  <motion.div 
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="text-brand-pink" size={20} />
                  </motion.div>
                </div>
              </motion.div>

               <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">
                ¡PRÓXIMAMENTE!
               </h2>
               
               <div className="bg-brand-blue/5 rounded-2xl p-4 mb-6 border border-brand-blue/10">
                 <p className="text-slate-600 font-bold leading-tight">
                   Estamos construyendo la <span className="text-brand-blue">TIENDA MÁGICA</span>. 
                   <br/><br/>
                   ¡Sigue acumulando <span className="text-brand-yellow font-black">ESTRELLAS</span> para canjearlas por nuevos avatares y sorpresas increíbles!
                 </p>
               </div>
               
               <div className="flex justify-center gap-2 mb-8">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }}
                    >
                      <Star className="text-brand-yellow fill-brand-yellow" size={24} />
                    </motion.div>
                  ))}
               </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white border-brand-pink/30 shadow-brand-pink/20" 
                onClick={onClose}
              >
                ¡ENTENDIDO! 🚀
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
