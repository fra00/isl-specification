<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-fog-of-war.isl.md -->

## Scenario: Initialization of Fog Map
- **Given**: A `staticVisibilityMap` is provided with all `fog` properties set to `true`.
- **When**: The `useFogOfWar` component mounts.
- **Assert (Expected Outcomes)**:
    - `fogVisibilityMap` is initialized as a deep copy of `staticVisibilityMap`.
    - All cells in `fogVisibilityMap` maintain `fog: true`.
    - The system does not mutate the original `staticVisibilityMap` reference.

## Scenario: Fog Removal on Hero Movement
- **Given**: A `gameSession` with a hero at `(5, 5)` and a `fogVisibilityMap` where all cells are `fog: true`.
- **When**: `calculateFog` is triggered for the hero at `(5, 5)`.
- **Assert (Expected Outcomes)**:
    - `visibilityCalc.calculateVisibleCells(5, 5)` is invoked.
    - All cells returned by the calculation have their `fog` property updated to `false` in `fogVisibilityMap`.
    - Cells not returned by the calculation remain `fog: true`.

## Scenario: Persistence of Revealed Fog (Constraint Verification)
- **Given**: A `fogVisibilityMap` where cells `(1,1)` to `(3,3)` are already `fog: false` (previously revealed).
- **When**: The hero moves to a new position `(10, 10)` that does not include `(1,1)` to `(3,3)` in its visibility range.
- **Assert (Expected Outcomes)**:
    - `calculateFog` updates the new visible cells to `fog: false`.
    - Cells `(1,1)` to `(3,3)` retain `fog: false` (they do not revert to `true`).
    - The system state satisfies the "permanently visible" constraint.

## Scenario: Manual Reveal via Script/Event
- **Given**: A `fogVisibilityMap` where a specific room at `(20, 20)` is currently `fog: true`.
- **When**: `revealFromPoint(20, 20)` is called (e.g., triggered by a secret passage or map script).
- **Assert (Expected Outcomes)**:
    - `visibilityCalc.calculateVisibleCells(20, 20)` is executed.
    - All cells in the returned area are updated to `fog: false` in `fogVisibilityMap`.
    - The update is reflected immediately in the returned `fogVisibilityMap`.

## Scenario: Deterministic Handling of Null/Invalid Inputs
- **Given**: `staticVisibilityMap` is `null` or the `gameSession` contains no heroes.
- **When**: `calculateFog` or `init` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow handles the null reference gracefully without throwing exceptions.
    - `fogVisibilityMap` is set to `null` (or empty state) as per contract.
    - The system does not enter a dead-end state; it remains ready for a valid `staticVisibilityMap` injection.

## Scenario: Visibility Calculation Boundary Edge Case
- **Given**: A hero is positioned at the edge of the map `(0, 0)`.
- **When**: `calculateFog` is triggered.
- **Assert (Expected Outcomes)**:
    - `visibilityCalc` is called with `(0, 0)`.
    - The logic correctly handles the boundary without attempting to access out-of-bounds indices in `fogVisibilityMap`.
    - Only valid cells within the map grid are updated to `fog: false`.