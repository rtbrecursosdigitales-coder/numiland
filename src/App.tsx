import React, { useState, useMemo, useEffect } from 'react';
import { LevelSelector } from './components/LevelSelector';
import { Onboarding } from './components/Onboarding';
import { RewardModal } from './components/ui/RewardModal';
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
import { motion } from 'motion/react';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Button } from './components/ui/Button';
import { Lock, Crown, LogOut, MessageCircle, ExternalLink, Volume2, RefreshCcw } from 'lucide-react';
import { cn } from './lib/utils';
import { say, stopSpeaking } from './lib/speech';

// Link de Mercado Pago configurado por el usuario
const MERCADO_PAGO_LINK = 'https://mpago.la/1FGeP6i'; 

export default function App() {
  // --- AUTH & CLOUD STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // --- GAME STATE ---
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [view, setView] = useState<'onboarding' | 'lobby' | 'game' | 'payment'>('onboarding');
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  // --- AUTH OBSERVER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            // Check for payment success in URL
            const urlParams = new URLSearchParams(window.location.search);
            const isSuccess = urlParams.get('payment') === 'success';

            // Listen to Firestore for this user
            const userRef = doc(db, 'users', currentUser.uid);
            
            if (isSuccess) {
                await setDoc(userRef, { isPaid: true }, { merge: true });
                setIsPaid(true);
                // Clear URL params
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setIsPaid(userData.isPaid || currentUser.email === 'rtb.recursosdigitales@gmail.com');
                setProgress(prev => ({
                    ...prev,
                    ...userData,
                    avatar: userData.avatar as Avatar || 'bear',
                    name: userData.name || '',
                    currentWorld: userData.currentWorld as GameWorld || 'explorers',
                }));
                if (userData.name) setView('lobby');
            } else {
                // New user - checking if they are admin to give auto-pay
                setIsPaid(currentUser.email === 'rtb.recursosdigitales@gmail.com');
                setView('onboarding');
            }
        } else {
            setIsPaid(false);
            setProgress(INITIAL_PROGRESS);
            setView('onboarding');
        }
        setLoading(false);
    });
    return () => unsubscribe();
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
    const isAdmin = user?.email === 'rtb.recursosdigitales@gmail.com';
    return LEVELS.map(l => ({
        ...l,
        unlocked: isAdmin || progress.unlockedLevelIds.includes(l.id),
        completed: progress.completedLevelIds.includes(l.id),
        stars: progress.starsPerLevel[l.id] || 0,
        completions: progress.completionsPerLevel[l.id] || 0
    }));
  }, [progress, user]);

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

  // --- ACTIONS ---
  const handleStartLevel = (levelId: number) => {
    // Permitir el acceso si el usuario ha pagado o si el nivel está en su lista de desbloqueados iniciales.
    // Si no ha pagado, bloqueamos el acceso si el nivel no está desbloqueado o si intenta ir más allá de los niveles de prueba.
    const isInitiallyUnlocked = progress.unlockedLevelIds.includes(levelId);
    
    if (!isPaid && !isInitiallyUnlocked) {
        setView('payment');
        return;
    }

    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;

    setCurrentLevelId(levelId);
    setCurrentTaskIndex(0);
    setLastCorrect(null);
    
    // Generate procedural tasks
    let gameTypes: TaskType[] = [];
    if (level.world === 'explorers') {
        gameTypes = [TaskType.COUNTING, TaskType.MATCHING, TaskType.SEQUENCE, TaskType.MISSING_NUMBER, TaskType.COMPARISON, TaskType.ADDITION, TaskType.SUBTRACTION];
    } else if (level.world === 'adventurers') {
        gameTypes = [TaskType.SEQUENCE, TaskType.NUMBER_LINE, TaskType.ORDERING, TaskType.PATTERN, TaskType.ADDITION, TaskType.SUBTRACTION, TaskType.MULTIPLICATION, TaskType.DIVISION];
    } else if (level.world === 'scholars') {
        gameTypes = [TaskType.VISUAL_MULTIPLICATION, TaskType.WORD_PROBLEM, TaskType.MULTIPLICATION, TaskType.DIVISION, TaskType.MISSING_FACTOR];
    } else if (level.world === 'masters') {
        gameTypes = [TaskType.NUMBER_LINE, TaskType.ORDERING, TaskType.PATTERN, TaskType.ADDITION, TaskType.SUBTRACTION, TaskType.MULTIPLICATION, TaskType.DIVISION, TaskType.ALGEBRA];
    } else { // legends
        gameTypes = [TaskType.ALGEBRA, TaskType.GEOMETRY, TaskType.COORDINATES, TaskType.FUNCTIONS, TaskType.MULTIPLICATION, TaskType.DIVISION];
    }

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
            }, 800);
        }
    } else {
        playTone(220, 0.2);
        setTimeout(() => setLastCorrect(null), 800);
    }
  };

  if (loading) {
    return (
        <div className="immersive-bg min-h-screen flex items-center justify-center">
            <div className="w-20 h-20 border-8 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );
  }

  if (view === 'payment') {
    return (
        <div className="immersive-bg min-h-screen flex items-center justify-center p-6">
            <div className="glass-card max-w-lg w-full p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-pink" />
                <div className="bg-brand-pink/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Lock className="text-brand-pink w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">Acceso Premium</h2>
                <p className="text-slate-500 font-bold mb-10 text-lg leading-relaxed">
                    ¡Has llegado muy lejos! Para continuar la aventura y desbloquear los <span className="text-brand-blue">100 niveles</span> y todos los mundos de <span className="text-brand-pink font-black">NUMILAND</span>, adquiere la versión completa.
                </p>
                <div className="space-y-4">
                    <Button 
                        size="xl" 
                        className="w-full h-20 text-2xl font-black gap-3 bg-brand-yellow hover:bg-brand-yellow/90 text-slate-800 border-brand-yellow/30"
                        onClick={() => window.open(MERCADO_PAGO_LINK, '_blank')}
                    >
                        <ExternalLink className="w-8 h-8" /> PAGAR CON MERCADO PAGO
                    </Button>
                    <Button 
                        variant="outline"
                        size="lg"
                        className="w-full h-16 text-xl font-black gap-3 border-brand-yellow text-brand-yellow"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="w-6 h-6" /> YA REALICÉ EL PAGO
                    </Button>
                    <Button 
                        size="lg" 
                        variant="secondary"
                        className="w-full h-16 text-xl font-bold gap-3"
                        onClick={() => window.open(`https://wa.me/5492233440067?text=Hola! Quiero comprar el acceso full para Numiland. Mi email es: ${user?.email}`, '_blank')}
                    >
                        <MessageCircle className="w-6 h-6" /> PAGAR POR TRANSFERENCIA
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        onClick={() => setView('lobby')}
                    >
                        VOLVER AL LOBBY
                    </Button>
                </div>
            </div>
        </div>
    );
  }

  if (view === 'onboarding') {
    return (
        <Onboarding 
            isSignedIn={!!user}
            userEmail={user?.email}
            isAdmin={isPaid}
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
  }

  if (view === 'lobby') {
    return (
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
            </div>

            <LevelSelector 
                levels={levelInfoList}
                starsPerLevel={progress.starsPerLevel}
                completionsPerLevel={progress.completionsPerLevel}
                onSelectLevel={handleStartLevel}
                onSelectAvatar={() => setView('onboarding')}
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
            />
        </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const currentLevel = LEVELS.find(l => l.id === currentLevelId);

  return (
    <>
        <GameLayout
            levelLabel={currentLevel?.label || ''}
            progress={currentTaskIndex + 1}
            total={tasks.length || TASKS_PER_LEVEL}
            onBack={() => setView('lobby')}
            stars={totalStarsCount}
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
    </>
  );
}
