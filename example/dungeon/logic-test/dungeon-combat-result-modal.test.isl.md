# Project: Dungeon React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-combat-result-modal.test

---

> **Reference**: `./dungeon-combat-result-modal.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced Dungeon component behavior.

## Component: DungeonCombatResultModalLogicTests

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-combat-result-modal.isl.md -->

## Scenario: Modal Rendering with Valid Combat Data

- **Given**: `isOpen` is true, `combatResult` contains 3 skulls and 1 shield, `attacker` is a Hero, `defender` is a Monster.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - `animationActive` is set to true.
  - Attacker portrait displays the correct Hero image path.
  - Defender portrait displays the correct Monster image path.
  - Dice container renders the correct number of dice images based on `attackerDice` and `defenderDice` lists.
  - Result text displays the localized damage summary for value `2`.
  - The modal headline reflects a successful hit state.

## Scenario: Modal Rendering with Null Combat Data (Edge Case)

- **Given**: `isOpen` is true, `combatResult` is null.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - Component renders a localized empty-state combat report.
  - `Close Button` is rendered and enabled.
  - `onClose` callback is triggered upon clicking the close button.
  - No runtime errors occur due to null property access.

## Scenario: Deterministic Cleanup on Close

- **Given**: `isOpen` is true, `animationActive` is true.
- **When**: The user clicks the "OK" button.
- **Assert (Expected Outcomes)**:
  - `onClose` function is executed.
  - `animationActive` is set to false (ensuring state reset for next opening).
  - The modal overlay is removed from the DOM (or hidden).

## Scenario: Attacker/Defender Portrait Source Logic

- **Given**: `attacker` is a Monster, `defender` is a Hero.
- **When**: The modal renders.
- **Assert (Expected Outcomes)**:
  - Attacker portrait source resolves to `/img/mostri/` + `monster.immalarge`.
  - Defender portrait source resolves to `/img/eroi/` + `hero.portrait`.
  - Layout respects the defined z-index and clip-path constraints.

## Scenario: Animation Staggering and Flow

- **Given**: `combatResult` contains a list of 3 attacker dice and 2 defender dice.
- **When**: `isOpen` transitions from false to true.
- **Assert (Expected Outcomes)**:
  - `animationActive` becomes true.
  - Attacker dice row triggers staggered slide-in animation from the left.
  - Defender dice row triggers staggered slide-in animation from the right.
  - Result text visibility is delayed until after the dice animation sequence completes.

## Scenario: Adversarial Input (Empty Dice Lists)

- **Given**: `combatResult` has `attackerDice` = [], `defenderDice` = [], `skulls` = 0, `shields` = 0, `damageDealt` = 0.
- **When**: The modal renders.
- **Assert (Expected Outcomes)**:
  - No dice images are rendered in the container.
  - Result text displays the localized zero-damage summary.
  - The modal remains stable and functional.
  - `onClose` remains reachable.
