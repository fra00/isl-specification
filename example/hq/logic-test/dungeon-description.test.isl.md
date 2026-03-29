<!-- LOGIC TEST SCENARIOS FOR: dungeon-description.isl.md -->

This test suite focuses on the **DungeonDescription** component, ensuring that the presentation layer correctly interprets the `GameSession` state and maps user intents to the required `PageNavigationEnum` transitions.

## Scenario: Navigation to Dungeon View
- **Given**: `gameSession` is initialized with a valid `MapDefinition` containing a `descrizione`.
- **When**: The user clicks the "Entra nel dungeon" button.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is invoked exactly once.
    - The argument passed to `onChangePageView` is `PageNavigationEnum.DUNGEON`.
    - No modification is made to the `gameSession` object.

## Scenario: Navigation to Shop View
- **Given**: `gameSession` is active and the user is viewing the mission description.
- **When**: The user clicks the "Armeria" button.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is invoked exactly once.
    - The argument passed to `onChangePageView` is `PageNavigationEnum.SHOP`.
    - The system remains in the current session state without resetting mission progress.

## Scenario: Navigation Back to Play Game
- **Given**: `gameSession` is active.
- **When**: The user clicks the "Indietro" button.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is invoked exactly once.
    - The argument passed to `onChangePageView` is `PageNavigationEnum.PLAY_GAME`.

## Scenario: Deterministic Rendering of Mission Description
- **Given**: `gameSession.currentMap.header.descrizione` contains a multi-paragraph string.
- **When**: The `DungeonDescription` component mounts.
- **Assert (Expected Outcomes)**:
    - The component successfully reads `gameSession.currentMap.header.descrizione`.
    - The UI container is rendered with the scrollable property enabled to accommodate the text length.
    - The text content matches the source string exactly (no truncation or encoding errors).

## Scenario: Adversarial/Edge Case - Missing Description
- **Given**: `gameSession.currentMap.header` exists, but `descrizione` is an empty string or null.
- **When**: The component attempts to render the description text.
- **Assert (Expected Outcomes)**:
    - The component handles the empty/null value gracefully without throwing a runtime exception.
    - A fallback placeholder (e.g., "Nessuna descrizione disponibile") is displayed to ensure the UI does not appear broken.
    - The "Entra nel dungeon" button remains interactive and functional.

## Scenario: Guaranteed Flow Integrity (State Persistence)
- **Given**: A `gameSession` with modified `HeroState` (e.g., gold, inventory) and `currentMissionIndex`.
- **When**: The user navigates between `DUNGEON_DESCRIPTION` and `SHOP` multiple times.
- **Assert (Expected Outcomes)**:
    - `onUpdateSession` is not triggered by navigation actions (navigation is read-only for the session).
    - The `gameSession` object passed to the component remains immutable throughout the navigation lifecycle.
    - The system never enters a dead-end state where buttons become unresponsive after repeated navigation.