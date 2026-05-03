<!-- LOGIC TEST SCENARIOS FOR: dungeon-treasure-card-modal.isl.md -->

## Scenario: Modal Rendering with Valid TreasureCard
- **Given**: `isOpen` is `true`, `card` is a valid `@TreasureCard` object (e.g., `id: 1, azione: "aggiungi_oro", immagine: "gold.png"`).
- **When**: The component mounts.
- **Assert (Expected Outcomes)**:
    - The overlay container is rendered with `z-index: 60` and `bg-black/80`.
    - The image source is correctly resolved to `/img/cartetesoro/gold.png`.
    - The `alt` attribute is populated with the `card.effetto` string.

## Scenario: Guard Clause for Null TreasureCard
- **Given**: `isOpen` is `true`, `card` is `null`.
- **When**: The component attempts to render.
- **Assert (Expected Outcomes)**:
    - The component returns `null` or renders the 'EmptyState' component.
    - No runtime errors occur due to property access on `null` (e.g., `card.immagine`).

## Scenario: Image Loading Failure (Graceful Degradation)
- **Given**: `isOpen` is `true`, `card` is valid, but the image file at `/img/cartetesoro/invalid.png` does not exist.
- **When**: The `img` element triggers an `onError` event.
- **Assert (Expected Outcomes)**:
    - The `src` attribute of the image element is updated to `/img/placeholder.png`.
    - The modal remains open and functional.

## Scenario: Deterministic Close Flow
- **Given**: `isOpen` is `true`, `modalState` is `'open'`, and `onClose` is a provided callback function.
- **When**: The user clicks the overlay or the card image.
- **Assert (Expected Outcomes)**:
    - `modalState` transitions to `'closing'`.
    - The `onClose` callback is invoked exactly once.
    - The component ensures the transition to the final state is completed, preventing multiple concurrent close triggers.

## Scenario: Adversarial Interaction during Closing
- **Given**: `isOpen` is `true`, `modalState` is `'closing'`.
- **When**: The user attempts to click the overlay again while the closing transition is in progress.
- **Assert (Expected Outcomes)**:
    - The `handleClose` logic ignores the secondary trigger because `modalState` is already `'closing'`.
    - The `onClose` callback is not invoked a second time, ensuring deterministic flow completion.

## Scenario: Structural Integrity of TreasureCard Data
- **Given**: A `@TreasureCard` object is passed with an unexpected `azione` value (e.g., an empty string or undefined).
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The component does not crash.
    - The `alt` text defaults to the `effetto` property, maintaining accessibility even if the `azione` logic is unknown to the presentation layer.