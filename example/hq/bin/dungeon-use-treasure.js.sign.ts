export function useTreasureSearch(config: {
  gameSession: any;
  visibilityMap: any;
  onNotify: (message: string) => void;
  onActionDone: () => void;
  onUpdateSession: (session: any) => void;
  onTreasureCardDrawn: (card: any) => void;
  onWanderingMonster: (x: number, y: number) => void;
}): {
  foundTreasures: { x: number; y: number; img: string }[];
  searchTreasure: () => void;
  applyTreasureEffect: (card: any) => void;
};