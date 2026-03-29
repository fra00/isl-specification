# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-secret-passages

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellPassage in `./domain-map.isl.md`
> **Reference**: @useVisibilityCalc in `./dungeon-use-visibility-calc.isl.md`

## Component: useSecretPassages

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap
- `onNotify`: (message: String) -> void (Callback to show notification).
- `onActionDone`: () -> void (Callback to mark turn action as done).

### ⚡ Capabilities

#### internalState

- `foundPassages`: List of {x: Integer, y: Integer, img: String} (Stores discovered secret passages).
- `visibilityCalc`: @useVisibilityCalc (Hook instance for visibility calculations).

#### searchPassages

- **Contract**: Scans visible area for secret passages.
- **Trigger**: User clicks "Cerca Passaggi".
- **Flow**:
  - Find current hero in `gameSession.heroes` (turnOrder == currentTurn).
  - Call `visibilityCalc.calculateVisibleCells(hero.x, hero.y)` to get `visibleCells`.
  - Initialize `foundInThisSearch` as false.
  - Iterate through all potential passages in `gameSession.currentMap.grid` (cells where `psgg.ps > 0`).
  - FOR EACH `potentialPassage`:
    - Let `px` = `potentialPassage.x`, `py` = `potentialPassage.y`.
    - // Determine if this passage is adjacent to any currently visible cell.
    - Let `isDiscoverable` = false.
    - IF `potentialPassage.psgg.oriz` is true (Horizontal):
      - IF `{x: px, y: py-1}` OR `{x: px, y: py+1}` is in `visibleCells`: Set `isDiscoverable` to true.
    - ELSE (Vertical):
      - IF `{x: px-1, y: py}` OR `{x: px+1, y: py}` is in `visibleCells`: Set `isDiscoverable` to true.
    - IF `isDiscoverable` is true AND `{x: px, y: py}` NOT in `foundPassages`:
      - Determine Image:
        - IF `potentialPassage.psgg.oriz` is true THEN `img` = "pso.jpg".
        - ELSE `img` = "psv.jpg".
      - Add {x: px, y: py, img: img} to `foundPassages`.
      - Set `foundInThisSearch` to true.

  - IF `foundInThisSearch` is true:
    - Trigger `onNotify("Hai trovato un passaggio segreto!")`.
    - Trigger `onActionDone()`.
  - ELSE:
    - Trigger `onNotify("Nessun passaggio segreto trovato.")`.
    - Trigger `onActionDone()`.

#### getFoundPassages

- **Contract**: Returns the list of visible secret passages.
- **Signature**: getFoundPassages(): { visiblePassages: [{x:int, y:int, img:string}] }
- **Flow**:
  - Initialize `visiblePassages` as an empty list.
  - FOR EACH `passage` in `foundPassages`:
    - Let `isVisible` = false.
    - // A passage is visible if its own cell OR either side of its boundary is revealed.
    - Let `cellsToCheck` = List containing `{x: passage.x, y: passage.y}`.
    - IF `passage.oriz` is true: Add `{x: x, y: y-1}` and `{x: x, y: y+1}` to `cellsToCheck`.
    - ELSE: Add `{x: x-1, y: y}` and `{x: x+1, y: y}` to `cellsToCheck`.
    - FOR EACH `coord` in `cellsToCheck`:
      - Find `visCell` in `boardVisibilityMap.data` matching `coord.x` and `coord.y`.
      - IF `visCell` exists AND `visCell.fog` is false: Set `isVisible` to true AND BREAK.
    - IF `isVisible` is true: Add `passage` to `visiblePassages`.

  - RETURN `visiblePassages`.
