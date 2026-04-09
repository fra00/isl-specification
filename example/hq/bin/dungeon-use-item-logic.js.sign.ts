export declare function useItemLogic(config: { staticItems: Array<any>; sessionManager: any }): {
    useItem: (heroId: number, itemId: number, gameSession: any, targetMonsterId?: number | null) => boolean;
};