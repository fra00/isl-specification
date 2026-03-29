<!-- LOGIC TEST SCENARIOS FOR: dungeon-mission-summary.isl.md -->

## Scenario: Mission Summary Display Integrity
- **Given**: A `GameSession` has concluded. `heroes` list contains a mix of survivors (`currentBody > 0`) and fallen heroes (`currentBody <= 0`). `allEquipment` and `allItems` are populated with valid definitions.
- **When**: The `DungeonMissionSummary` component is rendered with `isOpen: true`.
- **Assert (Expected Outcomes)**:
    - The component displays only heroes where `currentBody > 0`.
    - Fallen heroes are excluded from the summary grid.
    - `hero.gold` is correctly retrieved and displayed for each survivor.
    - `hero.inventory` IDs are correctly mapped to `allItems` names.
    - `hero.equipment` IDs are correctly mapped to `allEquipment` names.

## Scenario: Empty Inventory and Equipment Handling
- **Given**: A hero has `currentBody > 0`, but `inventory` and `equipment` lists are empty.
- **When**: The `DungeonMissionSummary` component renders the hero's loot section.
- **Assert (Expected Outcomes)**:
    - The component renders the hero profile without throwing errors.
    - The "Loot Section" displays a placeholder (e.g., "Nessun oggetto") or remains empty without breaking the layout.
    - The gold total is displayed correctly (default 500 or current value).

## Scenario: Deterministic Finalization (handleFinalize)
- **Given**: The `DungeonMissionSummary` is open (`isOpen: true`).
- **When**: The user clicks the "Torna al Villaggio" button.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is triggered exactly once.
    - The flow ensures the UI state transitions to the "Village/Campaign" screen.
    - The system releases the `DungeonMissionSummary` overlay (ensuring `isOpen` effectively becomes false or the component unmounts).
    - No lingering blocking flags or "isLoading" states remain active after the callback execution.

## Scenario: Data Mapping Mismatch (Adversarial)
- **Given**: A hero has an item ID in `inventory` that does not exist in the provided `allItems` list.
- **When**: The component attempts to render the item name.
- **Assert (Expected Outcomes)**:
    - The component handles the missing reference gracefully (e.g., displays "Oggetto Sconosciuto" or skips the entry).
    - The rendering flow does not crash or halt the entire summary display.
    - The system maintains structural integrity despite the invalid reference.

## Scenario: Multi-Hero Gold Aggregation
- **Given**: Multiple heroes are present in the `heroes` list, each with different `gold` values.
- **When**: The summary grid is rendered.
- **Assert (Expected Outcomes)**:
    - Each hero's specific `gold` value is mapped to their respective portrait/name block.
    - No cross-contamination of gold values occurs between different hero instances.
    - The total gold displayed for each hero matches the `HeroState` persistence data.