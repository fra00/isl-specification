export function useSecretPassages(config: { gameSession: any; visibilityMap: any; onNotify?: (message: string) => void; onActionDone?: () => void }): {
  searchPassages: () => void;
  getFoundPassages: () => { visiblePassages: { x: number; y: number; img: string }[] };
};