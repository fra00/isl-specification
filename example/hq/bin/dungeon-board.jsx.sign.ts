export default function DungeonBoard(props: {
  gameSession: any;
  boardVisibilityMap: any;
  onCellClick?: (x: number, y: number) => void;
  onCellHover?: (x: number, y: number) => void;
  onMonsterClick?: (monsterId: number) => void;
  hoveredPath?: Array<{ x: number; y: number }>;
  secretPassages?: Array<{ x: number; y: number; img: string }>;
  treasures?: Array<{ x: number; y: number; img: string }>;
}): React.ReactElement;