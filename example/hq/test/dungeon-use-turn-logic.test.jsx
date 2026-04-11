import { renderHook, act } from '../bin/node_modules/@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTurnLogic } from '../bin/dungeon-use-turn-logic';

function createSession(overrides = {}) {
  const baseSession = {
    currentTurn: 1,
    heroes: [
      {
        heroId: 1,
        turnOrder: 1,
        x: 0,
        y: 0,
        currentBody: 8,
        currentMind: 4,
        gold: 0,
        inventory: [],
        equipment: [],
        equipped: [],
        activeStatus: [],
        isEscaped: false,
        hero: { classe: 'Barbaro' },
      },
    ],
    monsters: [],
    openedDoors: [],
    spawnedLocations: [],
    currentMap: {
      header: {
        mostro_uscita: -1,
        tesoro_finale: { x: 0, y: 0 },
        oggetto_f: -1,
        arma_f: -1,
        nfine: 0,
      },
      grid: [
        {
          x: 0,
          y: 0,
          fine: '',
          tes: { mon: 0, ogg: 0, arma: 0, trp: 0 },
          mostab: { mos: false, mosid: 0, corpo: 0 },
          trpl: { tipo: 0, rccadex: 0, rccadey: 0 },
          arnt: { antroc: false, inv: false },
        },
        {
          x: 1,
          y: 0,
          fine: 1,
          tes: { mon: 0, ogg: 0, arma: 0, trp: 0 },
          mostab: { mos: false, mosid: 0, corpo: 0 },
          trpl: { tipo: 0, rccadex: 0, rccadey: 0 },
          arnt: { antroc: false, inv: false },
        },
      ],
      porte: [],
    },
  };

  return {
    ...baseSession,
    ...overrides,
    heroes: overrides.heroes ?? baseSession.heroes,
    monsters: overrides.monsters ?? baseSession.monsters,
    spawnedLocations: overrides.spawnedLocations ?? baseSession.spawnedLocations,
    currentMap: {
      ...baseSession.currentMap,
      ...(overrides.currentMap || {}),
      header: {
        ...baseSession.currentMap.header,
        ...(overrides.currentMap?.header || {}),
      },
      grid: overrides.currentMap?.grid ?? baseSession.currentMap.grid,
      porte: overrides.currentMap?.porte ?? baseSession.currentMap.porte,
    },
  };
}

function setup(configOverrides = {}) {
  const gameSession = createSession(configOverrides.gameSession);
  const onNotify = vi.fn();
  const trapsLogic = {
    checkTrapActivation: vi.fn(() => false),
    isTrapVisible: vi.fn(() => false),
    registerTriggeredTrap: vi.fn(),
  };
  const heroStatsLogic = {
    calculateStats: vi.fn(() => ({ movimento: 1, canAttackDiagonal: false, canAttackRanged: false })),
    calculateAttackDice: vi.fn(() => 2),
    canAttackTwice: vi.fn(() => false),
    getConsumableWeaponId: vi.fn(() => null),
  };
  const hooksPathfinding = {
    calculatePath: vi.fn((fromX, fromY, targetX, targetY) => {
      if (fromX === 0 && fromY === 0 && targetX === 1 && targetY === 0) {
        return [{ x: 1, y: 0 }];
      }
      return [];
    }),
  };
  const combatLogic = {
    resolveCombat: vi.fn(() => ({ damageDealt: 1 })),
  };
  const mapInteractionLogic = {
    isFrontOfDoor: vi.fn(() => null),
    openPassage: vi.fn(() => true),
  };
  const visibilityCalc = {
    hasLineOfSight: vi.fn(() => false),
  };
  const sessionManager = {
    clearHeroStatusEverywhere: vi.fn(),
    clearCurrentHeroStatus: vi.fn(),
    resolveMovementTrap: vi.fn(),
    resolveHeroAttack: vi.fn(),
    moveCurrentHeroTo: vi.fn((nextX, nextY) => {
      gameSession.heroes[0].x = nextX;
      gameSession.heroes[0].y = nextY;
    }),
    markCurrentHeroEscaped: vi.fn(() => {
      gameSession.heroes[0].isEscaped = true;
      return true;
    }),
    advanceTurn: vi.fn(),
  };
  const visibilityMap = configOverrides.visibilityMap ?? {
    data: [
      { x: 0, y: 0, valo: 'A', fog: false },
      { x: 1, y: 0, valo: 'A', fog: false },
    ],
  };

  const hook = renderHook((props) => useTurnLogic(props), {
    initialProps: {
      gameSession,
      visibilityMap,
      onNotify,
      trapsLogic,
      heroStatsLogic,
      hooksPathfinding,
      combatLogic,
      mapInteractionLogic,
      visibilityCalc,
      sessionManager,
    },
  });

  const rerender = () => hook.rerender({
    gameSession,
    visibilityMap,
    onNotify,
    trapsLogic,
    heroStatsLogic,
    hooksPathfinding,
    combatLogic,
    mapInteractionLogic,
    visibilityCalc,
    sessionManager,
  });

  return {
    ...hook,
    gameSession,
    onNotify,
    sessionManager,
    rerender,
  };
}

describe('useTurnLogic mission end rules', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('requires all active header objectives before reporting mission completion', () => {
    const api = setup({
      gameSession: {
        currentMap: {
          header: {
            mostro_uscita: 7,
            tesoro_finale: { x: 2, y: 2 },
            oggetto_f: 9,
            arma_f: 22,
          },
          grid: [
            { x: 0, y: 0, fine: '', tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 5, y: 5, fine: '', tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: true, mosid: 7, corpo: 3 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 2, y: 2, fine: '', tes: { mon: 100, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 3, y: 3, fine: '', tes: { mon: 0, ogg: 9, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 4, y: 4, fine: '', tes: { mon: 0, ogg: 0, arma: 22, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
          ],
        },
      },
    });

    expect(api.result.current.isMissionObjectiveCompleted).toBe(false);

    api.gameSession.spawnedLocations.push('5,5');
    api.gameSession.currentMap.grid.find((cell) => cell.x === 2 && cell.y === 2).tes = { mon: 0, ogg: 0, arma: 0, trp: 0 };
    api.gameSession.currentMap.grid.find((cell) => cell.x === 3 && cell.y === 3).tes.ogg = 0;
    api.gameSession.currentMap.grid.find((cell) => cell.x === 4 && cell.y === 4).tes.arma = 0;
    api.gameSession.heroes[0].inventory = [9];
    api.gameSession.heroes[0].equipment = [22];

    api.rerender();

    expect(api.result.current.isMissionObjectiveCompleted).toBe(true);
  });

  it('asks confirmation before retreating from the stairs when the mission is incomplete', () => {
    vi.stubGlobal('confirm', vi.fn(() => false));

    const api = setup({
      gameSession: {
        heroes: [
          {
            heroId: 1,
            turnOrder: 1,
            x: 0,
            y: 0,
            currentBody: 8,
            currentMind: 4,
            gold: 0,
            inventory: [],
            equipment: [],
            equipped: [],
            activeStatus: [],
            isEscaped: false,
            hero: { classe: 'Barbaro' },
          },
          {
            heroId: 2,
            turnOrder: 2,
            x: 5,
            y: 5,
            currentBody: 7,
            currentMind: 3,
            gold: 0,
            inventory: [],
            equipment: [],
            equipped: [],
            activeStatus: [],
            isEscaped: false,
            hero: { classe: 'Nano' },
          },
        ],
        currentMap: {
          header: {
            oggetto_f: 9,
          },
          grid: [
            { x: 0, y: 0, fine: '', tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 1, y: 0, fine: 1, tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 3, y: 3, fine: '', tes: { mon: 0, ogg: 9, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
          ],
        },
      },
    });

    api.gameSession.heroes[0].x = 1;
    api.gameSession.heroes[0].y = 0;
    api.rerender();

    act(() => {
      expect(api.result.current.attemptExitFromCurrentCell()).toBe(false);
    });

    expect(globalThis.confirm).toHaveBeenCalledWith('La missione non è ancora completata. Vuoi uscire comunque dalle scale?');
    expect(api.sessionManager.markCurrentHeroEscaped).not.toHaveBeenCalled();
    expect(api.sessionManager.advanceTurn).not.toHaveBeenCalled();
    expect(api.gameSession.heroes[0].isEscaped).toBe(false);
    expect(api.onNotify).toHaveBeenCalledWith('Uscita annullata. Completa la missione o conferma la ritirata dalle scale.');
  });

  it('allows a confirmed retreat from the stairs even when the mission is incomplete', () => {
    vi.stubGlobal('confirm', vi.fn(() => true));

    const api = setup({
      gameSession: {
        heroes: [
          {
            heroId: 1,
            turnOrder: 1,
            x: 0,
            y: 0,
            currentBody: 8,
            currentMind: 4,
            gold: 0,
            inventory: [],
            equipment: [],
            equipped: [],
            activeStatus: [],
            isEscaped: false,
            hero: { classe: 'Barbaro' },
          },
          {
            heroId: 2,
            turnOrder: 2,
            x: 5,
            y: 5,
            currentBody: 7,
            currentMind: 3,
            gold: 0,
            inventory: [],
            equipment: [],
            equipped: [],
            activeStatus: [],
            isEscaped: false,
            hero: { classe: 'Nano' },
          },
        ],
        currentMap: {
          header: {
            arma_f: 22,
          },
          grid: [
            { x: 0, y: 0, fine: '', tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 1, y: 0, fine: 1, tes: { mon: 0, ogg: 0, arma: 0, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
            { x: 4, y: 4, fine: '', tes: { mon: 0, ogg: 0, arma: 22, trp: 0 }, mostab: { mos: false, mosid: 0, corpo: 0 }, trpl: { tipo: 0, rccadex: 0, rccadey: 0 }, arnt: { antroc: false, inv: false } },
          ],
        },
      },
    });

    api.gameSession.heroes[0].x = 1;
    api.gameSession.heroes[0].y = 0;
    api.rerender();

    act(() => {
      expect(api.result.current.attemptExitFromCurrentCell()).toBe(true);
    });

    expect(globalThis.confirm).toHaveBeenCalledWith('La missione non è ancora completata. Vuoi uscire comunque dalle scale?');
    expect(api.sessionManager.markCurrentHeroEscaped).toHaveBeenCalled();
    expect(api.sessionManager.advanceTurn).toHaveBeenCalledWith(2, null);
    expect(api.gameSession.heroes[0].isEscaped).toBe(true);
    expect(api.onNotify).toHaveBeenCalledWith('Barbaro si ritira dalle scale.');
  });
});