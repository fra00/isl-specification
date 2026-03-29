<!-- LOGIC TEST SCENARIOS FOR: armory.isl.md -->

## Scenario: Successful Item Purchase
- **Given**: A `GameSession` with a hero having 500 gold, and an `Equipment` item (e.g., "Longsword") costing 250 gold.
- **When**: The user selects the hero, selects the item, and triggers `buyItem`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: true`.
    - `ShopLogic.executePurchase` returns a new `GameSession` where `hero.gold` is 250.
    - The `hero.equipment` list contains the new item ID.
    - `onUpdateSession` is called with the updated session.

## Scenario: Purchase Blocked by Insufficient Funds
- **Given**: A `HeroState` with 50 gold, and an `Equipment` item costing 100 gold.
- **When**: The user attempts to trigger `buyItem`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and reason "Not enough gold".
    - `executePurchase` is NOT called.
    - The `GameSession` remains unchanged.

## Scenario: Purchase Blocked by Class Restriction
- **Given**: A `HeroState` for a "Wizard" (ID: 2), and an `Equipment` item (e.g., "Plate Armor") where `nopsg` is true and `nopsgid` is 2.
- **When**: The user attempts to trigger `buyItem`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and reason "Forbidden for class".
    - The purchase transaction is aborted.

## Scenario: Purchase Blocked by Duplicate Ownership
- **Given**: A `HeroState` whose `equipment` list already contains the ID of the selected `Equipment` item.
- **When**: The user attempts to trigger `buyItem`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and reason "Already owned".
    - The `GameSession` state is preserved.

## Scenario: Deterministic Navigation to Dungeon
- **Given**: The `Armory` component is active and the user clicks "Entra nel dungeon".
- **When**: `enterDungeon` is triggered.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.DUNGEON`.
    - The flow ensures no partial state transitions occur; the navigation trigger is the final action.

## Scenario: Deterministic Exit from Shop
- **Given**: The `Armory` component is active and the user clicks "Esci".
- **When**: `exitShop` is triggered.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.DUNGEON_DESCRIPTION`.
    - The component releases any local selection state (e.g., `selectedEquipmentId` reset).

## Scenario: Component Initialization and Data Integrity
- **Given**: The `Armory` component mounts.
- **When**: `initialize` capability executes.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.loadShopData` completes successfully.
    - `staticHeroes` and `shopItems` are populated in local state.
    - `selectedHeroIndex` defaults to 0.
    - If `loadShopData` fails (e.g., network error), the component must handle the failure gracefully (e.g., empty lists) rather than entering a dead-end state.

## Scenario: Hero Selection Reset Logic
- **Given**: A hero is selected, and an item is currently selected in the `ShopInventory`.
- **When**: The user switches to a different hero via `selectHero`.
- **Assert (Expected Outcomes)**:
    - `selectedHeroIndex` updates to the new index.
    - `selectedEquipmentId` is reset to `null` to prevent purchasing an item for the wrong hero.
    - `canBuy` status is recalculated based on the new hero's gold and compatibility.