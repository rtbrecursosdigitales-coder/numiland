import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, UserProgress } from '../types';
import { AVATAR_ICONS } from '../constants';
import { Button } from './ui/Button';
import { X, Pencil, Star, Mail, ShieldCheck, ArrowLeft, Rocket, Crown } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileProps {
  progress: UserProgress;
  totalStars: number;
  isPaid: boolean;
  userEmail: string | null;
  onSave: (name: string, avatar: Avatar) => void;
  onClose: () => void;
  onInstall: () => void;
  canInstall: boolean;
  onSignOut: () => void;
}

export function Profile({ progress, totalStars, isPaid, userEmail, onSave, onClose, onInstall, canInstall, onSignOut }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(progress.name);
  const [editAvatar, setEditAvatar] = useState<Avatar>(progress.avatar);

  const handleSave = () => {
    onSave(editName, editAvatar);
    setIsEditing(false);
  };

  const isAdmin = userEmail === 'rtb.recursosdigitales@gmail.com';
  const availableAvatars = Object.entries(AVATAR_ICONS).filter((_, i) => isPaid || isAdmin || i < 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-periwinkle/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto relative no-scrollbar"
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-blue/10 to-transparent pointer-events-none" />
        
        <div className="p-5 md:p-10 relative z-10">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <button 
                onClick={onClose} 
                className="p-2 md:p-3 bg-white/50 hover:bg-white rounded-2xl transition-all shadow-sm group"
            >
                <ArrowLeft size={20} className="text-slate-600 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="text-center flex-1">
                <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter">Mi Perfil</h2>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                    <div className={cn(
                        "text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full border shadow-lg transition-all",
                        isPaid 
                            ? "bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink border-white text-white scale-110" 
                            : "bg-slate-100 border-slate-200 text-slate-400"
                    )}>
                        {isPaid ? (
                            <span className="flex items-center gap-1">
                                <Crown size={10} className="fill-white" />
                                Explorador Premium
                            </span>
                        ) : 'Explorador Free'}
                    </div>
                </div>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12" /> {/* Spacer */}
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div 
                key="view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center"
              >
                {/* Avatar Display */}
                <div className="relative group mb-4 md:mb-6">
                    <div className="w-32 h-32 md:w-56 md:h-56 bg-white rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center text-6xl md:text-9xl shadow-2xl border-4 md:border-8 border-white relative overflow-hidden group-hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-transparent" />
                        {AVATAR_ICONS[progress.avatar]}
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2.5 md:p-4 bg-brand-pink text-white rounded-xl md:rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-2 md:border-4 border-white"
                    >
                        <Pencil size={18} className="md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Name Display */}
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">{progress.name}</h3>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                    <div className="bg-white/60 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border-2 border-white flex flex-col items-center gap-0.5 md:gap-1">
                        <div className="flex items-center gap-2 text-brand-yellow mb-0.5">
                            <Star className="fill-brand-yellow w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-xl md:text-2xl font-black">{totalStars}</span>
                        </div>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Estrellas</span>
                    </div>
                    <div className="bg-white/60 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border-2 border-white flex flex-col items-center gap-0.5 md:gap-1">
                        <div className="flex items-center gap-2 text-brand-blue mb-0.5">
                            <Mail className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-medium text-slate-500 truncate w-full text-center px-2">{userEmail}</span>
                    </div>
                </div>

                {isPaid ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 md:mt-6 w-full p-4 md:p-6 bg-gradient-to-br from-brand-pink via-brand-orange to-brand-yellow rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-white flex flex-col items-center gap-3 md:gap-4 border-2 md:border-4 border-white/20"
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                            <Rocket className="animate-bounce w-6 h-6 md:w-8 md:h-8" />
                            <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">App Premium</span>
                        </div>
                        
                        {canInstall ? (
                            <>
                                <p className="text-xs md:text-sm font-bold text-white text-center leading-tight">¡Genial! Tienes acceso total. Instala la app para jugar donde quieras sin conexión.</p>
                                <Button 
                                    onClick={onInstall}
                                    size="lg"
                                    className="bg-white text-brand-pink hover:bg-slate-50 w-full font-black py-4 md:py-6 rounded-2xl shadow-2xl border-b-4 md:border-b-6 border-slate-200 active:border-b-0 active:translate-y-1 text-lg md:text-xl"
                                >
                                    INSTALAR AHORA
                                </Button>
                            </>
                        ) : (
                            <div className="bg-black/10 p-3 md:p-4 rounded-2xl w-full">
                                <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-center mb-2 md:mb-3">Instalación Manual</p>
                                <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-[11px] font-bold leading-tight">
                                    <p className="flex items-center gap-2">📱 <span className="opacity-90">En iPhone: "Compartir" y "Agregar a inicio".</span></p>
                                    <p className="flex items-center gap-2">🤖 <span className="opacity-90">En Android: Menú y "Instalar aplicación".</span></p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        onClick={() => window.location.reload()}
                        className="mt-4 md:mt-6 w-full p-3 md:p-4 bg-slate-100 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                        <Lock size={16} className="md:w-5 md:h-5" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Instalación solo para Premium Total</span>
                    </motion.div>
                )}

                <div className="mt-6 md:mt-8 w-full flex flex-col gap-3">
                    <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full h-12 md:h-16 font-black uppercase tracking-widest text-xs md:text-sm"
                        onClick={() => setIsEditing(true)}
                    >
                        Editar Mi Perfil
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="lg" 
                        className="w-full h-10 md:h-12 font-bold uppercase tracking-widest text-[10px] md:text-xs text-slate-400 hover:text-brand-pink"
                        onClick={onSignOut}
                    >
                        Cerrar Sesión
                    </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest text-center">Tu Nombre</label>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={15}
                        className="w-full text-4xl font-black bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 focus:outline-none focus:border-brand-blue transition-colors text-slate-700 text-center"
                        placeholder="Escribe tu nombre..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest text-center">Tu Personaje</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[30vh] overflow-y-auto pr-2 no-scrollbar p-2">
                        {availableAvatars.map(([key, icon]) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setEditAvatar(key as Avatar)}
                                className={cn(
                                    "aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all relative",
                                    editAvatar === key 
                                        ? "bg-brand-blue text-white shadow-lg ring-4 ring-brand-blue/30 scale-105 z-10" 
                                        : "bg-white border-2 border-slate-100 text-slate-400"
                                )}
                            >
                                {icon}
                                {editAvatar === key && (
                                    <div className="absolute -top-2 -right-2 bg-brand-yellow p-1 rounded-full">
                                        <ShieldCheck size={12} className="text-white fill-brand-yellow" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                    {!isPaid && !isAdmin && (
                        <p className="text-center text-[10px] text-brand-pink font-black uppercase tracking-widest mt-4 animate-pulse">
                             ✨ ¡Desbloquea +20 personajes con Premium!
                        </p>
                    )}
                </div>

                <div className="flex gap-4">
                    <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        className="flex-[2]"
                        disabled={!editName.trim()}
                        onClick={handleSave}
                    >
                        Guardar Cambios
                    </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
