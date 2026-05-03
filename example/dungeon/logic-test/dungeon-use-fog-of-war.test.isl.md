<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-fog-of-war.isl.md -->

## Scenario: Initialization of Fog Map
- **Given**: A `staticVisibilityMap` is provided with all `fog` properties set to `true`.
- **When**: The `useFogOfWar` component mounts.
- **Assert (Expected Outcomes)**:
    - `fogVisibilityMap` is initialized as a deep copy of `staticVisibilityMap`.
    - All cells in `fogVisibilityMap` maintain `fog: true`.
    - The system does not mutate the original `staticVisibilityMap` reference.

## Scenario: Legacy Visibility Map Defaults To Fogged
- **Given**: A `staticVisibilityMap` is provided from JSON and some cells omit the `fog` property entirely.
- **When**: The `useFogOfWar` component mounts.
- **Assert (Expected Outcomes)**:
    - Every visibility cell without an explicit `fog: false` MUST be normalized to `fog: true`.
    - The board MUST NOT treat omitted `fog` values as already visible cells.
    - Only cells explicitly revealed later by fog-of-war logic may become `fog: false`.

## Scenario: Fog Removal on Hero Movement
- **Given**: A `gameSession` with a hero at position (5, 5). `fogVisibilityMap` has `fog: true` for all cells.
- **When**: `calculateFog` is triggered for the hero at (5, 5).
- **Assert (Expected Outcomes)**:
    - `visibilityCalc.calculateVisibleCells(5, 5)` is invoked.
    - All cells returned by the calculator have their `fog` property updated to `false` in `fogVisibilityMap`.
    - Cells not returned by the calculator remain `fog: true`.

## Scenario: Permanent Visibility (Persistence)
- **Given**: A hero moves from (5, 5) to (6, 6). The cell (5, 5) was previously revealed (`fog: false`).
- **When**: `calculateFog` is triggered for the new position (6, 6).
- **Assert (Expected Outcomes)**:
    - The cell at (5, 5) remains `fog: false` (it does not revert to `true`).
    - The cells visible from (6, 6) are updated to `fog: false`.
    - The system state correctly accumulates revealed areas across multiple turns.

## Scenario: Manual Reveal via Script
- **Given**: A `fogVisibilityMap` where a specific room (e.g., Room ID "2") is entirely under fog (`fog: true`).
- **When**: `revealFromPoint(x, y)` is called for a coordinate inside Room "2".
- **Assert (Expected Outcomes)**:
    - `visibilityCalc.calculateVisibleCells(x, y)` identifies all cells in Room "2".
    - Every cell in Room "2" has its `fog` property set to `false`.
    - The change is persisted in the `fogVisibilityMap` for the remainder of the session.

## Scenario: Handling Null/Invalid Inputs
- **Given**: `staticVisibilityMap` is `null` or the `gameSession` contains no heroes.
- **When**: `calculateFog` or `init` is triggered.
- **Assert (Expected Outcomes)**:
    - `fogVisibilityMap` is set to `null` (or remains empty).
    - The system does not throw runtime exceptions (Deterministic Completion).
    - The flow gracefully exits without attempting to access properties of undefined objects.

## Scenario: Deterministic Completion of Visibility Calculation
- **Given**: A complex map with multiple rooms and corridors.
- **When**: `calculateFog` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow iterates through the full list of `visibleCells` returned by `visibilityCalc`.
    - The loop completes for every cell, ensuring no partial updates occur.
    - The function returns the fully updated `fogVisibilityMap` object, ensuring the UI/State layer receives a consistent snapshot of the board.
    - No "isProcessing" or "isLoading" flags are left in a blocking state (if applicable to the implementation).