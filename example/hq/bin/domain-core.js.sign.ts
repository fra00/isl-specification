export const PageNavigationEnum: {
  MAIN_MENU: string;
  PLAY_GAME: string;
  EDITOR_GAME: string;
  SHOP: string;
  DUNGEON: string;
  DUNGEON_DESCRIPTION: string;
};

export const NavigationStatus: (data?: { currentPageView?: string }) => {
  currentPageView: string;
};