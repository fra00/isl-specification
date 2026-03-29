<!-- LOGIC TEST SCENARIOS FOR: main.isl.md -->

This document outlines the critical logic test scenarios for the **Heroquest React** application, focusing on domain integrity, state transitions, and flow continuity.

## Scenario: Campaign Initialization (Default State)
- **Given**: The application is mounted, no saved campaign exists in `localStorage` (via `campaignManager`).
- **When**: `PlayGame` component initializes (`initSession`).
- **Assert (Expected Outcomes)**:
    - `maxUnlockedMissionIndex` is set to 0.
    - `defaultHeroes` are created with correct initial equipment based on class (e.g., Barbaro gets ID 13).
    - `campaignManager.saveCampaign` is called with the default hero state.
    - System transitions to a valid state where Mission 0 is accessible.

## Scenario: Progression Rule Violation
- **Given**: `maxUnlockedMissionIndex` is 0.
- **When**: User attempts to trigger `selectMission(1)`.
- **Assert (Expected Outcomes)**:
    - The condition `index <= maxAccessibleIndex` fails.
    - `onUpdateSession` is NOT triggered.
    - Navigation to `DUNGEON_DESCRIPTION` is blocked.
    - Visual feedback (if implemented) or no state change occurs.

## Scenario: Dungeon Initialization and Hero Placement
- **Given**: A valid `GameSession` exists with heroes and a selected map.
- **When**: `Dungeon` component mounts and `fetchHqData` completes.
- **Assert (Expected Outcomes)**:
    - `isStaticDataLoaded` becomes true.
    - Each `HeroState` is updated with `x, y` coordinates matching the `eroi_start` definition in the map JSON.
    - `treasureDeck` is shuffled and assigned to the session.
    - `onUpdateSession` is called with the initialized session.

## Scenario: Turn Order and Spell Selection Flow
- **Given**: `isHeroOrderConfirmed` is false, and the party contains a "Mago".
- **When**: User confirms turn order in `DungeonHeroOrder`.
- **Assert (Expected Outcomes)**:
    - `gameSession.isHeroOrderConfirmed` becomes true.
    - `isSpellSelectionRequired` becomes true.
    - `DungeonSpellSelectionModal` is rendered.
    - `confirmSpellSelection` updates `availableSpells` for the Mago and sets `isSpellSelectionRequired` to false.

## Scenario: Deterministic Combat Resolution
- **Given**: A `lastAttack` object exists in `gameSession`.
- **When**: User triggers `closeCombatResult`.
- **Assert (Expected Outcomes)**:
    - `gameSession.lastAttack` is set to `null`.
    - `onUpdateSession` is triggered to propagate the change.
    - The `CombatResultModal` is removed from the view.
    - The system remains in a valid `TurnPhase` (no dead-end).

## Scenario: Spell Targeting and Line of Sight
- **Given**: `targetingSpell` is active (e.g., "Palla di Fuoco").
- **When**: User clicks a coordinate `(x, y)` on the board.
- **Assert (Expected Outcomes)**:
    - If `hasLineOfSight` is false, `notificationMessage` is updated and the spell is NOT cast.
    - If `hasLineOfSight` is true, `hooksMagicLogic.castSpell` is executed.
    - `targetingSpell` is reset to `null`.
    - `notificationMessage` is cleared.

## Scenario: Mission Victory and State Cleanup
- **Given**: All active heroes have `isEscaped` = true.
- **When**: `monitorTurn` detects the victory condition.
- **Assert (Expected Outcomes)**:
    - `isMissionSummaryOpen` is set to true.
    - Upon `completeMission`:
        - `campaignManager.saveCampaign` is called with `currentMissionIndex + 1`.
        - Navigation transitions to `PLAY_GAME`.
        - The system resets any blocking flags (e.g., `isMissionSummaryOpen` = false).

## Scenario: Adversarial/Invalid Data Handling
- **Given**: A malformed JSON response from `/jsonData/map/[filename]`.
- **When**: `fetchHqData` attempts to parse the map.
- **Assert (Expected Outcomes)**:
    - The `CATCH` block is triggered.
    - `notificationMessage` is set to "Errore critico: ...".
    - `isStaticDataLoaded` remains false.
    - The flow halts to prevent the application from entering an undefined state (no corrupted session created).

## Scenario: Inventory/Item Usage Flow
- **Given**: `isInventoryOpen` is true, user selects an item with `targetType` = "Monster".
- **When**: `handleUseItem` is called.
- **Assert (Expected Outcomes)**:
    - `isInventoryOpen` is set to false.
    - `targetingItem` is set to the selected item.
    - `notificationMessage` informs the user to select a monster.
    - The system enters a "targeting" state, ensuring the user cannot perform other actions until the target is selected or cancelled.