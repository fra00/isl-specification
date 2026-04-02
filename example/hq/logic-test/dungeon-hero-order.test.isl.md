<!-- LOGIC TEST SCENARIOS FOR: dungeon-hero-order.isl.md -->

This document outlines the logical test scenarios for the `DungeonHeroOrder` component, focusing on state transitions, input mapping, and flow integrity.

## Scenario: Initialization State
- **Given**: A list of 4 `HeroState` objects is passed as `heroes` prop.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` is initialized as an empty list `[]`.
    - `availableHeroes` contains all 4 `HeroState` objects from the `heroes` prop.
    - The "Confirm Order" button is disabled (as `selectedOrder.length` < `heroes.length`).

## Scenario: Selecting a Hero
- **Given**: `availableHeroes` contains a Hero with `id: 1`.
- **When**: The user clicks on the Hero with `id: 1`.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` contains `[1]`.
    - `availableHeroes` no longer contains the Hero with `id: 1`.
    - The UI reflects the hero in the first slot of the "Current Order Section".

## Scenario: Removing a Hero from Order
- **Given**: `selectedOrder` is `[1, 2]` and `availableHeroes` contains `[3, 4]`.
- **When**: The user clicks on the Hero with `id: 1` in the "Current Order Section".
- **Assert (Expected Outcomes)**:
    - `selectedOrder` is updated to `[2]`.
    - `availableHeroes` now contains `[1, 3, 4]`.
    - The UI removes the hero from the "Current Order Section" and restores them to the "Available Heroes Section".

## Scenario: Reaching Maximum Order Capacity
- **Given**: `heroes` prop contains 4 heroes; `selectedOrder` currently contains 3 heroes.
- **When**: The user clicks the final available hero.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` contains all 4 hero IDs.
    - `availableHeroes` is empty.
    - The "Confirm Order" button becomes enabled.

## Scenario: Deterministic Confirmation Flow
- **Given**: `selectedOrder` contains all hero IDs; `onConfirmOrder` callback is provided.
- **When**: The user clicks "Confirm Order".
- **Assert (Expected Outcomes)**:
    - The `onConfirmOrder` callback is triggered exactly once with the correct `List<Integer>` of IDs.
    - The system state remains consistent (no duplicate IDs in `selectedOrder`).
    - The flow ensures that the action is only possible if `selectedOrder.length === heroes.length`.

## Scenario: Adversarial Input (Rapid Clicking)
- **Given**: `selectedOrder` is empty.
- **When**: The user triggers `selectHero(1)` twice in rapid succession.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` contains `[1]` (Length is 1).
    - The logic prevents duplicate entries of the same `heroId` in `selectedOrder`.
    - The component state remains valid and does not crash or enter an inconsistent state.

## Scenario: Prop Update Integrity
- **Given**: The component is mounted with a specific list of `heroes`.
- **When**: The `heroes` prop changes (e.g., a hero is removed from the session).
- **Assert (Expected Outcomes)**:
    - The `initialize` flow is re-triggered.
    - `selectedOrder` is reset to `[]` to prevent stale references to non-existent heroes.
    - `availableHeroes` is synchronized with the new `heroes` prop.
    - The component avoids "logical dead-ends" by resetting the selection state when the underlying data source changes.