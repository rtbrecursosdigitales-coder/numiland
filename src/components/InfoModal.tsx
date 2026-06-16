import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, MessageCircle, Rocket, Heart, ShieldCheck, Mail, Star, Lock, Compass, Map, GraduationCap, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { RtbLogo } from './RtbLogo';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPaid: boolean;
    onGoToPayment: () => void;
}

export function InfoModal({ isOpen, onClose, isPaid, onGoToPayment }: InfoModalProps) {
    if (!isOpen) return null;

    const handleWhatsApp = () => {
        window.open('https://wa.me/5491123456789', '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden relative shadow-2xl"
            >
                <div className="bg-brand-blue p-8 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Rocket size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Sobre Numiland</h3>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">v1.2.0 | RTB Digital</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Brand Logo Container */}
                    <div className="p-5 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 flex justify-center shadow-inner">
                        <RtbLogo layout="horizontal" />
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nuestra Misión</h4>
                            <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                                Transformamos el aprendizaje de las matemáticas en una aventura épica. Diseñado para niños de 5 a 13 años, Numiland fomenta la confianza numérica a través del juego, desafíos gamificados y el refuerzo positivo.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Los 5 Mundos de Numiland</h4>
                            
                            <div className="space-y-3">
                                {/* Exploradores */}
                                <div className="flex items-start gap-3 p-3 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                    <div className="p-2 bg-brand-blue rounded-xl text-white mt-1">
                                        <Compass size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-extrabold text-slate-800 text-sm">Mundo Exploradores (5 - 7 años)</h5>
                                        <p className="text-slate-500 text-[11px] font-bold leading-tight mt-0.5">
                                            Primeros pasos matemáticos. Conteo interactivo de objetos animados, correspondencia de conjuntos, secuencias numéricas cortas, sumas y restas sencillas.
                                        </p>
                                    </div>
                                </div>

                                {/* Aventureros */}
                                <div className="flex items-start gap-3 p-3 bg-brand-green/5 rounded-2xl border border-brand-green/10">
                                    <div className="p-2 bg-brand-green rounded-xl text-white mt-1">
                                        <Map size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-extrabold text-slate-800 text-sm">Mundo Aventureros (8 - 10 años)</h5>
                                        <p className="text-slate-500 text-[11px] font-bold leading-tight mt-0.5">
                                            Retos de cálculo mental rápido, patrones secuenciales y la <span className="text-brand-green">escritura correcta de los nombres de los números en español latino</span>.
                                        </p>
                                    </div>
                                </div>

                                {/* Tablas */}
                                <div className="flex items-start gap-3 p-3 bg-brand-purple/5 rounded-2xl border border-brand-purple/10">
                                    <div className="p-2 bg-brand-purple rounded-xl text-white mt-1">
                                        <GraduationCap size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-extrabold text-slate-800 text-sm">Mundo Tablas (Multiplicar 0 - 10)</h5>
                                        <p className="text-slate-500 text-[11px] font-bold leading-tight mt-0.5">
                                            Entrenamiento intensivo y lúdico para dominar las tablas de multiplicar del 0 al 10, divisiones sencillas y resolución mental veloz de problemas.
                                        </p>
                                    </div>
                                </div>

                                {/* Maestros */}
                                <div className="flex items-start gap-3 p-3 bg-brand-orange/5 rounded-2xl border border-brand-orange/10">
                                    <div className="p-2 bg-brand-orange rounded-xl text-white mt-1">
                                        <Zap size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-extrabold text-slate-800 text-sm">Mundo Maestros (11 - 13 años)</h5>
                                        <p className="text-slate-500 text-[11px] font-bold leading-tight mt-0.5">
                                            Aritmética avanzada, patrones complejos, operaciones de álgebra básica preliminar y <span className="text-brand-orange font-bold">traducción/escritura de números grandes en español</span>.
                                        </p>
                                    </div>
                                </div>

                                {/* Leyendas */}
                                <div className="flex items-start gap-3 p-3 bg-brand-pink/5 rounded-2xl border border-brand-pink/10">
                                    <div className="p-2 bg-brand-pink rounded-xl text-white mt-1">
                                        <Rocket size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-extrabold text-slate-800 text-sm">Mundo Leyendas (Secundaria)</h5>
                                        <p className="text-slate-500 text-[11px] font-bold leading-tight mt-0.5">
                                            Ecuaciones avanzadas con incógnitas, interpretación geométrica de áreas/perímetros, identificación de coordenadas cartesianas y funciones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-50/80 p-5 rounded-3xl border-2 border-slate-100 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sistema Especial de Estrellas</h4>
                            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                                ¡Cada nivel es rejugable y evoluciona! Cada vez que completas un nivel, la insignia de estrellas cambia de color para demostrar tu maestría acumulada:
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-extrabold text-slate-700">
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">🥉</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-brand-orange">Bronce</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">1 vez superado</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">🥈</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-slate-400">Plata</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">2 veces superado</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">🥇</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-amber-500">Oro</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">3 veces superado</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">💎</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-sky-400">Diamante</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">4-5 veces superado</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">❤️</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-rose-500">Rubí</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">6-7 veces superado</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-lg">👑</span>
                                    <div>
                                        <p className="font-extrabold leading-none text-purple-500">Maestro</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">8+ veces superado</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {!isPaid && (
                            <div className="bg-brand-yellow/10 p-5 rounded-3xl border-2 border-brand-yellow/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Star className="text-brand-orange fill-brand-orange" size={20} />
                                    <h4 className="font-black text-slate-800 uppercase tracking-tight">¡Únete al Club Premium!</h4>
                                </div>
                                <p className="text-slate-600 text-[11px] mb-4 font-bold leading-tight">
                                    Desbloquea todos los mundos, personajes exclusivos y niveles legendarios. ¡Toda la diversión sin límites!
                                </p>
                                <Button 
                                    onClick={onGoToPayment}
                                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-xl shadow-brand-orange/20"
                                >
                                    ¡QUIERO SER PREMIUM!
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleWhatsApp}
                            className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border-2 border-green-100 text-green-600 hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Soporte</span>
                        </button>
                        <button 
                            onClick={() => window.open('mailto:soporte@numiland.com', '_blank')}
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <Mail size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Contacto</span>
                        </button>
                    </div>

                    <div className="pt-2 text-center">
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            Hecho con <Heart size={10} className="text-brand-pink fill-brand-pink" /> por RTB Recursos Digitales
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
