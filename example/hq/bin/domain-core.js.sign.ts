export const PageNavigationEnum: {
  readonly MAIN_MENU: string;
  readonly PLAY_GAME: string;
  readonly EDITOR_GAME: string;
  readonly SHOP: string;
  readonly DUNGEON: string;
  readonly DUNGEON_DESCRIPTION: string;
};

export const NavigationStatus: (data?: { currentPageView?: string }) => { 
  currentPageView: string 
};