<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-monsters.isl.md -->

## Scenario: Spawn Monsters on Visibility Reveal
- **Given**: A `GameSession` with an empty `monsters` list and `spawnedLocations` = []. A `visibilityMap` where a cell at (5, 5) has `fog` = false. The corresponding `MapCell` at (5, 5) has `mostab.mos` = true and `mostab.mosid` = 1.
- **When**: `spawnMonsters` is triggered by the visibility update.
- **Assert (Expected Outcomes)**:
    - `GameSession.monsters` contains exactly one new `@MonsterState` with `x: 5, y: 5`.
    - `GameSession.spawnedLocations` contains "5,5".
    - `onUpdateSession` is called with the updated session state.
    - The `currentBody` and `currentMind` of the spawned monster match the values in the provided `monsterDefinitions` for ID 1.

## Scenario: Prevent Duplicate Monster Spawning
- **Given**: A `GameSession` where `spawnedLocations` = ["5,5"]. A `visibilityMap` where the cell at (5, 5) has `fog` = false.
- **When**: `spawnMonsters` is triggered.
- **Assert (Expected Outcomes)**:
    - No new monster is added to `GameSession.monsters`.
    - `GameSession.spawnedLocations` remains ["5,5"].
    - `onUpdateSession` is NOT called (or called with no changes).

## Scenario: Wandering Monster Success
- **Given**: A hero is at (2, 2). Adjacent cells (2, 3), (3, 2), (1, 2) are empty and walkable. (2, 1) is a wall.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
    - A new `@MonsterState` is added to `GameSession.monsters`.
    - The monster's `x, y` coordinates are one of the valid adjacent cells (e.g., 2, 3).
    - `onUpdateSession` is called with the updated session.
    - The function returns the newly created `@MonsterState`.

## Scenario: Wandering Monster Failure (No Space)
- **Given**: A hero is at (2, 2). All adjacent cells (2, 3), (3, 2), (1, 2), (2, 1) are either walls or occupied by other entities.
- **When**: `spawnWanderingMonster(2, 2)` is called.
- **Assert (Expected Outcomes)**:
    - `onNotify` is triggered with the message "Non c'è spazio per il mostro errante!".
    - `GameSession.monsters` remains unchanged.
    - The function returns `null`.

## Scenario: Deterministic Completion of Spawn Flow
- **Given**: A `visibilityMap` with multiple cells transitioning from `fog: true` to `fog: false` simultaneously.
- **When**: `spawnMonsters` processes the visibility update.
- **Assert (Expected Outcomes)**:
    - The logic iterates through all cells in `visibilityMap.data`.
    - The system ensures that even if multiple monsters are found, they are all processed and added to the session in a single `onUpdateSession` call.
    - The `spawnedLocations` list is updated to include all newly spawned coordinates, ensuring no logical dead-ends or infinite loops occur during the iteration.
    - The system state is guaranteed to be consistent (all monsters spawned or none, if an error occurs).

## Scenario: Invalid Monster Definition Handling
- **Given**: A `MapCell` indicates a monster exists (`mostab.mos` = true) with `mosid` = 999, but `monsterDefinitions` does not contain an entry for ID 999.
- **When**: `spawnMonsters` is triggered for that cell.
- **Assert (Expected Outcomes)**:
    - The system skips the invalid monster.
    - `GameSession.monsters` is not updated with an invalid object.
    - The flow continues to process other cells in the `visibilityMap` without crashing.