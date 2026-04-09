export declare function useDungeonMovementRules(config: { mapQuery: any }): {
    isValidDestination: (x: number, y: number, excludeEntityId: number) => boolean;
    isWalkable: (sourceX: number, sourceY: number, targetX: number, targetY: number, excludeEntityId: number) => boolean;
};