# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-inventory-logic

---

> **Reference**: @HeroState, @GameSession in `./domain-session.isl.md`
> **Reference**: @Equipment in `./domain-ruleset.isl.md`

## Component: useInventoryLogic

### Role: Business Logic

**Signature**:

- `staticEquipment`: List<@Equipment>
- `onUpdateSession`: (session: @GameSession) -> void
- `onNotify`: (message: String) -> void

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

- **Contract**: Equips or unequips an item, handling validation and mutual exclusivity (noogg).
- **Signature**: `(heroId: Integer, itemId: Integer, gameSession: @GameSession)`
- **Flow**:
  - Find `hero` in `gameSession.heroes` matching `heroId`.
  - Find `item` in `staticEquipment` matching `itemId`.
  - IF `item` is null:
    - Trigger `onNotify('Oggetto non trovato.')`.
    - RETURN.

  - IF `hero.equipped` contains `itemId`:
    - Remove `itemId` from `hero.equipped`.
  - ELSE:
    - **Step 1: Validate Class**:
      - IF `isItemCompatibleWithHero(hero, item)` is false:
        - Trigger `onNotify("La tua classe non può equipaggiare questo oggetto.")`.
        - RETURN.
    - **Step 2: Handle Incompatibilities (noogg)**:
      - IF `item.noogg` > 0:
        - Remove `item.noogg` from `hero.equipped` (if present).
      - FOR EACH `equippedId` in `hero.equipped`:
        - Find `equippedItem` in `staticEquipment`.
        - IF `equippedItem.noogg` is EQUAL to `itemId`:
          - Remove `equippedId` from `hero.equipped`.
          - Trigger `onNotify("Hai rimosso " + equippedItem.nome + " perché incompatibile.")`.
    - **Step 3: Add Item**:
      - Add `itemId` to `hero.equipped`.
  - Trigger `onUpdateSession` with updated `gameSession`.

### ✅ Acceptance Criteria

- A Wizard cannot equip items marked with `nopsg: true` for their class ID.
- A Dwarf-only item (solopsg) cannot be equipped by a Barbarian.
- Equipping a Two-Handed weapon (noogg: 11) automatically unequips the Shield (ID 11).
- Equipping a Shield (ID 11) automatically unequips any weapon that has `noogg: 11`.
