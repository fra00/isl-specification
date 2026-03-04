# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-secret-passages

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellPassage in `./domain-map.isl.md`

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

#### searchPassages

- **Contract**: Scans visible area for secret passages.
- **Trigger**: User clicks "Cerca Passaggi".
- **Flow**:
  - Initialize `foundInThisSearch` as false.
  - Iterate through `gameSession.currentMap.grid` (the map cells).
  - FOR each cell:
    - Check if cell has `psgg` (Secret Passage property).
    - IF `cell.psgg.ps` > 0:
      - Check visibility: Find corresponding cell in `visibilityMap` (at x, y).
      - IF `visibilityMap` cell exists AND `fog` is false:
        - Check if already found: IF (x, y) NOT in `foundPassages`:
          - Determine Image:
            - IF `cell.psgg.oriz` is true THEN `img` = "pso.jpg".
            - ELSE `img` = "psv.jpg".
          - Add {x, y, img} to `foundPassages`.
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