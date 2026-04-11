import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "../bin/node_modules/@testing-library/react";
import { useDungeonMonsters } from "../bin/dungeon-use-monsters";

const monsterDefinitions = [
  { id: 1, nome: "Orco", corpo: 1, mente: 2 },
  { id: 2, nome: "Guerriero del caos", corpo: 1, mente: 3 },
  { id: 6, nome: "Mummia", corpo: 1, mente: 0 },
];

function resolveUpdatedSession(updateArg, baseSession) {
  return typeof updateArg === "function" ? updateArg(baseSession) : updateArg;
}

function makeSession({
  merr,
  grid = [
    { x: 2, y: 2, arnt: { antroc: false, inv: false } },
    { x: 2, y: 1, arnt: { antroc: false, inv: false } },
  ],
  heroes = [{ x: 2, y: 2 }],
  monsters = [],
} = {}) {
  return {
    currentMap: {
      header: { merr },
      grid,
    },
    heroes,
    monsters,
    spawnedLocations: [],
  };
}

describe("useDungeonMonsters", () => {
  it("uses currentMap.header.merr to choose the wandering monster", () => {
    const session = makeSession({ merr: 6 });
    const onUpdateSession = vi.fn();
    const onNotify = vi.fn();

    const { result } = renderHook(() =>
      useDungeonMonsters({
        gameSession: session,
        visibilityMap: null,
        onUpdateSession,
        onNotify,
        monsterDefinitions,
      }),
    );

    let newMonster = null;
    act(() => {
      newMonster = result.current.spawnWanderingMonster(2, 2);
    });

    expect(newMonster).not.toBeNull();
    expect(newMonster.monster.id).toBe(6);
    expect(onNotify).not.toHaveBeenCalled();
    expect(onUpdateSession).toHaveBeenCalledTimes(1);
    const updatedSession = resolveUpdatedSession(onUpdateSession.mock.calls[0][0], session);
    expect(updatedSession.monsters).toHaveLength(1);
    expect(updatedSession.monsters[0].monster.id).toBe(6);
  });

  it("prefers a free visible cell in the same valo as the hero", () => {
    const onUpdateSession = vi.fn();

    const { result } = renderHook(() =>
      useDungeonMonsters({
        gameSession: makeSession({
          merr: 6,
          grid: [
            { x: 2, y: 2, arnt: { antroc: false, inv: false } },
            { x: 2, y: 1, arnt: { antroc: false, inv: false } },
            { x: 3, y: 2, arnt: { antroc: false, inv: false } },
          ],
        }),
        visibilityMap: {
          data: [
            { x: 2, y: 2, valo: "A", fog: false },
            { x: 3, y: 2, valo: "1", fog: false },
            { x: 2, y: 1, valo: "A", fog: false },
          ],
        },
        onUpdateSession,
        onNotify: vi.fn(),
        monsterDefinitions,
      }),
    );

    let newMonster = null;
    act(() => {
      newMonster = result.current.spawnWanderingMonster(2, 2);
    });

    expect(newMonster).not.toBeNull();
    expect(newMonster.x).toBe(2);
    expect(newMonster.y).toBe(1);
  });

  it("falls back to the first visible free cell when the hero area is full", () => {
    const onUpdateSession = vi.fn();

    const { result } = renderHook(() =>
      useDungeonMonsters({
        gameSession: makeSession({
          merr: 2,
          grid: [
            { x: 2, y: 2, arnt: { antroc: false, inv: false } },
            { x: 2, y: 1, arnt: { antroc: false, inv: false } },
            { x: 1, y: 2, arnt: { antroc: false, inv: false } },
            { x: 3, y: 2, arnt: { antroc: false, inv: false } },
            { x: 4, y: 4, arnt: { antroc: false, inv: false } },
            { x: 5, y: 4, arnt: { antroc: false, inv: false } },
          ],
          heroes: [
            { x: 2, y: 2 },
            { x: 2, y: 1 },
          ],
          monsters: [
            { id: 100, x: 1, y: 2 },
            { id: 101, x: 3, y: 2 },
          ],
        }),
        visibilityMap: {
          data: [
            { x: 2, y: 2, valo: "A", fog: false },
            { x: 2, y: 1, valo: "A", fog: false },
            { x: 1, y: 2, valo: "A", fog: false },
            { x: 3, y: 2, valo: "A", fog: false },
            { x: 4, y: 4, valo: "B", fog: false },
            { x: 5, y: 4, valo: "B", fog: false },
          ],
        },
        onUpdateSession,
        onNotify: vi.fn(),
        monsterDefinitions,
      }),
    );

    let newMonster = null;
    act(() => {
      newMonster = result.current.spawnWanderingMonster(2, 2);
    });

    expect(newMonster).not.toBeNull();
    expect(newMonster.monster.id).toBe(2);
    expect(newMonster.x).toBe(4);
    expect(newMonster.y).toBe(4);
  });

  it("returns null for quests with a special wandering event", () => {
    const onUpdateSession = vi.fn();
    const onNotify = vi.fn();

    const { result } = renderHook(() =>
      useDungeonMonsters({
        gameSession: makeSession({ merr: -1 }),
        visibilityMap: null,
        onUpdateSession,
        onNotify,
        monsterDefinitions,
      }),
    );

    let newMonster = null;
    act(() => {
      newMonster = result.current.spawnWanderingMonster(2, 2);
    });

    expect(newMonster).toBeNull();
    expect(onUpdateSession).not.toHaveBeenCalled();
    expect(onNotify).toHaveBeenCalledWith(
      "In questa missione il mostro errante non è un mostro standard.",
    );
  });
});
