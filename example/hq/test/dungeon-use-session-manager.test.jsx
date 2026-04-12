import { renderHook, act } from "../bin/node_modules/@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDungeonSessionManager } from "../bin/dungeon-use-session-manager";

function createSession() {
  return {
    currentTurn: 1,
    isHeroOrderConfirmed: false,
    openedDoors: [],
    spawnedLocations: [],
    treasureDeck: [{ id: 1, azione: "aggiungi_oro", valore: 50 }],
    currentMap: {
      eroi_start: [{ id: 1, x: 1, y: 1 }],
      porte: [{ x: 5, y: 5 }],
      grid: [
        {
          x: 2,
          y: 2,
          tes: { mon: 100, ogg: 0, arma: 0, trp: 0 },
          arnt: { antroc: false },
        },
        {
          x: 4,
          y: 4,
          tes: { mon: 0, ogg: 0, arma: 0, trp: 0 },
          arnt: { antroc: false },
        },
        { x: 6, y: 6, arnt: { antroc: false } },
      ],
    },
    heroes: [
      {
        heroId: 1,
        x: 0,
        y: 0,
        gold: 10,
        inventory: [7],
        equipment: [2],
        equipped: [2],
        activeStatus: ["RockSkin", "Courage"],
        availableSpells: [5],
        currentBody: 5,
        currentMind: 2,
        hero: { corpo: 8, mente: 4, classe: "Elfo" },
        turnOrder: 1,
        turnPhase: {
          HasMoved: true,
          HasPerformedAction: true,
          IsTurnFinished: false,
        },
      },
      {
        heroId: 2,
        x: 9,
        y: 9,
        gold: 25,
        inventory: [],
        equipment: [],
        equipped: [],
        activeStatus: [],
        availableSpells: [],
        currentBody: 6,
        currentMind: 3,
        hero: { corpo: 8, mente: 4, classe: "Nano" },
        turnOrder: 2,
        turnPhase: {
          HasMoved: false,
          HasPerformedAction: false,
          IsTurnFinished: false,
        },
      },
    ],
    monsters: [
      {
        id: 9,
        x: 3,
        y: 3,
        currentBody: 3,
        currentMind: 1,
        activeStatus: ["Sleep"],
        monster: { nome: "Orc", nonmorto: true, difesa: 2 },
      },
    ],
    lastAttack: { old: true },
  };
}

function setup(configOverrides = {}) {
  let currentSession = createSession();
  const onNotify = vi.fn();
  const staticItems = [{ id: 11, nome: "Pozione del Coraggio" }];
  const staticEquipment = [
    { id: 22, nome: "Spada Lunga" },
    { id: 3, nome: "Shield", noogg: 2 },
  ];
  const fogOfWarLogic = {
    revealInitialVisibility: vi.fn(),
    revealFromPoint: vi.fn(),
  };
  const onUpdateSession = vi.fn((next) => {
    currentSession = typeof next === "function" ? next(currentSession) : next;
  });
  const hook = renderHook((props) => useDungeonSessionManager(props), {
    initialProps: {
      gameSession: currentSession,
      onUpdateSession,
      onNotify,
      fogOfWarLogic,
      staticItems,
      staticEquipment,
      ...configOverrides,
    },
  });
  const rerender = () =>
    hook.rerender({
      gameSession: currentSession,
      onUpdateSession,
      onNotify,
      fogOfWarLogic,
      staticItems,
      staticEquipment,
      ...configOverrides,
    });
  return {
    ...hook,
    onNotify,
    onUpdateSession,
    fogOfWarLogic,
    getSession: () => currentSession,
    rerender,
  };
}

function setupDeferred(configOverrides = {}) {
  let currentSession = createSession();
  let pendingUpdater = null;
  const onNotify = vi.fn();
  const staticItems = [{ id: 11, nome: "Pozione del Coraggio" }];
  const staticEquipment = [{ id: 22, nome: "Spada Lunga" }];
  const fogOfWarLogic = {
    revealInitialVisibility: vi.fn(),
    revealFromPoint: vi.fn(),
  };
  const onUpdateSession = vi.fn((next) => {
    pendingUpdater = next;
  });
  const hook = renderHook((props) => useDungeonSessionManager(props), {
    initialProps: {
      gameSession: currentSession,
      onUpdateSession,
      onNotify,
      fogOfWarLogic,
      staticItems,
      staticEquipment,
      ...configOverrides,
    },
  });

  const flushPendingUpdate = () => {
    if (typeof pendingUpdater === "function") {
      currentSession = pendingUpdater(currentSession);
    } else if (pendingUpdater != null) {
      currentSession = pendingUpdater;
    }
    pendingUpdater = null;
  };

  return {
    ...hook,
    onNotify,
    onUpdateSession,
    fogOfWarLogic,
    getSession: () => currentSession,
    flushPendingUpdate,
  };
}

describe("useDungeonSessionManager", () => {
  it("initializes missions and confirms hero order", () => {
    const api = setup();

    act(() => {
      api.result.current.initializeMission([{ id: 3 }]);
    });
    expect(api.getSession().heroes[0]).toMatchObject({
      x: 1,
      y: 1,
      isEscaped: false,
    });
    expect(api.getSession().treasureDeck).toEqual([{ id: 3 }]);

    api.rerender();
    act(() => {
      api.result.current.confirmHeroOrder([1]);
    });
    expect(api.getSession().isHeroOrderConfirmed).toBe(true);
    expect(api.fogOfWarLogic.revealInitialVisibility).toHaveBeenCalled();
  });

  it("opens passages, toggles equipment and uses items with effects", () => {
    const api = setup();

    act(() => {
      expect(api.result.current.openPassage(5, 5, 6, 6, [])).toBe(true);
    });
    expect(api.fogOfWarLogic.revealFromPoint).toHaveBeenCalledWith(6, 6);
    expect(api.onNotify).toHaveBeenCalledWith("Porta aperta.");

    api.rerender();
    act(() => {
      expect(
        api.result.current.toggleEquipItem(1, 3, [
          { id: 3, nome: "Shield", noogg: 2 },
        ]),
      ).toBe(true);
    });
    expect(api.getSession().heroes[0].equipped).toContain(3);
    expect(api.getSession().heroes[0].equipped).not.toContain(2);

    api.rerender();
    act(() => {
      expect(
        api.result.current.useItem(
          1,
          7,
          [{ id: 7, nome: "Acqua Santa", acqua: true, danni: 2, hp: 1, mp: 1 }],
          9,
        ),
      ).toBe(true);
    });
    expect(api.getSession().heroes[0].currentBody).toBe(6);
    expect(api.getSession().monsters[0].currentBody).toBe(1);
  });

  it("collects treasure, draws cards and applies card effects atomically", () => {
    const api = setup();
    api.getSession().currentMap.grid[0].tes = {
      mon: 100,
      ogg: 11,
      arma: 22,
      trp: 0,
    };
    act(() => {
      expect(api.result.current.collectTreasureAtCell(1, 2, 2)).toBe(true);
    });
    expect(api.getSession().heroes[0].gold).toBe(110);
    expect(api.getSession().heroes[0].inventory).toContain(11);
    expect(api.getSession().heroes[0].equipment).toContain(22);
    expect(api.getSession().heroes[1]).toMatchObject({
      gold: 25,
      inventory: [],
      equipment: [],
    });
    expect(
      api
        .getSession()
        .currentMap.grid.find((cell) => cell.x === 2 && cell.y === 2).tes.mon,
    ).toBe(0);
    expect(api.onNotify).toHaveBeenCalledWith(
      "Hai trovato 100 monete d'oro!\nHai trovato l'oggetto: Pozione del Coraggio!\nHai trovato l'arma: Spada Lunga!",
    );

    api.rerender();
    act(() => {
      expect(api.result.current.drawTreasureCard()).toEqual({
        id: 1,
        azione: "aggiungi_oro",
        valore: 50,
      });
    });
    expect(api.getSession().treasureDeck).toEqual([]);

    api.rerender();
    const onWanderingMonster = vi.fn();
    act(() => {
      expect(
        api.result.current.applyTreasureCardEffect(
          1,
          { azione: "mostro_errante" },
          onWanderingMonster,
        ),
      ).toBe(true);
    });
    expect(onWanderingMonster).toHaveBeenCalledWith(
      api.getSession().heroes[0].x,
      api.getSession().heroes[0].y,
    );

    api.rerender();
    act(() => {
      expect(
        api.result.current.applyTreasureCardEffect(
          1,
          { azione: "aggiungi_oro", valore: 30 },
          onWanderingMonster,
        ),
      ).toBe(true);
    });
    expect(api.getSession().heroes[0].gold).toBe(140);
  });

  it("returns treasure results correctly even when session updates are deferred by React", () => {
    const api = setupDeferred();

    act(() => {
      expect(api.result.current.collectTreasureAtCell(1, 2, 2)).toBe(true);
    });
    api.flushPendingUpdate();
    expect(api.getSession().heroes[0].gold).toBe(110);

    act(() => {
      expect(api.result.current.drawTreasureCard()).toEqual({
        id: 1,
        azione: "aggiungi_oro",
        valore: 50,
      });
    });
    api.flushPendingUpdate();
    expect(api.getSession().treasureDeck).toEqual([]);

    const onWanderingMonster = vi.fn();
    act(() => {
      expect(
        api.result.current.applyTreasureCardEffect(
          1,
          { azione: "mostro_errante" },
          onWanderingMonster,
        ),
      ).toBe(true);
    });
    expect(onWanderingMonster).toHaveBeenCalledWith(0, 0);
  });

  it("updates combat, traps, statuses and turn progression", () => {
    const api = setup();

    act(() => {
      api.result.current.resolveMonsterAttack(9, 1, { damageDealt: 1 });
    });
    expect(api.getSession().heroes[0].currentBody).toBe(4);
    expect(api.getSession().heroes[0].activeStatus).not.toContain("RockSkin");

    api.rerender();
    act(() => {
      api.result.current.resolveHeroAttack(9, { damageDealt: 2 }, ["Sleep"], 2);
    });
    expect(api.getSession().heroes[0].equipped).not.toContain(2);
    expect(api.getSession().monsters[0].currentBody).toBe(1);
    expect(api.getSession().monsters[0].activeStatus).toEqual([]);

    api.rerender();
    act(() => {
      api.result.current.resolveMovementTrap(6, 6, 3, 4, 4);
    });
    expect(api.getSession().heroes[0]).toMatchObject({
      x: 6,
      y: 6,
      currentBody: 3,
    });
    expect(
      api
        .getSession()
        .currentMap.grid.find((cell) => cell.x === 4 && cell.y === 4).arnt
        .antroc,
    ).toBe(true);

    api.rerender();
    act(() => {
      api.result.current.moveCurrentHeroTo(7, 7);
    });
    expect(api.getSession().heroes[0]).toMatchObject({ x: 7, y: 7 });

    api.rerender();
    act(() => {
      api.result.current.startNextHeroRound();
      api.result.current.clearHeroStatusEverywhere("Courage");
    });

    api.rerender();
    act(() => {
      api.result.current.markCurrentHeroEscaped();
    });
    expect(api.getSession().heroes[0]).toMatchObject({
      x: 7,
      y: 7,
      isEscaped: true,
    });
    expect(api.getSession().heroes[0].turnPhase).toMatchObject({
      HasMoved: false,
      HasPerformedAction: false,
      IsTurnFinished: true,
    });
    expect(api.getSession().heroes[0].activeStatus).toEqual([]);
  });

  it("advances turn and clears last attack independently", () => {
    const api = setup();
    act(() => {
      api.result.current.advanceTurn(2, "RockSkin");
    });

    expect(api.getSession().currentTurn).toBe(2);
    expect(api.getSession().heroes[0].activeStatus).not.toContain("RockSkin");

    api.rerender();
    act(() => {
      api.result.current.clearLastAttack();
    });
    expect(api.getSession().lastAttack).toBeNull();
  });

  it("executes mission scripts through the session boundary and applies side effects", () => {
    const api = setup();
    const scriptSession = api.getSession();
    scriptSession.currentMap.scripts = [
      { x: 1, y: 1, text: 'possta 6,6;\nmsg allarme;\naggoro 25;', evento: 1, unavolta: true, morto: false, idmosc: 0 },
    ];

    let result;
    act(() => {
      result = api.result.current.executeMissionScripts({
        baseSession: scriptSession,
        eventType: 1,
        context: { previousPosition: { x: 1, y: 1 } },
        visibilityMap: { data: [] },
      });
    });

    expect(result.handled).toBe(true);
    expect(api.fogOfWarLogic.revealFromPoint).toHaveBeenCalledWith(6, 6);
    expect(api.onNotify).toHaveBeenCalledWith('allarme');
    expect(api.getSession().heroes[0].gold).toBe(35);
    expect(api.getSession().triggeredScripts).toHaveLength(1);
  });

  it("runs mission start scripts during initializeMission before gameplay begins", () => {
    const api = setup();
    api.getSession().currentMap.scripts = [
      { x: 0, y: 0, text: 'msg inizio missione;\naggoro 40;\npossta 6,6;', evento: 6, unavolta: true, morto: false, idmosc: 0 },
    ];

    act(() => {
      api.result.current.initializeMission([{ id: 3 }]);
    });

    expect(api.getSession().heroes[0]).toMatchObject({ x: 1, y: 1, gold: 50 });
    expect(api.fogOfWarLogic.revealFromPoint).toHaveBeenCalledWith(6, 6);
    expect(api.onNotify).toHaveBeenCalledWith('inizio missione');
    expect(api.getSession().triggeredScripts).toHaveLength(1);
  });
});
