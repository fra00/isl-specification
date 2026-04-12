# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-spell-cast-modal.test

---

> **Reference**: `./dungeon-spell-cast-modal.isl.md`

## Domain Concepts

- `spell cast dialog`: Modal overlay that lets the active magical hero inspect available spells and trigger one spell cast.
- `resolved spell card`: Presentation row built only from spell ids that successfully resolve into entries in `allSpells`.
- `short viewport overlay`: A viewport where the dialog exceeds the available height and must remain reachable through overlay scrolling.

## Component: DungeonSpellCastModalLogicTests

### Role: Test

### ⚡ Scenarios

## Scenario: Modal Visibility and Data Binding
- **Given**: `isOpen` is `true`, `hero` contains `availableSpells` with IDs `[1, 2]`, and `allSpells` contains definitions for both IDs.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The dialog container is visible in the DOM.
    - The number of rendered spell cards matches the number of resolved spell IDs.
    - The header displays `Lancia Incantesimo`, the hero class, and the remaining spell count.
    - Each card displays the correct `spell.nome`, `spell.descrizione`, and localized target badge.

## Scenario: Empty Spell Inventory
- **Given**: `isOpen` is `true` and `hero.availableSpells` is an empty list.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The dialog renders the empty-state message `Non hai piu incantesimi disponibili per questa missione.`
    - No cast buttons are rendered.
    - The close action remains reachable.

## Scenario: Successful Spell Execution
- **Given**: `isOpen` is `true` and a spell card with `spellId: 5` is rendered.
- **When**: The player clicks the `Lancia` action for `spellId: 5`.
- **Assert (Expected Outcomes)**:
    - `onCastSpell` is triggered exactly once with argument `5`.
    - The dialog does not auto-close on its own.
    - The parent retains control of the cast resolution flow.

## Scenario: Modal Dismissal Via Backdrop Or Close Control
- **Given**: `isOpen` is `true`.
- **When**: The player clicks the backdrop overlay or the close button.
- **Assert (Expected Outcomes)**:
    - `onClose` is triggered.
    - The component remains stateless with respect to closing.

## Scenario: Invalid Spell References Are Skipped
- **Given**: `hero.availableSpells` contains IDs `[999, 7]` and only `7` exists in `allSpells`.
- **When**: The component resolves spell cards.
- **Assert (Expected Outcomes)**:
    - Only the valid spell with id `7` is rendered.
    - The component does not throw when id `999` cannot be resolved.
    - The rest of the dialog remains fully usable.

## Scenario: Short Viewport Keeps Cast Actions Reachable
- **Given**: The viewport height is shorter than the natural height of the spell-cast dialog and several spell cards are available.
- **When**: The dialog renders.
- **Assert (Expected Outcomes)**:
    - The overlay can scroll vertically.
    - The header, card content, and every `Lancia` button remain reachable.
    - The close action is still available without requiring clipped internal panels.