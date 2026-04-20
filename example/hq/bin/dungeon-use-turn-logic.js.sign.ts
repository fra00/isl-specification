export declare function useTurnLogic(config?: {
  gameSession?: any;
  visibilityMap?: any;
  onNotify?: (message: string) => void;
  trapsLogic?: any;
  heroStatsLogic?: any;
  hooksPathfinding?: any;
  combatLogic?: any;
  mapInteractionLogic?: any;
  visibilityCalc?: any;
  sessionManager?: any;
}): {
  turnPhase: { HasMoved: boolean; HasPerformedAction: boolean; IsTurnFinished: boolean };
  movementPoints: number | null;
  hoveredPath: Array<{ x: number; y: number }>;
  hoveredPathVariant: string | null;
  isMoving: boolean;
  canOpenDoor: any | null;
  canAttack: boolean;
  isMissionObjectiveCompleted: boolean;
  handleOpenDoor: () => void;
  rollMovement: () => void;
  handleBoardHover: (x: number, y: number) => void;
  handleBoardClick: (x: number, y: number) => void;
  handleMonsterClick: (monsterId: number) => void;
  markActionDone: () => void;
  forceTurnExhausted: (positionOverride?: { x: number; y: number }) => void;
  endTurn: (force?: boolean) => void;
};