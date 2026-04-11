<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-monsters.isl.md -->

## Scenario: Spawn Monsters on Visibility Reveal

- **Given**: A `GameSession` with an empty `monsters` list and `spawnedLocations` = []. A `VisibilityMap` where a cell at (5, 5) has `fog` = false. The corresponding `MapCell` at (5, 5) has `mostab.mos` = true and `mostab.mosid` = 1.
- **When**: The `visibilityMap` is updated, triggering `spawnMonsters`.
- **Assert (Expected Outcomes)**:
  - `gameSession.monsters` contains exactly one new `@MonsterState` with `x: 5, y: 5`.
  - `gameSession.spawnedLocations` contains "5,5".
  - `onUpdateSession` is called with the updated session state.
  - The `currentBody` and `currentMind` of the spawned monster match the `monsterDefinitions` for ID 1.

## Scenario: Prevent Duplicate Monster Spawning

- **Given**: A `GameSession` where `spawnedLocations` already contains "5,5". A `VisibilityMap` where the cell at (5, 5) is visible (`fog` = false).
- **When**: `spawnMonsters` is triggered.
- **Assert (Expected Outcomes)**:
  - No new monster is added to `gameSession.monsters`.
  - `gameSession.spawnedLocations` remains unchanged.
  - `onUpdateSession` is NOT called (or called with identical state).

## Scenario: Wandering Monster Success

- **Given**: A hero is at (2, 2). `visibilityMap.data` contains the hero cell and at least one visible free cell in the same `valo`. The current map header sets `merr` to the desired wandering monster ID.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
  - A new `@MonsterState` is added to `gameSession.monsters`.
  - The monster's `x, y` coordinates are chosen from the same visible `valo` as the hero.
  - `onUpdateSession` is called with the updated session.
  - The monster's stats are initialized correctly from the `monsterDefinitions` entry selected by `currentMap.header.merr`.

## Scenario: Wandering Monster Visible Fallback

- **Given**: A hero is at (2, 2). All visible free cells in the hero's `valo` are occupied or blocked. `visibilityMap.data` still contains at least one other visible (`fog` = false) free cell in another `valo`.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
  - A new `@MonsterState` is added to `gameSession.monsters`.
  - The monster is placed on the first visible free cell available outside the hero's `valo`.
  - The chosen cell is walkable and unoccupied.
  - `onUpdateSession` is called with the updated session.

## Scenario: Wandering Monster Special Event

- **Given**: A hero is at (2, 2). The current map header sets `merr` to `-1`, meaning the quest uses a special wandering event instead of a standard monster.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
  - The function returns `null`.
  - `onNotify` is triggered with the message "In questa missione il mostro errante non è un mostro standard.".
  - `gameSession.monsters` remains unchanged.
  - `onUpdateSession` is NOT called.

## Scenario: Wandering Monster Blocked (No Space)

- **Given**: A hero is at (2, 2). No visible cell in the same `valo` is free, and there are no other visible (`fog` = false) free cells anywhere on the board.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with the message "Non c'è spazio per il mostro errante!".
  - `gameSession.monsters` remains unchanged.
  - `onUpdateSession` is NOT called.
  - The function returns `null`.

## Scenario: Deterministic Completion - Invalid Visibility Data

- **Given**: `visibilityMap` is passed as `null` or contains malformed data (e.g., empty `data` list).
- **When**: `spawnMonsters` is triggered.
- **Assert (Expected Outcomes)**:
  - The flow terminates gracefully without throwing exceptions.
  - `gameSession` remains in its original state.
  - No side effects (notifications or updates) are triggered.

## Scenario: Adversarial - Monster Definition Missing

- **Given**: A `MapCell` indicates a monster exists (`mostab.mos` = true) with `mosid` = 999, but `monsterDefinitions` does not contain an entry for ID 999.
- **When**: `spawnMonsters` is triggered for a newly visible cell.
- **Assert (Expected Outcomes)**:
  - The system identifies the missing definition.
  - The monster is NOT added to `gameSession.monsters`.
  - The `spawnedLocations` is NOT updated for that coordinate (allowing for potential retry if data is fixed).
  - The flow continues to process other cells in the `visibilityMap` without crashing.
