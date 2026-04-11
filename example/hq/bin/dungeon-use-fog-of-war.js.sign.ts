export function useFogOfWar(config: { gameSession: any; staticVisibilityMap: any }): {
  fogVisibilityMap: any;
  calculateFog: () => void;
  revealInitialVisibility: () => void;
  revealFromPoint: (x: number, y: number) => void;
};