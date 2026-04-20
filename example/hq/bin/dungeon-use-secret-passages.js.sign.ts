export declare function useSecretPassages(config: {
  gameSession: any;
  visibilityMap: any;
  onNotify: (message: string) => void;
  onActionDone: () => void;
  onForceTurnEnd: () => void;
  sessionManager: any;
}): {
  searchPassages: () => void;
  getFoundPassages: () => {
    visiblePassages: Array<{
      x: number;
      y: number;
      img: string;
      oriz?: boolean;
    }>;
  };
};