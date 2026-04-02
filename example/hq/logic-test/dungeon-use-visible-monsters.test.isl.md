<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-visible-monsters.isl.md -->

## Scenario: Empty Session or Missing Visibility Data
- **Given**: A `gameSession` where `monsters` is an empty list, or a `boardVisibilityMap` that is null/undefined.
- **When**: The `visibleMonsters` capability is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list must be empty.
    - The system must not throw a runtime error (null pointer exception).
    - The flow must terminate gracefully.

## Scenario: Monster in Fog of War
- **Given**: A `gameSession` containing a `MonsterState` at coordinates (5, 5). The corresponding `VisibilityCell` for (5, 5) in `boardVisibilityMap` has `fog: true`.
- **When**: The `visibleMonsters` capability is invoked.
- **Assert (Expected Outcomes)**:
    - The monster at (5, 5) must NOT be included in the returned list.
    - The logic must correctly identify the `fog` property as the primary filter for visibility.

## Scenario: Monster in Visible Area
- **Given**: A `gameSession` containing a `MonsterState` at coordinates (2, 2). The corresponding `VisibilityCell` for (2, 2) in `boardVisibilityMap` has `fog: false`.
- **When**: The `visibleMonsters` capability is invoked.
- **Assert (Expected Outcomes)**:
    - The monster at (2, 2) must be included in the returned list.
    - The returned object must contain the full `MonsterState` data.

## Scenario: Mixed Visibility State
- **Given**: A `gameSession` with two monsters: Monster A at (1, 1) and Monster B at (10, 10). `VisibilityCell` for (1, 1) has `fog: false`, and `VisibilityCell` for (10, 10) has `fog: true`.
- **When**: The `visibleMonsters` capability is invoked.
- **Assert (Expected Outcomes)**:
    - The returned list must contain exactly one element (Monster A).
    - The system must correctly filter out Monster B while preserving Monster A.

## Scenario: Monster Coordinates Outside Visibility Map
- **Given**: A `gameSession` with a `MonsterState` at (99, 99). The `boardVisibilityMap` only contains cells for coordinates (0,0) to (10,10).
- **When**: The `visibleMonsters` capability is invoked.
- **Assert (Expected Outcomes)**:
    - The monster at (99, 99) must NOT be included in the returned list.
    - The flow must handle the missing `VisibilityCell` (lookup failure) as a "not visible" state rather than a crash.

## Scenario: Deterministic Completion and State Integrity
- **Given**: A `gameSession` with multiple monsters and a valid `VisibilityMap`.
- **When**: The `visibleMonsters` capability is invoked repeatedly under high load or rapid state updates.
- **Assert (Expected Outcomes)**:
    - The function must be pure (no side effects on `gameSession` or `boardVisibilityMap`).
    - The function must return a consistent result for the same input state.
    - The flow must ensure that even if a `VisibilityCell` is malformed (e.g., missing `fog` property), it defaults to `fog: true` (safe-fail) to prevent accidental monster reveal.