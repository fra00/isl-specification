<!-- LOGIC TEST SCENARIOS FOR: dungeon-movement-rules.isl.md -->

## Scenario: Validate Destination Blocked by Dynamic Entities
- **Given**: A `GameSession` where a Monster is at coordinates (5, 5) with `currentBody` > 0.
- **When**: `isValidDestination(5, 5, heroId)` is called for a Hero.
- **Assert (Expected Outcomes)**:
    - `mapQuery.isBlockedByMonster` returns TRUE.
    - `isValidDestination` returns FALSE.
    - The system correctly identifies the collision despite the cell being technically traversable in the map grid.

## Scenario: Walkable Path Through FoggyMist
- **Given**: A Hero at (2, 2) with `activeStatus` containing "FoggyMist". A Monster is at (2, 3).
- **When**: `isWalkable(2, 2, 2, 3, heroId)` is called.
- **Assert (Expected Outcomes)**:
    - `mapQuery.isBlockedByMonster` returns TRUE.
    - The logic checks `hero.activeStatus` for "FoggyMist".
    - `isWalkable` returns TRUE (overriding the standard monster block).

## Scenario: Crossing Room Boundaries Without Door
- **Given**: Source cell (10, 10) in Room A, Target cell (10, 11) in Room B. No door or secret passage exists at these coordinates.
- **When**: `isWalkable(10, 10, 10, 11, heroId)` is called.
- **Assert (Expected Outcomes)**:
    - `sourceValo` != `targetValo`.
    - `isDoor` and `isSecretPassage` return FALSE.
    - `isWalkable` returns FALSE (enforcing room separation).

## Scenario: Crossing Room Boundaries With WallPass Effect
- **Given**: Source cell (10, 10) in Room A, Target cell (10, 11) in Room B. No door exists. Hero has "WallPass" in `activeStatus`.
- **When**: `isWalkable(10, 10, 10, 11, heroId)` is called.
- **Assert (Expected Outcomes)**:
    - The logic detects the room mismatch.
    - The logic detects the "WallPass" status.
    - `isWalkable` returns TRUE.

## Scenario: Out of Bounds Movement
- **Given**: Map dimensions are 26x19.
- **When**: `isWalkable(1, 1, 0, 1, heroId)` is called (attempting to move to X=0).
- **Assert (Expected Outcomes)**:
    - Bounds check triggers.
    - `isWalkable` returns FALSE.
    - The system prevents access to invalid grid indices.

## Scenario: Deterministic Handling of Null VisibilityMap
- **Given**: `visibilityMap` is null.
- **When**: `isWalkable` is called for any adjacent cells.
- **Assert (Expected Outcomes)**:
    - The component does not throw a null reference exception.
    - The flow gracefully handles the absence of `VisibilityCell` data (e.g., treating room logic as neutral or defaulting to blocked).
    - The system maintains a stable state and returns a boolean result.

## Scenario: Rock Obstacle Enforcement
- **Given**: A cell (4, 4) where `MapCell.arnt.antroc` is TRUE.
- **When**: `isValidDestination(4, 4, heroId)` is called.
- **Assert (Expected Outcomes)**:
    - `mapQuery.isBlockedByRock` returns TRUE.
    - `isValidDestination` returns FALSE.
    - The hero is prevented from ending their turn on a rock-blocked cell.