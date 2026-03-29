# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-campaign-manager

---

> **Reference**: @HeroState in `./domain-session.isl.md`

## Component: useCampaignManager

### Role: Business Logic

### ⚡ Capabilities

#### saveCampaign

- **Contract**: Saves the current state of heroes and mission progress to LocalStorage.
- **Signature**: `(heroes: List<@HeroState>, nextMissionIndex: Integer)`
- **Flow**:
  - Create `campaignData` object: `{ heroes: heroes, nextMissionIndex: nextMissionIndex, timestamp: Date.now() }`.
  - Serialize `campaignData` to JSON string.
  - Save string to LocalStorage with key `"hq_campaign_data"`.

#### loadCampaign

- **Contract**: Retrieves the saved campaign data.
- **Signature**: `() -> { heroes: List<@HeroState>, nextMissionIndex: Integer } | null`
- **Flow**:
  - Get item `"hq_campaign_data"` from LocalStorage.
  - IF item is null OR empty: RETURN null.
  - TRY:
    - Parse JSON string to `campaignData`.
  - CATCH: RETURN null.
  - RETURN `campaignData`.

#### hasSavedCampaign

- **Contract**: Checks if a saved campaign exists.
- **Signature**: `() -> Boolean`
- **Flow**:
  - Get item `"hq_campaign_data"` from LocalStorage.
  - RETURN true if item exists, false otherwise.

#### resetCampaign

- **Contract**: Deletes the saved campaign data.
- **Signature**: `()`
- **Flow**:
  - Remove item `"hq_campaign_data"` from LocalStorage.
