import { describe, expect, it } from 'vitest';
import { NavigationStatus, PageNavigationEnum } from '../bin/domain-core';

describe('domain-core', () => {
  it('exposes all expected navigation enum values', () => {
    expect(PageNavigationEnum).toEqual({
      MAIN_MENU: 'MAIN_MENU',
      PLAY_GAME: 'PLAY_GAME',
      EDITOR_GAME: 'EDITOR_GAME',
      SHOP: 'SHOP',
      DUNGEON: 'DUNGEON',
      DUNGEON_DESCRIPTION: 'DUNGEON_DESCRIPTION',
    });
  });

  it('defaults navigation status to the main menu', () => {
    expect(NavigationStatus()).toEqual({
      currentPageView: PageNavigationEnum.MAIN_MENU,
    });
  });

  it('preserves an explicitly provided current page view', () => {
    expect(NavigationStatus({ currentPageView: PageNavigationEnum.DUNGEON })).toEqual({
      currentPageView: PageNavigationEnum.DUNGEON,
    });
  });
});