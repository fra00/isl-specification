export function loadShopData(): Promise<{ heroes: any[]; items: any[] }>;
export function validatePurchase(heroState: any, item: any): { allowed: boolean; reason: string };
export function executePurchase(session: any, heroIndex: number, item: any): any;