<!-- LOGIC TEST SCENARIOS FOR: dungeon-spell-cast-modal.isl.md -->

This document outlines the logical test scenarios for the `DungeonSpellCastModal` component, focusing on presentation mapping, input validation, and flow integrity.

## Scenario: Modal Visibility and Data Binding
- **Given**: `isOpen` is `true`, `hero` is initialized with `availableSpells` containing IDs `[1, 2]`, and `allSpells` contains definitions for IDs `1` and `2`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The modal container is visible in the DOM.
    - The number of rendered spell cards matches the length of `hero.availableSpells`.
    - Each card displays the correct `spell.nome` and `spell.descrizione` by mapping `hero.availableSpells` against `allSpells`.
    - The hero's class name is correctly extracted from `hero.hero.classe` and displayed in the header.

## Scenario: Empty Spell Inventory
- **Given**: `isOpen` is `true`, `hero.availableSpells` is an empty list `[]`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The modal displays an empty state or a "No spells available" message.
    - No "Lancia" buttons are rendered.
    - The component remains in a valid, non-crashing state.

## Scenario: Successful Spell Execution
- **Given**: `isOpen` is `true`, a spell card with `spellId: 5` is rendered.
- **When**: The user clicks the "Lancia" button for `spellId: 5`.
- **Assert (Expected Outcomes)**:
    - The `onCastSpell` callback is triggered exactly once with the argument `5`.
    - The modal does not automatically close (closing logic is delegated to the parent component via `onCastSpell` or `onClose`).

## Scenario: Modal Dismissal via Backdrop
- **Given**: `isOpen` is `true`.
- **When**: The user clicks the backdrop overlay.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is triggered.
    - The component state reflects the intent to close (the parent should toggle `isOpen` to `false`).

## Scenario: Deterministic Completion and Cleanup
- **Given**: The modal is open and the user initiates a spell cast.
- **When**: `onCastSpell` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow ensures that regardless of whether the spell cast succeeds or fails in the business logic layer, the `DungeonSpellCastModal` must be prepared to transition to a closed state.
    - The component must not maintain internal "processing" flags that block subsequent openings if the parent fails to re-render the modal correctly.
    - The component must guarantee that `onClose` is reachable via user interaction even if a previous `onCastSpell` action is pending.

## Scenario: Adversarial Input (Invalid Spell IDs)
- **Given**: `hero.availableSpells` contains an ID `999` which does not exist in `allSpells`.
- **When**: The component attempts to render the card for `999`.
- **Assert (Expected Outcomes)**:
    - The component must handle the missing reference gracefully (e.g., skip rendering the card or render a placeholder).
    - The component must not throw a runtime exception that crashes the UI thread.
    - The system maintains structural integrity by not attempting to access properties of an undefined spell object.