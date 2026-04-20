export declare function useFogOfWar(config: {
  gameSession: any;
  staticVisibilityMap: any;
}): {
  fogVisibilityMap: any;
  calculateFog: () => any;
  revealInitialVisibility: () => any;
  revealFromPoint: (x: number, y: number) => any;
};