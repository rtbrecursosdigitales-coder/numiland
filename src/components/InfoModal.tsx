import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, MessageCircle, Rocket, Heart, ShieldCheck, Mail, Star, Lock } from 'lucide-react';
import { Button } from './ui/Button';

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

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <section>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nuestra Misión</h4>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                Transformamos el aprendizaje de las matemáticas en una aventura épica. Diseñado para niños de 5 a 9 años, Numiland fomenta la confianza numérica a través del juego y el refuerzo positivo.
                            </p>
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
