<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-secret-passages.isl.md -->

## Scenario: Successful Discovery of a Horizontal Secret Passage

- **Given**: A hero is at (5, 5). A secret passage exists at (5, 6) with `oriz: true`. The `visibilityCalc` returns a list of visible cells including (5, 5) and (5, 7).
- **When**: The user triggers `searchPassages`.
- **Assert (Expected Outcomes)**:
  - `isDiscoverable` evaluates to true because (5, 7) is in `visibleCells` (adjacent to (5, 6)).
  - `foundPassages` contains `{x: 5, y: 6, img: "pso.png"}`.
  - `onNotify` is called with "Hai trovato un passaggio segreto!".
  - `onActionDone` is triggered to end the hero's turn action.

## Scenario: No Secret Passage in Proximity

- **Given**: A hero is at (10, 10). The nearest secret passage is at (20, 20). `visibilityCalc` returns cells only within a 3-tile radius of (10, 10).
- **When**: The user triggers `searchPassages`.
- **Assert (Expected Outcomes)**:
  - `isDiscoverable` remains false for all potential passages.
  - `foundPassages` remains unchanged.
  - `onNotify` is called with "Nessun passaggio segreto trovato.".
  - `onActionDone` is triggered to ensure the turn flow continues.

## Scenario: Visibility-Based Filtering of Found Passages

- **Given**: `foundPassages` contains a passage at (2, 2). The `visibilityMap` has `fog: true` for (2, 2) and all adjacent cells (1, 2), (3, 2), (2, 1), (2, 3).
- **When**: `getFoundPassages` is called.
- **Assert (Expected Outcomes)**:
  - `isVisible` evaluates to false because no `cellsToCheck` have `fog: false`.
  - The returned list `visiblePassages` is empty.
  - The system correctly hides the passage from the UI even though it is in the `foundPassages` state.

## Scenario: Deterministic Flow Completion (Action Reset)

- **Given**: A hero has `turnOrder` matching `currentTurn`. The `searchPassages` logic is triggered.
- **When**: The search logic completes (regardless of whether a passage was found or not).
- **Assert (Expected Outcomes)**:
  - The `onActionDone` callback is guaranteed to execute.
  - The system state never remains in a "searching" or "processing" deadlock.
  - The `GameSession` turn phase is updated to reflect that the action has been consumed.

## Scenario: Edge Case - Invalid Visibility Map Data

- **Given**: `visibilityCalc.calculateVisibleCells` returns an empty list due to a map error or null `visibilityMap`.
- **When**: `searchPassages` is triggered.
- **Assert (Expected Outcomes)**:
  - The loop over `potentialPassages` fails to find any `isDiscoverable` matches.
  - `foundInThisSearch` remains false.
  - `onNotify` triggers the "Nessun passaggio segreto trovato." message.
  - `onActionDone` is triggered, preventing the UI from hanging on a failed calculation.

## Scenario: Duplicate Discovery Prevention

- **Given**: A secret passage at (8, 8) is already present in `foundPassages`.
- **When**: The hero performs `searchPassages` again while standing adjacent to (8, 8).
- **Assert (Expected Outcomes)**:
  - The condition `{x: px, y: py} NOT in foundPassages` evaluates to false.
  - The passage is not added a second time.
  - `foundInThisSearch` remains false (unless another _new_ passage is found).
  - The system does not trigger redundant notifications for already discovered passages.
