# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-monsters

---

> **Reference**: @GameSession, @MonsterState in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellMonster in `./domain-map.isl.md`
> **Reference**: @Monster in `./domain-ruleset.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component owns monster spawning decisions while delegating persistent session updates to the dungeon session boundary.

## Component: useDungeonMonsters

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap
- `onUpdateSession`: (session: @GameSession) -> void
- `onNotify`: (message: String) -> void
- `monsterDefinitions`: List<@Monster>

### ⚡ Capabilities

#### internalState

- **Contract**: Tracks which static monster spawn points have already been materialized in the live session.
- `spawnedLocations`: List of "x,y" strings (Tracks which map cells have had monsters spawned to prevent duplicates).

#### spawnMonsters

- **Contract**: Checks visible cells for monsters (@MapCellMonster) in the static map that haven't been spawned yet, and adds them to `@GameSession.monsters`.
- **Trigger**: When `visibilityMap` changes.
- **Flow**:
  - Initialize `newMonsters` list.
  - Initialize `newSpawnedLocations` list.
  - IF `visibilityMap` is null, Return (No action).
  - Iterate through `visibilityMap.data`:
    - IF cell is NOT fogged (`fog` == false) AND `x,y` is NOT in `spawnedLocations`:
      - Find map cell in `@GameSession.currentMap.grid` at (x, y).
      - IF map cell has `mostab.mos` == true:
      - Find `@Monster` definition in `monsterDefinitions` where `id` == `mostab.mosid` and store in `monster`.
      - IF found:
        - Create `@MonsterState` (id: random/unique, monster: `monster`, x: x, y: y, currentBody: `monster.corpo` , currentMind: `monster.mente`).
        - Add to `newMonsters`.
        - Add "x,y" to `newSpawnedLocations`.
  - IF `newMonsters` is not empty:
    - Create updated `@GameSession` with appended `monsters` and `spawnedLocations`.
    - Trigger `onUpdateSession`.

#### spawnWanderingMonster

- **Contract**: Spawns a wandering monster in the hero's visible area first: adjacent in the same `valo` when possible, otherwise in the first free visible cell of the same `valo`, and only then in the first other free visible cell.
- **Signature**: `(heroX: Integer, heroY: Integer) -> @MonsterState | null`
- **Flow**:
  - Read `wanderingMonsterId` from `gameSession.currentMap.header.merr`.
  - IF `wanderingMonsterId` is missing or invalid:
    - Use fallback ID `1` (Orco) for backward compatibility.
  - IF `wanderingMonsterId` is `-1`:
    - Trigger `onNotify("In questa missione il mostro errante non è un mostro standard.")`.
    - RETURN null.
  - IF `visibilityMap.data` is available:
    - Read the hero visibility cell at `(heroX, heroY)`.
    - IF the hero visibility cell exists:
      - Check the four adjacent cells in order Up, Down, Left, Right.
      - IF an adjacent cell is visible (`fog == false`), belongs to the same `valo`, is walkable, and is not occupied by a hero or monster:
        - Set `spawnCell` to that adjacent cell.
      - OTHERWISE iterate `visibilityMap.data` in order.
      - IF a visible cell belongs to the same `valo`, is not the hero cell, is walkable, and is not occupied:
        - Set `spawnCell` to the first such cell.
    - IF no same-`valo` cell was selected:
      - Iterate all visible (`fog == false`) cells in `visibilityMap.data` order.
      - Set `spawnCell` to the first walkable, unoccupied cell different from the hero cell.
  - ELSE:
    - Use legacy fallback: check adjacent cells in order Up, Down, Left, Right and pick the first walkable, unoccupied one.
  - IF `spawnCell` is null:
    - Trigger `onNotify("Non c'è spazio per il mostro errante!")`.
    - RETURN null.
  - Pick the monster definition in `monsterDefinitions` whose `id` matches `wanderingMonsterId`.
  - IF no definition exists for the configured ID and `wanderingMonsterId` is NOT `1`:
    - Retry with fallback ID `1` (Orco).
  - IF fallback ID `1` is still unavailable and `monsterDefinitions` is not empty:
    - Pick a random fallback definition.
  - Create `@MonsterState` -> `newMonster`:
    - `id`: unique random integer.
    - `monster`: selected definition.
    - `x`: `spawnCell.x`, `y`: `spawnCell.y`.
    - `currentBody`: `monster.corpo`.
    - `currentMind`: `monster.mente`.
  - Update `gameSession.monsters` by adding `newMonster`.
  - Trigger `onUpdateSession`.
  - RETURN `newMonster`.
