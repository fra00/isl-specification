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

- **Contract**: Spawns a wandering monster adjacent to the current hero.
- **Signature**: `(heroX: Integer, heroY: Integer) -> @MonsterState | null`
- **Flow**:
  - Define `directions` as Up, Down, Left, Right.
  - Initialize `spawnCell` as null.
  - FOR EACH `dir` in `directions`:
    - Let `targetX` = `heroX` + `dir.x`, `targetY` = `heroY` + `dir.y`.
    - IF `targetX, targetY` is within bounds AND cell is walkable (not wall/rock) AND NOT occupied by any hero or monster:
      - Set `spawnCell` to `{x: targetX, y: targetY}`.
      - BREAK loop.
  - IF `spawnCell` is null:
    - Trigger `onNotify("Non c'è spazio per il mostro errante!")`.
    - RETURN null.
  - Pick a monster definition (Default ID 1 - Orco, or random from `monsterDefinitions`).
  - Create `@MonsterState` -> `newMonster`:
    - `id`: unique random integer.
    - `monster`: selected definition.
    - `x`: `spawnCell.x`, `y`: `spawnCell.y`.
    - `currentBody`: `monster.corpo`.
    - `currentMind`: `monster.mente`.
  - Update `gameSession.monsters` by adding `newMonster`.
  - Trigger `onUpdateSession`.
  - RETURN `newMonster`.
