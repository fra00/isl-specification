export const GameStatusEnum: {
  INITIAL: 'INITIAL';
  PLAYING: 'PLAYING';
  PAUSED: 'PAUSED';
  GAME_OVER: 'GAME_OVER';
  LEVEL_CLEARED: 'LEVEL_CLEARED';
  GAME_WON: 'GAME_WON';
};

export const EntityTypeEnum: {
  PLAYER: 'PLAYER';
  INVADER: 'INVADER';
  PLAYER_BULLET: 'PLAYER_BULLET';
  INVADER_BULLET: 'INVADER_BULLET';
  SHIELD_SEGMENT: 'SHIELD_SEGMENT';
};

export const DirectionEnum: {
  LEFT: 'LEFT';
  RIGHT: 'RIGHT';
  UP: 'UP';
  DOWN: 'DOWN';
};

export const PlayerActionEnum: {
  MOVE_LEFT: 'MOVE_LEFT';
  MOVE_RIGHT: 'MOVE_RIGHT';
  SHOOT: 'SHOOT';
};

export const InvaderTypeEnum: {
  TYPE_A: 'TYPE_A';
  TYPE_B: 'TYPE_B';
  TYPE_C: 'TYPE_C';
  UFO: 'UFO';
};

export const Position: (data?: { x?: number; y?: number }) => { x: number; y: number };

export const Size: (data?: { width?: number; height?: number }) => { width: number; height: number };

export const Velocity: (data?: { dx?: number; dy?: number }) => { dx: number; dy: number };

export const PlayerState: (data?: {
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  speed?: number;
  lives?: number;
  isShooting?: boolean;
  lastShotTime?: number;
}) => {
  position: { x: number; y: number };
  size: { width: number; height: number };
  speed: number;
  lives: number;
  isShooting: boolean;
  lastShotTime: number;
};

export const InvaderState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  type?: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
  isAlive?: boolean;
  direction?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  speed?: number;
  points?: number;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
  isAlive: boolean;
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  speed: number;
  points: number;
};

export const BulletState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  speed?: number;
  direction?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  owner?: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
  isAlive?: boolean;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  speed: number;
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
  isAlive: boolean;
};

export const ShieldSegmentState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  health?: number;
  isDestroyed?: boolean;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  health: number;
  isDestroyed: boolean;
};

export const LevelConfig: (data?: {
  levelNumber?: number;
  invaderRows?: number;
  invaderCols?: number;
  invaderSpeedMultiplier?: number;
  invaderBulletSpeedMultiplier?: number;
  invaderShotFrequencyMultiplier?: number;
  playerBulletSpeedMultiplier?: number;
  playerSpeedMultiplier?: number;
  initialPlayerLives?: number;
  shieldConfiguration?: Array<{ x?: number; y?: number }>;
}) => {
  levelNumber: number;
  invaderRows: number;
  invaderCols: number;
  invaderSpeedMultiplier: number;
  invaderBulletSpeedMultiplier: number;
  invaderShotFrequencyMultiplier: number;
  playerBulletSpeedMultiplier: number;
  playerSpeedMultiplier: number;
  initialPlayerLives: number;
  shieldConfiguration: Array<{ x: number; y: number }>;
};

export const GameConfig: (data?: {
  canvasWidth?: number;
  canvasHeight?: number;
  playerBaseSpeed?: number;
  playerBulletBaseSpeed?: number;
  playerBulletCooldown?: number;
  invaderBaseSpeed?: number;
  invaderBulletBaseSpeed?: number;
  invaderShotBaseFrequency?: number;
  invaderHorizontalSpacing?: number;
  invaderVerticalSpacing?: number;
  invaderDescentAmount?: number;
  initialLives?: number;
  maxLevels?: number;
  shieldCount?: number;
  shieldSegmentHealth?: number;
  scorePerInvader?: number;
  scorePerUFO?: number;
  scorePerLevelClear?: number;
}) => {
  canvasWidth: number;
  canvasHeight: number;
  playerBaseSpeed: number;
  playerBulletBaseSpeed: number;
  playerBulletCooldown: number;
  invaderBaseSpeed: number;
  invaderBulletBaseSpeed: number;
  invaderShotBaseFrequency: number;
  invaderHorizontalSpacing: number;
  invaderVerticalSpacing: number;
  invaderDescentAmount: number;
  initialLives: number;
  maxLevels: number;
  shieldCount: number;
  shieldSegmentHealth: number;
  scorePerInvader: number;
  scorePerUFO: number;
  scorePerLevelClear: number;
};

export const GameConstants: (data?: {
  PLAYER_WIDTH?: number;
  PLAYER_HEIGHT?: number;
  INVADER_WIDTH?: number;
  INVADER_HEIGHT?: number;
  BULLET_WIDTH?: number;
  BULLET_HEIGHT?: number;
  SHIELD_SEGMENT_WIDTH?: number;
  SHIELD_SEGMENT_HEIGHT?: number;
  PLAYER_START_Y_OFFSET?: number;
  INVADER_START_Y_OFFSET?: number;
  UFO_SPAWN_INTERVAL?: number;
  UFO_SPEED?: number;
  UFO_Y_POSITION?: number;
  INVADER_MIN_X_OFFSET?: number;
  INVADER_MAX_X_OFFSET?: number;
}) => {
  PLAYER_WIDTH: number;
  PLAYER_HEIGHT: number;
  INVADER_WIDTH: number;
  INVADER_HEIGHT: number;
  BULLET_WIDTH: number;
  BULLET_HEIGHT: number;
  SHIELD_SEGMENT_WIDTH: number;
  SHIELD_SEGMENT_HEIGHT: number;
  PLAYER_START_Y_OFFSET: number;
  INVADER_START_Y_OFFSET: number;
  UFO_SPAWN_INTERVAL: number;
  UFO_SPEED: number;
  UFO_Y_POSITION: number;
  INVADER_MIN_X_OFFSET: number;
  INVADER_MAX_X_OFFSET: number;
};