# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./shop-inventory

---

> **Reference**: Equipment in `./domain-ruleset.isl.md`

## Component: ShopInventory

### Role: Presentation

**Signature**:

- `items`: List<Equipment> (List of available shop items).
- `selectedItemId`: Integer (ID of the currently selected item).
- `canBuy`: Boolean (Whether the selected item can be purchased).
- `buyReason`: String (Reason if purchase is disabled).
- `onSelect`: (id: Integer) -> void (Callback when item is selected).
- `onBuy`: () -> void (Callback to buy item).
- `onEnterDungeon`: () -> void (Callback to start mission).
- `onExit`: () -> void (Callback to exit shop).

### 🔍 Appearance

- **Layout**: Vertical column layout.
- **List**: Scrollable list of items.
- **Preview**: Card showing selected item image.
- **Actions**: Row of buttons at the bottom.

### 📦 Content

- **Item List**: Iterates over `items`.
  - Displays Name and Price.
  - Highlights if `id` matches `selectedItemId`.
  - Visual indication (e.g., opacity) if item is not affordable/compatible (logic handled by parent).
- **Preview**: Image sourced from `/img/equip/` + `selectedItem.immagine`.
- **Buttons**:
  - "Acquista" (Disabled if `!canBuy`, tooltip shows `buyReason`).
  - "Entra nel dungeon".
  - "Esci".

### ⚡ Capabilities

#### handleInteraction

- **Contract**: Delegates actions to parent.
- **Trigger**: User clicks buttons or items.
- **Flow**:
  - IF Item clicked -> IF items.find(i => i.id === id) == null THEN return; ELSE Trigger onSelect(id).
  - IF "Acquista" clicked AND `canBuy` -> Trigger `onBuy()`.
  - IF "Entra nel dungeon" clicked -> Trigger `onEnterDungeon()`.
  - IF "Esci" clicked -> Trigger `onExit()`.
