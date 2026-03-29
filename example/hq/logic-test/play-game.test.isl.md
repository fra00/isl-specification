<!-- LOGIC TEST SCENARIOS FOR: play-game.isl.md -->

This document outlines the logical test scenarios for the `PlayGame` component and its associated business logic, ensuring domain integrity and deterministic flow control.

## Scenario: Initialization of New Campaign
- **Given**: No existing `"hq_campaign_data"` in LocalStorage.
- **When**: `initSession` is triggered on component mount.
- **Assert (Expected Outcomes)**:
    - `campaign` state is populated from `/jsonData/campagne.json`.
    - `maxUnlockedMissionIndex` is set to `0`.
    - `campaignManager.saveCampaign` is called with default hero states (Gold: 0, specific starting equipment based on class).
    - `statsHeroes` is populated from `/jsonData/heroes.json`.
    - System state is ready for Mission 0 selection.

## Scenario: Loading Existing Campaign
- **Given**: `"hq_campaign_data"` exists in LocalStorage with `nextMissionIndex` = 2.
- **When**: `initSession` is triggered.
- **Assert (Expected Outcomes)**:
    - `maxUnlockedMissionIndex` is set to `2`.
    - `campaignManager.saveCampaign` is **not** overwritten.
    - Hero states are restored from the saved JSON data.
    - Missions 0, 1, and 2 are marked as accessible in the UI.

## Scenario: Mission Selection - Valid Access
- **Given**: `maxUnlockedMissionIndex` is 2.
- **When**: `selectMission(1)` is called.
- **Assert (Expected Outcomes)**:
    - Map data is fetched from the filename defined in `campaign.missioni[1].file`.
    - `onUpdateSession` is called with a `GameSession` containing the loaded map and saved hero states.
    - `onChangePageView` is triggered with `PageNavigationEnum.DUNGEON_DESCRIPTION`.
    - No error state is triggered.

## Scenario: Mission Selection - Unauthorized Access (Locked)
- **Given**: `maxUnlockedMissionIndex` is 0.
- **When**: `selectMission(1)` is called.
- **Assert (Expected Outcomes)**:
    - `onUpdateSession` is **not** called.
    - `onChangePageView` is **not** triggered.
    - System remains on the Mission List view.
    - (Optional) Visual feedback/error log indicating the mission is locked.

## Scenario: Deterministic Data Filtering (Coordinate Integrity)
- **Given**: A raw JSON map file contains cells with `x: 0` or `y: 0`.
- **When**: `initSession` or `selectMission` parses the map data.
- **Assert (Expected Outcomes)**:
    - Any `MapCell` with `x` or `y` equal to `0` is discarded or ignored.
    - The resulting `MapDefinition` grid contains only valid 1-indexed coordinates (1-26).
    - The system does not crash due to out-of-bounds array access.

## Scenario: Campaign Manager - Deterministic Completion
- **Given**: A request to `saveCampaign` is triggered during a state update.
- **When**: The browser storage is full or the write operation fails.
- **Assert (Expected Outcomes)**:
    - The flow must handle the exception (try/catch).
    - The system must not enter a "loading" deadlock.
    - The `GameSession` state remains consistent in memory even if persistence fails.
    - The UI provides feedback that the progress could not be saved.

## Scenario: Navigation Flow Continuity
- **Given**: The user is in the `DungeonDescription` view.
- **When**: The user clicks "Indietro" (Back).
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called with `PageNavigationEnum.PLAY_GAME`.
    - The `PlayGame` component re-renders the mission list.
    - The `gameSession` remains intact for potential resumption.

## Scenario: Adversarial - Invalid Equipment Mapping
- **Given**: `statsHeroes` contains a hero class not defined in the `initSession` mapping logic.
- **When**: `initSession` creates the default campaign.
- **Assert (Expected Outcomes)**:
    - The system assigns an empty `equipment` list rather than throwing an undefined reference error.
    - The `GameSession` is initialized with a safe, empty state for that hero.
    - The flow continues to completion without blocking the user.