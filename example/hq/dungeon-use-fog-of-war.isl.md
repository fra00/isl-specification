# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-fog-of-war

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`

## Component: useFogOfWar

### Role: Business Logic

**Signature**: `useFogOfWar({ gameSession: GameSession, staticVisibilityMap: VisibilityMap }): VisibilityMap`

- `gameSession`: @GameSession (Current session state containing heroes).
- `staticVisibilityMap`: @VisibilityMap (The static board configuration loaded from JSON).

### ⚡ Capabilities

#### internal state

- `fogVisibilityMap`: @VisibilityMap (The static visibility map loaded from the mission data, used as reference for calculations).

#### calculateFog

- **Contract**: Computes the current visibility state of the board based on hero positions.
- **Trigger**: When @gameSession.heroes or `staticVisibilityMap` changes.
- **Flow**:
  - Create a new `fogVisibilityMap` structure based on `staticVisibilityMap`.
  - Find all cells currently occupied by heroes in @gameSession.heroes (using their x and y coordinates).
  - Find the corresponding @VisibilityCell in `fogVisibilityMap.data` for those coordinates.
  - Collect and distinct `vis1` and `vis2` (ignore valo) values into a set of `activeVisibilityIds` (excluding '0').
  - Iterate through all cells in `fogVisibilityMap.data`.
  - Set `fog` to `false` IF the cell's `vis1` OR `vis2` (ignore valo) is present in `activeVisibilityIds`.
  - Return the processed `fogVisibilityMap`.

**🚨 Constraint**:

- When fog is removed from a cell, it should remain permanently visible for the rest of the session. This means that once a cell's `fog` is set to `false`, it should never revert back to `true` even if all heroes move away from it.

- **Return**: `fogVisibilityMap` (The map data with updated fog status).
