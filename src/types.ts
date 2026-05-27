export enum TaskType {
  COUNTING = 'counting',
  MATCHING = 'matching',
  SEQUENCE = 'sequence',
  MISSING_NUMBER = 'missing_number',
  NUMBER_LINE = 'number_line',
  ORDERING = 'ordering',
  COMPARISON = 'comparison',
  PATTERN = 'pattern',
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  COORDINATES = 'coordinates',
  FUNCTIONS = 'functions',
  VISUAL_MULTIPLICATION = 'visual_multiplication',
  WORD_PROBLEM = 'word_problem',
  MISSING_FACTOR = 'missing_factor',
  SPANISH_NUMBER = 'spanish_number'
}

export type GameWorld = 'explorers' | 'adventurers' | 'scholars' | 'masters' | 'legends';

export interface LevelInfo {
  id: number;
  world: GameWorld;
  label: string;
  min: number;
  max: number;
  description?: string; // Specific description (e.g. "Tabla del 2")
  color: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  isMaster?: boolean;
  targetTable?: number;
  lockType?: 'none' | 'payment' | 'progression';
}

export interface GameTask {
  id: string;
  type: TaskType;
  prompt: string;
  question: any;
  answer: any;
  options?: any[];
}

export type Avatar = 
  | 'bear' | 'panda' | 'fox' | 'rabbit' | 'koala' 
  | 'lion' | 'tiger' | 'frog' | 'monkey' | 'cat'
  | 'gamer' | 'techie' | 'cool' | 'wizard' | 'dragon'
  | 'alien' | 'robot' | 'rocket' | 'skate' | 'ninja'
  | 'fire' | 'thunder' | 'crystal' | 'shield' | 'phoenix'
  | 'unicorn' | 'ghost' | 'star' | 'crown' | 'diamond';

export interface UserProgress {
  avatar: Avatar;
  name: string;
  currentLevelId: number;
  unlockedLevelIds: number[];
  completedLevelIds: number[];
  starsPerLevel: Record<number, number>;
  completionsPerLevel: Record<number, number>;
  currentWorld?: GameWorld;
  paidWorldIds?: GameWorld[];
  isFullAccess?: boolean;
}
