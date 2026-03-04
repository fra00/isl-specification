export const PageNavigationEnum: {
  MAIN_MENU: 'MAIN_MENU';
  PLAY_GAME: 'PLAY_GAME';
  EDITOR_GAME: 'EDITOR_GAME';
  SHOP: 'SHOP';
  DUNGEON: 'DUNGEON';
  DUNGEON_DESCRIPTION: 'DUNGEON_DESCRIPTION';
};
export const NavigationStatus: (data?: { currentPageView?: typeof PageNavigationEnum[keyof typeof PageNavigationEnum] }) => {
  currentPageView: typeof PageNavigationEnum[keyof typeof PageNavigationEnum];
};