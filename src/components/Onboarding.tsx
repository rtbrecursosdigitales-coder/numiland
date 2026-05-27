import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { AVATAR_ICONS } from '../constants';
import { cn } from '../lib/utils';
import { Sparkles, ArrowRight, LogIn, Lock, Compass, Map, Zap, Rocket, GraduationCap, Volume2 } from 'lucide-react';
import { GameWorld } from '../types';

interface OnboardingProps {
  onComplete: (name: string, avatar: string, startingWorld: GameWorld) => void;
  onSignIn: () => void;
  isSignedIn: boolean;
  isAdmin: boolean;
  userEmail?: string | null;
}

export function Onboarding({ onComplete, onSignIn, isSignedIn, isAdmin, userEmail }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(isSignedIn ? 2 : 1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('bear');
  const [startingWorld, setStartingWorld] = useState<GameWorld>('explorers');

  // Auto-advance to step 2 when signed in
  React.useEffect(() => {
    if (isSignedIn && step === 1) {
      setStep(2);
    }
  }, [isSignedIn, step]);

  const worlds = [
    { 
      id: 'explorers', 
      label: 'Exploradores', 
      age: '5-7 años', 
      icon: <Compass size={18} />, 
      color: 'bg-brand-blue',
      description: 'Fundamentos: Números del 1 al 100, conteo visual y sumas simples.'
    },
    { 
      id: 'adventurers', 
      label: 'Aventureros', 
      age: '8-10 años', 
      icon: <Map size={18} />, 
      color: 'bg-brand-green',
      description: 'Grandes Retos: Números hasta 1.000, multiplicación y lógica.'
    },
    { 
      id: 'scholars', 
      label: 'Tablas', 
      age: 'Academia', 
      icon: <GraduationCap size={18} />, 
      color: 'bg-brand-purple',
      description: '¡Domina las Tablas!: Del 1 al 10 con juegos y multivariables.'
    },
    { 
      id: 'masters', 
      label: 'Maestros', 
      age: '11-13 años', 
      icon: <Zap size={18} />, 
      color: 'bg-brand-orange',
      description: 'Poder Mental: Hasta 10.000, divisiones y cálculo avanzado.'
    },
    { 
      id: 'legends', 
      label: 'Leyendas', 
      age: 'Secundaria', 
      icon: <Rocket size={18} />, 
      color: 'bg-brand-pink',
      description: 'Dimensión X: Álgebra, geometría y coordenadas matemáticas.'
    },
  ];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const availableAvatars = Object.entries(AVATAR_ICONS).filter((_, i) => isAdmin || i < 10);
  const lockedAvatars = Object.entries(AVATAR_ICONS).filter((_, i) => !isAdmin && i >= 10);

  const handleNext = () => {
    if (step === 2 && name.trim()) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) {
        onComplete(name.trim(), avatar, startingWorld);
    }
  };

  return (
    <div className="immersive-bg min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
          <span className="text-brand-yellow">NUMI</span>
          <span className="text-brand-pink">LAND</span>
        </h1>
        <p className="text-white text-2xl font-bold italic mt-2 drop-shadow-md">
          ¡Tu aventura matemática!
        </p>
      </motion.div>

      <motion.div 
        key={step}
        initial={{ scale: 0.9, opacity: 0, x: 20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        className="glass-card w-full max-w-2xl p-6 md:p-10 flex flex-col max-h-[90vh] md:max-h-[85vh] relative overflow-hidden"
      >
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6 md:mb-8 flex-shrink-0">
            {[1, 2, 3, 4].map(s => (
                <div key={s} className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500",
                    step >= s ? "bg-brand-pink w-8" : "bg-white/20"
                )} />
            ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 flex-1 flex flex-col justify-center py-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                Bienvenido Explorador
              </h2>
              <p className="text-slate-500 font-bold text-lg">
                Inicia sesión para guardar tus estrellas y jugar en cualquier dispositivo.
              </p>
            </div>
            <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
              <Button 
                onClick={onSignIn}
                size="xl" 
                className="w-full h-16 md:h-20 text-xl md:text-2xl font-black gap-4"
              >
                <LogIn className="w-8 h-8" /> ENTRAR CON GOOGLE
              </Button>
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
                size="xl" 
                className="w-full h-14 md:h-16 text-lg md:text-xl font-black gap-3 border-2 border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                🎮 CONTINUAR COMO INVITADO
              </Button>
            </div>
            <p className="text-slate-400 text-sm font-medium italic">
              * El progreso se sincronizará automáticamente.
            </p>
          </div>
        )}

        {step === 2 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex-1 flex flex-col justify-center space-y-8">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight text-center">
                      ¿Cómo te llamas?
                  </h2>
                  <div className="py-4">
                      <input 
                          type="text" 
                          autoFocus
                          placeholder="Escribe tu nombre..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={15}
                          className="w-full text-4xl md:text-5xl font-black text-brand-blue placeholder:text-slate-200 border-b-8 border-brand-blue/20 focus:border-brand-blue outline-none transition-all pb-4 text-center bg-transparent"
                      />
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                      onClick={handleNext}
                      size="xl" 
                      className="w-full h-16 md:h-20 text-xl md:text-2xl font-black group mt-4"
                      disabled={!name.trim()}
                  >
                      CONTINUAR <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight flex-shrink-0">
                    Elige tu Personaje
                </h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-slate-50/50 p-4 rounded-[2rem] border-2 border-white/50">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {availableAvatars.map(([key, icon]) => (
                      <button
                        key={key}
                        onClick={() => setAvatar(key)}
                        className={cn(
                          "w-full aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all relative overflow-hidden",
                          avatar === key 
                            ? "bg-brand-yellow border-4 border-white shadow-lg scale-110 rotate-3 z-10" 
                            : "bg-white hover:bg-slate-100 border-4 border-transparent shadow-sm"
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                    {lockedAvatars.map(([key]) => (
                      <div key={key} className="w-full aspect-square rounded-2xl bg-slate-100/50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 grayscale opacity-50">
                          <Lock size={16} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col gap-4">
                  {!isAdmin && (
                      <p className="text-[10px] md:text-[11px] text-brand-pink font-bold uppercase tracking-wider text-center">
                          ★ +20 personajes especiales en la versión FULL
                      </p>
                  )}
                  <Button 
                      onClick={handleNext}
                      size="xl" 
                      className="w-full h-16 md:h-20 text-xl md:text-2xl font-black group"
                  >
                      CONTINUAR <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
            </div>
        )}

        {step === 4 && (
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight flex-shrink-0">
                    Elige un Mundo
                </h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 bg-slate-50/50 p-4 rounded-[2rem] border-2 border-white/50">
                  {worlds.map((world) => (
                    <button
                      key={world.id}
                      onClick={() => setStartingWorld(world.id as GameWorld)}
                      className={cn(
                        "w-full flex items-center p-4 rounded-3xl font-black text-lg transition-all border-b-8 gap-4 text-left",
                        startingWorld === world.id
                          ? `${world.color} text-white border-black/20 scale-[1.01] shadow-lg`
                          : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                        startingWorld === world.id ? "bg-white/20" : "bg-slate-100"
                      )}>
                        {world.icon}
                      </div>
                      <div className="flex-1 text-left">
                          <p className="uppercase tracking-tighter leading-none text-sm font-black">{world.label}</p>
                          <p className={cn("text-[10px] font-bold opacity-60 uppercase mb-1", startingWorld === world.id ? "text-white" : "text-slate-400")}>{world.age}</p>
                          {world.description && (
                            <p className={cn("text-[11px] font-medium leading-tight", startingWorld === world.id ? "text-white/90" : "text-slate-500")}>
                              {world.description}
                            </p>
                          )}
                      </div>
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(`${world.label}. ${world.description}`);
                        }}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            startingWorld === world.id ? "hover:bg-white/20 text-white" : "hover:bg-slate-100 text-slate-400"
                        )}
                      >
                        <Volume2 size={16} />
                      </button>
                    </button>
                  ))}
                </div>
                <div className="flex-shrink-0">
                  <Button 
                      onClick={handleNext}
                      size="xl" 
                      className="w-full h-16 md:h-20 text-xl md:text-2xl font-black group bg-brand-pink hover:bg-brand-pink/90 text-white border-brand-pink/30 mt-2"
                  >
                      ¡A JUGAR AHORA! <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
            </div>
        )}

        {isSignedIn && (
           <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Explorador: {userEmail}</span>
               {isAdmin && <span className="text-brand-yellow">Premium</span>}
           </div>
        )}
      </motion.div>
    </div>
  );
}
