<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-visible-monsters.isl.md -->

## Scenario: Empty Session or Missing Visibility Data
- **Given**: `gameSession` is initialized but `monsters` list is empty, OR `boardVisibilityMap` is null/undefined.
- **When**: `visibleMonsters` is invoked.
- **Assert (Expected Outcomes)**:
    - The function returns an empty list `[]`.
    - No runtime errors or exceptions are thrown.
    - The system maintains a stable state without attempting to access properties of null objects.

## Scenario: Monster in Fog of War
- **Given**: 
    - A `MonsterState` exists at coordinates `(5, 5)`.
    - `boardVisibilityMap` contains a `VisibilityCell` at `(5, 5)` where `fog` is `true`.
- **When**: `visibleMonsters` is invoked.
- **Assert (Expected Outcomes)**:
    - The monster at `(5, 5)` is excluded from the returned list.
    - The function correctly identifies the `fog` property as the primary filter for visibility.

## Scenario: Monster in Visible Area
- **Given**: 
    - A `MonsterState` exists at coordinates `(2, 2)`.
    - `boardVisibilityMap` contains a `VisibilityCell` at `(2, 2)` where `fog` is `false`.
- **When**: `visibleMonsters` is invoked.
- **Assert (Expected Outcomes)**:
    - The monster at `(2, 2)` is included in the returned list.
    - The returned list contains the full `MonsterState` object for the visible monster.

## Scenario: Multiple Monsters with Mixed Visibility
- **Given**: 
    - `gameSession.monsters` contains three instances: M1 at `(1, 1)`, M2 at `(2, 2)`, and M3 at `(3, 3)`.
    - `boardVisibilityMap` has `fog: false` for `(1, 1)` and `(3, 3)`, but `fog: true` for `(2, 2)`.
- **When**: `visibleMonsters` is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list contains exactly two monsters: M1 and M3.
    - M2 is correctly filtered out due to the `fog` status.
    - The order of the returned list preserves the relative order of the original `gameSession.monsters` list.

## Scenario: Deterministic Completion and Boundary Handling
- **Given**: 
    - A `MonsterState` exists at coordinates `(99, 99)` (out of bounds of the provided `boardVisibilityMap` data).
- **When**: `visibleMonsters` is invoked.
- **Assert (Expected Outcomes)**:
    - The function handles the missing coordinate mapping gracefully (e.g., treats as `fog: true` or ignores).
    - The flow completes deterministically without crashing due to index out-of-bounds or undefined lookup.
    - The system ensures that only monsters explicitly confirmed as visible (fog: false) are returned, defaulting to "not visible" for unknown coordinates.