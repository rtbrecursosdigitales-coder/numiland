import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, UserRoundX, RefreshCcw, MessageSquare, ShieldCheck, Music, Mic2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
    voicesEnabled: boolean;
    onToggleVoices: () => void;
    effectsEnabled: boolean;
    onToggleEffects: () => void;
    onResetProgress: () => void;
    onSignOut: () => void;
}

export function Settings({ 
    isOpen, 
    onClose, 
    isMuted, 
    onToggleMute, 
    voicesEnabled, 
    onToggleVoices, 
    effectsEnabled, 
    onToggleEffects,
    onResetProgress,
    onSignOut
}: SettingsProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden relative shadow-2xl"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Ajustes</h3>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Audio Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audio del Juego</label>
                            
                            <div className="grid grid-cols-1 gap-2">
                                <button 
                                    onClick={onToggleMute}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                                        isMuted 
                                            ? "border-slate-100 bg-slate-50 text-slate-400" 
                                            : "border-brand-purple bg-brand-purple/5 text-brand-purple"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        <span className="font-bold">Silenciar Todo</span>
                                    </div>
                                    <div className={cn(
                                        "w-12 h-6 rounded-full relative transition-colors",
                                        isMuted ? "bg-slate-300" : "bg-brand-purple"
                                    )}>
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                            isMuted ? "left-1" : "left-7"
                                        )} />
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={onToggleVoices}
                                        disabled={isMuted}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                            !voicesEnabled || isMuted
                                                ? "border-slate-100 bg-slate-50 text-slate-400" 
                                                : "border-brand-blue bg-brand-blue/5 text-brand-blue"
                                        )}
                                    >
                                        <Mic2 size={20} />
                                        <span className="text-xs font-black uppercase">Voces AI</span>
                                    </button>

                                    <button 
                                        onClick={onToggleEffects}
                                        disabled={isMuted}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                            !effectsEnabled || isMuted
                                                ? "border-slate-100 bg-slate-50 text-slate-400" 
                                                : "border-brand-pink bg-brand-pink/5 text-brand-pink"
                                        )}
                                    >
                                        <Music size={20} />
                                        <span className="text-xs font-black uppercase">Efectos</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danger/Account Section */}
                        <div className="pt-4 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Herramientas</label>
                            
                            <Button 
                                variant="secondary"
                                className="w-full justify-start gap-4 h-14 text-slate-600 border-slate-200"
                                onClick={onResetProgress}
                            >
                                <RefreshCcw size={20} />
                                REINICIAR PROGRESO
                            </Button>

                            <Button 
                                variant="outline"
                                className="w-full justify-start gap-4 h-14 text-slate-400 border-slate-100 hover:bg-slate-50"
                                onClick={onSignOut}
                            >
                                <UserRoundX size={20} />
                                CERRAR SESIÓN
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Numiland v1.0.26.4</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
