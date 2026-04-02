<!-- LOGIC TEST SCENARIOS FOR: dungeon-description.isl.md -->

This test suite focuses on the **DungeonDescription** component, ensuring that the presentation layer correctly interprets the `GameSession` state and maps user intents to the required `PageNavigationEnum` transitions.

## Scenario: Navigation to Dungeon View
- **Given**: A `GameSession` is active with a valid `MapDefinition` containing a mission description.
- **When**: The user clicks the "Entra nel dungeon" button.
- **Assert (Expected Outcomes)**: 
    - `onChangePageView` is triggered with `PageNavigationEnum.DUNGEON`.
    - The system state remains consistent with the current `gameSession`.

## Scenario: Navigation to Shop View
- **Given**: A `GameSession` is active.
- **When**: The user clicks the "Armeria" button.
- **Assert (Expected Outcomes)**: 
    - `onChangePageView` is triggered with `PageNavigationEnum.SHOP`.
    - No modifications are made to the `gameSession` object.

## Scenario: Navigation Back to Play Game
- **Given**: A `GameSession` is active.
- **When**: The user clicks the "Indietro" button.
- **Assert (Expected Outcomes)**: 
    - `onChangePageView` is triggered with `PageNavigationEnum.PLAY_GAME`.

## Scenario: Rendering Mission Description Text
- **Given**: `gameSession.currentMap.header.descrizione` contains a non-empty string (e.g., "The dark corridors await...").
- **When**: The `DungeonDescription` component mounts.
- **Assert (Expected Outcomes)**: 
    - The UI displays the exact text found in `gameSession.currentMap.header.descrizione`.
    - The text container is scrollable if the content exceeds the defined viewport height.

## Scenario: Handling Null or Empty Description
- **Given**: `gameSession.currentMap.header.descrizione` is an empty string or null.
- **When**: The `DungeonDescription` component mounts.
- **Assert (Expected Outcomes)**: 
    - The component renders a fallback message (e.g., "No description available") or an empty state without crashing.
    - The "Entra nel dungeon" button remains functional and accessible.

## Scenario: Deterministic Navigation Flow (Adversarial/Rapid Click)
- **Given**: The user is on the `DungeonDescription` view.
- **When**: The user triggers multiple rapid clicks on the "Entra nel dungeon" button.
- **Assert (Expected Outcomes)**: 
    - The `onChangePageView` callback is invoked.
    - The system ensures that the navigation transition is idempotent; subsequent clicks do not trigger redundant state changes or race conditions in the `GameDomainCore`.
    - The system releases any internal "isProcessing" flags if the navigation logic involves an asynchronous transition.

## Scenario: Integrity of Session Data during Navigation
- **Given**: A `GameSession` with modified `HeroState` (e.g., gold, inventory).
- **When**: The user navigates to any page via the `DungeonDescription` buttons.
- **Assert (Expected Outcomes)**: 
    - The `onUpdateSession` callback is not triggered unless a session modification is explicitly required by the transition.
    - The `gameSession` object passed to the component remains immutable during the render cycle.