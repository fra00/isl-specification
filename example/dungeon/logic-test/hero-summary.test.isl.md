<!-- LOGIC TEST SCENARIOS FOR: hero-summary.isl.md -->

This document outlines the logical test scenarios for the `HeroSummary` component, focusing on domain integrity, state mapping, and flow continuity.

## Scenario: Component Initialization with Empty Session
- **Given**: `heroes` list is empty (`[]`), `staticHeroes` is populated.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
    - The component renders the fallback message: "No Heroes Available".
    - No `onSelect` callbacks are triggered.
    - No portrait or stat containers are rendered.

## Scenario: Default Selection Index Out of Bounds
- **Given**: `heroes` has 2 entries, `selectedIndex` is passed as 5 (invalid).
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The component applies the guard rule: `selectedIndex` is internally treated as 0.
    - The UI displays data for the hero at index 0.
    - The selector highlights the first hero in the list.

## Scenario: Hero Data Mapping Integrity
- **Given**: A `HeroState` exists with `heroId: 1` and `gold: 750`. `staticHeroes` contains a hero with `id: 1` and `portrait: "barbarian.png"`.
- **When**: The component renders the hero at index 0.
- **Assert (Expected Outcomes)**:
    - The portrait image source is correctly resolved to `/img/eroi/barbarian.png`.
    - The gold display string is exactly "Gold: 750".
    - The hero name is retrieved from the `staticHero` definition matching the `heroId`.

## Scenario: Equipment List Resolution
- **Given**: `HeroState.equipment` contains `[101, 102]`. `Equipment` definitions exist for IDs 101 ("Broadsword") and 102 ("Shield").
- **When**: The component renders the inventory section.
- **Assert (Expected Outcomes)**:
    - The component performs a lookup in the static equipment list for each ID.
    - The UI displays "Broadsword" and "Shield" as text labels.
    - If an ID in `equipment` does not exist in the static list, the component handles the null/undefined reference gracefully without crashing (e.g., skips or renders "Unknown Item").

## Scenario: Selection Trigger and Callback Flow
- **Given**: `heroes` has 3 entries, `selectedIndex` is 0.
- **When**: User clicks on the second hero (index 1) in the selector.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback is invoked with the argument `1`.
    - The component ensures the flow is deterministic: the UI updates to reflect the state of the hero at index 1 upon the next render cycle.
    - The `selectedIndex` state is updated to 1.

## Scenario: Deterministic State Sync (Adversarial)
- **Given**: `heroes` list is updated externally (e.g., a hero dies or is removed from the session), causing `heroes.length` to decrease from 3 to 1 while `selectedIndex` was 2.
- **When**: The component receives the new props.
- **Assert (Expected Outcomes)**:
    - The guard rule `selectedIndex >= heroes.length` triggers.
    - The component resets `selectedIndex` to 0.
    - The component avoids a "logical dead-end" (index out of bounds error) and ensures the UI remains in a valid, renderable state.

## Scenario: Equipment/Inventory Data Consistency
- **Given**: `HeroState` has `equipment` (owned) and `equipped` (currently active) lists.
- **When**: The component renders the inventory.
- **Assert (Expected Outcomes)**:
    - The component displays all items found in the `equipment` list.
    - The component logic ensures that the "Equipment List" only displays items that exist in the static ruleset, preventing the display of corrupted or non-existent item IDs.