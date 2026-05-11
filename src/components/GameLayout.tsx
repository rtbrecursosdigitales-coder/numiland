import { motion } from 'motion/react';
import React, { ReactNode } from 'react';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import { cn } from '../lib/utils';

interface GameLayoutProps {
  children: ReactNode;
  levelLabel: string;
  progress: number;
  total: number;
  onBack: () => void;
  stars: number;
}

export function GameLayout({ children, levelLabel, progress, total, onBack, stars }: GameLayoutProps) {
  return (
    <div className="immersive-bg min-h-screen flex flex-col overflow-x-hidden scroll-smooth">
      {/* Cloud shapes */}
      <div className="cloud-blur top-10 left-10 w-32 h-20 animate-float" />
      <div className="cloud-blur top-32 right-20 w-48 h-24 animate-float [animation-delay:1s]" />
      <div className="cloud-blur bottom-20 left-1/4 w-64 h-32 animate-float [animation-delay:2s]" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="rounded-2xl w-14 h-14 p-0 bg-white/20 hover:bg-white/40 border-white/40">
            <ArrowLeft size={28} />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black text-white drop-shadow-md tracking-tight uppercase">NumiLand</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-20 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-green shadow-[0_0_8px_#06D6A0]" 
                  style={{ width: `${(progress / total) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">{levelLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-full pl-2 pr-6 py-2 border border-white/30 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-xl shadow-inner">⭐</div>
            <span className="text-xl font-black text-white">{stars}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center px-4 py-2 md:py-4 overflow-hidden">
        <motion.div
          key={progress} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-4xl p-3 md:p-4 lg:p-6 relative flex flex-col items-center overflow-y-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer / Step indicator */}
      <footer className="relative z-10 p-2 md:p-4 lg:p-6 flex flex-col items-center gap-2 shrink-0 mt-auto">
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto max-w-full px-4 py-1 no-scrollbar bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
          {Array.from({ length: total }).map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-md font-black transition-all shrink-0",
                  i + 1 < progress ? "bg-brand-green text-white border-2 md:border-4 border-white shadow-lg" : 
                  i + 1 === progress ? "bg-white border-2 md:border-4 border-brand-blue text-brand-blue shadow-xl animate-pulse ring-2 md:ring-4 ring-brand-blue/30 scale-110" : 
                  "bg-white/20 border-2 md:border-4 border-white/20 text-white/40"
                )}
              >
                {i + 1 < progress ? "✓" : i + 1}
              </div>
              {i < total - 1 && <div className="w-4 md:w-8 h-1 bg-white/40 rounded-full shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </footer>
    </div>
  );
}
