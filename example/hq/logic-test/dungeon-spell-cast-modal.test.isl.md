<!-- LOGIC TEST SCENARIOS FOR: dungeon-spell-cast-modal.isl.md -->

This document outlines the logical test scenarios for the `DungeonSpellCastModal` component. These tests focus on the presentation-to-logic mapping, ensuring that user intent is correctly translated into domain actions while maintaining state integrity.

## Scenario: Modal Initialization with Available Spells
- **Given**: `isOpen` is `true`, `hero` contains a list of `availableSpells` (e.g., `[101, 102]`), and `allSpells` contains definitions for those IDs.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The modal displays exactly two spell cards corresponding to the IDs in `hero.availableSpells`.
    - Each card correctly maps the `spell.nome`, `spell.descrizione`, and `spell.immagine` from `allSpells`.
    - The header displays the correct `hero.hero.classe`.

## Scenario: Empty Spell Inventory
- **Given**: `isOpen` is `true`, `hero.availableSpells` is an empty list `[]`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The modal displays an empty state or a "No spells available" message.
    - No "Lancia" buttons are rendered.
    - The component remains in a valid, non-crashing state.

## Scenario: Successful Spell Execution
- **Given**: `isOpen` is `true`, `hero.availableSpells` contains `[101]`.
- **When**: The user clicks the "Lancia" button on the spell card for ID `101`.
- **Assert (Expected Outcomes)**:
    - `onCastSpell(101)` is triggered exactly once.
    - The flow proceeds to the game logic layer to process the spell effect.
    - The modal does not automatically close (closing logic is handled by the parent component after successful validation).

## Scenario: Modal Dismissal via Backdrop
- **Given**: `isOpen` is `true`.
- **When**: The user clicks the backdrop (outside the dialog container).
- **Assert (Expected Outcomes)**:
    - `onClose()` is triggered.
    - The component ceases to render (or `isOpen` becomes `false`).
    - No spell casting logic is triggered.

## Scenario: Deterministic State Cleanup
- **Given**: The modal is open and the user is interacting with the spell list.
- **When**: The parent component updates the `hero` state (e.g., the hero loses a spell due to an external event) or triggers `onClose`.
- **Assert (Expected Outcomes)**:
    - The component must immediately reflect the updated `hero.availableSpells` list.
    - If `onClose` is triggered, the component must release all local focus/interaction states.
    - The system must never remain in a "loading" or "blocked" state; it must always return to the main game loop view.

## Scenario: Adversarial Spell Selection
- **Given**: `isOpen` is `true`, `hero.availableSpells` is `[101]`.
- **When**: A malicious user attempts to trigger `onCastSpell` with an ID not present in `hero.availableSpells` (e.g., `999`).
- **Assert (Expected Outcomes)**:
    - The UI must only provide "Lancia" buttons for valid IDs present in `hero.availableSpells`.
    - If the logic is bypassed, the `onCastSpell` handler must validate the ID against the `hero.availableSpells` list before proceeding to the game engine.
    - The system must reject the action and maintain the current `GameSession` state without corruption.