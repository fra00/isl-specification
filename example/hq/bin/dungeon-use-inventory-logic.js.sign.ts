export function isItemCompatibleWithHero(hero: any, item: any): boolean;
export function useInventoryLogic(config: { 
  staticEquipment: any[]; 
  onUpdateSession: (session: any) => void; 
  onNotify: (message: string) => void; 
}): { 
  isItemCompatibleWithHero: (hero: any, item: any) => boolean; 
  toggleEquipItem: (heroId: number, itemId: number, gameSession: any) => void; 
};