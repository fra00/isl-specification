<!-- LOGIC TEST SCENARIOS FOR: play-game.isl.md -->

This document outlines the logical test scenarios for the `PlayGame` component and its associated `useCampaignManager` logic, focusing on state transitions, data integrity, and flow continuity.

## Scenario: Initialization of New Campaign
- **Given**: No existing `"dg_campaign_data"` in LocalStorage.
- **When**: `PlayGame` component mounts and `initSession` is triggered.
- **Assert (Expected Outcomes)**:
    - `maxUnlockedMissionIndex` is set to 0.
    - `campaignManager.saveCampaign` is called with default hero states.
    - Default equipment (Spada lunga, Ascia, Daga, or Bastone magico) is correctly assigned to heroes based on class.
    - `statsHeroes` is populated from `/jsonData/heroes.json`.

## Scenario: Loading Existing Campaign
- **Given**: `"dg_campaign_data"` exists in LocalStorage with `nextMissionIndex` = 2.
- **When**: `PlayGame` component mounts and `initSession` is triggered.
- **Assert (Expected Outcomes)**:
    - `maxUnlockedMissionIndex` is set to 2.
    - `statsHeroes` is populated from the saved state in LocalStorage.
    - The UI correctly identifies missions 0, 1, and 2 as "Available/Completed" and mission 3+ as "Locked".

## Scenario: Successful Mission Selection
- **Given**: A valid campaign exists; `maxUnlockedMissionIndex` is 1.
- **When**: User calls `selectMission(1)`.
- **Assert (Expected Outcomes)**:
    - The system fetches the map file associated with `campaign.missioni[1].file`.
    - `onUpdateSession` is called with a `GameSession` containing the loaded map and saved hero states.
    - `onChangePageView` is triggered to `PageNavigationEnum.DUNGEON_DESCRIPTION`.

## Scenario: Adversarial Mission Access (Out of Bounds)
- **Given**: `maxUnlockedMissionIndex` is 0.
- **When**: User attempts to call `selectMission(2)`.
- **Assert (Expected Outcomes)**:
    - The logic rejects the request (index 2 > 0).
    - No map fetch is initiated.
    - `onUpdateSession` is NOT called.
    - The application remains on the mission selection screen.

## Scenario: Deterministic Completion of Map Loading
- **Given**: User selects a valid mission index.
- **When**: The fetch request for `/jsonData/map/[filename]` is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must handle the promise resolution:
        - **Success**: `GameSession` is updated and navigation proceeds to `DUNGEON_DESCRIPTION`.
        - **Failure (Network/File Error)**: The system must not hang; it should log the error and maintain the current state (preventing a logical dead-end).
    - The `isLoading` state (if implemented) must be reset regardless of success or failure.

## Scenario: DungeonDescription Navigation Logic
- **Given**: `DungeonDescription` is rendered with a valid `gameSession`.
- **When**: User clicks "Entra nel dungeon".
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.DUNGEON`.
- **When**: User clicks "Armeria".
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.SHOP`.
- **When**: User clicks "Indietro".
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.PLAY_GAME`.

## Scenario: Campaign Manager Data Integrity
- **Given**: A `List<@HeroState>` is passed to `saveCampaign`.
- **When**: `saveCampaign` is executed.
- **Assert (Expected Outcomes)**:
    - The serialized JSON string in LocalStorage must contain the `heroes` list, `nextMissionIndex`, and a valid `timestamp`.
    - If serialization fails, the `CATCH` block must log the error and prevent the application from crashing.
    - `loadCampaign` must return `null` if the JSON is malformed or the key is missing, ensuring the system defaults to a safe state rather than throwing an exception.