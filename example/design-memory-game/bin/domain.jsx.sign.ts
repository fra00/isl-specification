export const CardState: {
  Covered: 'Covered';
  Flipped: 'Flipped';
  Solved: 'Solved';
};

export const CardEntity: (data?: {
  id?: string;
  value?: string;
  state?: typeof CardState[keyof typeof CardState];
}) => {
  id: string;
  value: string;
  state: typeof CardState[keyof typeof CardState];
};

export const GameStatus: {
  NotStarted: 'NotStarted';
  Playing: 'Playing';
  Paused: 'Paused';
  Won: 'Won';
};

export const GameConfig: (data?: {
  gridSize?: number[];
  matchDelayMs?: number;
}) => {
  gridSize: number[];
  matchDelayMs: number;
};