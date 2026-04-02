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
- **Given**: A hero is at (2, 2). Adjacent cells (2, 3), (3, 2), (1, 2), (2, 1) are all empty and within map bounds.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
    - A new `@MonsterState` is added to `gameSession.monsters`.
    - The monster's `x, y` coordinates are one of the valid adjacent cells.
    - `onUpdateSession` is called with the updated session.
    - The monster's stats are initialized correctly from `monsterDefinitions`.

## Scenario: Wandering Monster Blocked (No Space)
- **Given**: A hero is at (2, 2). All adjacent cells (2, 3), (3, 2), (1, 2), (2, 1) are occupied by other monsters or heroes.
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