export default function DungeonBoard(props: {
  gameSession: any;
  boardVisibilityMap: any;
  onCellClick: (x: number, y: number) => void;
  onCellHover: (x: number, y: number) => void;
  onMonsterClick: (monsterId: number) => void;
  hoveredPath?: Array<{ x: number; y: number }>;
  hoveredPathVariant?: "valid" | "blocked-by-second-wall" | null;
  secretPassages?: Array<{ x: number; y: number; img: string }>;
  treasures?: Array<{ x: number; y: number; img: string }>;
  triggeredTraps?: Array<{ x: number; y: number; tipo: number }>;
  targetingSpell?: any;
  visibilityCalc?: any;
}): React.ReactElement;