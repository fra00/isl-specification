<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-furniture.isl.md -->

## Scenario: Empty Session or Missing Visibility Map
- **Given**: `gameSession` is null or `boardVisibilityMap` is null.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**: 
    - The function returns an empty list `[]`.
    - The system does not throw a null pointer exception.
    - Deterministic completion: The flow terminates immediately without attempting to iterate over undefined grid data.

## Scenario: Fog of War Hiding Furniture
- **Given**: A `MapCell` at (5, 5) contains furniture (`mobili.num` = 10, `img` = "chest.jpg"). The corresponding `VisibilityCell` at (5, 5) has `fog` = true.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list does not contain the entry for (5, 5).
    - Furniture remains hidden while the cell is under the fog of war.

## Scenario: Visible Furniture Rendering
- **Given**: A `MapCell` at (2, 3) contains furniture (`mobili.num` = 5, `img` = "table.jpg"). The corresponding `VisibilityCell` at (2, 3) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list contains an object `{ x: 2, y: 3, img: "table.jpg" }`.
    - The furniture is correctly identified as visible.

## Scenario: Rock Block Transition (Antroc) Priority
- **Given**: A `MapCell` at (1, 1) has `arnt.antroc` = true, `arnt.inv` = false, and `mobili.num` = 99. The corresponding `VisibilityCell` at (1, 1) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list contains `{ x: 1, y: 1, img: "../cell/pietra.jpg" }`.
    - The logic prioritizes the `antroc` (rock block) image over the `mobili.img` property, as per the "ELSE IF" flow structure.

## Scenario: Invisible Block Transition (Inv) Exclusion
- **Given**: A `MapCell` at (4, 4) has `arnt.antroc` = true AND `arnt.inv` = true. The corresponding `VisibilityCell` at (4, 4) has `fog` = false.
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list does not contain the rock block image (because `inv` is true).
    - If `mobili.num` is null, the list entry for (4, 4) is excluded.
    - The system correctly handles the exclusion logic for invisible blocks.

## Scenario: Deterministic Completion on Grid Mismatch
- **Given**: `gameSession.currentMap.grid` contains 100 cells, but `boardVisibilityMap.data` contains only 50 cells (or is missing specific coordinates).
- **When**: `visibleFurniture` is invoked.
- **Assert (Expected Outcomes)**:
    - The flow gracefully handles missing visibility data for specific grid cells (e.g., treating them as `fog` = true).
    - The process completes for all reachable cells without hanging or crashing.
    - The system ensures a valid final state (a list of visible items) is returned, even if partial data is provided.