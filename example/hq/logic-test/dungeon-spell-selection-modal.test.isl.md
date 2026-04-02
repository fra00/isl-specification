<!-- LOGIC TEST SCENARIOS FOR: dungeon-spell-selection-modal.isl.md -->

## Scenario: Initialization with Valid Hero Party
- **Given**: `heroes` contains both a Wizard and an Elf; `allSpells` is populated with 12 spells.
- **When**: The `DungeonSpellSelectionModal` is initialized.
- **Assert (Expected Outcomes)**:
    - `currentHeroPicking` is set to the Wizard instance.
    - `pickedElements` is initialized as an empty list.
    - UI instruction displays "Turno del Mago".

## Scenario: Initialization with Missing Wizard
- **Given**: `heroes` contains only an Elf (no Wizard present).
- **When**: The `DungeonSpellSelectionModal` is initialized.
- **Assert (Expected Outcomes)**:
    - `currentHeroPicking` is null.
    - UI displays "Nessun mago disponibile".
    - `onConfirmSelection` is never triggered.

## Scenario: Wizard Selection Flow (3 Elements)
- **Given**: `currentHeroPicking` is the Wizard; `pickedElements` is empty.
- **When**: The user selects 3 distinct elements (e.g., "Fuoco", "Acqua", "Aria").
- **Assert (Expected Outcomes)**:
    - `pickedElements` contains exactly 3 elements.
    - `currentHeroPicking` transitions to the Elf instance.
    - UI instruction updates to "Turno dell'Elfo".

## Scenario: Prevent Duplicate Element Selection
- **Given**: `pickedElements` contains ["Fuoco"].
- **When**: The user attempts to select "Fuoco" again.
- **Assert (Expected Outcomes)**:
    - `pickedElements` remains length 1.
    - No state transition occurs.
    - The action is ignored.

## Scenario: Deterministic Completion (Wizard to Elf Handover)
- **Given**: Wizard has picked 3 elements; `currentHeroPicking` is the Elf.
- **When**: The user selects the 4th and final element (e.g., "Terra").
- **Assert (Expected Outcomes)**:
    - `pickedElements` contains 4 elements.
    - `wizardSpells` are correctly filtered from `allSpells` based on the first 3 elements.
    - `elfSpells` are correctly filtered from `allSpells` based on the 4th element.
    - `onConfirmSelection` is triggered with a map containing both `wizardId` and `elfId` keys.
    - The modal flow reaches a terminal state (Success).

## Scenario: Adversarial - Attempting Selection After Completion
- **Given**: `pickedElements` already contains 4 elements and `onConfirmSelection` has been triggered.
- **When**: The user attempts to trigger `selectElement` again.
- **Assert (Expected Outcomes)**:
    - The logic must be idempotent; no further state changes occur.
    - The system does not re-trigger `onConfirmSelection`.

## Scenario: Data Integrity - Spell Filtering
- **Given**: `allSpells` contains 12 spells (3 per element).
- **When**: Wizard selects "Fuoco", "Acqua", "Aria".
- **Assert (Expected Outcomes)**:
    - `wizardSpells` contains exactly 9 spell IDs (3 from each selected element).
    - `elfSpells` contains exactly 3 spell IDs (from the remaining "Terra" element).
    - No spell IDs are duplicated between the two lists.