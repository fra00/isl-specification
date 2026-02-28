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

### ⚡ Capabilities

#### internalState

- `spawnedLocations`: List of "x,y" strings (Tracks which map cells have had monsters spawned to prevent duplicates).
- `monsterDefinitions`: list of @Monster (Loaded from JSON on initialization for reference when spawning).

#### initialize

- Fetch board data from `/jsonData/monsters.json`.
- IF response is not OK, throw Error "Failed to load monsters.json: File not found".
- Parse response into list of @Monster and store in `monsterDefinitions`.

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
        - Create `@MonsterState` (id: random/unique, monster: `monster`, x: x, y: y, currentBody: `monster.body` , currentMind: `monster.mind`).
        - Add to `newMonsters`.
        - Add "x,y" to `newSpawnedLocations`.
  - IF `newMonsters` is not empty:
    - Create updated `@GameSession` with appended `monsters` and `spawnedLocations`.
    - Trigger `onUpdateSession`.
