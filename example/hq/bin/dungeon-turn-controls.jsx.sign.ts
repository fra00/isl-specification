export default function DungeonTurnControls(props: {
  currentHero?: { heroId: number; turnOrder: number; currentBody: number; currentMind: number; gold: number; inventory: Array<number>; equipment: Array<number>; x: number; y: number; hero: { id: number; classe: string; attacco: number; difesa: number; movimento: number; mente: number; corpo: number; miniature: string; miniatureDeath: string; portrait: string } };
  movementPoints?: number;
  turnPhase?: string;
  isMoving?: boolean;
  onRollMovement?: () => void;
  onEndTurn?: () => void;
  onSearchPassages?: () => void;
  hasActed?: boolean;
}): React.Element;