# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-visible-monsters

---

> **Reference**: @GameSession, @MonsterState in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`

## Component: useDungeonVisibleMonsters

### Role: Business Logic

**Signature**: `useDungeonVisibleMonsters({ gameSession: GameSession, boardVisibilityMap: VisibilityMap })`

### ⚡ Capabilities

#### visibleMonsters

- **Contract**: Returns a list of monsters currently visible to the player.
- **Flow**:
  - IF `gameSession.monsters` OR `boardVisibilityMap` is missing, RETURN empty list.
  - Iterate through `gameSession.monsters`.
  - Find the VisibilityCell for the monster's (x, y).
  - IF no cell exists or cell.fog is true, treat as not visible.
  - ELSE, include in the returned list.
  - RETURN list of visible monsters.
