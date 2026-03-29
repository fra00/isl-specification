<!-- LOGIC TEST SCENARIOS FOR: hero-summary.isl.md -->

This test suite focuses on the **HeroSummary** component, ensuring that the presentation layer correctly maps the `GameDomainSession` data to the UI and handles user interactions deterministically.

## Scenario: Hero Selection Propagation
- **Given**: A `GameSession` with 3 `HeroState` objects and their corresponding `Hero` definitions. `selectedIndex` is currently 0.
- **When**: The user clicks on the hero at index 2 in the selector.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback must be invoked exactly once with the argument `2`.
    - The component must not mutate the `selectedIndex` internally (it remains a controlled component).
    - The flow must ensure the UI re-renders to reflect the new selection state provided by the parent.

## Scenario: Data Mapping Integrity (Gold and Portrait)
- **Given**: A `HeroState` where `heroId` is 1, `gold` is 750, and the corresponding `Hero` definition has `portrait` set to "barbarian.png".
- **When**: The `HeroSummary` component renders the selected hero.
- **Assert (Expected Outcomes)**:
    - The Gold display must render the string "Gold: 750".
    - The Portrait image source must resolve to `/img/eroi/barbarian.png`.
    - If the `portrait` string is empty or null, the component must fallback to a default placeholder image (Structural Integrity).

## Scenario: Inventory and Equipment Resolution
- **Given**: A `HeroState` with `inventory` containing `[101, 102]` and `equipment` containing `[50]`. The `staticHeroes` list contains the corresponding `Equipment` definitions where ID 101 is "Healing Potion", 102 is "Tool Kit", and 50 is "Broadsword".
- **When**: The component renders the Inventory/Equipment list.
- **Assert (Expected Outcomes)**:
    - The list must display the names "Healing Potion", "Tool Kit", and "Broadsword".
    - If an ID in the inventory does not exist in the static definitions, the component must handle the missing reference gracefully (e.g., display "Unknown Item" or omit) rather than throwing a runtime error.
    - The order of items must match the order provided in the `HeroState` lists.

## Scenario: Empty State Handling
- **Given**: A `GameSession` where the `heroes` list is empty (e.g., session initialization or game over).
- **When**: The `HeroSummary` component is mounted.
- **Assert (Expected Outcomes)**:
    - The component must not crash when accessing `heroes[selectedIndex]`.
    - The selector must render an empty state or a "No Heroes Available" message.
    - The `onSelect` callback must not be triggered during the initial render.

## Scenario: Deterministic Selection Reset
- **Given**: A `HeroSummary` component displaying data for a hero that is subsequently removed from the `GameSession` (e.g., hero death or session reset).
- **When**: The `heroes` prop is updated to a shorter list, making the current `selectedIndex` out of bounds.
- **Assert (Expected Outcomes)**:
    - The component must handle the index out-of-bounds error by defaulting to index 0 or null.
    - The flow must ensure the component does not attempt to access properties of an undefined hero object.
    - The system must release any "active" selection flags to prevent stale data display.