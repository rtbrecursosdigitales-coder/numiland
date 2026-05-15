import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelInfo, Avatar, GameWorld } from '../types';
import { Button } from './ui/Button';
import { Lock, Star, Trophy, Grid2X2, Settings, User, X, Medal, Sparkles, HelpCircle, Rocket, Map, Compass, Zap, GraduationCap, RefreshCcw, LogOut, Volume2 } from 'lucide-react';
import { AVATAR_ICONS } from '../constants';
import { cn, getStarTier } from '../lib/utils';

interface LevelSelectorProps {
  levels: LevelInfo[];
  starsPerLevel: Record<number, number>;
  completionsPerLevel: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  userName: string;
  avatar: string;
  currentWorld?: GameWorld;
  onWorldChange: (world: GameWorld) => void;
  onStatsClick?: () => void;
}

export function LevelSelector({ 
  levels, 
  starsPerLevel, 
  completionsPerLevel,
  onSelectLevel, 
  userName,
  avatar,
  currentWorld = 'explorers',
  onWorldChange,
  onStatsClick
}: LevelSelectorProps) {
  const [selectedWorld, setSelectedWorld] = React.useState<GameWorld>(currentWorld);
  
  React.useEffect(() => {
    setSelectedWorld(currentWorld);
  }, [currentWorld]);

  const handleWorldSelect = (world: GameWorld) => {
    setSelectedWorld(world);
    onWorldChange(world);
  };
  const [showPrizes, setShowPrizes] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const worlds = [
    { id: 'explorers' as const, label: 'Exploradores', icon: <Compass className="w-5 h-5" />, color: 'bg-brand-blue', description: '5 - 7 años' },
    { id: 'adventurers' as const, label: 'Aventureros', icon: <Map className="w-5 h-5" />, color: 'bg-brand-green', description: '8 - 10 años' },
    { id: 'scholars' as const, label: 'Tablas', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-brand-purple', description: 'Tablas 0 - 10' },
    { id: 'masters' as const, label: 'Maestros', icon: <Zap className="w-5 h-5" />, color: 'bg-brand-orange', description: '11 - 13 años' },
    { id: 'legends' as const, label: 'Leyendas', icon: <Rocket className="w-5 h-5" />, color: 'bg-brand-pink', description: 'Secundaria' },
  ];

  const filteredLevels = levels.filter(l => l.world === selectedWorld);
  const totalStars = starsPerLevel ? (Object.values(starsPerLevel) as number[]).reduce((acc, curr) => acc + (curr || 0), 0) : 0;
  const completedLevels = levels.filter(l => completionsPerLevel[l.id] > 0);

  return (
    <div className="relative">
      {/* World Selector */}
      <div className="max-w-6xl mx-auto mb-12 relative z-20">
        <div className="flex flex-wrap justify-center gap-3">
            {worlds.map((world) => {
                const isActive = selectedWorld === world.id;
                const worldLevels = levels.filter(l => l.world === world.id);
                const isLockedSelection = worldLevels.every(l => !l.unlocked);

                return (
                    <button
                        key={world.id}
                        onClick={() => handleWorldSelect(world.id as GameWorld)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-3xl transition-all border-b-8 active:translate-y-1 active:border-b-4 relative",
                            isActive 
                                ? `${world.color} text-white border-black/20 shadow-xl scale-105 z-10` 
                                : "bg-white/90 text-slate-400 border-slate-200 hover:bg-white"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shadow-inner",
                            isActive ? "bg-white/20" : "bg-slate-100"
                        )}>
                            {isLockedSelection ? <Lock className="w-4 h-4 opacity-50 text-slate-400" /> : world.icon}
                        </div>
                        <div className="text-left">
                            <p className="font-black uppercase tracking-tighter leading-none">{world.label}</p>
                            <p className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                isActive ? "opacity-70" : "opacity-40"
                            )}>{world.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Level Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 relative z-20">
        {filteredLevels.map((level, idx) => {
          const stars = starsPerLevel[level.id] || 0;
          const completions = completionsPerLevel[level.id] || 0;
          const tier = getStarTier(completions);
          const isUnlocked = level.unlocked;

          return (
            <motion.div
              key={level.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: isUnlocked ? 1.05 : 1, y: isUnlocked ? -5 : 0 }}
              whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
              onClick={() => onSelectLevel(level.id)}
              className={cn(
                "relative rounded-3xl p-3 md:p-4 flex flex-col items-center justify-center aspect-square transition-all overflow-hidden",
                isUnlocked && "cursor-pointer",
                level.isMaster && isUnlocked ? "bg-brand-orange/20 border-brand-orange/40 border-2 animate-pulse shadow-brand-orange/20" : "",
                isUnlocked 
                  ? "bg-white/90 backdrop-blur-sm shadow-xl border-2 md:border-4 border-white" 
                  : level.lockType === 'payment'
                    ? "bg-brand-pink/5 border-2 md:border-4 border-brand-pink/10"
                    : "bg-black/5 border-2 md:border-4 border-black/5"
              )}
            >
              {!isUnlocked && (
                <div className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[1px] z-20",
                    level.lockType === 'payment' ? "bg-brand-pink/10" : "bg-black/10"
                )}>
                  {level.lockType === 'payment' ? (
                    <>
                        <Lock size={24} className="text-brand-pink/40" />
                        <span className="text-[8px] font-black text-brand-pink/50 mt-2 tracking-widest">PREMIUM</span>
                    </>
                  ) : (
                    <>
                        <Lock size={20} className="text-slate-400/40" />
                        <span className="text-[8px] font-black text-slate-400/50 mt-2 tracking-widest uppercase">Completa Niveles</span>
                    </>
                  )}
                </div>
              )}

              <div className={cn(
                "w-20 h-20 md:w-32 md:h-32 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl border-6 md:border-[12px] border-white/50 mb-3 md:mb-6",
                level.color
              )}>
                <span className="text-4xl md:text-7xl font-black text-white drop-shadow-lg">
                    {level.isMaster ? '★' : (level.id > 400 ? '?' : level.id % 100)}
                </span>
              </div>

              <div className="text-center px-1">
                <span className={cn(
                    "text-sm md:text-xl font-black uppercase tracking-tight block mb-3 md:mb-5 leading-none drop-shadow-md",
                    isUnlocked ? "text-slate-700" : "text-white/40"
                )}>
                    {level.description || (level.isMaster ? 'MAESTRO' : `Hasta ${level.max}`)}
                </span>
                
                <div className="flex justify-center gap-0.5 md:gap-1">
                    {[1, 2, 3].map((s) => (
                        <Star 
                            key={s} 
                            size={16} 
                            style={{ fill: s <= stars ? tier.fill : 'transparent' }}
                            className={cn(
                                s <= stars ? tier.color : "text-slate-200",
                                !isUnlocked && "opacity-20"
                            )} 
                        />
                    ))}
                </div>
              </div>

              {level.completed && (
                 <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-brand-green rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                    <Trophy size={16} className="md:w-5 md:h-5" />
                 </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats/Footer area */}
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-brand-purple/10 rounded-[3rem] border-4 border-dashed border-brand-purple/20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-20">
        <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-purple rounded-3xl flex items-center justify-center text-white kid-shadow">
                <Grid2X2 size={40} />
            </div>
            <div className="text-left">
                <h4 className="text-2xl font-black text-brand-purple uppercase tracking-tight">Colección de Premios</h4>
                <p className="text-slate-500 font-bold italic">Completa niveles para ganar medallas</p>
            </div>
        </div>
        <Button 
            variant="secondary" 
            size="lg" 
            className="bg-brand-purple text-white border-purple-700 hover:bg-brand-purple/90"
            onClick={() => setShowPrizes(true)}
        >
            VER PREMIOS
        </Button>
      </div>

      {/* Prizes Modal */}
      <AnimatePresence>
        {showPrizes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-periwinkle/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-white drop-shadow-md uppercase tracking-tight text-left">Tus Logros</h2>
                <Button variant="ghost" onClick={() => setShowPrizes(false)} className="text-white">
                  <X size={32} />
                </Button>
              </div>

              {completedLevels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 opacity-30 text-center flex justify-center">🏆</div>
                  <h3 className="text-2xl font-black text-white/60 uppercase">¡Aún no tienes medallas!</h3>
                  <p className="text-white/40 font-bold italic">Supera niveles para ver tus premios aquí</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {completedLevels.map(level => (
                    <div key={level.id} className="bg-white/20 p-6 rounded-3xl border-2 border-white/30 flex flex-col items-center">
                      <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white",
                        level.color
                      )}>
                        <Medal size={40} className="text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase text-center mb-2">{level.label}</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(s => {
                          const levelTier = getStarTier(completionsPerLevel[level.id] || 1);
                          return (
                            <Star 
                                key={s} 
                                size={20} 
                                style={{ fill: s <= (starsPerLevel[level.id] || 0) ? levelTier.fill : 'transparent' }}
                                className={cn(
                                    s <= (starsPerLevel[level.id] || 0) ? levelTier.color : "text-white/20"
                                )} 
                                />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-white/10 text-center">
                <Button size="xl" variant="secondary" onClick={() => setShowPrizes(false)} className="w-full">
                  ¡A JUGAR!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-white drop-shadow-md uppercase tracking-tight text-left">Guía de Numiland</h2>
                <Button variant="ghost" onClick={() => setShowInfo(false)} className="text-white">
                  <X size={32} />
                </Button>
              </div>

              <div className="space-y-8">
                <section className="bg-slate-900/80 p-8 rounded-[3rem] border-2 border-white/20 flex flex-col items-start text-left shadow-2xl backdrop-blur-xl">
                    <h3 className="text-3xl font-black mb-4 uppercase flex items-center gap-3 text-brand-yellow drop-shadow-sm">
                        <Sparkles /> Los 5 Mundos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="bg-white/10 p-4 rounded-2xl border border-brand-blue/30">
                            <h4 className="text-brand-blue font-black mb-1 flex items-center gap-2">
                                <Compass size={18} /> EXPLORADORES (5-7 Años)
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Domina los números del <span className="text-brand-blue font-bold">1 al 100</span>. Aprenderás a contar, sumar y restar de forma visual y divertida.
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-brand-green/30">
                            <h4 className="text-brand-green font-black mb-1 flex items-center gap-2">
                                <Map size={18} /> AVENTUREROS (8-10 Años)
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                El gran salto hasta el <span className="text-brand-green font-bold">1.000</span>. Los niveles suben de 10 en 10 hasta alcanzar la cima del conocimiento.
                            </p>
                        </div>
                        <div className="bg-brand-purple/20 p-4 rounded-2xl border border-brand-purple/30">
                            <h4 className="text-brand-purple font-black mb-1 flex items-center gap-2">
                                <GraduationCap size={18} /> TABLAS (Academia)
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Conviértete en un experto de las tablas del <span className="text-brand-purple font-bold">0 al 10</span>. ¡El pilar de las matemáticas!
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-brand-orange/30">
                            <h4 className="text-brand-orange font-black mb-1 flex items-center gap-2">
                                <Zap size={18} /> MAESTROS (11-13 Años)
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                ¡Poder total hasta el <span className="text-brand-orange font-bold">10.000</span>! Niveles que avanzan de 100 en 100 para un cálculo imparable.
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-brand-pink/30 md:col-span-2">
                            <h4 className="text-brand-pink font-black mb-1 flex items-center gap-2">
                                <Rocket size={18} /> LEYENDAS (Secundaria)
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Bienvenido a la <span className="text-brand-pink font-bold">Dimensión X</span>. Álgebra, coordenadas y retos que solo las leyendas pueden resolver.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/80 p-8 rounded-[3rem] border-2 border-white/20 flex flex-col items-start text-left shadow-2xl backdrop-blur-xl">
                    <h3 className="text-3xl font-black mb-4 uppercase flex items-center gap-3 text-brand-pink drop-shadow-sm">
                        <Lock className="text-brand-pink" /> Sistema de Candados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-pink/20 p-3 rounded-2xl border-2 border-brand-pink/30">
                                    <Lock size={24} className="text-brand-pink" />
                                </div>
                                <div>
                                    <h4 className="text-brand-pink font-black uppercase text-sm">Candado Premium</h4>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Requiere Suscripción</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Estos niveles son exclusivos para usuarios Premium. Al suscribirte, desbloqueas los <span className="text-white font-bold italic">10 primeros niveles de cada mundo</span> al instante.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-3 rounded-2xl border-2 border-white/20">
                                    <Lock size={24} className="text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="text-slate-300 font-black uppercase text-sm">Candado de Progreso</h4>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Supera Desafíos</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Para abrir estos niveles debes completar los anteriores. Es el camino del aprendizaje: ¡Gana estrellas para avanzar!
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/80 p-8 rounded-[3rem] border-2 border-white/20 flex flex-col items-start text-left shadow-2xl backdrop-blur-xl">
                    <h3 className="text-3xl font-black mb-4 uppercase flex items-center gap-3 text-brand-pink drop-shadow-sm">
                        <Star className="fill-brand-pink" /> Maestría Progresiva
                    </h3>
                    <p className="font-bold text-xl mb-6 text-white leading-relaxed">
                        ¡Repite niveles para ganar mejores estrellas! Cada vez que superas un nivel, la recompensa evoluciona:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {[
                            { n: '1 VEZ', t: 'BRONCE', c: 'bg-brand-orange' },
                            { n: '2 VECES', t: 'PLATA', c: 'bg-slate-300' },
                            { n: '3 VECES', t: 'ORO', c: 'bg-brand-yellow' },
                            { n: '4 VECES', t: 'DIAMANTE', c: 'bg-[#B9F2FF]' },
                            { n: '6 VECES', t: 'RUBÍ', c: 'bg-[#E0115F]' },
                            { n: '8 VECES', t: 'MAESTRO', c: 'bg-[#9966CC]' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 p-4 rounded-3xl flex flex-col items-center border border-white/10">
                                <span className="text-[11px] font-black text-white/40 mb-2">{item.n}</span>
                                <div className={cn("w-12 h-12 rounded-full mb-2 border-2 border-white/30 flex items-center justify-center shadow-lg", item.c)}>
                                    <Star size={20} className="text-white fill-white" />
                                </div>
                                <span className="text-sm font-black text-white">{item.t}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-slate-900/80 p-8 rounded-[3rem] border-2 border-white/20 flex flex-col items-start text-left shadow-2xl backdrop-blur-xl">
                    <h3 className="text-3xl font-black mb-4 uppercase flex items-center gap-3 text-brand-green drop-shadow-sm">
                        <Trophy /> Aprendizaje Progresivo
                    </h3>
                    <p className="font-bold text-xl text-white leading-relaxed">
                        El juego está <span className="text-brand-yellow font-black px-2 py-0.5 bg-white/10 rounded-lg">optimizado con dificultad progresiva</span>. 
                        Los niveles comienzan fáciles y se vuelven más difíciles a medida que avanzas, 
                        asegurando que siempre estés motivado.
                    </p>
                </section>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 space-y-10">
                {/* RTB Footer specifically for the guide */}
                <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[3rem] border-4 border-white shadow-xl flex flex-col md:flex-row items-center gap-6 transition-all hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                        {!logoError ? (
                          <img 
                              src="https://rtbrecursosdigitales.com/wp-content/uploads/2023/10/cropped-favicon-rtb-192x192.png" 
                              alt="RTB Logo" 
                              className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-sm"
                              referrerPolicy="no-referrer"
                              onError={() => setLogoError(true)}
                          />
                        ) : (
                          <div className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center bg-brand-blue/10 rounded-2xl p-2">
                             <span className="text-brand-blue font-black text-2xl">RTB</span>
                          </div>
                        )}
                        <div className="h-12 w-0.5 bg-slate-200 rounded-full hidden md:block" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <p className="text-slate-800 font-black text-xl tracking-tighter mb-1 uppercase">
                            RTB RECURSOS DIGITALES
                        </p>
                        <p className="text-slate-500 font-bold text-sm leading-snug mb-3">
                            Recursos para crear, aprender y resolver. <br/>
                            <span className="text-brand-pink font-black uppercase text-xs italic">Volviendo divertidas las matemáticas.</span>
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest bg-slate-100/50 inline-block px-3 py-1 rounded-full">
                              Derechos reservados 2026
                          </p>
                          <p className="text-slate-300 font-bold text-[10px] tracking-widest uppercase">
                              Versión 1.0.26.4
                          </p>
                        </div>
                    </div>
                </div>

                <Button size="xl" variant="secondary" onClick={() => setShowInfo(false)} className="w-full">
                  ¡ENTENDIDO!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
