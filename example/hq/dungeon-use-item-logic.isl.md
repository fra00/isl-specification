# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-item-logic

---

> **Reference**: @HeroState, @GameSession in `./domain-session.isl.md`
> **Reference**: @Item in `./domain-ruleset.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component exposes consumable item intent while delegating persistent session writes to the dungeon session boundary.

## Component: useItemLogic

### Role: Business Logic

**Signature**:

- `staticItems`: List<@Item>
- `sessionManager`: @useDungeonSessionManager

### ⚡ Capabilities

#### useItem

- **Contract**: Delegates consumable item execution to the dungeon session boundary using the active `gameSession` context.
- **Signature**: `(heroId: Integer, itemId: Integer, gameSession: @GameSession, targetMonsterId: Integer | null) -> Boolean`
- **Flow**:
  - IF `gameSession` is null RETURN false.
  - RETURN `sessionManager.useItem(heroId, itemId, staticItems, targetMonsterId)`.

### ✅ Acceptance Criteria

- Using a healing potion increases `currentBody`.
- Health cannot exceed the hero's starting `corpo` value.
- The item is removed from the `inventory` array after use.
- A notification is shown to the user confirming the action.
