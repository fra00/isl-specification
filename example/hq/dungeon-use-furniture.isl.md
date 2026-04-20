# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-furniture

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellFurniture, @MapCell in `./domain-map.isl.md`

## Component: useDungeonFurniture

hooks for manage visibility for furniture

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession (Current session state containing the map definition).
- `boardVisibilityMap`: @VisibilityMap (The calculated visibility map with fog status).

### ⚡ Capabilities

#### visibleFurniture

- **Contract**: Returns a list of furniture items (@MapCellFurniture) that are currently visible to the player.
- **Signature**: () -> List<{x: Integer, y: Integer, img: String}>
- **Trigger**: When `gameSession.currentMap` or `boardVisibilityMap` changes.
- **Flow**:
  - IF `gameSession.currentMap` OR `boardVisibilityMap` is missing RETURN empty list.
  - Initialize `visibleFurniture` as an empty list.
  - Iterate through each `mapCell` in `gameSession.currentMap.grid`:
    - Find the corresponding cell in `boardVisibilityMap` (matching x, y).
    - IF the visibility cell exists AND `fog` is false:
      - IF `mapCell.arnt.antroc` is true AND `mapCell.arnt.inv` is false:
        - Add `{ x: mapCell.x, y: mapCell.y, img: "../cell/pietra.jpg" }` to `visibleFurniture`.
      - ELSE IF `mapCell.mobili.num` is NOT null:
        - Add `{ x: mapCell.x, y: mapCell.y, img: mapCell.mobili.img }` to `visibleFurniture`.
- **Return**: List of objects `{ x, y, img }`.
