<!-- LOGIC TEST SCENARIOS FOR: mission-card.isl.md -->

## Scenario: Locked Mission Interaction
- **Given**: A `MissionCard` component where `status` is set to 'LOCKED'.
- **When**: The user triggers `handleInteraction` (clicks the card or button).
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback must **not** be invoked.
    - The component state remains unchanged.
    - The UI remains in the 'LOCKED' visual state (gray theme, reduced opacity).

## Scenario: Available Mission Selection
- **Given**: A `MissionCard` component where `status` is set to 'AVAILABLE'.
- **When**: The user triggers `handleInteraction`.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback must be invoked exactly once with the correct `index` parameter.
    - The flow must ensure the action is processed synchronously to prevent double-triggering.

## Scenario: Completed Mission Replay
- **Given**: A `MissionCard` component where `status` is set to 'COMPLETED'.
- **When**: The user triggers `handleInteraction`.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback must be invoked with the correct `index`.
    - The component must maintain the 'COMPLETED' visual state (green theme) regardless of the interaction, as the status is determined by external campaign progress.

## Scenario: Data Integrity and Mapping
- **Given**: A `Mission` object with `titolo` = "The Trial" and `ordine` = 1.
- **When**: The component is rendered with `index` = 0.
- **Assert (Expected Outcomes)**:
    - The Title text displays "The Trial".
    - The Subtitle text displays "Mission 1" (derived from `mission.ordine` or `index + 1`).
    - The component maps the `status` string to the correct visual theme (Green/Yellow/Gray) as defined in the Appearance section.

## Scenario: Deterministic State Handling
- **Given**: A `MissionCard` component initialized with a null or undefined `mission` object.
- **When**: The component attempts to render.
- **Assert (Expected Outcomes)**:
    - The component must handle the missing data gracefully (e.g., fallback to empty strings or default placeholders).
    - The flow must not crash or enter an undefined state.
    - `handleInteraction` must be guarded against null references to ensure no runtime exceptions occur if a user clicks a malformed card.

## Scenario: Adversarial Interaction (Rapid Clicking)
- **Given**: A `MissionCard` component where `status` is 'AVAILABLE'.
- **When**: The user triggers `handleInteraction` multiple times in rapid succession.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback should be debounced or handled such that the application logic is not overwhelmed by redundant navigation requests.
    - The system must ensure that even if multiple events fire, the final state of the application remains consistent and does not result in a logical dead-end (e.g., stuck in a loading state).