# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./armory

---

> **Reference**: PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: Hero, Equipment in `./domain-ruleset.isl.md`
> **Reference**: GameSession, HeroState in `./domain-session.isl.md`
> **Reference**: ShopLogic in `./shop-logic.isl.md`
> **Reference**: HeroSummary in `./hero-summary.isl.md`
> **Reference**: ShopInventory in `./shop-inventory.isl.md`

## Component: Armory

### Role: Presentation

## Domain Concepts

### 📦 Content/Structure

#### `ArmoryPanel`

- **Contract**: Identifies the two main presentation areas of the armory flow.

- `HERO_SUMMARY`: Panel containing the selected hero dossier.
- `SHOP_INVENTORY`: Panel containing the inventory and purchase actions.

**Signature**:

- `gameSession`: GameSession (Current session state).
- `onUpdateSession`: (session: GameSession) -> void (Callback to update session).
- `onChangePageView`: (page: PageNavigationEnum) -> void (Callback to navigate).

### 🔍 Appearance

- **Layout**: Full-page dark gothic armory aligned with mission selection and briefing screens.
- **Background**: Reuse the original HeroQuest artwork with dark overlays, mist and bronze highlights.
- **Header**: Compact bronze fantasy heading and short descriptive copy.
- **Columns**: Two-column responsive layout.
  - **Left Column**: Contains `HeroSummary` inside a dark panel.
  - **Right Column**: Contains `ShopInventory` inside a dark panel.
- On large screens, the combined composition must read as three vertical areas: hero dossier, equipment list, preview/actions.
- Scrollbars must use the same dark bronze palette as the rest of the navigation flow.
- Horizontal scrolling must never appear.

### 📦 Content

- `HeroSummary` component.
- `ShopInventory` component.

### ⚡ Capabilities

#### initialize

- **Contract**: Initializes the shop by loading data.
- **Trigger**: On Component Mount.
- **Flow**:
  - Call `ShopLogic.loadShopData()`.
  - Store `staticHeroes` and `shopItems` in local state.
  - Set default `selectedHeroIndex` to 0.

#### selectHero

- **Contract**: Changes the currently active hero for the shop.
- **Signature**: `(index: Integer)`
- **Flow**:
  - Set `selectedHeroIndex` to `index`.
  - Reset `selectedEquipmentId` to null.
  - Disable Each Element in shop not pass validation Purchase (validatePurchase in ShopLogic )

#### selectItem

- **Contract**: Selects an item to view/buy.
- **Signature**: `(itemId: Integer)`
- **Flow**:
  - Set `selectedEquipmentId` to `itemId`.

#### buyItem

- **Contract**: Orchestrates the purchase using ShopLogic.
- **Trigger**: `onBuy` callback from `ShopInventory`.
- **Flow**:
  - Get `currentHero` and `selectedItem`.
  - Call `ShopLogic.validatePurchase(currentHero, selectedItem)`.
  - IF allowed:
    - Call `ShopLogic.executePurchase(gameSession, selectedHeroIndex, selectedItem)`.
    - Trigger `onUpdateSession(updatedSession)`.

#### enterDungeon

- **Contract**: Starts the current mission.
- **Trigger**: `onEnterDungeon` callback from `ShopInventory`.
- **Flow**: change page view to `DUNGEON`
  - onChangePageView to `PageNavigationEnum.DUNGEON`.

#### exitShop

- **Contract**: Returns to the game navigation.
- **Trigger**: `onExit` callback from `ShopInventory`.
- **Flow**:
  - onChangePageView to `PageNavigationEnum.DUNGEON_DESCRIPTION`

### 🚨 Constraints

- The component must adapt to 100% of the available container height.
- The main armory container must not scroll vertically.
- When vertical space is insufficient, only the internal panels and lists may scroll vertically.
- The visual direction must remain coherent with the dark bronze HeroQuest navigation flow.
