<!-- LOGIC TEST SCENARIOS FOR: armory.isl.md -->

This document outlines the formal verification scenarios for the **Armory** component, focusing on the integration between `ShopLogic`, `HeroSummary`, and `ShopInventory`.

## Scenario: Successful Item Purchase
- **Given**: A `GameSession` with a hero having 500 gold; an `Equipment` item with price 200 exists.
- **When**: The user selects the hero, selects the item, and clicks "Acquista".
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: true`.
    - `ShopLogic.executePurchase` is called.
    - The updated `GameSession` reflects `gold: 300` for the hero.
    - The item ID is present in the hero's `inventory` list.
    - `onUpdateSession` is triggered with the new state.

## Scenario: Purchase Blocked by Insufficient Gold
- **Given**: A `HeroState` with 50 gold; an `Equipment` item with price 100.
- **When**: The user selects the item in `ShopInventory`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and `reason: "Not enough gold"`.
    - The "Acquista" button in `ShopInventory` is rendered as disabled.
    - Clicking "Acquista" triggers no state change.

## Scenario: Purchase Blocked by Class Restriction
- **Given**: A `HeroState` for a "Wizard" (ID: 2); an `Equipment` item (e.g., Plate Armor) where `nopsg: true` and `nopsgid: 2`.
- **When**: The user selects the item in `ShopInventory`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and `reason: "Forbidden for class"`.
    - The "Acquista" button is disabled.

## Scenario: Purchase Blocked by Duplicate Ownership
- **Given**: A `HeroState` where `equipment` list already contains `item.id: 10`.
- **When**: The user selects item `10` in `ShopInventory`.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.validatePurchase` returns `allowed: false` and `reason: "Already owned"`.
    - The "Acquista" button is disabled.

## Scenario: Deterministic Initialization
- **Given**: The `Armory` component is mounted.
- **When**: `initialize` capability executes.
- **Assert (Expected Outcomes)**:
    - `ShopLogic.loadShopData` completes successfully.
    - `staticHeroes` and `shopItems` are populated in local state.
    - `selectedHeroIndex` defaults to `0`.
    - The UI renders the first hero's details in `HeroSummary`.
    - System state is not in a "loading" dead-end (guaranteed completion).

## Scenario: Navigation to Dungeon
- **Given**: The user is in the `Armory` view.
- **When**: The user clicks "Entra nel dungeon".
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.DUNGEON`.
    - The flow transitions immediately to the game board view.

## Scenario: Navigation to Dungeon Description (Exit)
- **Given**: The user is in the `Armory` view.
- **When**: The user clicks "Esci".
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.DUNGEON_DESCRIPTION`.
    - The flow transitions to the mission briefing state.

## Scenario: Hero Selection Reset
- **Given**: A hero is selected, and an item is currently selected in the `ShopInventory`.
- **When**: The user clicks on a different hero in `HeroSummary`.
- **Assert (Expected Outcomes)**:
    - `selectedHeroIndex` updates to the new index.
    - `selectedEquipmentId` is reset to `null`.
    - `ShopInventory` re-validates the `canBuy` status for the new hero against the previously viewed items.