<!-- LOGIC TEST SCENARIOS FOR: dungeon-treasure-card-modal.isl.md -->

## Scenario: Modal Visibility State Integrity
- **Given**: `isOpen` is set to `false`.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**:
    - The modal container is not rendered in the DOM.
    - No event listeners for `onClose` are active.

## Scenario: Successful Card Rendering
- **Given**: `isOpen` is `true` and `card` is defined with `immagine: "gold_100.png"` and `effetto: "100 Gold"`.
- **When**: The component is rendered.
- **Assert (Expected Outcomes)**:
    - The modal container is visible with `z-index: 60`.
    - The image source is correctly resolved to `/img/cartetesoro/gold_100.png`.
    - The `alt` attribute is set to "100 Gold".

## Scenario: Triggering Close via Overlay Click
- **Given**: `isOpen` is `true`.
- **When**: The user clicks on the semi-transparent backdrop (overlay).
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is invoked exactly once.
    - The modal state transitions to closed (or parent component updates `isOpen` to `false`).

## Scenario: Triggering Close via Image Click
- **Given**: `isOpen` is `true`.
- **When**: The user clicks directly on the card image.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback is invoked exactly once.
    - The interaction is captured by the image element and propagates to the `handleClose` logic.

## Scenario: Deterministic Handling of Null/Undefined Card
- **Given**: `isOpen` is `true`, but `card` is `null` or `undefined`.
- **When**: The component attempts to render the card image.
- **Assert (Expected Outcomes)**:
    - The component handles the missing data gracefully without throwing a runtime exception (e.g., fallback UI or empty state).
    - The `onClose` trigger remains functional to allow the user to exit the broken state.

## Scenario: Adversarial Interaction (Rapid Clicking)
- **Given**: `isOpen` is `true`.
- **When**: The user triggers multiple rapid clicks on the overlay.
- **Assert (Expected Outcomes)**:
    - The `onClose` logic is idempotent; multiple triggers do not cause state corruption or multiple modal instances.
    - The system ensures the final state is "Closed" regardless of the number of clicks.

## Scenario: Domain Integrity - Invalid Image Path
- **Given**: `card.immagine` contains special characters or is an empty string.
- **When**: The component attempts to resolve the image source.
- **Assert (Expected Outcomes)**:
    - The component does not crash.
    - The image element handles the broken source (e.g., displays a placeholder or remains hidden) without breaking the modal layout.