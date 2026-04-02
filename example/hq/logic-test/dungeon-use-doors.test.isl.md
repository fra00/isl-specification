<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-doors.isl.md -->

## Scenario: Visibility via Opened Door
- **Given**: A `GameSession` where a door at `(5, 5)` is present in `currentMap.porte`. The `openedDoors` list contains `"5,5"`. The `boardVisibilityMap` shows all surrounding cells as `fog: true`.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The door at `(5, 5)` is included in the returned list.
    - The `isVisible` logic correctly prioritizes the `openedDoors` persistence check over the fog-of-war check.

## Scenario: Visibility via Adjacent Fog-Free Cell (Horizontal)
- **Given**: A horizontal door at `(10, 10)`. `openedDoors` does not contain `"10,10"`. The `boardVisibilityMap` has `fog: false` for cell `(10, 11)`.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The door at `(10, 10)` is included in the returned list.
    - The image assigned is `portao.jpg` (based on `oriz: true`).
    - The logic correctly identifies that an adjacent cell (the boundary) is visible, triggering the door's visibility.

## Scenario: Visibility via Adjacent Fog-Free Cell (Vertical)
- **Given**: A vertical door at `(2, 2)`. `openedDoors` does not contain `"2,2"`. The `boardVisibilityMap` has `fog: false` for cell `(3, 2)`.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The door at `(2, 2)` is included in the returned list.
    - The image assigned is `portav.jpg` (based on `oriz: false`).
    - The logic correctly identifies the vertical boundary check.

## Scenario: Hidden Door in Fog
- **Given**: A door at `(8, 8)`. `openedDoors` does not contain `"8,8"`. All cells in `boardVisibilityMap` (including the door's cell and its boundaries) have `fog: true`.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The returned list is empty.
    - The system correctly maintains the "Fog of War" state by hiding unvisited/unopened doors.

## Scenario: Deterministic Handling of Missing Data
- **Given**: `gameSession` is null or `boardVisibilityMap` is undefined.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The function returns an empty list `[]`.
    - The flow terminates gracefully without throwing runtime exceptions (Deterministic Completion).
    - No internal state flags (if any were present) remain in a "processing" state.

## Scenario: Boundary Edge Case (Map Edge)
- **Given**: A door located at `(0, 0)` (map corner). `openedDoors` is empty. `boardVisibilityMap` has `fog: false` for `(0, 1)` but `(0, -1)` is out of bounds.
- **When**: The `visibleDoors` capability is triggered.
- **Assert (Expected Outcomes)**:
    - The logic handles the missing/out-of-bounds coordinate gracefully.
    - The door is correctly marked as visible because at least one valid adjacent cell `(0, 1)` is fog-free.