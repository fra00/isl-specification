# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-visibility-calc

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`

## Component: useVisibilityCalc

### Role: Business Logic

**Signature**: `useVisibilityCalc({ gameSession: GameSession, visibilityMap: VisibilityMap })`

### ⚡ Capabilities

#### calculateVisibleCells

- **Contract**: Calculates visible cells from a specific position using Room/Corridor logic.
- **Signature**: `(startX: Integer, startY: Integer) -> List<{x: Integer, y: Integer}>`
- **Flow**:
  - Initialize `visibleCells` list.
  - Find `startVisCell` in `visibilityMap` at `startX`, `startY`.
  - IF `startVisCell` is null, Return empty list.
  - Add `{x: startX, y: startY}` to `visibleCells`.
  - **Phase 1: Room Visibility**
    - IF `startVisCell.valo` is NOT "1":
      - Iterate through all cells in `visibilityMap.data`.
      - IF `cell.valo` == `startVisCell.valo`:
        - Add `{x: cell.x, y: cell.y}` to `visibleCells`.
      - Return `visibleCells`.
  - **Phase 2: Corridor Visibility (Ray Casting)**
    - Define `directions` as Up (0,-1), Down (0,1), Left (-1,0), Right (1,0).
    - FOR EACH `dir` in `directions`:
      - Set `currentX` = `startX`, `currentY` = `startY`.
      - WHILE true:
        - Increment `currentX` by `dir.x`, `currentY` by `dir.y`.
        - Find `visCell` in `visibilityMap` at `currentX`, `currentY`.
        - IF `visCell` is null: BREAK Loop.
        - **Rule 1: Room Boundary (Stop)**:
          - IF `visCell.valo` is NOT "1":
            - BREAK Loop.
        - **Rule 2: Obstacle (Stop)**:
          - Find `mapCell` in `gameSession.currentMap.grid` at `currentX`, `currentY`.
          - IF `mapCell` exists AND `mapCell.arnt.antroc` is true (Rock):
            - Add `{x: currentX, y: currentY}` to `visibleCells` (See the rock).
            - BREAK Loop.
        - **Rule 3: Corridor (Propagate)**:
          - Add `{x: currentX, y: currentY}` to `visibleCells`.
          - CONTINUE Loop.
  - Return `visibleCells`.
