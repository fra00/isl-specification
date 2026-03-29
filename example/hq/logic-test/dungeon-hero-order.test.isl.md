<!-- LOGIC TEST SCENARIOS FOR: dungeon-hero-order.isl.md -->

This document outlines the logical test scenarios for the `DungeonHeroOrder` component, focusing on state transitions, input mapping, and flow integrity.

## Scenario: Initialization State
- **Given**: A list of 4 `HeroState` objects is passed as `heroes` prop.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` is initialized as an empty list `[]`.
    - `availableHeroes` contains all 4 `HeroState` objects from the `heroes` prop.
    - The "Confirm Order" button is disabled (as `selectedOrder.length` < 4).

## Scenario: Selecting a Hero
- **Given**: `availableHeroes` contains a hero with `heroId: 1`.
- **When**: The user clicks on the hero with `heroId: 1`.
- **Assert (Expected Outcomes)**:
    - `heroId: 1` is added to `selectedOrder`.
    - `heroId: 1` is removed from `availableHeroes`.
    - The UI reflects the hero in the first available slot.

## Scenario: Removing a Selected Hero
- **Given**: `selectedOrder` contains `[1]`, and `availableHeroes` contains `[2, 3, 4]`.
- **When**: The user clicks on the hero with `heroId: 1` in the "Current Order" section.
- **Assert (Expected Outcomes)**:
    - `heroId: 1` is removed from `selectedOrder`.
    - `heroId: 1` is added back to `availableHeroes`.
    - The "Confirm Order" button remains disabled.

## Scenario: Reaching Full Order Capacity
- **Given**: 3 heroes have been selected, `selectedOrder` has length 3, and 1 hero remains in `availableHeroes`.
- **When**: The user clicks the final remaining hero in `availableHeroes`.
- **Assert (Expected Outcomes)**:
    - `selectedOrder` now contains all 4 hero IDs.
    - `availableHeroes` is empty.
    - The "Confirm Order" button becomes enabled.

## Scenario: Deterministic Confirmation Flow
- **Given**: `selectedOrder` contains all hero IDs, and `onConfirmOrder` is provided as a prop.
- **When**: The user clicks the "Confirm Order" button.
- **Assert (Expected Outcomes)**:
    - The `onConfirmOrder` callback is triggered exactly once.
    - The callback receives the `selectedOrder` list as an argument.
    - The system state transitions to the next phase (external to this component).

## Scenario: Adversarial - Attempting to Confirm Incomplete Order
- **Given**: `selectedOrder` contains only 3 out of 4 heroes.
- **When**: The user attempts to trigger the `confirm` action (e.g., via UI interaction or programmatic bypass).
- **Assert (Expected Outcomes)**:
    - The `confirm` logic must block execution.
    - `onConfirmOrder` is NOT called.
    - The component remains in the current state, preventing a logical dead-end or invalid game state.

## Scenario: Prop Change Handling
- **Given**: The component is mounted with a specific list of `heroes`.
- **When**: The `heroes` prop is updated (e.g., a hero is removed from the session).
- **Assert (Expected Outcomes)**:
    - The `initialize` flow is re-triggered.
    - `selectedOrder` is reset to `[]` to prevent stale references to non-existent heroes.
    - `availableHeroes` is synchronized with the new `heroes` prop.

## Scenario: Data Integrity of Hero Portraits
- **Given**: A `HeroState` object with `hero.portrait = "warrior.png"`.
- **When**: The hero is rendered in the "Current Order" section.
- **Assert (Expected Outcomes)**:
    - The image source path is correctly mapped to `img/eroi/warrior.png`.
    - The component correctly accesses the nested `hero` object within `HeroState` to retrieve the portrait string.