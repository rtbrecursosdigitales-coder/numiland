import { LevelInfo, TaskType, UserProgress } from './types';

const colors = [
  'bg-brand-blue', 
  'bg-brand-green', 
  'bg-brand-yellow', 
  'bg-brand-orange', 
  'bg-brand-pink', 
  'bg-brand-purple', 
  'bg-brand-red'
];

export const LEVELS: LevelInfo[] = [
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    return {
      id,
      world: 'explorers' as const,
      label: `Nivel ${id}`,
      min: 0,
      max: Math.min(100, rangeMultiplier * 10),
      color: colors[i % colors.length],
      unlocked: id <= 10,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 101;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    return {
      id,
      world: 'adventurers' as const,
      label: `Aventura ${id-100}`,
      min: 0,
      max: Math.min(1000, rangeMultiplier * 100),
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 201;
    let targetTable: number | undefined = undefined;
    
    if (i === 0) targetTable = 1; // Level 201: Table 1 (and 0)
    else if (i === 1) targetTable = 2; // Level 202: Table 2
    else if (i >= 2 && i < 18) {
        // Table 3 starts at i=2 (Level 203)
        // i=2,3 -> Table 3
        // i=4,5 -> Table 4
        // ...
        // i=16,17 -> Table 10
        targetTable = Math.floor((i - 2) / 2) + 3;
    }

    return {
      id,
      world: 'scholars' as const,
      label: targetTable !== undefined ? `Tabla del ${targetTable}` : `Repaso Tablas`,
      min: 0,
      max: 100,
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0,
      targetTable
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 301;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    return {
      id,
      world: 'masters' as const,
      label: `Maestro ${id-300}`,
      min: 0,
      max: Math.min(10000, rangeMultiplier * 1000),
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 401;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    return {
      id,
      world: 'legends' as const,
      label: `Leyenda ${id-400}`,
      min: 0,
      max: Math.min(100000, rangeMultiplier * 10000),
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0
    };
  })
];

export const INITIAL_PROGRESS: UserProgress = {
  avatar: 'bear',
  name: '',
  currentLevelId: 1,
  unlockedLevelIds: [1],
  completedLevelIds: [],
  starsPerLevel: {},
  completionsPerLevel: {},
};

export const TASKS_PER_LEVEL = 5;
export const MASTER_TASKS_COUNT = 10;

export const AVATAR_ICONS: Record<string, string> = {
  // Niños / Exploradores
  bear: '🐻', panda: '🐼', fox: '🦊', rabbit: '🐰', koala: '🐨',
  lion: '🦁', tiger: '🐯', frog: '🐸', monkey: '🐒', cat: '🐱',
  // Adolescentes / Aventureros
  gamer: '🎧', techie: '💻', cool: '😎', wizard: '🧙', dragon: '🐲',
  alien: '👽', robot: '🤖', rocket: '🚀', skate: '🛹', ninja: '🥷',
  // Míticos / Maestros
  fire: '🔥', thunder: '⚡', crystal: '🔮', shield: '🛡️', phoenix: '🐦‍🔥',
  unicorn: '🦄', ghost: '👻', star: '⭐', crown: '👑', diamond: '💎'
};

export const FRUITS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍍', '🍒', '🥝'];
export const ANIMALS = ['🦁', '🐯', '🐘', '🦒', '🦓', '🦘', '🦥', '🦦'];
export const OBJECTS = ['⭐️', '💎', '🍭', '🍦', '🍩', '🍪', '🎨', '🧩'];
