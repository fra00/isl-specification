export function useEditorGame(config?: any): {
  isLoading: boolean;
  isProcessing: boolean;
  status: string;
  entities: any[];
  onInit: () => void;
  onFetchData: () => Promise<void>;
  onMoveHero: (target: any) => void;
};