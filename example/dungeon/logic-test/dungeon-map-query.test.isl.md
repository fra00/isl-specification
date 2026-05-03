<!-- LOGIC TEST SCENARIOS FOR: dungeon-map-query.isl.md -->

## Scenario: Initialize with Null VisibilityMap
- **Given**: A `GameSession` is active, but `visibilityMap` is passed as `null`.
- **When**: `initialize` is called.
- **Assert (Expected Outcomes)**:
    - The component state remains stable.
    - Subsequent calls to `getVisibilityCell` return `null` rather than throwing an exception.
    - Internal flags (e.g., `isInitialized`) are set to `true` to ensure deterministic completion.

## Scenario: Retrieve Valid Map Cell
- **Given**: A `MapDefinition` exists with a `MapCell` at coordinates `(5, 5)`.
- **When**: `getMapCell(5, 5)` is called.
- **Assert (Expected Outcomes)**:
    - Returns the correct `@MapCell` object.
    - The returned object contains the expected `mobili`, `mostab`, and `trpl` properties.

## Scenario: Detect Monster Blockage (Exclusion Logic)
- **Given**: A `GameSession` with a monster at `(10, 10)` with `currentBody: 2`.
- **When**: `isBlockedByMonster(10, 10, 999)` is called (where 999 is a different ID).
- **Assert (Expected Outcomes)**:
    - Returns `true` because the monster at `(10, 10)` is alive and its ID does not match the exclusion ID.

## Scenario: Detect Monster Blockage (Dead Monster)
- **Given**: A `GameSession` with a monster at `(10, 10)` with `currentBody: 0`.
- **When**: `isBlockedByMonster(10, 10, 0)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `false` because the monster is dead (Body Points <= 0), effectively treating the cell as unblocked.

## Scenario: Detect Rock Blockage
- **Given**: A `MapCell` at `(2, 2)` where `arnt.antroc` is `true`.
- **When**: `isBlockedByRock(2, 2)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `true`.
    - If `arnt.antroc` is `false` or the cell does not exist, returns `false`.

## Scenario: Boundary Conditions for Map Dimensions
- **Given**: The system is initialized.
- **When**: `getMapDimensions()` is called.
- **Assert (Expected Outcomes)**:
    - Returns a fixed object `{ width: 26, height: 19 }`.
    - Ensures no out-of-bounds errors occur if coordinate queries are made at the exact edges (0,0) or (25, 18).

## Scenario: Adversarial Coordinate Query
- **Given**: A `MapDefinition` with standard grid size.
- **When**: `getMapCell` is called with coordinates outside the grid (e.g., `(-1, -1)` or `(100, 100)`).
- **Assert (Expected Outcomes)**:
    - The function returns `null` gracefully.
    - The system does not throw an "Index Out of Bounds" error.

## Scenario: Deterministic Completion of Visibility Query
- **Given**: A `visibilityMap` containing a list of `VisibilityCell`.
- **When**: `getVisibilityCell(x, y)` is called for a coordinate that does not exist in the `data` list.
- **Assert (Expected Outcomes)**:
    - The flow completes deterministically by returning `null`.
    - No blocking flags remain active; the system is ready for the next query immediately.

## Scenario: Door Detection
- **Given**: `MapDefinition.porte` contains an entry at `(8, 8)`.
- **When**: `isDoor(8, 8)` is called.
- **Assert (Expected Outcomes)**:
    - Returns `true`.
    - If called for `(8, 9)` (where no door exists), returns `false`.