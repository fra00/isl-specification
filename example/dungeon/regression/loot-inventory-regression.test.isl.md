# Project: Dungeon React Regression Tests

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-04-27
**Implementation**: ./regression/loot-inventory-regression.test

---

> **Reference**: `../dungeon-use-session-manager.isl.md`
> **Reference**: `../dungeon-use-treasure.isl.md`
> **Reference**: `../dungeon-inventory-modal.isl.md`

## Component: LootInventoryRegression

### Role: Test

### ⚡ Scenarios

## Scenario: Treasure Card Notification Uses Human Label

- **Target**: `useDungeonSessionManager.applyTreasureCardEffect`
- **Given**:
  - Treasure card action is `aggiungi_oggetto` with numeric value `card.valore`.
  - Matching item or equipment exists in static registries.
- **When**:
  - Treasure effect is applied.
- **Assert (Expected Outcomes)**:
  - Notification resolves and shows human-readable label (`descrizione` or `nome`).
  - Raw numeric ID is used only as fallback when no registry match exists.

## Scenario: Map Treasure Notification Uses Human Label

- **Target**: `useDungeonSessionManager.collectTreasureAtCell`
- **Given**:
  - Treasure cell contains `tes.ogg > 0` and/or `tes.arma > 0`.
  - Matching definitions are available in `staticItems` or `staticEquipment`.
- **When**:
  - Hero collects treasure from map cell.
- **Assert (Expected Outcomes)**:
  - Notification for item/weapon uses resolved human label.
  - Message does not regress to ID-only text when a label exists.

## Scenario: Inventory Modal Resolves Equipment Names

- **Target**: `DungeonInventoryModal` content rendering
- **Given**:
  - Hero owns equipment IDs in `hero.equipment`.
  - `allEquipment` contains matching entries.
- **When**:
  - Inventory modal is opened.
- **Assert (Expected Outcomes)**:
  - Equipment is rendered with resolved label from `allEquipment`.
  - UI must not show English technical placeholder `"Unknown equipment"`.
  - If missing definition, fallback remains localized as `Equipaggiamento ID <id>`.

## Scenario: Inventory Modal Resolves Item Names

- **Target**: `DungeonInventoryModal` content rendering
- **Given**:
  - Hero inventory contains item IDs.
  - `allItems` contains matching entries.
- **When**:
  - Inventory modal is opened.
- **Assert (Expected Outcomes)**:
  - Item labels use resolved `nome`/`descrizione`.
  - Missing definitions use localized fallback `Oggetto ID <id>`.
  - No `"Unknown Item"` placeholder appears in final UI.

## Scenario: Empty Designated Map Treasure Square Notifies And Skips Deck

- **Target**: `useTreasureSearch.searchTreasure`
- **Given**:
  - No monsters block search.
  - A visible `MapCell` has `tes.ts` == 1 and all of `mon`, `ogg`, `arma`, `trp` are less than or equal to 0 (empty pile).
- **When**:
  - The active hero triggers `searchTreasure()`.
- **Assert (Expected Outcomes)**:
  - `onNotify` shows `"Il tesoro è vuoto."`.
  - No treasure card is drawn for that same search action.
  - `collectTreasureAtCell` is NOT invoked for that branch; hero gold, inventory, equipment, and map `tes` data remain unchanged.

### ✅ Coverage Intent

- Covers notification and inventory label resolution for loot/equipment IDs.
- Prevents regressions to ID-only or placeholder labels when definitions exist.

