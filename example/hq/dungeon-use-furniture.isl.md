# Project: Heroquest React

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
- **Signature**: {visibleDoors = [{x:int, y:int, img:string}]}
- **Trigger**: When `gameSession.currentMap` or `boardVisibilityMap` changes.
- **Flow**:
  - IF `gameSession.currentMap` OR `boardVisibilityMap` is missing RETURN empty list.
  - get @MapCell from `gameSession.currentMap.grid` with coordinates x,y
  - IF @MapCell.arnt.antroc is true AND @MapCell.arnt.inv is false THEN
    - Add th rock image at coordinates x,y using the image `public/img/cell/pietra.jpg`
  - Iterate through `gameSession.currentMap.grid` @MapCell.
  - FOR each cell with `mobili.num` diverso da null :
    - Find the corresponding cell in `boardVisibilityMap` (matching x, y).
    - IF the visibility cell exists AND `fog` is false:
      - Add the furniture item to the result list (including x, y, and image).
- **Return**: List of objects `{ x, y, img }`.
