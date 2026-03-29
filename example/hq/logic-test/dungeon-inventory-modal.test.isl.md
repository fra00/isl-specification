<!-- LOGIC TEST SCENARIOS FOR: dungeon-inventory-modal.isl.md -->

## Scenario: Inventory Data Integrity
- **Given**: A `HeroState` object where `inventory` contains a list of valid `@Item` IDs and `equipment` contains a list of valid `@Equipment` IDs.
- **When**: The `DungeonInventoryModal` is rendered with this `hero` prop.
- **Assert (Expected Outcomes)**:
    - The modal correctly maps `hero.inventory` IDs to the corresponding `@Item` definitions.
    - The modal correctly maps `hero.equipment` IDs to the corresponding `@Equipment` definitions.
    - The gold balance displays the exact value of `hero.gold`.
    - The hero portrait and class name match the `hero.hero` static definition.

## Scenario: Empty Inventory and Equipment
- **Given**: A `HeroState` object where `inventory` is an empty list `[]` and `equipment` is an empty list `[]`.
- **When**: The `DungeonInventoryModal` is rendered.
- **Assert (Expected Outcomes)**:
    - The "Oggetti" section renders an empty state or placeholder text (no runtime errors).
    - The "Equipaggiamento" section renders an empty state or placeholder text.
    - The modal remains functional and displays the correct `hero.gold` (even if 0).

## Scenario: Modal Visibility and Overlay Interaction
- **Given**: `isOpen` is set to `false`.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**:
    - The modal component returns `null` or is not present in the DOM.
    - No event listeners for the overlay are active.

## Scenario: Deterministic Close Flow
- **Given**: `isOpen` is `true` and a valid `onClose` callback function is provided.
- **When**: The user clicks the close icon or the background overlay.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is triggered exactly once.
    - The system state transitions to a closed state (ensuring the modal is removed from the UI tree).
    - No residual blocking flags (e.g., focus traps or scroll locks) remain active after the callback execution.

## Scenario: Data Mismatch Handling (Adversarial)
- **Given**: A `HeroState` where `inventory` contains an ID that does not exist in the global `@Item` registry.
- **When**: The modal attempts to render the inventory list.
- **Assert (Expected Outcomes)**:
    - The component handles the missing reference gracefully (e.g., skipping the item or displaying a "Unknown Item" placeholder).
    - The rendering flow does not crash (no unhandled null pointer exceptions).
    - The modal remains open and interactive for other valid data.

## Scenario: Hero Identity Consistency
- **Given**: A `HeroState` object with a specific `hero.hero.immagine` and `hero.hero.classe`.
- **When**: The modal is opened.
- **Assert (Expected Outcomes)**:
    - The image source is correctly constructed as `/img/personaggi/` + `hero.hero.immagine`.
    - The displayed class name matches `hero.hero.classe` exactly.
    - The UI reflects the state of the specific `hero` passed as a prop, ensuring no cross-contamination if multiple heroes exist in the `GameSession`.