# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-hero-order

---

> **Reference**: HeroState in `./domain-session.isl.md`
> **Reference**: Hero in `./domain-ruleset.isl.md`

## Component: DungeonHeroOrder

### Role: Presentation

**Signature**:

- `heroes`: List of HeroState (The heroes available for the mission).
- `onConfirmOrder`: (orderedHeroIds: List<Integer>) -> void (Callback when order is confirmed).

### 🔍 Appearance

- **Overlay**: Fixed full-screen semi-transparent background (black 75%).
- **Modal**: Centered box, dark theme (gray-800), rounded corners, shadow.
- **Typography**: White text, bold headers.
- **Grid**: 4 columns for hero slots.

### 📦 Content

- **Title**: "Select Hero Turn Order".
- **Instructions**: "Click heroes below to set their turn order (1st, 2nd, etc.)".
- **Current Order Section**:
  - Displays slots for the selected order (1 to 4).
  - Shows selected heroes (`HeroState`) with their portrait (`hero.portrait`) and class (`hero.classe`).
    path of image is `img/eroi/` + `portrait
  - Clicking a selected hero removes them from the order.
- **Available Heroes Section**:
  - Displays heroes not yet selected.
  - Clicking an available hero adds them to the next available slot in the order.
- **Confirm Button**:
  - Enabled only when all heroes are assigned an order.
  - Text: "Confirm Order".

### ⚡ Capabilities

#### internalState

- `selectedOrder`: List of Integer (Hero IDs in order).
- `availableHeroes`: List of HeroState (Heroes not yet selected).

#### initialize

- **Contract**: Sets up initial state based on props.
- **Trigger**: On Mount or when `heroes` prop changes.
- **Flow**:
  - Set `selectedOrder` to empty list.
  - Set `availableHeroes` to `heroes`.

#### selectHero

- **Contract**: Adds a hero to the turn order.
- **Signature**: `(heroId: Integer)`
- **Trigger**: User clicks on an available hero.

- **Flow**:
  - IF `heroId` is NOT in `selectedOrder` AND `selectedOrder.length` < `heroes.length`:
    - Add `heroId` to `selectedOrder`.
    - Remove hero with `heroId` from `availableHeroes`.

#### removeHero

- **Contract**: Removes a hero from the turn order.
- **Signature**: `(heroId: Integer)`
- **Trigger**: User clicks on a selected hero.
- **Flow**:
  - Remove `heroId` from `selectedOrder`.
  - Find hero in `heroes` by `heroId`.
  - Add hero back to `availableHeroes`.
  - Sort `availableHeroes` by ID (optional, for consistency).

#### confirm

- **Contract**: Finalizes the order selection.
- **Trigger**: User clicks "Confirm Order".
- **Flow**:
  - IF `selectedOrder.length` EQUALS `heroes.length`:
    - Call `onConfirmOrder(selectedOrder)`.
