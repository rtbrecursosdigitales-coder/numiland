import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../types';
import { AVATAR_ICONS } from '../constants';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface AvatarSelectorProps {
  currentAvatar: Avatar;
  currentName: string;
  onSave: (name: string, avatar: Avatar) => void;
  onClose: () => void;
}

export function AvatarSelector({ currentAvatar, currentName, onSave, onClose }: AvatarSelectorProps) {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(currentAvatar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-periwinkle/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 max-w-xl w-full"
      >
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-800">TU PERFIL</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={32} className="text-slate-400" />
            </button>
        </div>

        <div className="space-y-8">
            <div>
                <label className="block text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">¿Cómo te llamas?</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={15}
                    className="w-full text-3xl font-black bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 focus:outline-none focus:border-brand-blue transition-colors text-slate-700"
                    placeholder="Escribe tu nombre..."
                />
            </div>

            <div>
                <label className="block text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">Elige tu personaje</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(AVATAR_ICONS).map(([key, icon]) => (
                        <motion.button
                            key={key}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedAvatar(key as Avatar)}
                            className={cn(
                                "aspect-square rounded-[2rem] flex items-center justify-center text-5xl transition-all",
                                selectedAvatar === key 
                                    ? "bg-brand-blue text-white kid-shadow border-4 border-blue-400 scale-110 z-10" 
                                    : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                            )}
                        >
                            {icon}
                        </motion.button>
                    ))}
                </div>
            </div>

            <Button size="xl" className="w-full mt-4" onClick={() => onSave(name, selectedAvatar)}>
                GUARDAR CAMBIOS
            </Button>
        </div>
      </motion.div>
    </div>
  );
}
