import { describe, expect, it } from "vitest";
import {
  executeDungeonScripts,
  moveCurrentHeroInSession,
  resolveHeroAttackInSession,
} from "../bin/dungeon-script-runtime";

function makeCell(x, y, overrides = {}) {
  return {
    x,
    y,
    arnt: { antroc: false, inv: false, ...(overrides.arnt || {}) },
    mobili: { num: null, img: "", ...(overrides.mobili || {}) },
    mostab: { mosid: 0, mos: false, corpo: 0, ...(overrides.mostab || {}) },
    tes: { mon: 0, ogg: 0, arma: 0, trp: 0, ...(overrides.tes || {}) },
    psgg: { ps: 0, oriz: false, ...(overrides.psgg || {}) },
    trpl: { tipo: 0, rccadex: 0, rccadey: 0, ...(overrides.trpl || {}) },
    fine: "",
    ...overrides,
  };
}

function createSession(overrides = {}) {
  const base = {
    currentTurn: 1,
    heroes: [
      {
        heroId: 1,
        turnOrder: 1,
        x: 2,
        y: 2,
        gold: 0,
        inventory: [],
        equipment: [],
        equipped: [],
        currentBody: 8,
        currentMind: 4,
        activeStatus: [],
      },
    ],
    monsters: [
      {
        id: 90,
        x: 3,
        y: 2,
        currentBody: 2,
        currentMind: 1,
        activeStatus: [],
        monster: { id: 14, nome: "Spirito", difesa: 2 },
      },
    ],
    triggeredScripts: [],
    scriptImages: [],
    currentMap: {
      porte: [],
      grid: [
        makeCell(1, 1),
        makeCell(2, 2),
        makeCell(3, 2),
        makeCell(4, 5),
        makeCell(5, 8),
        makeCell(5, 12),
        makeCell(6, 13),
      ],
      scripts: [],
    },
  };

  return {
    ...base,
    ...overrides,
    heroes: overrides.heroes ?? base.heroes,
    monsters: overrides.monsters ?? base.monsters,
    triggeredScripts: overrides.triggeredScripts ?? base.triggeredScripts,
    scriptImages: overrides.scriptImages ?? base.scriptImages,
    currentMap: {
      ...base.currentMap,
      ...(overrides.currentMap || {}),
      porte: overrides.currentMap?.porte ?? base.currentMap.porte,
      grid: overrides.currentMap?.grid ?? base.currentMap.grid,
      scripts: overrides.currentMap?.scripts ?? base.currentMap.scripts,
    },
  };
}

describe("dungeon-script-runtime", () => {
  it("moves the current hero snapshot and resolves combat on a supplied session", () => {
    const session = createSession();

    const moved = moveCurrentHeroInSession(session, 4, 5);
    expect(moved.heroes[0]).toMatchObject({ x: 4, y: 5 });
    expect(session.heroes[0]).toMatchObject({ x: 2, y: 2 });

    const attacked = resolveHeroAttackInSession(session, {
      monsterId: 90,
      combatResult: { damageDealt: 2 },
      statusesToRemove: [],
      consumedWeaponId: null,
    });
    expect(attacked.monsters).toEqual([]);
    expect(attacked.lastAttack).toMatchObject({
      combatResult: { damageDealt: 2 },
    });
  });

  it("executes one-time movement scripts with teleport and notifications", () => {
    const session = createSession({
      currentMap: {
        scripts: [
          {
            x: 1,
            y: 1,
            text: "pospsg 4,5,0;\nmsg botola segreta;",
            evento: 1,
            unavolta: true,
            morto: false,
            idmosc: 0,
          },
        ],
      },
    });

    const firstRun = executeDungeonScripts({
      session,
      eventType: 1,
      context: { previousPosition: { x: 1, y: 1 } },
      visibilityMap: { data: [] },
    });

    expect(firstRun.handled).toBe(true);
    expect(firstRun.session.heroes[0]).toMatchObject({ x: 4, y: 5 });
    expect(firstRun.effects.stopMovement).toBe(true);
    expect(firstRun.effects.movementDelta).toBe(-1);
    expect(firstRun.notifications).toEqual(["botola segreta"]);
    expect(firstRun.session.triggeredScripts).toHaveLength(1);

    const secondRun = executeDungeonScripts({
      session: firstRun.session,
      eventType: 1,
      context: { previousPosition: { x: 1, y: 1 } },
      visibilityMap: { data: [] },
    });

    expect(secondRun.handled).toBe(false);
  });

  it("applies attack blocking scripts only when the required weapon is not equipped", () => {
    const blocked = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: "noattarma 17;",
              evento: 2,
              unavolta: false,
              morto: false,
              idmosc: 14,
            },
          ],
        },
      }),
      eventType: 2,
      context: { monsterTypeId: 14, onDeath: false },
      visibilityMap: { data: [] },
    });

    expect(blocked.handled).toBe(true);
    expect(blocked.effects.attackBlocked).toBe(true);

    const allowed = executeDungeonScripts({
      session: createSession({
        heroes: [
          {
            heroId: 1,
            turnOrder: 1,
            x: 2,
            y: 2,
            gold: 0,
            inventory: [],
            equipment: [17],
            equipped: [17],
            currentBody: 8,
            currentMind: 4,
            activeStatus: [],
          },
        ],
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: "noattarma 17;",
              evento: 2,
              unavolta: false,
              morto: false,
              idmosc: 14,
            },
          ],
        },
      }),
      eventType: 2,
      context: { monsterTypeId: 14, onDeath: false },
      visibilityMap: { data: [] },
    });

    expect(allowed.effects.attackBlocked).toBe(false);
  });

  it("awards loot on monster death scripts", () => {
    const result = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: "aggoro 100;\naggogg 9;",
              evento: 2,
              unavolta: false,
              morto: true,
              idmosc: 14,
            },
          ],
        },
      }),
      eventType: 2,
      context: { monsterTypeId: 14, onDeath: true },
      visibilityMap: { data: [] },
    });

    expect(result.session.heroes[0].gold).toBe(100);
    expect(result.session.heroes[0].inventory).toEqual([9]);
  });

  it("executes room search scripts in the current area and can end the turn", () => {
    const visibilityMap = {
      data: [
        { x: 2, y: 2, valo: 7, fog: false },
        { x: 6, y: 13, valo: 7, fog: false },
      ],
    };
    const result = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 6,
              y: 13,
              text: "posmostro 7,6,13;\nmsg gargola;\nfineturno;",
              evento: 3,
              unavolta: true,
              morto: false,
              idmosc: 0,
            },
          ],
        },
      }),
      eventType: 3,
      visibilityMap,
    });

    expect(result.handled).toBe(true);
    expect(
      result.session.currentMap.grid.find(
        (cell) => cell.x === 6 && cell.y === 13,
      ).mostab,
    ).toMatchObject({ mos: true, mosid: 7 });
    expect(result.notifications).toEqual(["gargola"]);
    expect(result.effects.forceFinishTurn).toBe(true);
  });

  it("shares the same random variable across serand blocks and normalizes script images", () => {
    const result = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 1,
              y: 1,
              text: "serand 1,6,5;\nmsg colpito;\nagghp -1;\nend;\nserand 1,6,1;\naggoro 10;\nend;\nimg \\img\\mostri\\gargoyle.gif,5,12;",
              evento: 1,
              unavolta: false,
              morto: false,
              idmosc: 0,
            },
          ],
        },
      }),
      eventType: 1,
      context: { previousPosition: { x: 1, y: 1 } },
      visibilityMap: { data: [] },
      random: () => 0.8,
    });

    expect(result.session.heroes[0].currentBody).toBe(7);
    expect(result.session.heroes[0].gold).toBe(0);
    expect(result.notifications).toEqual(["colpito"]);
    expect(result.session.scriptImages).toEqual([
      { x: 5, y: 12, src: "/img/mostri/gargoyle.gif" },
    ]);
  });

  it("runs room-entry scripts only for the requested room", () => {
    const result = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: "sestanza 13;\nmsg stanza13;\nend;",
              evento: 8,
              unavolta: false,
              morto: false,
              idmosc: 0,
            },
          ],
        },
      }),
      eventType: 8,
      context: { roomId: 13 },
      visibilityMap: { data: [] },
    });

    expect(result.notifications).toEqual(["stanza13"]);
  });
});
