<!-- LOGIC TEST SCENARIOS FOR: dungeon-map-query.isl.md -->

## Scenario: Initialize with Null VisibilityMap
- **Given**: A `GameSession` is active, but `visibilityMap` is passed as `null`.
- **When**: `initialize` is called.
- **Assert (Expected Outcomes)**:
    - The component state remains valid.
    - `getVisibilityCell` returns `null` for any coordinate input.
    - No runtime exceptions are thrown during internal structure setup.
    - Deterministic completion: The component signals "ready" state despite the missing optional dependency.

## Scenario: Get Map Cell at Boundary
- **Given**: A `MapDefinition` with a grid containing cells at (0,0) and (25,18).
- **When**: `getMapCell(25, 18)` is called.
- **Assert (Expected Outcomes)**:
    - Returns the correct `@MapCell` object.
    - `getMapCell(26, 19)` returns `null` (Out of bounds).
    - `getMapCell(-1, -1)` returns `null` (Out of bounds).

## Scenario: Blocked by Monster (Exclusion Logic)
- **Given**: A `GameSession` with a `MonsterState` at (5,5) with `currentBody` = 2.
- **When**: `isBlockedByMonster(5, 5, 999)` is called (where 999 is a different ID).
- **Assert (Expected Outcomes)**:
    - Returns `TRUE` because the monster at (5,5) is alive and ID 999 does not match.
    - `isBlockedByMonster(5, 5, [MonsterID])` returns `FALSE` (Self-exclusion allows movement through own space).
    - `isBlockedByMonster(5, 5, 999)` where `currentBody` = 0 returns `FALSE` (Dead monsters do not block).

## Scenario: Door Detection
- **Given**: `MapDefinition.porte` contains an entry at (10, 10).
- **When**: `isDoor(10, 10)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `TRUE`.
    - `isDoor(10, 11)` returns `FALSE`.

## Scenario: Rock Block Integrity
- **Given**: A `@MapCell` at (2,2) where `arnt.antroc` is `true`.
- **When**: `isBlockedByRock(2, 2)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `TRUE`.
    - `isBlockedByRock(3, 3)` (where `antroc` is `false`) returns `FALSE`.
    - `isBlockedByRock(99, 99)` (non-existent cell) returns `FALSE`.

## Scenario: Occupied by Hero
- **Given**: `GameSession.heroes` contains a hero at (7,7).
- **When**: `isOccupiedByHero(7, 7, 0)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `TRUE`.
    - `isOccupiedByHero(7, 7, [HeroID])` returns `FALSE` (Self-exclusion).
    - `isOccupiedByHero(8, 8, 0)` returns `FALSE`.

## Scenario: Deterministic Completion of Query
- **Given**: A high-frequency sequence of queries (`isBlockedByMonster`, `isDoor`, `getMapCell`) is triggered.
- **When**: The `GameSession` object is updated (e.g., a monster moves).
- **Assert (Expected Outcomes)**:
    - The `useDungeonMapQuery` must return the updated state immediately upon the next call.
    - No stale data is cached if the `gameSession` reference changes.
    - The flow never enters a "loading" state that blocks subsequent queries; all operations are synchronous and deterministic.