# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-inventory-modal

---

> **Reference**: @HeroState in `./domain-session.isl.md`
> **Reference**: @Item, @Equipment in `./domain-ruleset.isl.md`

## Component: DungeonInventoryModal

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `hero`: @HeroState (The hero whose inventory is displayed).
- `onClose`: () -> void (Callback to close the modal).

### 🔍 Appearance

- **Overlay**: Fixed full-screen backdrop (bg-black/70), z-index 50.
- **Dialog**: Centered container, dark theme (`bg-gray-900`), white text, rounded corners, shadow-2xl, max-width 500px.
- **Header**: Title "Inventario" and a close icon.

### 📦 Content

- **Hero Identity**:
  - Image: `/img/personaggi/` + `hero.hero.immagine`.
  - Name: `hero.hero.nome` (Heading style).
  - Class: `hero.hero.classe` (Subheading).
- **Gold Balance**:
  - Display: "Monete d'Oro: " + `hero.gold`.
- **Items Grid (Oggetti)**:
  - List: Iterate `hero.inventory`.
    - Guard: IF item exists in registry: display name/image. ELSE: display 'Unknown Item' placeholder.
- **Equipment List (Equipaggiamento)**:
  - List: Iterate `hero.equipment`. For each ID, display the corresponding name of `@Equipment`.

### ⚡ Capabilities

#### handleClose

- **Contract**: Triggers the close callback.
- **Trigger**: User clicks the close button or the overlay.
- **Flow**:
  - Trigger `onClose`.
