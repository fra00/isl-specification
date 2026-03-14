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
  - FOR each `cell` in `visibleCells`:
    - Find corresponding `mapCell` in `gameSession.currentMap.grid` at `cell.x`, `cell.y`.
    - IF `mapCell` exists AND `mapCell.psgg` exists AND `mapCell.psgg.ps` > 0:
      - Check if already found: IF (`mapCell.x`, `mapCell.y`) NOT in `foundPassages`:
        - Determine Image:
          - IF `mapCell.psgg.oriz` is true THEN `img` = "pso.jpg".
          - ELSE `img` = "psv.jpg".
        - Add {x: mapCell.x, y: mapCell.y, img: img} to `foundPassages`.
        - Set `foundInThisSearch` to true.
  - IF `foundInThisSearch` is true:
    - Trigger `onNotify("Hai trovato un passaggio segreto!")`.
    - Trigger `onActionDone()`.
  - ELSE:
    - Trigger `onNotify("Nessun passaggio segreto trovato.")`.
    - Trigger `onActionDone()`.

#### getFoundPassages

- **Contract**: Returns the list of visible secret passages.
- **Return**: `foundPassages`.
