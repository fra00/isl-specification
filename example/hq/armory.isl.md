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

**Signature**:

- `gameSession`: GameSession (Current session state).
- `onUpdateSession`: (session: GameSession) -> void (Callback to update session).
- `onChangePageView`: (page: PageNavigationEnum) -> void (Callback to navigate).

### 🔍 Appearance

- **Layout**: Two-column grid layout.
  - **Left Column**: Contains `HeroSummary`.
  - **Right Column**: Contains `ShopInventory`.

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
