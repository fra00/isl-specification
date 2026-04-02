<!-- LOGIC TEST SCENARIOS FOR: dungeon-inventory-modal.isl.md -->

## Scenario: Modal Visibility and State Mapping
- **Given**: `isOpen` is set to `false`.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**: 
    - The modal container is not present in the DOM.
    - No `hero` data processing occurs.

## Scenario: Hero Data Integrity and Mapping
- **Given**: `isOpen` is `true`, and `hero` is provided with valid `@HeroState` (e.g., `gold: 500`, `inventory: [1, 2]`, `equipment: [10]`).
- **When**: The modal renders.
- **Assert (Expected Outcomes)**:
    - The hero portrait image source is correctly resolved using `/img/personaggi/` + `hero.hero.immagine`.
    - The "Monete d'Oro" display reflects the exact value of `hero.gold`.
    - The "Oggetti" list contains exactly two entries corresponding to the `@Item` definitions for IDs 1 and 2.
    - The "Equipaggiamento" list contains exactly one entry corresponding to the `@Equipment` definition for ID 10.

## Scenario: Empty Inventory and Equipment Handling
- **Given**: `isOpen` is `true`, and `hero` has an empty `inventory` list and an empty `equipment` list.
- **When**: The modal renders.
- **Assert (Expected Outcomes)**:
    - The "Oggetti" section displays an empty state message or remains blank without throwing a runtime error.
    - The "Equipaggiamento" section displays an empty state message or remains blank without throwing a runtime error.
    - The UI remains stable and does not crash due to null/undefined iteration.

## Scenario: Deterministic Close Trigger
- **Given**: `isOpen` is `true`, and a mock function is provided for `onClose`.
- **When**: The user clicks the close icon or the background overlay.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is invoked exactly once.
    - The flow ensures the modal state is reset, preventing any "zombie" modal instances.
    - The system guarantees that after `onClose` is triggered, the component lifecycle for the modal is effectively terminated (no further state updates are processed).

## Scenario: Adversarial Data (Invalid IDs)
- **Given**: `hero.inventory` contains an ID that does not exist in the `@Item` registry.
- **When**: The modal attempts to render the item list.
- **Assert (Expected Outcomes)**:
    - The component handles the missing reference gracefully (e.g., displaying "Unknown Item" or skipping the entry).
    - The flow does not crash the entire application due to a lookup failure.
    - The modal remains open and functional for other valid data points.