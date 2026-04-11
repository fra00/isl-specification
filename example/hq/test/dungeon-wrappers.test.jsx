import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInventoryLogic } from '../bin/dungeon-use-inventory-logic';
import { useItemLogic } from '../bin/dungeon-use-item-logic';

describe('thin dungeon wrappers', () => {
  it('checks item compatibility rules and delegates equipment toggling', () => {
    const sessionManager = { toggleEquipItem: vi.fn(() => true) };
    const staticEquipment = [{ id: 2 }];
    const { result } = renderHook(() => useInventoryLogic({ staticEquipment, sessionManager }));

    expect(result.current.isItemCompatibleWithHero({ heroId: 1 }, { solopsg: true, solopsgid: 2 })).toBe(false);
    expect(result.current.isItemCompatibleWithHero({ heroId: 1 }, { nopsg: true, nopsgid: 1 })).toBe(false);
    expect(result.current.isItemCompatibleWithHero({ heroId: 1 }, { id: 9 })).toBe(true);
    expect(result.current.toggleEquipItem(1, 2, { heroes: [] })).toBe(true);
    expect(sessionManager.toggleEquipItem).toHaveBeenCalledWith(1, 2, staticEquipment);
  });

  it('delegates item use only when a session exists', () => {
    const sessionManager = { useItem: vi.fn(() => true) };
    const staticItems = [{ id: 7 }];
    const { result } = renderHook(() => useItemLogic({ staticItems, sessionManager }));

    expect(result.current.useItem(1, 7, null, 9)).toBe(false);
    expect(result.current.useItem(1, 7, { heroes: [] }, 9)).toBe(true);
    expect(sessionManager.useItem).toHaveBeenCalledWith(1, 7, staticItems, 9);
  });
});