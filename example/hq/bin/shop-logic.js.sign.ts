export function loadShopData(): Promise<{ heroes: Array<any>; items: Array<any> }>;
export function validatePurchase(heroState: any, item: any): { allowed: boolean; reason: string };
export function executePurchase(session: any, heroIndex: number, item: any): any;