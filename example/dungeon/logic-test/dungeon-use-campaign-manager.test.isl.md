<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-campaign-manager.isl.md -->

## Scenario: Successful Campaign Persistence
- **Given**: A `GameSession` with a list of `HeroState` objects and `currentMissionIndex` set to 2.
- **When**: `saveCampaign(heroes, 2)` is invoked.
- **Assert (Expected Outcomes)**:
    - LocalStorage key `"dg_campaign_data"` exists.
    - The parsed JSON object contains the exact `heroes` list provided.
    - The `nextMissionIndex` property in storage is 2.
    - The `timestamp` property is present and represents a valid numeric time.

## Scenario: Load Campaign with Corrupted Data
- **Given**: LocalStorage key `"dg_campaign_data"` contains an invalid, non-JSON string (e.g., "corrupted_data_123").
- **When**: `loadCampaign()` is invoked.
- **Assert (Expected Outcomes)**:
    - The `TRY/CATCH` block catches the JSON parsing error.
    - The function returns `null` instead of throwing an exception.
    - The system state remains stable (no partial data corruption).

## Scenario: Deterministic Reset of Campaign
- **Given**: A valid campaign exists in LocalStorage (`"dg_campaign_data"` is populated).
- **When**: `resetCampaign()` is invoked.
- **Assert (Expected Outcomes)**:
    - `hasSavedCampaign()` returns `false`.
    - `loadCampaign()` returns `null`.
    - The LocalStorage key `"dg_campaign_data"` is removed from the browser storage.

## Scenario: Handling Storage Quota/Access Failure
- **Given**: The browser environment has disabled LocalStorage or the storage quota is full.
- **When**: `saveCampaign(heroes, 1)` is invoked.
- **Assert (Expected Outcomes)**:
    - The `CATCH` block is triggered.
    - An error is logged to the console.
    - A UI notification "Could not save progress" is triggered (simulated via the defined flow).
    - The system does not crash and maintains the current in-memory `GameSession` state.

## Scenario: Load Campaign with Empty Storage
- **Given**: LocalStorage is empty (no `"dg_campaign_data"` key).
- **When**: `loadCampaign()` is invoked.
- **Assert (Expected Outcomes)**:
    - The function returns `null` immediately.
    - No errors are logged.
    - The flow correctly identifies that no session is available to resume.

## Scenario: Integrity of HeroState during Save/Load
- **Given**: A `HeroState` with complex nested data (e.g., `inventory` list, `equipped` list, `activeStatus` list).
- **When**: `saveCampaign` is called, followed by `loadCampaign`.
- **Assert (Expected Outcomes)**:
    - The deserialized `HeroState` matches the original `HeroState` in all properties (`currentBody`, `gold`, `inventory`, etc.).
    - List types (inventory, equipment) maintain their order and content integrity after serialization/deserialization.
    - The `hero` definition reference (if serialized) remains consistent with the domain ruleset.