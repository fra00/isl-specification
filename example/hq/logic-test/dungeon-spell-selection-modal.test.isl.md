<!-- LOGIC TEST SCENARIOS FOR: dungeon-spell-selection-modal.isl.md -->

## Scenario: Initialization Flow
- **Given**: A `GameSession` containing a Wizard and an Elf hero.
- **When**: The `DungeonSpellSelectionModal` is mounted.
- **Assert (Expected Outcomes)**:
    - `currentHeroPicking` is correctly set to the Wizard instance.
    - `pickedElements` is initialized as an empty list.
    - UI instruction displays "Turno del Mago".

## Scenario: Wizard Element Selection (Partial)
- **Given**: `currentHeroPicking` is the Wizard; `pickedElements` is empty.
- **When**: The user selects "Fuoco".
- **Assert (Expected Outcomes)**:
    - "Fuoco" is added to `pickedElements`.
    - `pickedElements.length` is 1.
    - `currentHeroPicking` remains the Wizard.

## Scenario: Wizard Completes Selection (Transition to Elf)
- **Given**: `currentHeroPicking` is the Wizard; `pickedElements` contains ["Fuoco", "Acqua"].
- **When**: The user selects "Aria".
- **Assert (Expected Outcomes)**:
    - "Aria" is added to `pickedElements`.
    - `pickedElements.length` is 3.
    - `currentHeroPicking` transitions to the Elf.
    - UI instruction updates to "Turno dell'Elfo".

## Scenario: Elf Completes Selection (Deterministic Completion)
- **Given**: `currentHeroPicking` is the Elf; `pickedElements` contains ["Fuoco", "Acqua", "Aria"].
- **When**: The user selects "Terra".
- **Assert (Expected Outcomes)**:
    - "Terra" is added to `pickedElements`.
    - `pickedElements.length` is 4.
    - `wizardSpells` contains all spells matching "Fuoco", "Acqua", and "Aria".
    - `elfSpells` contains all spells matching "Terra".
    - `onConfirmSelection` is triggered with the correct map: `{ wizardId: [...], elfId: [...] }`.
    - The modal flow terminates, ensuring no further interactions are possible (Deterministic Completion).

## Scenario: Adversarial - Duplicate Element Selection
- **Given**: `pickedElements` contains ["Fuoco"].
- **When**: The user attempts to select "Fuoco" again.
- **Assert (Expected Outcomes)**:
    - `pickedElements` remains length 1.
    - No state transition occurs.
    - The system ignores the duplicate input, maintaining structural integrity.

## Scenario: Adversarial - Out of Bounds Selection
- **Given**: `pickedElements` contains ["Fuoco", "Acqua", "Aria", "Terra"].
- **When**: The user attempts to select a 5th element.
- **Assert (Expected Outcomes)**:
    - The system rejects the input.
    - The `onConfirmSelection` trigger is not called a second time.
    - The flow remains in the final state, preventing logical dead-ends or state corruption.

## Scenario: Missing Hero Dependency
- **Given**: `heroes` list contains only a Barbarian (no Wizard or Elf).
- **When**: The component initializes.
- **Assert (Expected Outcomes)**:
    - The system handles the missing dependency gracefully (e.g., `currentHeroPicking` is null).
    - The flow does not crash.
    - The UI remains in a safe state, preventing invalid `onConfirmSelection` calls.