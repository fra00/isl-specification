<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-visibility-calc.isl.md -->

## Scenario: Room Visibility Propagation
- **Given**: A `VisibilityMap` where a cluster of cells shares the same `valo` (e.g., "RoomA"). The hero is at `(5, 5)` inside "RoomA".
- **When**: `calculateVisibleCells(5, 5)` is triggered.
- **Assert (Expected Outcomes)**:
    - The `visibleCells` list must contain all coordinates `(x, y)` where `cell.valo == "RoomA"`.
    - The logic must not trigger Ray Casting (Phase 2) if the hero is inside a defined room (`valo != "1"`).
    - The result must be deterministic regardless of the hero's specific coordinate within the room.

## Scenario: Corridor Ray Casting with Rock Obstacle
- **Given**: A corridor defined by `valo: "1"`. A hero is at `(2, 2)`. A rock block (`antroc: true`) exists at `(2, 5)`.
- **When**: `calculateVisibleCells(2, 2)` is triggered.
- **Assert (Expected Outcomes)**:
    - The `visibleCells` list must include all corridor cells from `(2, 3)` to `(2, 4)`.
    - The `visibleCells` list must include the rock cell at `(2, 5)` (Rule 2: See the rock).
    - The loop must terminate immediately after adding the rock cell, ensuring no cells beyond `(2, 5)` are added.

## Scenario: Line of Sight Blocked by Furniture
- **Given**: A hero at `(1, 1)` and a target monster at `(1, 5)`. A furniture object exists at `(1, 3)`.
- **When**: `hasLineOfSight(1, 1, 1, 5)` is triggered.
- **Assert (Expected Outcomes)**:
    - The function must return `false`.
    - The logic must identify the furniture at `(1, 3)` as an obstruction during the line trace.
    - The check must verify the `mobili` property of the `MapCell` at the intersection point.

## Scenario: Line of Sight Through Open Door
- **Given**: A hero at `(2, 2)` and a target at `(2, 6)`. A door exists at `(2, 4)` and is present in `gameSession.openedDoors`.
- **When**: `hasLineOfSight(2, 2, 2, 6)` is triggered.
- **Assert (Expected Outcomes)**:
    - The function must return `true`.
    - The logic must recognize the door coordinate `(2, 4)` as "open" via `gameSession.openedDoors`, bypassing the standard wall/room boundary obstruction rule.

## Scenario: Deterministic Completion on Invalid Coordinates
- **Given**: A `VisibilityMap` with a limited grid (e.g., 10x10).
- **When**: `calculateVisibleCells` or `hasLineOfSight` is called with coordinates outside the grid bounds (e.g., `(-1, -1)` or `(99, 99)`).
- **Assert (Expected Outcomes)**:
    - The system must not throw an unhandled exception.
    - `calculateVisibleCells` must return an empty list or the initial cell if valid, but never crash.
    - `hasLineOfSight` must return `false` if the target is unreachable or out of bounds.
    - The flow must ensure any internal processing flags (if applicable) are reset to a clean state.

## Scenario: Room Boundary Transition
- **Given**: A hero at `(5, 5)` (Room A) adjacent to a corridor at `(5, 6)` (Room/Corridor "1").
- **When**: `calculateVisibleCells(5, 5)` is triggered.
- **Assert (Expected Outcomes)**:
    - The logic must strictly adhere to Rule 1 (Room Boundary).
    - The `visibleCells` must include all cells in Room A.
    - The `visibleCells` must NOT include the adjacent corridor cell at `(5, 6)` because the `valo` transition from "RoomA" to "1" triggers a stop.