# Project: Dungeon React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/dungeon-notification.test

---

> **Reference**: `./dungeon-notification.isl.md`

## Domain Concepts

- `logic test scenarios`: Deterministic acceptance scenarios used to verify the referenced Dungeon component behavior.

## Component: DungeonNotificationLogicTests

### Role: Test

### ⚡ Scenarios

<!-- LOGIC TEST SCENARIOS FOR: dungeon-notification.isl.md -->

## Scenario: Notification Visibility Toggle

- **Given**: `message` is null or an empty string.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**:
  - The component remains hidden (no DOM elements rendered).
  - No timers are initialized.

## Scenario: Auto-Close Lifecycle (Deterministic Completion)

- **Given**: `message` is set to "Enemy Spotted", `duration` is 3000ms.
- **When**: The component mounts and the duration elapses.
- **Assert (Expected Outcomes)**:
  - `onClose` callback is invoked exactly once.
  - The flow transitions to a "closed" state.
  - The internal timer is cleared/disposed to prevent memory leaks.

## Scenario: Message Update Reset (Flow Continuity)

- **Given**: A notification is currently visible with `message` "A" and a pending timer.
- **When**: `message` changes to "B" before the initial 3000ms duration expires.
- **Assert (Expected Outcomes)**:
  - The previous timer is cleared immediately.
  - A new timer is initialized for the new `message` using the current `duration`.
  - The component remains visible and displays "B".
  - No stale `onClose` triggers occur from the previous message.

## Scenario: Unmount Cleanup (Adversarial/Edge Case)

- **Given**: A notification is active with a pending `autoClose` timer.
- **When**: The component is unmounted (e.g., user navigates away or parent removes the component) before the timer expires.
- **Assert (Expected Outcomes)**:
  - The timer is successfully cleared.
  - No attempt is made to call `onClose` after unmount (preventing state update errors on unmounted components).

## Scenario: Zero or Negative Duration Handling

- **Given**: `message` is "Test", `duration` is 0 or -1000.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - The system treats the duration as an immediate trigger.
  - `onClose` is invoked immediately (or on the next tick).
  - The component does not persist in a "stuck" state.

## Scenario: Callback Integrity

- **Given**: `onClose` is provided as a function.
- **When**: The `autoClose` timer triggers.
- **Assert (Expected Outcomes)**:
  - The `onClose` function is executed with no arguments.
  - The component logic does not crash if `onClose` is undefined (defensive programming check).

## Scenario: Z-Index and Positioning Persistence

- **Given**: The component is active.
- **When**: The window is resized or the DOM structure changes.
- **Assert (Expected Outcomes)**:
  - The component maintains `fixed` positioning.
  - The component maintains `z-index: 100` to ensure it remains on top of the game board/UI.

## Scenario: Tone Derivation For Arcane And Warning Messages

- **Given**: `message` changes from an arcane targeting message to a warning/cancel message.
- **When**: The component re-renders.
- **Assert (Expected Outcomes)**:
  - The visible toast updates its tone label and accent styling based on the new message semantics.
  - Arcane messages render with a dedicated arcane label and color family.
  - Warning messages render with a cautionary label and color family.
