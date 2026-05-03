<!-- LOGIC TEST SCENARIOS FOR: dungeon-mission-summary.isl.md -->

## Scenario: Mission Summary Display Integrity
- **Given**: A `GameSession` has concluded. `heroes` contains a mix of survivors (`currentBody > 0`) and fallen heroes (`currentBody <= 0`). `allEquipment` and `allItems` contain the master definitions.
- **When**: The `DungeonMissionSummary` component is rendered with `isOpen: true`.
- **Assert (Expected Outcomes)**:
    - The component displays only heroes where `currentBody > 0`.
    - Fallen heroes are excluded from the summary grid.
    - Hero names and classes are correctly resolved from the `hero.hero` reference.
    - Gold values reflect the `hero.gold` property accurately.

## Scenario: Inventory and Equipment Mapping
- **Given**: A hero has `inventory` IDs [1, 2] and `equipment` IDs [10, 11]. `allItems` contains definitions for IDs 1 and 2; `allEquipment` contains definitions for IDs 10 and 11.
- **When**: The component renders the "Loot Section" for this hero.
- **Assert (Expected Outcomes)**:
    - The component successfully performs a lookup for each ID in the provided lists.
    - The UI displays the `nome` property of the resolved `@Item` and `@Equipment` objects.
    - If an ID exists in the hero's state but is missing from the provided `allEquipment`/`allItems` lists, the component handles the undefined reference gracefully without crashing (e.g., displaying "Unknown Item").

## Scenario: Deterministic Mission Finalization
- **Given**: The `DungeonMissionSummary` is open (`isOpen: true`).
- **When**: The user clicks the "Torna al Villaggio" button.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is triggered exactly once.
    - The flow ensures that the application state transitions away from the mission summary (e.g., `isOpen` effectively becomes `false` in the parent container).
    - The system guarantees that no further interactions with the mission summary are possible after `onClose` is invoked, preventing double-triggering of mission completion logic.

## Scenario: Empty Inventory/Equipment Edge Case
- **Given**: A hero has survived the mission (`currentBody > 0`) but has an empty `inventory` list and an empty `equipment` list.
- **When**: The component renders the Loot Section for this hero.
- **Assert (Expected Outcomes)**:
    - The component renders an empty state or a "No items found" placeholder rather than throwing an error or attempting to map over an undefined/null collection.
    - The layout remains consistent with other heroes who do have items.

## Scenario: Adversarial State - Zero Gold
- **Given**: A hero has `currentBody > 0` but `gold` is 0.
- **When**: The component renders the Gold Section.
- **Assert (Expected Outcomes)**:
    - The UI displays "0" or the appropriate icon-text representation for zero gold.
    - The component does not default to the initial session value (500) if the state explicitly dictates 0.