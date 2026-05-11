import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { AVATAR_ICONS } from '../constants';
import { cn } from '../lib/utils';
import { Sparkles, ArrowRight, LogIn, Lock, Compass, Map, Zap, Rocket, GraduationCap } from 'lucide-react';
import { GameWorld } from '../types';

interface OnboardingProps {
  onComplete: (name: string, avatar: string, startingWorld: GameWorld) => void;
  onSignIn: () => void;
  isSignedIn: boolean;
  isAdmin: boolean;
  userEmail?: string | null;
}

export function Onboarding({ onComplete, onSignIn, isSignedIn, isAdmin, userEmail }: OnboardingProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('bear');
  const [startingWorld, setStartingWorld] = useState<GameWorld>('explorers');

  const worlds = [
    { id: 'explorers', label: 'Exploradores', age: '5-7 años', icon: <Compass size={18} /> },
    { id: 'adventurers', label: 'Aventureros', age: '8-10 años', icon: <Map size={18} /> },
    { id: 'scholars', label: 'Tablas', age: 'Academia', icon: <GraduationCap size={18} /> },
    { id: 'masters', label: 'Maestros', age: '11-13 años', icon: <Zap size={18} /> },
    { id: 'legends', label: 'Leyendas', age: 'Secundaria', icon: <Rocket size={18} /> },
  ];

  const availableAvatars = Object.entries(AVATAR_ICONS).filter((_, i) => isAdmin || i < 10);
  const lockedAvatars = Object.entries(AVATAR_ICONS).filter((_, i) => !isAdmin && i >= 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
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
          ¡Tu aventura matemática está por comenzar!
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card w-full max-w-2xl p-8 md:p-12 overflow-y-auto max-h-[85vh] no-scrollbar"
      >
        {!isSignedIn ? (
          <div className="space-y-8 py-10">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              Bienvenido Explorador
            </h2>
            <p className="text-slate-500 font-bold text-lg">
              Inicia sesión para guardar tu progreso en la nube y acceder a todos los niveles.
            </p>
            <Button 
              onClick={onSignIn}
              size="xl" 
              className="w-full h-20 text-2xl font-black gap-4"
            >
              <LogIn className="w-8 h-8" /> ENTRAR CON GOOGLE
            </Button>
            <p className="text-slate-400 text-sm font-medium italic">
              * El progreso se sincronizará automáticamente con tu cuenta.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-100">
                <div className="text-left">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Sesión Iniciada</p>
                    <p className="text-brand-blue font-bold truncate max-w-[200px]">{userEmail}</p>
                </div>
                {isAdmin && (
                    <div className="bg-brand-yellow/10 text-brand-yellow px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-yellow/20">
                        Acceso Total
                    </div>
                )}
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tight">
              Configura tu perfil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">¿Cómo te llamas?</h3>
                <input 
                  type="text" 
                  placeholder="Tu nombre..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={15}
                  className="w-full text-3xl font-black text-brand-blue placeholder:text-slate-200 border-b-8 border-brand-blue/20 focus:border-brand-blue outline-none transition-all pb-4 text-center bg-transparent"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Elige tu personaje</h3>
                <div className="grid grid-cols-5 gap-3">
                  {availableAvatars.map(([key, icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAvatar(key)}
                      className={cn(
                        "w-full aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all relative overflow-hidden",
                        avatar === key 
                          ? "bg-brand-yellow border-4 border-white shadow-lg scale-105 rotate-2 z-10" 
                          : "bg-slate-100 hover:bg-slate-200 border-4 border-transparent"
                      )}
                    >
                      {icon}
                      {avatar === key && (
                        <motion.div layoutId="sparkle" className="absolute top-0 right-0 p-1">
                            <Sparkles size={12} className="text-white fill-white" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                  {lockedAvatars.map(([key]) => (
                    <div
                      key={key}
                      className="w-full aspect-square rounded-2xl bg-slate-100/50 flex items-center justify-center text-slate-300 relative border-2 border-dashed border-slate-200 grayscale"
                    >
                        <Lock size={16} />
                    </div>
                  ))}
                </div>
                {!isAdmin && (
                    <p className="mt-2 text-[10px] text-brand-pink font-bold uppercase tracking-wider">
                        ★ Obtén acceso full para desbloquear +20 avatares adolescentes y especiales
                    </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">¿Por dónde quieres empezar?</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {worlds.map((world) => (
                    <button
                      key={world.id}
                      type="button"
                      onClick={() => setStartingWorld(world.id as GameWorld)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl font-black text-[10px] transition-all border-b-4 h-24 gap-1",
                        startingWorld === world.id
                          ? "bg-brand-blue text-white border-brand-blue/30 scale-105"
                          : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                        startingWorld === world.id ? "bg-white/20" : "bg-slate-200"
                      )}>
                        {world.icon}
                      </div>
                      <span className="uppercase tracking-tighter leading-none">{world.label}</span>
                      <span className="opacity-50 text-[8px]">{world.age}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">
                  * Desbloquearás los primeros niveles del mundo seleccionado
                </p>
              </div>

              <Button 
                type="submit"
                size="xl" 
                className="w-full h-16 text-2xl font-black group"
                disabled={!name.trim()}
              >
                ¡LISTO PARA JUGAR! <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
