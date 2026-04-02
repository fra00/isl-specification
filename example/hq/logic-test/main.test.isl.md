<!-- LOGIC TEST SCENARIOS FOR: main.isl.md -->

## Scenario: Bootstrap Deterministic Completion
- **Given**: The `MainContent` component is mounted and the application is in the initial loading state (`isAppReady` = false).
- **When**: The `bootstrap` capability executes the parallel fetch of all required JSON assets (`monsters`, `equipment`, `items`, `treasure-card`, `campagne`).
- **Assert (Expected Outcomes)**:
    - If all fetches succeed: `isAppReady` transitions to `true`, and all global state variables are populated with parsed data.
    - If any fetch fails: The system catches the error, logs the specific failed URL, and displays the critical error message, ensuring the application does not hang in a "loading" state indefinitely.
    - The flow must guarantee that `PagePresentation` is only rendered once all assets are successfully initialized.

## Scenario: Progression Rule Violation (PlayGame)
- **Given**: `GameSession` exists with `currentMissionIndex` = 0 and `maxUnlockedMissionIndex` = 0.
- **When**: The user attempts to trigger `selectMission` for `index` = 2.
- **Assert (Expected Outcomes)**:
    - The `index` (2) is compared against `maxAccessibleIndex` (0).
    - The condition `index <= maxAccessibleIndex` evaluates to `false`.
    - The system prevents the loading of the mission map and triggers the "locked" visual feedback.
    - The `GameSession` remains unchanged, and the view does not transition to `DUNGEON_DESCRIPTION`.

## Scenario: Default Campaign Initialization
- **Given**: `GameSession` is null and `campaignManager.loadCampaign()` returns `null`.
- **When**: `PlayGame.initSession` is triggered.
- **Assert (Expected Outcomes)**:
    - A default campaign is created.
    - `maxUnlockedMissionIndex` is set to 0.
    - `defaultHeroes` are generated with correct initial equipment based on class (e.g., Barbaro gets ID 13).
    - `campaignManager.saveCampaign` is called with the new hero state and index 0.
    - The local state `statsHeroes` is correctly populated from `heroes.json`.

## Scenario: Spell Targeting Logic (Dungeon)
- **Given**: A hero has selected a spell with `targetType` = "Monster" and the `isSpellCastModalOpen` is closed.
- **When**: The user clicks on a monster on the board.
- **Assert (Expected Outcomes)**:
    - `handleMonsterClick` verifies if `targetingSpell` is not null.
    - The system checks `hooksVisibilityCalc.hasLineOfSight` between the hero and the monster.
    - If LOS is valid, `hooksMagicLogic.castSpell` is executed with the `monsterId`.
    - `targetingSpell` is reset to `null` and `notificationMessage` is cleared, ensuring the targeting state is released.

## Scenario: Turn Transition and Victory Condition
- **Given**: The `GameSession` has multiple heroes, and the `currentTurn` increments beyond the number of heroes.
- **When**: `monitorTurn` is triggered by the `currentTurn` change.
- **Assert (Expected Outcomes)**:
    - The system checks if all `activeHeroes` (body > 0) are also `isEscaped` = true.
    - If the condition is met, `isMissionSummaryOpen` is set to `true`.
    - If the condition is not met, `hooksMonsterAI.runMonsterTurn()` is triggered, ensuring the game flow continues to the monster phase.
    - The system must never enter a state where neither the hero turn nor the monster turn is active.

## Scenario: Inventory/Equipment Integrity
- **Given**: A hero has an item in the `inventory` list.
- **When**: `hooksInventoryLogic.toggleEquipItem` is called.
- **Assert (Expected Outcomes)**:
    - The item ID is moved between `inventory` and `equipped` lists.
    - The `GameSession` is updated via `onUpdateSession`.
    - The system ensures that the `equipped` list does not contain duplicate items or items that violate class restrictions (if defined in `Equipment` rules).
    - The `isInventoryOpen` flag remains consistent with the user's intent to keep the modal open or closed after the toggle.