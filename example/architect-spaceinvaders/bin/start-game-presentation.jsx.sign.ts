type GameState = {
  status: 'INITIAL' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_CLEARED' | 'GAME_WON';
  levelNumber: number;
  score: number;
  playerState: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    lives: number;
    isShooting: boolean;
    lastShotTime: number;
  };
  invadersState: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
    isAlive: boolean;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    speed: number;
    points: number;
  }>;
  playerBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  invaderBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  shieldStates: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    health: number;
    isDestroyed: boolean;
  }>;
  lastUpdateTime: number;
  gameConfig: {
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
  currentLevelConfig: {
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
  playerActionFlags: {
    moveLeft: boolean;
    moveRight: boolean;
    isShooting: boolean;
  };
  invaderDirection: number;
  invaderMovementTimer: number;
  invaderDescentTimer: number;
  invaderShotTimer: number;
  playerShotCooldownTimer: number;
};

export default function StartGamePresentation(props: {
  gameState: GameState;
  onStartGame: (stateToStart: GameState) => void;
  onResetGame: (stateToReset: GameState) => void;
}): React.Element;