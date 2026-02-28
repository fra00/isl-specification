# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-furniture

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellFurniture in `./domain-map.isl.md`

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
  - Iterate through `gameSession.currentMap.grid`.
  - FOR each cell with `mobili.num` diverso da null :
    - Find the corresponding cell in `boardVisibilityMap` (matching x, y).
    - IF the visibility cell exists AND `fog` is false:
      - Add the furniture item to the result list (including x, y, and image).
- **Return**: List of objects `{ x, y, img }`.
