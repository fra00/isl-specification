<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-secret-passages.isl.md -->

## Scenario: Search Passages - Successful Discovery
- **Given**: A hero is positioned at (5, 5). A secret passage exists at (6, 5) with `oriz: false` (Vertical). The `visibilityCalc` returns a list of visible cells including (5, 5) and (7, 5).
- **When**: The user triggers `searchPassages`.
- **Assert (Expected Outcomes)**:
    - `isDiscoverable` evaluates to true because (7, 5) is in `visibleCells` and the passage is vertical.
    - The passage at (6, 5) is added to `foundPassages` with `img: "psv.jpg"`.
    - `onNotify` is called with "Hai trovato un passaggio segreto!".
    - `onActionDone` is triggered to end the hero's turn action.

## Scenario: Search Passages - No Passage Found
- **Given**: A hero is at (10, 10). The `visibilityCalc` returns visible cells (10, 10) and (11, 10). No cells with `psgg.ps > 0` are adjacent to the visible area.
- **When**: The user triggers `searchPassages`.
- **Assert (Expected Outcomes)**:
    - `foundInThisSearch` remains false.
    - `onNotify` is called with "Nessun passaggio segreto trovato.".
    - `onActionDone` is triggered to end the hero's turn action.

## Scenario: Get Found Passages - Fog of War Re-hiding
- **Given**: A secret passage at (3, 3) was previously discovered and added to `foundPassages`. The `visibilityMap` for (3, 3) and its adjacent cells (2, 3) and (4, 3) is updated to `fog: true`.
- **When**: `getFoundPassages` is called.
- **Assert (Expected Outcomes)**:
    - `isVisible` evaluates to false for the passage at (3, 3) because all `cellsToCheck` have `fog: true`.
    - The returned `visiblePassages` list is empty.
    - The internal `foundPassages` state remains unchanged (persistence of discovery).

## Scenario: Search Passages - Already Discovered
- **Given**: A secret passage at (2, 2) is already present in `foundPassages`. The hero performs a search while standing adjacent to (2, 2).
- **When**: The user triggers `searchPassages`.
- **Assert (Expected Outcomes)**:
    - The logic checks `{x: 2, y: 2}` against `foundPassages` and identifies it is already present.
    - The passage is not added a second time (no duplicate entries).
    - `foundInThisSearch` remains false (unless another *new* passage is found).
    - `onNotify` is called with "Nessun passaggio segreto trovato." (assuming no other new passages exist).

## Scenario: Deterministic Flow Completion
- **Given**: The `searchPassages` function is triggered.
- **When**: The execution completes regardless of whether a passage is found or not.
- **Assert (Expected Outcomes)**:
    - The flow must guarantee that `onActionDone()` is called in every branch (Success or Failure).
    - The system state must not remain in a "searching" or "processing" state.
    - The `foundPassages` list must maintain structural integrity (never null, only valid coordinate objects).

## Scenario: Boundary Condition - Horizontal Passage Orientation
- **Given**: A horizontal passage (`oriz: true`) at (5, 5). The hero is at (5, 6).
- **When**: `searchPassages` is triggered.
- **Assert (Expected Outcomes)**:
    - The logic checks `(5, 5-1)` i.e., (5, 4) and `(5, 5+1)` i.e., (5, 6).
    - Since (5, 6) is in `visibleCells`, `isDiscoverable` is set to true.
    - The passage is correctly identified and added with `img: "pso.jpg"`.