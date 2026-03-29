<!-- LOGIC TEST SCENARIOS FOR: dungeon-notification.isl.md -->

# DungeonNotification Logic Test Scenarios (.test.isl.md)

## Scenario: Notification Visibility Toggle
- **Given**: `message` is null or an empty string.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**: 
    - The component remains hidden (no DOM elements rendered).
    - No timers are initialized.

## Scenario: Auto-Close Deterministic Completion
- **Given**: `message` is set to "Enemy Spotted", `duration` is 3000ms, and `onClose` is a mock function.
- **When**: The component mounts and 3000ms elapses.
- **Assert (Expected Outcomes)**:
    - `onClose` is called exactly once.
    - The flow transitions to a "closed" state.
    - No memory leaks (timeout is cleared).

## Scenario: Message Update Reset (Flow Continuity)
- **Given**: A notification is currently active with `message` "Trap Detected" and a pending timeout.
- **When**: `message` is updated to "Gold Found" before the initial 3000ms expires.
- **Assert (Expected Outcomes)**:
    - The previous timeout is cleared/cancelled.
    - A new timeout is initialized for the full `duration` of the new message.
    - The component does not trigger `onClose` prematurely.

## Scenario: Component Unmount Cleanup (Deterministic Completion)
- **Given**: A notification is active with a pending `autoClose` timer.
- **When**: The component is unmounted from the React tree.
- **Assert (Expected Outcomes)**:
    - The active timeout is cleared immediately.
    - `onClose` is NOT triggered (preventing state updates on unmounted components).
    - The system state is reset to prevent dangling references.

## Scenario: Adversarial Input Handling
- **Given**: `message` is provided, but `duration` is passed as a negative integer or zero.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
    - The component handles the invalid duration gracefully (e.g., defaults to a minimum threshold or closes immediately).
    - The system does not crash or enter an infinite loop.
    - `onClose` is triggered to ensure the flow does not hang in a "stuck" notification state.

## Scenario: Rapid Message Toggling
- **Given**: `message` is updated multiple times in rapid succession (e.g., within 100ms).
- **When**: The component processes these updates.
- **Assert (Expected Outcomes)**:
    - The component maintains a single active timer.
    - The final state reflects the last provided `message`.
    - The flow remains deterministic, ensuring the notification eventually closes based on the final message's `duration`.