<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-visibility-calc.isl.md -->

## Scenario: Room Visibility Propagation
- **Given**: A `VisibilityMap` where a cluster of cells shares the same `valo` (e.g., "RoomA"). The hero is at `(5, 5)` inside "RoomA".
- **When**: `calculateVisibleCells(5, 5)` is triggered.
- **Assert (Expected Outcomes)**:
    - The `visibleCells` list contains all coordinates `(x, y)` where `cell.valo == "RoomA"`.
    - The logic does not attempt ray casting for corridors because the room condition is met.
    - The hero's current position `(5, 5)` is included in the returned list.

## Scenario: Corridor Ray Casting with Rock Obstacle
- **Given**: A corridor path starting at `(10, 10)` with `valo` "1". At `(10, 13)`, there is a `MapCell` where `arnt.antroc` is `true`.
- **When**: `calculateVisibleCells(10, 10)` is triggered and the ray moves in the Down `(0, 1)` direction.
- **Assert (Expected Outcomes)**:
    - Cells `(10, 11)` and `(10, 12)` are added to `visibleCells` (Corridor propagation).
    - Cell `(10, 13)` is added to `visibleCells` (Rule 2: See the rock).
    - The loop terminates at `(10, 13)` and does not process `(10, 14)`.

## Scenario: Line of Sight Blocked by Furniture
- **Given**: A hero at `(2, 2)` and a monster at `(2, 5)`. A `MapCell` at `(2, 4)` contains `MapCellFurniture` with a valid `num`.
- **When**: `hasLineOfSight(2, 2, 2, 5)` is triggered.
- **Assert (Expected Outcomes)**:
    - The function detects the furniture at `(2, 4)` during the line trace.
    - The function returns `false` (Line of Sight is obstructed).

## Scenario: Line of Sight Through Open Door
- **Given**: A hero at `(5, 5)` and a monster at `(5, 8)`. A `MapDoor` exists at `(5, 6)` and is present in `gameSession.openedDoors`.
- **When**: `hasLineOfSight(5, 5, 5, 8)` is triggered.
- **Assert (Expected Outcomes)**:
    - The logic identifies the transition at `(5, 6)` as an open door.
    - The obstruction check for the door is bypassed.
    - The function returns `true` (Line of Sight is clear).

## Scenario: Deterministic Completion on Null Visibility Data
- **Given**: A `VisibilityMap` where the requested `startX, startY` does not exist in the `data` list.
- **When**: `calculateVisibleCells(startX, startY)` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow identifies `startVisCell` as `null`.
    - The function returns an empty list `[]` immediately.
    - The system state remains unchanged; no errors are thrown, and no blocking flags are left active.

## Scenario: Room Boundary Termination
- **Given**: A hero at `(1, 1)` in a corridor (`valo` "1"). The adjacent cell `(2, 1)` has `valo` "RoomB".
- **When**: `calculateVisibleCells(1, 1)` is triggered and the ray moves Right `(1, 0)`.
- **Assert (Expected Outcomes)**:
    - The logic checks `visCell.valo` for `(2, 1)`.
    - Since `valo` is not "1", the loop breaks (Rule 1: Room Boundary).
    - The cell `(2, 1)` is NOT added to the `visibleCells` list.