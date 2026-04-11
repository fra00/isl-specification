export function useItemLogic(config: { staticItems: any[]; sessionManager: any }): {
  useItem: (heroId: number, itemId: number, gameSession: any, targetMonsterId?: number | null) => boolean;
};