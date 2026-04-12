import { describe, expect, it } from 'vitest';
import { executeDungeonScripts } from '../bin/dungeon-script-runtime';

function makeCell(x, y, overrides = {}) {
  return {
    x,
    y,
    arnt: { antroc: false, inv: false, ...(overrides.arnt || {}) },
    mobili: { num: null, img: '', ...(overrides.mobili || {}) },
    mostab: { mosid: 0, mos: false, corpo: 0, ...(overrides.mostab || {}) },
    tes: { mon: 0, ogg: 0, arma: 0, trp: 0, ...(overrides.tes || {}) },
    psgg: { ps: 0, oriz: false, ...(overrides.psgg || {}) },
    trpl: { tipo: 0, rccadex: 0, rccadey: 0, ...(overrides.trpl || {}) },
    fine: '',
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
        inventory: [9, 10],
        equipment: [17],
        equipped: [17],
        currentBody: 8,
        currentMind: 4,
        activeStatus: [],
      },
      {
        heroId: 2,
        turnOrder: 2,
        x: 6,
        y: 6,
        gold: 5,
        inventory: [],
        equipment: [],
        equipped: [],
        currentBody: 3,
        currentMind: 3,
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
        monster: { id: 14, nome: 'Spirito', difesa: 2 },
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
        makeCell(6, 7),
        makeCell(10, 1),
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

describe('dungeon-script-runtime exhaustive coverage', () => {
  it('treats bare text as an implicit message and separates newline-delimited commands without semicolons', () => {
    const bareText = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            { x: 0, y: 0, text: 'Hai trovato il sigillo perduto;', evento: 6, unavolta: true, morto: false, idmosc: 0 },
          ],
        },
      }),
      eventType: 6,
      visibilityMap: { data: [] },
    });

    expect(bareText.handled).toBe(true);
    expect(bareText.notifications).toEqual(['Hai trovato il sigillo perduto']);

    const missingSemicolon = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            { x: 1, y: 1, text: 'possta 3,10\npossta 18,6;', evento: 1, unavolta: false, morto: false, idmosc: 0 },
          ],
        },
      }),
      eventType: 1,
      context: { previousPosition: { x: 1, y: 1 } },
      visibilityMap: { data: [] },
    });

    expect(missingSemicolon.revealPoints).toEqual([
      { x: 3, y: 10 },
      { x: 18, y: 6 },
    ]);
  });

  it('covers support-only commands not currently used by HQBase maps', () => {
    const result = executeDungeonScripts({
      session: createSession({
        currentMap: {
          grid: [
            makeCell(1, 1),
            makeCell(2, 2),
            makeCell(3, 2),
            makeCell(4, 5),
            makeCell(6, 7),
            makeCell(10, 1),
          ],
          scripts: [
            {
              x: 0,
              y: 0,
              text: 'posrocinv 4,5;\nposporta 1,6,7;\naggoroid 1,25;\nrimogg 9;\nrrndogg;\nagghppsg 1,2;',
              evento: 7,
              unavolta: false,
              morto: false,
              idmosc: 0,
            },
          ],
        },
      }),
      eventType: 7,
      visibilityMap: { data: [] },
      random: () => 0,
    });

    expect(result.handled).toBe(true);
    expect(result.session.currentMap.grid.find((cell) => cell.x === 4 && cell.y === 5).arnt.inv).toBe(true);
    expect(result.session.currentMap.porte).toEqual([{ x: 6, y: 7, oriz: true }]);
    expect(result.session.heroes[1]).toMatchObject({ gold: 30, currentBody: 5 });
    expect(result.session.heroes[0].inventory).toEqual([]);
  });

  it('covers conditional inventory and equipment checks and the att override', () => {
    const conditional = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: 'seogg 9;\naggoro 10;\nend;\nsearma 17;\naggoro 20;\nend;',
              evento: 7,
              unavolta: false,
              morto: false,
              idmosc: 0,
            },
          ],
        },
      }),
      eventType: 7,
      visibilityMap: { data: [] },
    });

    expect(conditional.session.heroes[0].gold).toBe(30);

    const attackOverride = executeDungeonScripts({
      session: createSession({
        currentMap: {
          scripts: [
            {
              x: 0,
              y: 0,
              text: 'noatt;\natt;',
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

    expect(attackOverride.effects.attackBlocked).toBe(false);
  });

  it('covers event 4 and 5 area matching and room-1 rock obstruction semantics', () => {
    const event4 = executeDungeonScripts({
      session: createSession({
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
        currentMap: {
          scripts: [
            { x: 2, y: 2, text: 'msg trappola stanza;', evento: 4, unavolta: false, morto: false, idmosc: 0 },
          ],
        },
      }),
      eventType: 4,
      visibilityMap: { data: [{ x: 2, y: 2, valo: 7, fog: false }] },
    });

    expect(event4.handled).toBe(true);
    expect(event4.notifications).toEqual(['trappola stanza']);

    const blockedRoom1 = executeDungeonScripts({
      session: createSession({
        heroes: [
          {
            heroId: 1,
            turnOrder: 1,
            x: 10,
            y: 1,
            gold: 0,
            inventory: [],
            equipment: [],
            equipped: [],
            currentBody: 8,
            currentMind: 4,
            activeStatus: [],
          },
        ],
        currentMap: {
          grid: [makeCell(5, 1, { arnt: { antroc: true } }), makeCell(10, 1), makeCell(1, 1)],
          scripts: [
            { x: 1, y: 1, text: 'msg corridoio ostruito;', evento: 5, unavolta: false, morto: false, idmosc: 0 },
          ],
        },
      }),
      eventType: 5,
      visibilityMap: {
        data: [
          { x: 1, y: 1, valo: '1', fog: false },
          { x: 10, y: 1, valo: '1', fog: false },
          { x: 5, y: 1, valo: '1', fog: false },
        ],
      },
    });

    expect(blockedRoom1.handled).toBe(false);
  });
});