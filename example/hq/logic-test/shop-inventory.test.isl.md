# Logic Test Scenarios

**Source**: `shop-inventory.isl.md`
**ISL Version**: 1.6.2
**Generated**: 2026-04-27

---

> Reference: `./shop-inventory.isl.md`

## Scenario: [HappyPath] Select Valid Item
- **Target**: `handleInteraction`
- **Given**: `items` contains an `Equipment` with `id: 101`. `onSelect` is defined.
- **When**: User clicks on the item with `id: 101`.
- **Assert (Expected Outcomes)**: 
    - `onSelect(101)` is triggered.
    - Component state reflects `selectedItemId: 101`.

## Scenario: [Edge] Select Non-Existent Item
- **Target**: `handleInteraction`
- **Given**: `items` is an empty list `[]`.
- **When**: User triggers `onSelect` with an arbitrary `id: 999`.
- **Assert (Expected Outcomes)**: 
    - `onSelect` is NOT triggered (or execution returns early per Flow).
    - No state change occurs regarding `selectedItemId`.

## Scenario: [Adversarial] Purchase Disabled Item
- **Target**: `handleInteraction`
- **Given**: `canBuy` is `false`. `buyReason` is "Insufficient Gold".
- **When**: User clicks "Acquista".
- **Assert (Expected Outcomes)**: 
    - `onBuy()` is NOT triggered.
    - UI maintains the disabled state for the "Acquista" button.

## Scenario: [HappyPath] Purchase Valid Item
- **Target**: `handleInteraction`
- **Given**: `canBuy` is `true`. `selectedItemId` is `101`.
- **When**: User clicks "Acquista".
- **Assert (Expected Outcomes)**: 
    - `onBuy()` is triggered.

## Scenario: [Constraint] Interaction Null Safety
- **Target**: `handleInteraction`
- **Given**: `items` is provided, but `onSelect` is passed as `undefined` (if allowed by environment) or a no-op.
- **When**: User clicks an item in the list.
- **Assert (Expected Outcomes)**: 
    - The flow handles the missing callback without throwing a runtime exception.
    - The system remains in a valid state.

## Scenario: [Constraint] Navigation Triggers
- **Target**: `handleInteraction`
- **Given**: Component is rendered with valid callbacks.
- **When**: User clicks "Entra nel dungeon" then "Indietro".
- **Assert (Expected Outcomes)**: 
    - `onEnterDungeon()` is triggered on the first click.
    - `onExit()` is triggered on the second click.
    - Logic flow remains deterministic and independent for each action.

## Scenario: [Completion] Deterministic Flow Sequence
- **Target**: `ShopInventorySection`
- **Given**: A sequence of interactions: Select Item -> Buy Item -> Exit Shop.
- **When**: User completes the sequence.
- **Assert (Expected Outcomes)**: 
    - `onSelect` is called.
    - `onBuy` is called.
    - `onExit` is called.
    - The component does not enter a "dead-end" state where buttons become unresponsive after a successful purchase.

## Scenario: [Constraint] UI/Logic Boundary Violation
- **Target**: `ShopInventorySection`
- **Given**: `canBuy` is `false`.
- **When**: Component attempts to internally mutate `items` or calculate `canBuy` logic.
- **Assert (Expected Outcomes)**: 
    - The component MUST NOT modify the `items` list or calculate purchase eligibility internally.
    - The component MUST rely solely on the provided `canBuy` prop and `buyReason` string.