export declare function loadShopData(): Promise<{ heroes: Array<any>; items: Array<any> }>;
export declare function validatePurchase(heroState: any, item: any): { allowed: boolean; reason: string };
export declare function executePurchase(session: any, heroIndex: number, item: any): any;