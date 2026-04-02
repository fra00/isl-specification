# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-fog-of-war

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCell in `./domain-map.isl.md`
> **Reference**: @useVisibilityCalc in `./dungeon-use-visibility-calc.isl.md`

## Component: useFogOfWar

### Role: Business Logic

**Signature**: `useFogOfWar({ gameSession: @GameSession, staticVisibilityMap: @VisibilityMap })`

- `gameSession`: @GameSession (Current session state containing heroes).
- `staticVisibilityMap`: @VisibilityMap (The static board configuration loaded from JSON).

### ⚡ Capabilities

#### internal state

- `fogVisibilityMap`: @VisibilityMap (The static visibility map loaded from the mission data, used as reference for calculations).
- `visibilityCalc`: @useVisibilityCalc (Hook instance for visibility calculations).

#### init fogVisibilityMap

- **Contract**: Initializes `fogVisibilityMap` with the provided `staticVisibilityMap` when the component mounts or when `staticVisibilityMap` changes.
- **Trigger**: On component mount and when `staticVisibilityMap` changes.
- **Flow**:
  - IF `staticVisibilityMap` is null, set `fogVisibilityMap` to null.
  - ELSE, create a deep copy of `staticVisibilityMap` and set it as the initial state for `fogVisibilityMap`.

#### calculateFog

- **Contract**: Computes the current visibility state of the board based on hero positions.
- **Trigger**: When @gameSession.heroes or `staticVisibilityMap` changes.
- **Flow**:
  - IF `gameSession.isHeroOrderConfirmed` is false, RETURN.
  - Find `heroInTurn` in `gameSession.heroes` matching `gameSession.currentTurn`.
  - IF `heroInTurn` is found:
    - Call `visibilityCalc.calculateVisibleCells(heroInTurn.x, heroInTurn.y)` to get `visibleCells`.
    - Iterate through `visibleCells`:
      - Find corresponding cell in `fogVisibilityMap`.
      - Set `fog` to `false`.
  - Return the processed `fogVisibilityMap`.

#### revealInitialVisibility
- **Contract**: Clears fog for all positioned heroes at once.
- **Flow**:
  - FOR EACH `hero` IN `gameSession.heroes`:
    - Call `visibilityCalc.calculateVisibleCells(hero.x, hero.y)` to get `visibleCells`.
    - Iterate through `visibleCells`:
      - Find corresponding cell in `fogVisibilityMap` and set `fog` to `false`.
  - Return `fogVisibilityMap`.

#### revealFromPoint

- **Contract**: Manually removes fog from a specific coordinate's visible area.
- **Signature**: `(x: Integer, y: Integer)`
- **Flow**:
  - Call `visibilityCalc.calculateVisibleCells(x, y)` to get `visibleCells`.
  - Iterate through `visibleCells`:
    - Find corresponding cell in `fogVisibilityMap` and set `fog` to `false`.

**🚨 Constraint**:

- When fog is removed from a cell, it should remain permanently visible for the rest of the session. This means that once a cell's `fog` is set to `false`, it should never revert back to `true` even if all heroes move away from it.

- **Return**: `fogVisibilityMap` (The map data with updated fog status).
