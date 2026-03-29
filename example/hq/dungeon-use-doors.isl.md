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
    - Let `doorCoordKey` = `x + "," + y`.
    - Initialize `isVisible` to false.

    - **Check Persisted Visibility**:
      - IF `gameSession.openedDoors` contains `doorCoordKey`:
        - Set `isVisible` to true.
    - **Check Dynamic Visibility (Fog of War)**:
      - IF `isVisible` is false:
        - // A door is visible if its own cell OR either side of its boundary is revealed.
        - Let `cellsToCheck` = List containing `{x, y}`.
        - IF `door.oriz` is true (Horizontal):
          - Add `{x: x, y: y-1}` and `{x: x, y: y+1}` to `cellsToCheck`.
        - ELSE (Vertical):
          - Add `{x: x-1, y: y}` and `{x: x+1, y: y}` to `cellsToCheck`.
        - FOR EACH `coord` in `cellsToCheck`:
          - Find `visCell` in `boardVisibilityMap.data` matching `coord.x` and `coord.y`.
          - IF `visCell` exists AND `visCell.fog` is false:
            - Set `isVisible` to true.
            - BREAK loop.

    - **Add to Render List**:
      - IF `isVisible` is true:
      - Determine image: IF `oriz` is true THEN `portao.jpg` ELSE `portav.jpg`. Dont scale.
      - Add the door to the result list (including x, y, and image).

- **Return**: List of objects `{ x, y, img }`.
