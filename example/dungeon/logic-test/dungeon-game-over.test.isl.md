<!-- LOGIC TEST SCENARIOS FOR: dungeon-game-over.isl.md -->

# DungeonGameOver.test.isl.md

## Scenario: Visibility State Integrity

- **Given**: `isOpen` is set to `false`.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**:
  - The overlay container is not rendered in the DOM (or has `display: none`).
  - No interaction events are registered for the "Torna al Menu" button.

## Scenario: Successful Trigger of Exit Callback

- **Given**: `isOpen` is set to `true`, and `onExit` is a mock function.
- **When**: The user clicks the "Torna al Menu" button.
- **Assert (Expected Outcomes)**:
  - The `onExit` callback is invoked exactly once.
  - The flow does not trigger any secondary side effects (e.g., state resets) outside of the provided callback.

## Scenario: Deterministic Completion of Exit Flow

- **Given**: `isOpen` is `true`, and the `onExit` callback is defined as an asynchronous function (e.g., clearing game state/database sync).
- **When**: The user clicks the "Torna al Menu" button.
- **Assert (Expected Outcomes)**:
  - The component maintains a "processing" state (if applicable) to prevent double-clicks.
  - Regardless of whether `onExit` succeeds or fails, the component must ensure the system does not remain in a "zombie" state (e.g., the overlay must not block the UI if the exit process hangs).
  - The flow guarantees a transition out of the `DungeonGameOver` context back to the main menu state.

## Scenario: Input Mapping and Interaction Bounds

- **Given**: `isOpen` is `true`.
- **When**: The user attempts to interact with elements outside the centered flex container (the backdrop).
- **Assert (Expected Outcomes)**:
  - The backdrop correctly captures pointer events to prevent interaction with the underlying game board.
  - The "Torna al Menu" button is the only interactive element within the overlay.

## Scenario: Structural Integrity of Content

- **Given**: The component is rendered with `isOpen: true`.
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
  - The title "Tutti gli eroi sono caduti..." is present in the document.
  - The message "L'Oscurità ha trionfato. Il mondo precipita nell'oscurità." is present in the document.
  - The "Torna al Menu" button is visible and accessible to assistive technologies.
