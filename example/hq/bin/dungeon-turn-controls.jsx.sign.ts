export default function DungeonTurnControls(props: {
  currentHero?: any;
  movementPoints?: number | null;
  turnPhase?: any;
  canOpenDoor?: boolean;
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