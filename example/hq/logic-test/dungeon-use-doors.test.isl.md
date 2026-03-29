<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-doors.isl.md -->

## Scenario: Visibility via Opened Doors
- **Given**: A `GameSession` where a door at `(5, 5)` is present in `currentMap.porte`. The `boardVisibilityMap` shows all adjacent cells as `fog: true`. The `gameSession.openedDoors` contains `"5,5"`.
- **When**: `visibleDoors()` is invoked.
- **Assert (Expected Outcomes)**:
    - The door at `(5, 5)` is included in the returned list.
    - `isVisible` logic correctly prioritizes the `openedDoors` state over the `fog` state.

## Scenario: Visibility via Fog of War (Adjacent Cells)
- **Given**: A `GameSession` with a vertical door at `(10, 10)`. `openedDoors` does not contain `"10,10"`. The `boardVisibilityMap` has `fog: false` for cell `(9, 10)` (left of the door).
- **When**: `visibleDoors()` is invoked.
- **Assert (Expected Outcomes)**:
    - The door at `(10, 10)` is included in the returned list because one of its boundary cells is revealed.
    - The image assigned is `portav.jpg` (Vertical).

## Scenario: Deterministic Handling of Missing Data
- **Given**: `gameSession` is null or `gameSession.currentMap` is undefined.
- **When**: `visibleDoors()` is invoked.
- **Assert (Expected Outcomes)**:
    - The function returns an empty list `[]`.
    - The system does not throw a runtime exception (guaranteed completion).
    - The flow terminates gracefully without attempting to access properties of null objects.

## Scenario: Horizontal vs Vertical Image Mapping
- **Given**: A map containing one horizontal door at `(2, 2)` (`oriz: true`) and one vertical door at `(4, 4)` (`oriz: false`). Both are revealed via `boardVisibilityMap`.
- **When**: `visibleDoors()` is invoked.
- **Assert (Expected Outcomes)**:
    - The door at `(2, 2)` has `img: "portao.jpg"`.
    - The door at `(4, 4)` has `img: "portav.jpg"`.
    - The list contains exactly two entries.

## Scenario: Hidden Door in Fog
- **Given**: A door at `(1, 1)` is not in `openedDoors`. The `boardVisibilityMap` shows the door cell and all adjacent cells (e.g., `(1, 0)`, `(1, 2)`) as `fog: true`.
- **When**: `visibleDoors()` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list is empty.
    - The logic correctly identifies that the door is neither opened nor adjacent to a revealed area.

## Scenario: Boundary Integrity for Visibility Check
- **Given**: A vertical door at `(0, 5)`.
- **When**: `visibleDoors()` checks visibility.
- **Assert (Expected Outcomes)**:
    - The logic attempts to check `(-1, 5)` and `(1, 5)`.
    - If `(-1, 5)` is out of bounds, the system must safely handle the lookup in `boardVisibilityMap` without crashing, ensuring the loop continues to check the valid `(1, 5)` coordinate.