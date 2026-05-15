import React, { useState, useMemo, useEffect } from 'react';
import { LevelSelector } from './components/LevelSelector';
import { Onboarding } from './components/Onboarding';
import { RewardModal } from './components/ui/RewardModal';
import { GameOverModal } from './components/ui/GameOverModal';
import { ComingSoonModal } from './components/ui/ComingSoonModal';
import { CountingTask } from './components/tasks/CountingTask';
import { SequenceTask } from './components/tasks/SequenceTask';
import { ComparisonTask } from './components/tasks/ComparisonTask';
import { ArithmeticTask } from './components/tasks/ArithmeticTask';
import { OrderingTask } from './components/tasks/OrderingTask';
import { NumberLineTask } from './components/tasks/NumberLineTask';
import { MatchingTask } from './components/tasks/MatchingTask';
import { AlgebraTask } from './components/tasks/AlgebraTask';
import { GeometryTask } from './components/tasks/GeometryTask';
import { CoordinateTask } from './components/tasks/CoordinateTask';
import { FunctionTask } from './components/tasks/FunctionTask';
import { VisualMultiplicationTask } from './components/tasks/VisualMultiplicationTask';
import { WordProblemTask } from './components/tasks/WordProblemTask';
import { MissingFactorTask } from './components/tasks/MissingFactorTask';
import { GameGenerator } from './lib/GameGenerator';
import { LEVELS, INITIAL_PROGRESS, TASKS_PER_LEVEL, MASTER_TASKS_COUNT } from './constants';
import { UserProgress, TaskType, GameTask, Avatar, GameWorld } from './types';
import confetti from 'canvas-confetti';
import { GameLayout } from './components/GameLayout';
import { Profile } from './components/Profile';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Button } from './components/ui/Button';
import { Lock, Crown, LogOut, MessageCircle, ExternalLink, Volume2, RefreshCcw, Compass, Trophy, Zap, Rocket, X } from 'lucide-react';
import { cn } from './lib/utils';
import { say, stopSpeaking } from './lib/speech';

// Links de Mercado Pago
const MP_SINGLE_WORLD_LINK = 'https://mpago.la/1FGeP6i'; 
const MP_FULL_ACCESS_LINK = 'https://mpago.la/1mhLkmw';

export default function App() {
  // --- AUTH & CLOUD STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false); // This will indicate Full Access
  const [paidWorldIds, setPaidWorldIds] = useState<GameWorld[]>([]);
  const [loading, setLoading] = useState(true);

  // --- GAME STATE ---
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [view, setView] = useState<'onboarding' | 'lobby' | 'game' | 'payment' | 'profile'>('onboarding');
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [gameOverReason, setGameOverReason] = useState<'lives' | 'time'>('lives');
  const [lives, setLives] = useState(2);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const MAX_LIVES = 2;
  const TIME_PER_TASK = 15; // Segundos por tarea

  // --- AUTH OBSERVER ---
  useEffect(() => {
    // Fail-safe: Si después de 5 segundos no ha cargado, forzamos la salida de la pantalla de carga
    const timeoutId = setTimeout(() => {
        if (loading) {
            console.log('Auth observer timeout - Forcing loading state off');
            setLoading(false);
        }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        try {
            setUser(currentUser);
            if (currentUser) {
                // Check for payment success in URL
                const urlParams = new URLSearchParams(window.location.search);
                const isSuccess = urlParams.get('payment') === 'success';

                const userRef = doc(db, 'users', currentUser.uid);
                
                if (isSuccess) {
                    await setDoc(userRef, { isPaid: true }, { merge: true });
                    setIsPaid(true);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const fullAccess = userData.isPaid || userData.isFullAccess || currentUser.email === 'rtb.recursosdigitales@gmail.com';
                    setIsPaid(fullAccess);
                    const paidWorlds = userData.paidWorldIds || [];
                    setPaidWorldIds(paidWorlds);

                    setProgress(prev => ({
                        ...prev,
                        ...userData,
                        avatar: userData.avatar as Avatar || 'bear',
                        name: userData.name || '',
                        currentWorld: userData.currentWorld as GameWorld || 'explorers',
                        isFullAccess: fullAccess,
                        paidWorldIds: paidWorlds
                    }));
                    if (userData.name) {
                        setView('lobby');
                    } else {
                        setView('onboarding');
                    }
                } else {
                    setIsPaid(currentUser.email === 'rtb.recursosdigitales@gmail.com');
                    setView('onboarding');
                }
            } else {
                setIsPaid(false);
                setProgress(INITIAL_PROGRESS);
                setView('onboarding');
            }
        } catch (error) {
            console.error('Error in auth observer:', error);
            setView('onboarding');
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    });

    return () => {
        unsubscribe();
        clearTimeout(timeoutId);
    };
  }, []);


  // --- CLOUD SYNC ---
  const syncProgress = async (newProgress: UserProgress) => {
    if (!user) return;
    try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            ...newProgress,
            email: user.email,
            userId: user.uid,
            isPaid: isPaid, // Preserve paid status
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.error('Error syncing to cloud', e);
    }
  };

  // --- DERIVED ---
  const totalStarsCount = useMemo(() => {
    if (!progress.starsPerLevel) return 0;
    return (Object.values(progress.starsPerLevel) as number[]).reduce((a, b) => a + (b || 0), 0);
  }, [progress.starsPerLevel]);

  const levelInfoList = useMemo(() => {
    return LEVELS.map(l => {
        const isFirst10OfWorld = 
            (l.id >= 1 && l.id <= 10) ||
            (l.id >= 101 && l.id <= 110) ||
            (l.id >= 201 && l.id <= 210) ||
            (l.id >= 301 && l.id <= 310) ||
            (l.id >= 401 && l.id <= 410);

        let lockType: 'none' | 'payment' | 'progression' = 'none';
        let unlocked = false;

        if (isPaid || paidWorldIds.includes(l.world)) {
            if (isFirst10OfWorld || progress.unlockedLevelIds.includes(l.id)) {
                unlocked = true;
                lockType = 'none';
            } else {
                unlocked = false;
                lockType = 'progression';
            }
        } else {
            // Free user
            // Allow explorers world first 10
            const isFreeUnlocked = (l.world === 'explorers' && (l.id <= 10 || progress.unlockedLevelIds.includes(l.id)));
            if (isFreeUnlocked) {
                unlocked = true;
                lockType = 'none';
            } else {
                unlocked = false;
                lockType = 'payment';
            }
        }

        return {
            ...l,
            unlocked,
            lockType,
            completed: progress.completedLevelIds.includes(l.id),
            stars: progress.starsPerLevel[l.id] || 0,
            completions: progress.completionsPerLevel[l.id] || 0
        };
    });
  }, [progress, isPaid]);

  // --- VOICE ---
  useEffect(() => {
    if (view === 'game' && currentTaskIndex !== null && tasks[currentTaskIndex]) {
        const t = tasks[currentTaskIndex];
        // Only auto-play if in explorers (World 1) or first task
        const isWorld1 = currentLevelId && currentLevelId < 100;
        if (isWorld1 || currentTaskIndex === 0) {
            say(t.prompt);
        }
    }
  }, [view, currentTaskIndex, tasks, currentLevelId]);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Si no hay prompt automático, llevamos al perfil para ver las instrucciones manuales
      setView('profile');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (view === 'game' && timeLeft !== null && !showRewardModal && !showGameOverModal) {
        interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(interval);
                    setGameOverReason('time');
                    setShowGameOverModal(true);
                    playTone(220, 0.4);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, timeLeft, showRewardModal, showGameOverModal]);

  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // --- ACTIONS ---
  const handleCheckPayment = async () => {
    if (!user) return;
    setIsCheckingPayment(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const fullAccess = userData.isPaid || userData.isFullAccess;
            const paidWorlds = userData.paidWorldIds || [];
            
            setIsPaid(fullAccess);
            setPaidWorldIds(paidWorlds);
            
            setProgress(prev => ({
                ...prev,
                isFullAccess: fullAccess,
                paidWorldIds: paidWorlds
            }));
            
            if (fullAccess || (progress.currentWorld && paidWorlds.includes(progress.currentWorld))) {
                setView('lobby');
            } else {
                setIsCheckingPayment(false);
            }
        } else {
            setIsCheckingPayment(false);
        }
    } catch (e) {
        console.error(e);
        setIsCheckingPayment(false);
    }
  };

  const handleInformPaymentWhatsApp = () => {
    const message = encodeURIComponent(`Hola! Ya realicé el pago de Matemágicos para la cuenta ${user?.email}. ¿Podrían activarlo manualmente?`);
    window.open(`https://wa.me/5491123456789?text=${message}`, '_blank');
  };
  const handleStartLevel = (levelId: number) => {
    const level = levelInfoList.find(l => l.id === levelId);
    if (!level) return;

    if (!level.unlocked) {
        if (level.lockType === 'payment') {
            setView('payment');
        }
        return;
    }

    setCurrentLevelId(levelId);
    setCurrentTaskIndex(0);
    setLastCorrect(null);
    setLives(MAX_LIVES);
    setShowGameOverModal(false);
    
    // Generate procedural tasks
    let gameTypes: TaskType[] = [];
    let hasTimeLimit = false;

    if (level.world === 'explorers') {
        gameTypes = [TaskType.COUNTING, TaskType.MATCHING, TaskType.SEQUENCE, TaskType.MISSING_NUMBER, TaskType.COMPARISON, TaskType.ADDITION, TaskType.SUBTRACTION];
    } else if (level.world === 'adventurers') {
        gameTypes = [TaskType.SEQUENCE, TaskType.NUMBER_LINE, TaskType.ORDERING, TaskType.PATTERN, TaskType.ADDITION, TaskType.SUBTRACTION, TaskType.MULTIPLICATION, TaskType.DIVISION];
        hasTimeLimit = true;
    } else if (level.world === 'scholars') {
        gameTypes = [TaskType.VISUAL_MULTIPLICATION, TaskType.WORD_PROBLEM, TaskType.MULTIPLICATION, TaskType.DIVISION, TaskType.MISSING_FACTOR];
        hasTimeLimit = true;
    } else if (level.world === 'masters') {
        gameTypes = [TaskType.NUMBER_LINE, TaskType.ORDERING, TaskType.PATTERN, TaskType.ADDITION, TaskType.SUBTRACTION, TaskType.MULTIPLICATION, TaskType.DIVISION, TaskType.ALGEBRA];
        hasTimeLimit = true;
    } else { // legends
        gameTypes = [TaskType.ALGEBRA, TaskType.GEOMETRY, TaskType.COORDINATES, TaskType.FUNCTIONS, TaskType.MULTIPLICATION, TaskType.DIVISION];
        hasTimeLimit = true;
    }

    setTimeLeft(hasTimeLimit ? TIME_PER_TASK : null);

    const newTasks: GameTask[] = [];
    const totalTasks = level.isMaster ? MASTER_TASKS_COUNT : TASKS_PER_LEVEL;
    
    for (let i = 0; i < totalTasks; i++) {
        const randomType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
        newTasks.push(GameGenerator.generateTask(randomType, level.min, level.max, i, totalTasks, level.targetTable));
    }

    setTasks(newTasks);
    setView('game');
  };

  const handleLevelComplete = () => {
    const stars = 3; 
    
    const nextLevelId = currentLevelId! + 1;
    const canUnlockNext = isPaid || progress.unlockedLevelIds.length < 10 || progress.unlockedLevelIds.includes(nextLevelId);

    const newProgress: UserProgress = {
        ...progress,
        completedLevelIds: [...new Set([...progress.completedLevelIds, currentLevelId!])],
        unlockedLevelIds: canUnlockNext 
            ? [...new Set([...progress.unlockedLevelIds, nextLevelId])].filter(id => id <= LEVELS.length)
            : progress.unlockedLevelIds,
        starsPerLevel: {
            ...progress.starsPerLevel,
            [currentLevelId!]: Math.max(progress.starsPerLevel[currentLevelId!] || 0, stars)
        },
        completionsPerLevel: {
            ...progress.completionsPerLevel,
            [currentLevelId!]: (progress.completionsPerLevel[currentLevelId!] || 0) + 1
        }
    };

    setProgress(newProgress);
    syncProgress(newProgress);
    setShowRewardModal(true);
    say('¡Felicidades! Has completado el nivel');
  };

  const handleResetProgress = async () => {
    if (!window.confirm('¿Estás seguro de que deseas reiniciar todo el progreso? Se borrarán tus estrellas y niveles completados.')) return;
    
    const resetProgress = {
        ...INITIAL_PROGRESS,
        name: progress.name,
        avatar: progress.avatar,
    };
    
    setProgress(resetProgress);
    await syncProgress(resetProgress);
    setView('onboarding');
  };

  const playTone = (freq: number, duration: number) => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn('Audio not supported', e);
    }
  };

  const handleAnswer = (answer: string | number | number[]) => {
    const currentTask = tasks[currentTaskIndex];
    if (!currentTask) return;
    
    let isCorrect = false;
    if (Array.isArray(answer)) {
        isCorrect = JSON.stringify(answer) === JSON.stringify(currentTask.answer);
    } else {
        isCorrect = String(answer) === String(currentTask.answer);
    }

    setLastCorrect(isCorrect);

    if (isCorrect) {
        playTone(440, 0.1);
        setTimeout(() => playTone(880, 0.15), 100);

        if (currentTaskIndex === tasks.length - 1) {
            handleLevelComplete();
        } else {
            setTimeout(() => {
                setCurrentTaskIndex(prev => prev + 1);
                setLastCorrect(null);
                // Reset timer for next task if applicable
                const level = LEVELS.find(l => l.id === currentLevelId);
                if (level && level.world !== 'explorers') {
                    setTimeLeft(TIME_PER_TASK);
                }
            }, 800);
        }
    } else {
        playTone(220, 0.2);
        setLives(prev => {
            if (prev <= 1) {
                setGameOverReason('lives');
                setShowGameOverModal(true);
                return 0;
            }
            return prev - 1;
        });
        setTimeout(() => setLastCorrect(null), 800);
    }
  };

  let mainContent;

  if (loading) {
    mainContent = (
        <div className="immersive-bg min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-8 border-white/20 border-t-white rounded-full mb-8 shadow-xl"
            />
            <h2 className="text-white font-black text-2xl uppercase tracking-widest animate-pulse">
                Conectando con NumiLand...
            </h2>
            <div className="mt-8 space-y-4">
                <p className="text-white/60 font-bold text-sm">Si esto tarda demasiado, intenta presionar el botón de abajo</p>
                <Button 
                    variant="secondary"
                    onClick={() => setLoading(false)}
                    className="px-8"
                >
                    FORZAR ENTRADA
                </Button>
            </div>
        </div>
    );
  } else if (view === 'payment') {
    const currentWorldLabel = progress.currentWorld === 'explorers' ? 'Exploradores' : 
                             progress.currentWorld === 'adventurers' ? 'Aventureros' :
                             progress.currentWorld === 'scholars' ? 'Tablas' :
                             progress.currentWorld === 'masters' ? 'Maestros' : 'Leyendas';

    mainContent = (
        <div className="min-h-screen bg-brand-periwinkle flex items-center justify-center p-4">
            <div className="glass-card max-w-3xl w-full p-8 md:p-14 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-brand-pink via-brand-orange to-brand-yellow" />
                
                {/* Botón Cerrar */}
                <button 
                    onClick={() => setView('lobby')}
                    className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 transition-all z-20 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
                
                <AnimatePresence mode="wait">
                    {isCheckingPayment ? (
                        <motion.div 
                            key="checking"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-16 flex flex-col items-center"
                        >
                            <div className="w-28 h-28 border-[12px] border-brand-yellow/20 border-t-brand-yellow rounded-full animate-spin mb-10" />
                            <h2 className="text-4xl font-black text-slate-800 uppercase mb-4 tracking-tight">Verificando Pago</h2>
                            <p className="text-slate-500 text-xl font-medium italic">Esto solo tomará un momento...</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="info"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            <div className="inline-block p-8 bg-brand-pink/10 rounded-[3.5rem] mb-2 shadow-inner">
                                <Lock size={80} className="text-brand-pink" />
                            </div>
                            
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter leading-none">Versión Premium</h2>
                                <p className="text-slate-600 leading-relaxed text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                                    ¡Libera todo el poder de <span className="text-brand-pink font-black uppercase tracking-tight">NumiLand</span>!
                                </p>
                                
                                <div className="space-y-6 max-w-lg mx-auto py-8">
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-brand-blue rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                            <Compass size={40} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-3xl font-black text-slate-800 leading-none">5 Mundos Increíbles</p>
                                            <p className="text-slate-500 text-lg font-bold">Exploración total garantizada</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-brand-green rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                            <Trophy size={40} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-3xl font-black text-slate-800 leading-none">500 Niveles de Aventura</p>
                                            <p className="text-slate-500 text-lg font-bold">Desafíos que crecen contigo</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-brand-orange rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                            <Zap size={40} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-3xl font-black text-slate-800 leading-none">+2500 Minijuegos</p>
                                            <p className="text-slate-500 text-lg font-bold">Diversión infinita asegurada</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-brand-pink rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                            <Rocket size={40} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-3xl font-black text-slate-800 leading-none">Instalación Simple</p>
                                            <p className="text-slate-500 text-lg font-bold">Sin ocupar memoria en tu celular</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 p-8 bg-brand-yellow/5 rounded-[3rem] border-4 md:border-8 border-brand-yellow flex flex-col items-center relative overflow-hidden group shadow-2xl">
                                        <div className="absolute top-0 right-0 bg-brand-yellow text-white text-[10px] font-black px-5 py-2 rounded-bl-2xl uppercase tracking-tighter">MEJOR VALOR</div>
                                        <span className="text-xs font-black text-brand-orange uppercase tracking-[0.2em] mb-3">Acceso Total</span>
                                        <h4 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Todos los Mundos</h4>
                                        <Button 
                                            size="xl" 
                                            className="w-full h-20 text-xl font-black shadow-2xl bg-brand-yellow hover:bg-brand-orange text-white border-b-8 border-black/10 active:border-b-0 active:translate-y-2" 
                                            onClick={() => window.open(MP_FULL_ACCESS_LINK, '_blank')}
                                        >
                                            DESBLOQUEAR TODO
                                        </Button>
                                    </div>

                                    <div className="flex-1 p-8 bg-white rounded-[3rem] border-4 border-slate-100 flex flex-col items-center shadow-lg">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Opción Individual</span>
                                        <h4 className="text-2xl font-black text-slate-700 mb-6">Mundo {currentWorldLabel}</h4>
                                        <Button 
                                            size="xl" 
                                            className="w-full h-20 text-lg font-black shadow-xl" 
                                            onClick={() => window.open(MP_SINGLE_WORLD_LINK, '_blank')}
                                        >
                                            DESBLOQUEAR ESTE MUNDO
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="pt-8 space-y-4">
                                    <Button 
                                        variant="outline" 
                                        size="xl" 
                                        className="w-full h-20 text-2xl font-black gap-4 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md"
                                        onClick={handleCheckPayment}
                                    >
                                        <RefreshCcw className="w-8 h-8" /> YA REALICÉ EL PAGO
                                    </Button>

                                    <Button 
                                        variant="ghost" 
                                        size="lg" 
                                        className="text-slate-400 hover:text-brand-green font-black text-base uppercase tracking-[0.15em] gap-3"
                                        onClick={handleInformPaymentWhatsApp}
                                    >
                                        <MessageCircle size={24} /> ¿Problemas? Informar pago por WhatsApp
                                    </Button>
                                </div>
                            </div>

                            <button onClick={() => setView('lobby')} className="text-slate-400 font-black text-lg uppercase tracking-[0.2em] hover:text-slate-600 transition-colors py-4">
                                ← Volver al Mapa de Niveles
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
  } else if (view === 'onboarding') {
    mainContent = (
        <Onboarding 
            isSignedIn={!!user}
            userEmail={user?.email}
            isAdmin={isPaid || paidWorldIds.length > 0}
            onSignIn={signInWithGoogle}
            onComplete={(name, avatar, startingWorld) => {
                let startId = 1;
                if (startingWorld === 'adventurers') startId = 101;
                else if (startingWorld === 'scholars') startId = 201;
                else if (startingWorld === 'masters') startId = 301;
                else if (startingWorld === 'legends') startId = 401;

                const unlocked = Array.from({ length: 10 }, (_, i) => startId + i);
                const newProgress: UserProgress = { 
                    ...INITIAL_PROGRESS, 
                    name, 
                    avatar: avatar as Avatar,
                    unlockedLevelIds: unlocked,
                    currentLevelId: startId,
                    currentWorld: startingWorld
                };
                setProgress(newProgress);
                syncProgress(newProgress);
                setView('lobby');
            }}
        />
    );
  } else if (view === 'lobby') {
    mainContent = (
        <div className="relative">
            {/* Admin/User indicator */}
            <div className="fixed top-4 left-4 z-50 flex gap-2">
                <div 
                    onClick={() => !isPaid && setView('payment')}
                    className={cn(
                        "bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border-2 shadow-lg flex items-center gap-2 transition-all",
                        !isPaid ? "border-brand-pink hover:scale-105 cursor-pointer" : "border-brand-blue"
                    )}
                >
                    {isPaid ? <Crown size={16} className="text-brand-yellow fill-brand-yellow" /> : <Lock size={16} className="text-brand-pink" />}
                    <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        isPaid ? "text-brand-blue" : "text-brand-pink"
                    )}>
                        {isPaid ? 'Premium' : 'Pasar a Premium'}
                    </span>
                </div>
                <button 
                    onClick={() => window.open('https://wa.me/5492233440067', '_blank')}
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white flex items-center gap-2 px-4"
                >
                    <MessageCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Soporte</span>
                </button>
                
                {(isPaid || paidWorldIds.length > 0) && (
                    <button 
                        onClick={handleInstallClick}
                        className="bg-brand-orange text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white flex items-center gap-2 px-4"
                    >
                        <Rocket size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Instalar App</span>
                    </button>
                )}
            </div>

            <LevelSelector 
                levels={levelInfoList}
                starsPerLevel={progress.starsPerLevel}
                completionsPerLevel={progress.completionsPerLevel}
                onSelectLevel={handleStartLevel}
                onSelectAvatar={() => setView('profile')}
                onResetProgress={handleResetProgress}
                userName={progress.name}
                avatar={progress.avatar}
                currentWorld={progress.currentWorld}
                onWorldChange={(world) => {
                    const newProgress = { ...progress, currentWorld: world };
                    setProgress(newProgress);
                    syncProgress(newProgress);
                }}
                onSignOut={logout}
                onStatsClick={() => setShowComingSoonModal(true)}
            />
            {/* Version Indicator */}
            <div className="text-center pb-8 opacity-40">
                <p className="text-white text-[10px] font-black uppercase tracking-widest">
                    v1.0.26.4 | RTB Recursos Digitales
                </p>
            </div>
        </div>
    );
  } else if (view === 'profile') {
    mainContent = (
        <Profile 
            progress={progress}
            totalStars={totalStarsCount}
            isPaid={isPaid || paidWorldIds.length > 0}
            userEmail={user?.email || null}
            onSave={(name, avatar) => {
                const newProgress = { ...progress, name, avatar };
                setProgress(newProgress);
                syncProgress(newProgress);
                setView('lobby');
            }}
            onClose={() => setView('lobby')}
            onInstall={handleInstallClick}
            canInstall={!!deferredPrompt}
        />
    );
  } else {
    // view === 'game'
    const currentTask = tasks[currentTaskIndex];
    const currentLevel = LEVELS.find(l => l.id === currentLevelId);
    mainContent = (
        <GameLayout
            levelLabel={currentLevel?.label || ''}
            progress={currentTaskIndex + 1}
            total={tasks.length || TASKS_PER_LEVEL}
            onBack={() => setView('lobby')}
            stars={totalStarsCount}
            lives={lives}
            maxLives={MAX_LIVES}
            timeLeft={timeLeft}
            onStatsClick={() => setShowComingSoonModal(true)}
        >
                    <div className="flex items-center gap-2 max-w-[90%] mx-auto z-20">
                        <div className="mb-4 md:mb-6 bg-brand-pink text-white px-6 py-3 rounded-2xl font-black text-sm md:text-lg shadow-lg uppercase tracking-wider text-center flex-1">
                            {currentTask?.prompt}
                        </div>
                        <button 
                            onClick={() => say(currentTask?.prompt || '')}
                            className="mb-4 md:mb-6 p-3 bg-white text-brand-pink rounded-2xl shadow-lg border-b-4 border-slate-200 active:translate-y-1 active:border-b-0 transition-all hover:bg-slate-50"
                        >
                            <Volume2 size={24} />
                        </button>
                    </div>

                <div className="flex flex-col items-center w-full">
                    {currentTask?.type === TaskType.COUNTING && (
                        <CountingTask 
                            question={currentTask.question as string[]}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.MATCHING && (
                        <MatchingTask 
                            question={currentTask.question as { count: number; icon: string }}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {(currentTask?.type === TaskType.ADDITION || currentTask?.type === TaskType.SUBTRACTION || currentTask?.type === TaskType.MULTIPLICATION || currentTask?.type === TaskType.DIVISION) && (
                        <ArithmeticTask 
                            type={currentTask.type}
                            question={currentTask.question as any}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {(currentTask?.type === TaskType.SEQUENCE || currentTask?.type === TaskType.MISSING_NUMBER || currentTask?.type === TaskType.PATTERN) && (
                        <SequenceTask 
                            question={currentTask.type === TaskType.PATTERN 
                                ? [...(currentTask.question as number[]), null] 
                                : currentTask.question as (number | null)[]}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.COMPARISON && (
                        <ComparisonTask 
                            question={currentTask.question as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.ORDERING && (
                        <OrderingTask 
                            question={currentTask.question as number[]}
                            prompt={currentTask.prompt}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.NUMBER_LINE && (
                        <NumberLineTask 
                            question={currentTask.question as { start: number; end: number }}
                            answer={currentTask.answer as number}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.ALGEBRA && (
                        <AlgebraTask 
                            question={currentTask.question as string}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.GEOMETRY && (
                        <GeometryTask 
                            question={currentTask.question as string}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.COORDINATES && (
                        <CoordinateTask 
                            question={currentTask.question as { x: number; y: number }}
                            options={currentTask.options as string[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.FUNCTIONS && (
                        <FunctionTask 
                            question={currentTask.question as string}
                            options={currentTask.options as string[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.VISUAL_MULTIPLICATION && (
                        <VisualMultiplicationTask 
                            question={currentTask.question as any}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.WORD_PROBLEM && (
                        <WordProblemTask 
                            prompt={currentTask.prompt}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {currentTask?.type === TaskType.MISSING_FACTOR && (
                        <MissingFactorTask 
                            question={currentTask.question as any}
                            options={currentTask.options as number[]}
                            onAnswer={handleAnswer}
                        />
                    )}
                    {!currentTask && (
                        <div className="text-center py-20 text-slate-400 font-bold">
                            Cargando desafío...
                        </div>
                    )}
                </div>

                {lastCorrect === true && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-brand-green text-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                            <span className="text-6xl">✨</span>
                        </div>
                    </motion.div>
                )}

                {lastCorrect === false && (
                    <motion.div 
                        initial={{ x: -20 }}
                        animate={{ x: [0, -10, 10, -10, 10, 0] }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-brand-pink text-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                            <span className="text-6xl">❌</span>
                        </div>
                    </motion.div>
                )}
        </GameLayout>
    );
  }

  return (
    <>
        {mainContent}

        <RewardModal 
            isOpen={showRewardModal}
            stars={3}
            completions={progress.completionsPerLevel[currentLevelId!] || 1}
            onNext={() => {
                setShowRewardModal(false);
                if (currentLevelId !== null) {
                    const nextLevelId = currentLevelId + 1;
                    if (nextLevelId <= LEVELS.length) {
                        handleStartLevel(nextLevelId);
                    } else {
                        setView('lobby');
                    }
                }
            }}
            onRetry={() => {
                setShowRewardModal(false);
                handleStartLevel(currentLevelId!);
            }}
            onClose={() => {
                setShowRewardModal(false);
                setView('lobby');
            }}
        />

        <GameOverModal 
            isOpen={showGameOverModal}
            reason={gameOverReason}
            onRetry={() => {
                setShowGameOverModal(false);
                handleStartLevel(currentLevelId!);
            }}
            onClose={() => {
                setShowGameOverModal(false);
                setView('lobby');
            }}
        />

        <ComingSoonModal 
            isOpen={showComingSoonModal}
            onClose={() => setShowComingSoonModal(false)}
        />
    </>
  );
}
