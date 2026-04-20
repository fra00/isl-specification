export declare function useTreasureSearch(config: {
  gameSession: any;
  visibilityMap: any;
  onNotify: (message: string) => void;
  onActionDone: () => void;
  onForceTurnEnd: () => void;
  sessionManager: any;
  onTreasureCardDrawn: (card: any) => void;
  onWanderingMonster: (x: number, y: number) => void;
}): {
  searchTreasure: () => void;
  getFoundTreasures: () => Array<{ x: number; y: number; img: string }>;
  applyTreasureEffect: (card: any) => void;
};