<!-- LOGIC TEST SCENARIOS FOR: dungeon-combat-result-modal.isl.md -->

## Scenario: Combat Result Mapping (Domain Integrity)
- **Given**: A `CombatResult` object where `attackerDice` contains 3 `SKULL` and `defenderDice` contains 2 `WHITE_SHIELD`.
- **When**: The `CombatResultModal` receives this object as a prop.
- **Assert (Expected Outcomes)**:
    - The `attackerDice` row must render exactly 3 instances of `/img/altro/teschio.jpg`.
    - The `defenderDice` row must render exactly 2 instances of `/img/altro/scudo.jpg`.
    - The `damageDealt` text must display "Damage Dealt: 1" (3 skulls - 2 shields).

## Scenario: Attacker/Defender Portrait Resolution (Presentation Logic)
- **Given**: An `attacker` of type `HeroState` and a `defender` of type `MonsterState`.
- **When**: The modal is rendered.
- **Assert (Expected Outcomes)**:
    - Left Panel source must resolve to `/img/eroi/` + `attacker.hero.portrait`.
    - Right Panel source must resolve to `/img/mostri/` + `defender.monster.immalarge`.
    - The layout must maintain the defined `z-index` hierarchy (Attacker Portrait > Center Info > Background Panels).

## Scenario: Animation Triggering (Flow Continuity)
- **Given**: `isOpen` is `false`.
- **When**: `isOpen` transitions to `true`.
- **Assert (Expected Outcomes)**:
    - `animationActive` must transition to `true`.
    - The CSS animation sequence for dice must initiate with the defined staggered delay (0.1s).
    - The modal container must be visible within the `bg-black/80` overlay.

## Scenario: Modal Dismissal (Deterministic Completion)
- **Given**: The modal is open (`isOpen: true`) and `animationActive` is `true`.
- **When**: The user clicks the "OK" button.
- **Assert (Expected Outcomes)**:
    - The `onClose` callback must be executed.
    - `animationActive` must be reset to `false` (ensuring no lingering state for the next combat event).
    - The modal must no longer be rendered in the DOM.

## Scenario: Edge Case - Zero Damage (Domain Integrity)
- **Given**: A `CombatResult` where `skulls` is 1 and `shields` is 2.
- **When**: The modal renders the result.
- **Assert (Expected Outcomes)**:
    - `damageDealt` must be 0 (as per `Max(0, skulls - shields)` logic).
    - The UI must display "Damage Dealt: 0" rather than a negative integer.

## Scenario: Adversarial/Invalid State Handling (Flow Integrity)
- **Given**: `combatResult` is `null` or undefined due to a failed combat resolution.
- **When**: The modal is forced to open.
- **Assert (Expected Outcomes)**:
    - The component must implement a fallback or guard clause to prevent a crash (e.g., rendering empty dice rows or a "No Result" message).
    - The system must ensure `onClose` is still functional to allow the user to exit the dead-end state and return to the main game loop.