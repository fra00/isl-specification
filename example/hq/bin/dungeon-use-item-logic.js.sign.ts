export function useItemLogic(config: { 
  staticItems: any[]; 
  onUpdateSession: (session: any) => void; 
  onNotify: (message: string) => void; 
}): { 
  useItem: (heroId: number, itemId: number, gameSession: any, targetMonsterId?: number | null) => void; 
};