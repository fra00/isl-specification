# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-inventory-logic

---

> **Reference**: @HeroState, @GameSession in `./domain-session.isl.md`
> **Reference**: @Equipment in `./domain-ruleset.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component validates equipment metadata and delegates persistent equip state changes to the dungeon session boundary.

## Component: useInventoryLogic

### Role: Business Logic

**Signature**:

- `staticEquipment`: List<@Equipment>
- `sessionManager`: @useDungeonSessionManager

### ⚡ Capabilities

#### isItemCompatibleWithHero

- **Contract**: Checks if a specific equipment item can be used by a hero based on class restrictions.
- **Signature**: `(hero: @HeroState, item: @Equipment) -> Boolean`
- **Flow**:
  - IF `item.solopsg` is true AND `item.solopsgid` is NOT equal to `hero.heroId`:
    - RETURN false.
  - IF `item.nopsg` is true AND `item.nopsgid` is EQUAL to `hero.heroId`:
    - RETURN false.
  - RETURN true.

#### toggleEquipItem

- **Contract**: Requests the dungeon session boundary to equip or unequip an item after the consumer provides the active `gameSession` context.
- **Signature**: `(heroId: Integer, itemId: Integer, gameSession: @GameSession) -> Boolean`
- **Flow**:
  - IF `gameSession` is null RETURN false.
  - RETURN `sessionManager.toggleEquipItem(heroId, itemId, staticEquipment)`.

### ✅ Acceptance Criteria

- A Wizard cannot equip items marked with `nopsg: true` for their class ID.
- A Dwarf-only item (solopsg) cannot be equipped by a Barbarian.
- Equipping a Two-Handed weapon (noogg: 11) automatically unequips the Shield (ID 11).
- Equipping a Shield (ID 11) automatically unequips any weapon that has `noogg: 11`.
