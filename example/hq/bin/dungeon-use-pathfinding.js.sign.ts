export function usePathfinding(config: { gameSession?: any; visibilityMap?: any; foundPassages?: Array<{ x: number; y: number }> }): {
    calculatePath: (startX: number, startY: number, targetX: number, targetY: number, maxDepth: number, excludeEntityId: number) => Array<{ x: number; y: number }>;
};