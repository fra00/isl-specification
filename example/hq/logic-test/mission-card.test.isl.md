<!-- LOGIC TEST SCENARIOS FOR: mission-card.isl.md -->

## Scenario: Render State Integrity
- **Given**: A `MissionCard` component is initialized with a valid `Mission` object, an `index` of 0, and `status` set to 'AVAILABLE'.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The container applies the Gold theme styling.
    - The title displays `mission.titolo`.
    - The subtitle displays "Mission 1" (index + 1).
    - The action button displays "Start".

## Scenario: Locked State Interaction Prevention
- **Given**: A `MissionCard` component is initialized with `status` = 'LOCKED'.
- **When**: The user triggers `handleInteraction` (click event).
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback is NOT invoked.
    - The component maintains its gray theme and reduced opacity.
    - No state transition occurs within the component.

## Scenario: Completed State Replay Capability
- **Given**: A `MissionCard` component is initialized with `status` = 'COMPLETED'.
- **When**: The user triggers `handleInteraction` (click event).
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback is invoked with the correct `index`.
    - The component maintains the Green theme styling.
    - The action button displays "Replay".

## Scenario: Null Mission Handling (Defensive Programming)
- **Given**: A `MissionCard` component is initialized with `mission` = `null` and `status` = 'AVAILABLE'.
- **When**: The user triggers `handleInteraction`.
- **Assert (Expected Outcomes)**:
    - The flow terminates immediately.
    - The `onSelect` callback is NOT invoked.
    - The component does not crash (graceful exit).

## Scenario: Deterministic Status Mapping
- **Given**: A list of missions is processed to generate `MissionCard` components.
- **When**: The `status` prop is toggled between 'LOCKED', 'AVAILABLE', and 'COMPLETED'.
- **Assert (Expected Outcomes)**:
    - The component must strictly map 'LOCKED' to the gray theme/lock icon.
    - The component must strictly map 'AVAILABLE' to the gold theme/play icon.
    - The component must strictly map 'COMPLETED' to the green theme/checkmark icon.
    - The system must never enter an undefined state (e.g., no theme or missing icon) for any valid enum value.

## Scenario: Index-to-Order Consistency
- **Given**: A `Mission` object where `ordine` is 5, but the component `index` is 2.
- **When**: The component renders the subtitle.
- **Assert (Expected Outcomes)**:
    - The subtitle displays "Mission 3" (based on `index + 1` logic as per specification).
    - The logic ensures that the UI reflects the sequence position rather than the raw `ordine` property if the specification mandates `index + 1`.