<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-campaign-manager.isl.md -->

## Scenario: Save Campaign Data Integrity
- **Given**: A list of `HeroState` objects with valid attributes and a `nextMissionIndex` of 2.
- **When**: `saveCampaign(heroes, 2)` is executed.
- **Assert (Expected Outcomes)**:
    - LocalStorage key `"hq_campaign_data"` exists.
    - The stored JSON string, when parsed, contains the exact `heroes` list provided.
    - The stored `nextMissionIndex` matches 2.
    - A `timestamp` property exists in the stored object and is a valid numeric value.

## Scenario: Load Campaign with Non-Existent Data
- **Given**: LocalStorage is empty or the key `"hq_campaign_data"` does not exist.
- **When**: `loadCampaign()` is called.
- **Assert (Expected Outcomes)**:
    - The function returns `null`.
    - No errors are thrown during the parsing attempt.
    - The system state remains unchanged.

## Scenario: Load Campaign with Corrupted Data
- **Given**: LocalStorage contains `"hq_campaign_data"` with invalid/malformed JSON string.
- **When**: `loadCampaign()` is called.
- **Assert (Expected Outcomes)**:
    - The flow handles the parsing failure gracefully (e.g., via try-catch).
    - The function returns `null` rather than crashing the application.
    - The system does not attempt to initialize a session with partial or invalid data.

## Scenario: Deterministic Reset of Campaign
- **Given**: A valid campaign exists in LocalStorage (`"hq_campaign_data"` is populated).
- **When**: `resetCampaign()` is executed.
- **Assert (Expected Outcomes)**:
    - `hasSavedCampaign()` returns `false`.
    - `loadCampaign()` returns `null`.
    - The key `"hq_campaign_data"` is completely removed from LocalStorage (not just set to null or empty string).

## Scenario: Verify Campaign Persistence Flow (Round-trip)
- **Given**: A `GameSession` with modified `HeroState` (e.g., gold updated to 600, inventory updated).
- **When**: 
    1. `saveCampaign(heroes, 1)` is called.
    2. `loadCampaign()` is called.
- **Assert (Expected Outcomes)**:
    - The loaded `heroes` list matches the state of the heroes at the time of saving.
    - The `nextMissionIndex` is correctly retrieved as 1.
    - The system state is restored to the exact point of the last save, ensuring no data loss between sessions.

## Scenario: Adversarial Input Handling
- **Given**: An empty list of `heroes` and a negative `nextMissionIndex`.
- **When**: `saveCampaign([], -1)` is executed.
- **Assert (Expected Outcomes)**:
    - The system successfully serializes the empty list and the negative index.
    - `loadCampaign()` successfully retrieves the empty list and negative index.
    - *Note*: While the business logic might later reject a negative index, the `CampaignManager` must act as a transparent storage layer and preserve the data provided without mutation.