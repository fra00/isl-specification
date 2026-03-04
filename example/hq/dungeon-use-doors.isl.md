# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-doors

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapDoor in `./domain-map.isl.md`

## Component: useDungeonDoors

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession (Current session state containing the map definition).
- `boardVisibilityMap`: @VisibilityMap (The calculated visibility map with fog status).

### ⚡ Capabilities

#### visibleDoors

- **Contract**: Returns a list of doors (@MapDoor) that are currently visible to the player.
- **Signature**: visibleDoors():{ visibleDoors: [{x:int, y:int, img:string}] }
- **Trigger**: When `gameSession.currentMap` or `boardVisibilityMap` changes.
- **Flow**:
  - IF `gameSession.currentMap` OR `boardVisibilityMap` is missing RETURN empty list.
  - Iterate through `gameSession.currentMap.porte`.
  - FOR each door:
    - Parse `x` and `y` to Integer.
    - Find the corresponding cell in `boardVisibilityMap` (matching: x-1, y-1 or x, y-1 or x-1, y) .
    - IF the visibility cell exists AND `fog` is false:
      - Determine image: IF `oriz` is true THEN `portao.jpg` ELSE `portav.jpg`.
      - Add the door to the result list (including x, y, and image).
- **Return**: List of objects `{ x, y, img }`.
