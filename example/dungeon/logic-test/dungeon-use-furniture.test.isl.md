<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-furniture.isl.md -->

## Scenario: Empty Session or Missing Visibility Map

- **Given**: `gameSession` is null or `boardVisibilityMap` is null.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
  - The function returns an empty list `[]`.
  - No runtime errors or exceptions are thrown.
  - The system maintains a stable state (no side effects).

## Scenario: Fog of War Obscures Furniture

- **Given**: A `MapCell` exists at (5, 5) with `mobili.num` = 101 and `mobili.img` = "chest.png". The corresponding `VisibilityCell` at (5, 5) has `fog` = true.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
  - The returned list does not contain the entry for (5, 5).
  - The furniture remains hidden from the output despite being defined in the map.

## Scenario: Visible Furniture Rendering

- **Given**: A `MapCell` exists at (2, 3) with `mobili.num` = 202 and `mobili.img` = "table.png". The corresponding `VisibilityCell` at (2, 3) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
  - The returned list contains an object `{ x: 2, y: 3, img: "table.png" }`.
  - The furniture is correctly mapped to the visible grid.

## Scenario: Rock Block Transition (Antroc) Priority

- **Given**: A `MapCell` at (10, 10) has `arnt.antroc` = true, `arnt.inv` = false, and `mobili.num` = 500. The corresponding `VisibilityCell` at (10, 10) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
  - The returned list contains `{ x: 10, y: 10, img: "../cell/pietra.png" }`.
  - The logic prioritizes the `antroc` visual override over the `mobili.img` property.

## Scenario: Invisible Block Transition (Inv) Exclusion

- **Given**: A `MapCell` at (8, 8) has `arnt.antroc` = true, `arnt.inv` = true, and `mobili.num` = 300. The corresponding `VisibilityCell` at (8, 8) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
  - The returned list contains `{ x: 8, y: 8, img: "300_image_path" }` (or the furniture image).
  - The `antroc` rule is ignored because `inv` is true, allowing the standard furniture to be visible.

## Scenario: Deterministic Completion and State Reset

- **Given**: A complex `gameSession` with a large grid (e.g., 50x50) and multiple `VisibilityCell` updates.
- **When**: The `gameSession` or `boardVisibilityMap` is updated rapidly (simulating asynchronous loading).
- **Assert (Expected Outcomes)**:
  - The flow completes deterministically for every trigger.
  - The system never enters a "loading" dead-end; the function always returns a valid list (even if empty).
  - The iteration logic handles the full grid without index out-of-bounds errors.
  - The output list is strictly filtered by the current `fog` status of the provided `boardVisibilityMap`.
