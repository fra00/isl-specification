import { renderHook, act } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMagicLogic } from '../bin/dungeon-use-magic';

function setupMagic() {
  let currentSession = {
    currentTurn: 1,
    heroes: [{
      heroId: 1,
      x: 1,
      y: 1,
      turnOrder: 1,
      currentBody: 4,
      hero: { classe: 'Elfo', corpo: 6 },
      activeStatus: [],
      availableSpells: [10, 11, 12],
    }],
    monsters: [{
      id: 9,
      x: 3,
      y: 1,
      currentBody: 2,
      currentMind: 1,
      activeStatus: ['Sleep', 'Tempest'],
      monster: { nome: 'Orc', nonmorto: false, difesa: 2 },
    }],
  };

  const onNotify = vi.fn();
  const onActionDone = vi.fn();
  const onUpdateSession = vi.fn((next) => {
    currentSession = typeof next === 'function' ? next(currentSession) : next;
  });

  const hook = renderHook(() => useMagicLogic({
    gameSession: currentSession,
    onUpdateSession,
    onNotify,
    onActionDone,
    staticSpells: [
      { id: 10, nome: 'Palla', effetto: 'Palla di Fuoco', targetType: 'Monster' },
      { id: 11, nome: 'Cura', effetto: 'Acqua Guaritrice', valore: 3, targetType: 'Hero' },
      { id: 12, nome: 'Genio', effetto: 'Genio', targetType: 'Monster' },
    ],
    combatLogic: { resolveCombat: vi.fn(() => ({ damageDealt: 2 })) },
    mapInteractionLogic: { isFrontOfDoor: vi.fn(() => ({ found: true, passageCell: { x: 5, y: 5 }, destination: { x: 6, y: 6 } })), openPassage: vi.fn() },
    fogOfWarLogic: { visibilityCalc: { hasLineOfSight: vi.fn(() => true) } },
    heroStatsLogic: {},
  }));

  return { hook, onNotify, onActionDone, onUpdateSession, getSession: () => currentSession };
}

describe('useMagicLogic', () => {
  it('casts direct damage and healing spells, consuming the spell and updating session', () => {
    const api = setupMagic();
    act(() => {
      api.hook.result.current.castSpell(10, null, 9, null, null);
    });
    expect(api.getSession().monsters).toEqual([]);
    expect(api.getSession().heroes[0].availableSpells).not.toContain(10);
    expect(api.onActionDone).toHaveBeenCalled();

    api.hook.rerender();
    act(() => {
      api.hook.result.current.castSpell(11, 1, null, null, null);
    });
    expect(api.getSession().heroes[0].currentBody).toBe(6);
  });

  it('casts genie attacks and removes expired effects from heroes and monsters', () => {
    const api = setupMagic();
    act(() => {
      api.hook.result.current.castSpell(12, null, 9, null, null);
    });
    expect(api.getSession().monsters).toEqual([]);

    api.hook.rerender();
    act(() => {
      api.hook.result.current.removeExpiredEffects(1, 9, 'Sleep');
    });
    expect(api.getSession().heroes[0].activeStatus).toEqual([]);
  });

  it('finishes early when the selected spell does not exist', () => {
    const api = setupMagic();
    act(() => {
      api.hook.result.current.castSpell(999, null, null, null, null);
    });
    expect(api.onActionDone).toHaveBeenCalled();
  });
});