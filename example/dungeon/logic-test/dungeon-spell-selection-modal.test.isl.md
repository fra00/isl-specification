# Project: Dungeon React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-spell-selection-modal.test

---

> **Reference**: `./dungeon-spell-selection-modal.isl.md`

## Domain Concepts

- `spell selection flow`: Overlay used before the first dungeon turn to assign elemental spell schools to the Wizard and, when present, automatically reserve the remaining school for the Elf.
- `short viewport overlay`: A constrained-height viewport where the modal natural height exceeds the screen and must stay reachable through vertical scrolling rather than clipping.

## Component: DungeonSpellSelectionModalLogicTests

### Role: Test

### ⚡ Scenarios

## Scenario: Initialization Prioritizes Wizard

- **Given**: `heroes` contains both a Wizard and an Elf; `allSpells` is populated with 12 spells.
- **When**: The `DungeonSpellSelectionModal` initializes.
- **Assert (Expected Outcomes)**:
  - `currentHeroPicking` is set to the Wizard instance.
  - `pickedElements` is initialized as an empty list.
  - The instruction row displays the Wizard class and the remaining count `(3 rimanenti)`.

## Scenario: Initialization Falls Back to Elf

- **Given**: `heroes` contains only an Elf and no Wizard.
- **When**: The `DungeonSpellSelectionModal` initializes.
- **Assert (Expected Outcomes)**:
  - `currentHeroPicking` is set to the Elf instance.
  - `pickedElements` is initialized as an empty list.
  - Selecting one element is sufficient to complete the flow.

## Scenario: Missing Magical Heroes Disables Selection

- **Given**: `heroes` contains neither Wizard nor Elf.
- **When**: The `DungeonSpellSelectionModal` initializes.
- **Assert (Expected Outcomes)**:
  - `currentHeroPicking` is null.
  - The UI displays `Nessun eroe magico presente`.
  - All element buttons remain disabled.
  - `onConfirmSelection` is never triggered.

## Scenario: Wizard Completion Auto-Assigns Remaining Element To Elf

- **Given**: `currentHeroPicking` is the Wizard; `pickedElements` is empty; an Elf is present in `heroes`.
- **When**: The user selects 3 distinct elements (for example `Fuoco`, `Acqua`, `Aria`).
- **Assert (Expected Outcomes)**:
  - `pickedElements` contains the 3 explicitly selected elements.
  - The remaining unpicked element is inferred automatically for the Elf.
  - `onConfirmSelection` is triggered exactly once with a map containing both the Wizard and Elf hero IDs.
  - The Wizard receives exactly 9 spell IDs and the Elf receives exactly 3 spell IDs.

## Scenario: Elf-Only Flow Completes After One Pick

- **Given**: `currentHeroPicking` is the Elf and no Wizard is present.
- **When**: The user selects one element.
- **Assert (Expected Outcomes)**:
  - `pickedElements` contains exactly that single element.
  - `onConfirmSelection` is triggered exactly once with a map containing only the Elf hero ID.
  - The mapped spell list contains the 3 spell IDs that belong to the chosen element.

## Scenario: Duplicate Selection Is Ignored

- **Given**: `pickedElements` already contains `Fuoco`.
- **When**: The user attempts to select `Fuoco` again.
- **Assert (Expected Outcomes)**:
  - `pickedElements` remains unchanged.
  - No duplicate element is added.
  - `onConfirmSelection` is not triggered early.

## Scenario: Short Viewport Keeps The Full Modal Reachable

- **Given**: The viewport height is shorter than the natural height of the spell-selection modal.
- **When**: The overlay renders.
- **Assert (Expected Outcomes)**:
  - The overlay can scroll vertically.
  - The title, instruction row, all four element cards, and their labels remain reachable.
  - No spell card is clipped behind the viewport without a scroll path.
  - Full-card click targets remain usable after scrolling.
