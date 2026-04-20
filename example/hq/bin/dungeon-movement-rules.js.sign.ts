export declare function useDungeonMovementRules(config?: {
  mapQuery?: any;
  foundPassages?: Array<{ x: number; y: number }>;
}): {
  isValidDestination: (x: number, y: number, excludeEntityId: number) => boolean;
  isWalkable: (
    sourceX: number, 
    sourceY: number, 
    targetX: number, 
    targetY: number, 
    excludeEntityId: number, 
    foundPassages?: Array<{ x: number; y: number }>
  ) => boolean;
};