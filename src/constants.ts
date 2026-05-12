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
    const max = Math.min(100, rangeMultiplier * 10);
    return {
      id,
      world: 'explorers' as const,
      label: `Nivel ${id}`,
      min: 0,
      max,
      description: `Hasta ${max}`,
      color: colors[i % colors.length],
      unlocked: id <= 10,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 101;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    const max = Math.min(1000, rangeMultiplier * 100);
    return {
      id,
      world: 'adventurers' as const,
      label: `Aventura ${id-100}`,
      min: 0,
      max,
      description: `Hasta ${max}`,
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 201;
    let targetTable: number | undefined = undefined;
    let description = "";
    
    if (i === 0) {
      targetTable = 1;
      description = "Tabla del 1";
    } else if (i === 1) {
      targetTable = 2;
      description = "Tabla del 2";
    } else if (i >= 2 && i < 18) {
      targetTable = Math.floor((i - 2) / 2) + 3;
      description = `Tabla del ${targetTable}`;
    } else if (i >= 18 && i < 40) {
      description = "Tablas del 1 al 5";
    } else if (i >= 40 && i < 70) {
      description = "Tablas del 6 al 10";
    } else {
      description = "Tablas del 1 al 10";
    }

    return {
      id,
      world: 'scholars' as const,
      label: targetTable !== undefined ? `Tablas` : `Academia`,
      min: 0,
      max: 100,
      description,
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
    const max = Math.min(10000, rangeMultiplier * 1000);
    return {
      id,
      world: 'masters' as const,
      label: `Maestro ${id-300}`,
      min: 0,
      max,
      description: `Hasta ${max}`,
      color: colors[i % colors.length],
      unlocked: false,
      completed: false,
      stars: 0
    };
  }),
  ...Array.from({ length: 100 }, (_, i) => {
    const id = i + 401;
    const rangeMultiplier = Math.floor(i / 10) + 1;
    const max = Math.min(100000, rangeMultiplier * 10000);
    return {
      id,
      world: 'legends' as const,
      label: `Leyenda ${id-400}`,
      min: 0,
      max,
      description: `Reto ${max}`,
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
