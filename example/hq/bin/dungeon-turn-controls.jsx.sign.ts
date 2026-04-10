export default function DungeonTurnControls(props: {
  currentHero?: any;
  currentHeroStats?: { attacco: number; difesa: number; movimento: number; mente: number; corpo: number; canAttackDiagonal: boolean; canAttackRanged: boolean; canDisarmTraps: boolean; hasDoubleAttack: boolean } | null;
  movementPoints?: number | null;
  turnPhase?: any;
  canOpenDoor?: { found: boolean } | null;
  isTargeting?: boolean;
  isMoving?: boolean;
  onRollMovement?: () => void;
  onEndTurn?: () => void;
  onSearchPassages?: () => void;
  onSearchTreasure?: () => void;
  onSearchTraps?: () => void;
  onOpenMagic?: () => void;
  onOpenInventory?: () => void;
  onCancelTargeting?: () => void;
  onOpenDoor?: () => void;
}): React.ReactElement;