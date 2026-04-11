# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./play-game

---

> **Reference**: PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: Campaign, Mission in `./domain-map.isl.md`
> **Reference**: MapDefinition in `./domain-map.isl.md`
> **Reference**: Hero in `./domain-ruleset.isl.md`
> **Reference**: Equipment in `./domain-ruleset.isl.md`
> **Reference**: GameSession in `./domain-session.isl.md`
> **Reference**: HeroState in `./domain-session.isl.md`
> **Reference**: DungeonDescription in `./dungeon-description.isl.md`
> **Reference**: @useCampaignManager in `./dungeon-use-campaign-manager.isl.md`

## Component: PlayGame

### Role: Presentation

## Domain Concepts

### 📦 Content/Structure

#### `MissionArchiveStatus`

- **Contract**: Classifies each mission card according to campaign progression for presentation and interaction rules.

Represents the visual progression state of a mission in the selection screen.

- `LOCKED`: Mission not yet available.
- `AVAILABLE`: Current next mission that can be started.
- `COMPLETED`: Mission already completed and replayable.

**Signature**:

- `gameSession`: @GameSession (Current state of the session, nullable).
- `onChangePageView`: (nextPage: @PageNavigationEnum) -> void (Callback to change page).
- `onUpdateSession`: `(session: @GameSession) -> void` OR `((previousSession: @GameSession) -> @GameSession) -> void` (Callback to update the session state).
- `campaign`: @Campaign (Provided by MainContent).
- `staticHeroes`: List<@Hero> (Provided by MainContent).
- `staticEquipment`: List<@Equipment> (Provided by MainContent).

### 🔍 Appearance

- A full-screen gothic mission archive aligned with the main menu visual language.
- Background: reuse the original HeroQuest artwork from the home screen, darkened with shadow gradients, mist, and warm candle-like highlights.
- Title area: compact bronze/fantasy heading with reduced vertical footprint.
- **State: Mission List**:
  - A left column containing vertically stacked mission cards inside a dark panel.
  - Cards use a stone/parchment gothic treatment with bronze borders and subtle inner glow.
  - Visual distinction between **Completed**, **Available** (Next), and **Locked** missions.
  - Status pills inside the cards must remain horizontally centered and visually stable.
  - Click on a card updates the mission detail panel; hover alone must not change the selected mission.
- **State: Mission Details**:
  - A right panel shows the currently focused mission with title, archive file, status seal, atmospheric copy, and the primary action button.
  - Includes a dark "Back to Menu" button styled coherently with the main menu.
  - When vertical space is insufficient, the page and the detail/list panels must allow scroll instead of overflowing outside the container.
  - Scrollbars must use dark bronze/gothic colors coherent with the page palette.

### 📦 Content

- **Campaign Title**: Displays `nome_campagna` from the loaded JSON.
- **Mission List**: Iterates over `missioni`.
  - **Mission Item**:
    - Title: `titolo`.
    - Archive reference: `file`.
    - Status Indicator: Determine based on `index` vs `maxUnlockedMissionIndex`.
- **Focused Mission Panel**:
  - Uses the currently focused mission index.
  - Shows `titolo` and a status label derived from progression state.
  - Shows atmospheric helper text based on whether the mission is locked, completed, or available.
- **Loading State**: Displays IF `campaign` or `staticHeroes` is null.

### ⚡ Capabilities

#### internal State

- **Contract**: Maintains the progression boundary, the currently focused mission, and access to persisted campaign progression.

- `maxUnlockedMissionIndex`: Integer (Highest mission index accessible).
- `focusedMissionIndex`: Integer (Mission currently highlighted in the archive panel).
- `campaignManager`: @useCampaignManager

#### initSession

- **Contract**: Initializes the local state using the provided campaign data.
- **Trigger**: On Component Mount.
- **Flow**:
  - **Campaign Check**:
    - Let `savedData` = `campaignManager.loadCampaign()`.
    - IF `savedData` is NOT null:
      - Set `maxUnlockedMissionIndex` to `savedData.nextMissionIndex`.
    - ELSE (Create Default Campaign):
      - Create `defaultHeroes` list by mapping `staticHeroes` to `HeroState`:
        - `heroId`: `Hero.id`.
        - `hero`: `Hero`.
        - `currentBody`: `Hero.corpo`.
        - `currentMind`: `Hero.mente`.
        - `gold`: 0.
        - `inventory`: [].
        - `availableSpells`: [].
        - `activeStatus`: [].
        - Let `initialEquipment` = List of IDs found in `staticEquipment` matching:
          - IF `Hero.classe` == "Barbaro": ID = 13 for "Spadone".
          - IF `Hero.classe` == "Nano": ID = 2 for "Ascia".
          - IF `Hero.classe` == "Elfo": ID = 12 for "Spadino".
          - IF `Hero.classe` == "Mago": ID = 4 for "Bastone".
        - `equipment`: `initialEquipment`.
        - `equipped`: `initialEquipment`.
      - Call `campaignManager.saveCampaign(defaultHeroes, 0)`.
      - Set `maxUnlockedMissionIndex` to 0.

#### syncFocusedMission

- **Contract**: Keeps the focused mission index valid when the campaign or unlocked progress changes.
- **Trigger**: When `campaign` or `maxUnlockedMissionIndex` changes.
- **Flow**:
  - Determine mission count from `campaign.missioni`.
  - IF there are no missions THEN do nothing.
  - IF current `focusedMissionIndex` is still within bounds THEN preserve it.
  - ELSE set `focusedMissionIndex` to the highest valid mission index, preferring `maxUnlockedMissionIndex`.

#### selectMission

- **Contract**: Loads the selected mission map, updates the session
- **Signature**: `(index: Integer)`
- **Flow**:
  - Let `savedData` = `campaignManager.loadCampaign()`.
  - Determine `maxAccessibleIndex`:
    - `maxUnlockedMissionIndex` (initialized in `initSession`).
  - IF `index` <= `maxAccessibleIndex` AND `savedData` is NOT null THEN:
    - Identify the mission file from `campaign.missioni[index].file`.
    - Fetch map data from `/jsonData/map/[filename]` (extension is included in the filename).
    - Parse into @MapDefinition.
    - Trigger `onUpdateSession` with a functional updater so the mission bootstrap merges onto the latest available session snapshot.
    - Inside that updater:
      - Start from `previousSession` when available, otherwise outer `gameSession`.
      - Set `campaignName` to `campaign.nome_campagna`.
      - Set `heroes` to `savedData.heroes`.
      - Set `currentMap` to the loaded map.
      - Set `currentMissionIndex` to `index`.
      - Reset `monsters`, `openedDoors`, and `spawnedLocations` to empty lists.
      - Set `currentTurn` to 1.
      - Set `isHeroOrderConfirmed` to false.
      - Set `lastAttack` to `null`.
      - Set `treasureDeck` to an empty list so mission initialization owns deck seeding.
    - onChangePageView to @PageNavigationEnum.DUNGEON_DESCRIPTION
  - ELSE:
    - (Optional) Show visual feedback that the mission is locked.

#### focusMission

- **Contract**: Updates the mission detail panel without navigating away.
- **Signature**: `(index: Integer)`
- **Flow**:
  - Set `focusedMissionIndex` to `index`.
  - This capability is triggered by click on a mission card.
  - Selecting a card MUST NOT start the mission immediately; mission start remains on the primary action button in the detail panel.

#### goBack

- **Contract**: Returns to the main menu.
- **Trigger**: User clicks "Back" button.
- **Flow**:
  - onChangePageView to @PageNavigationEnum.MAIN_MENU.

### 🚨 Constraints

- **Progression Rule**: The user MUST NOT be able to start a mission with an index higher than `currentMissionIndex`.
- **Default State**: If no `gameSession` exists, the user is treated as a new player (only @Mission 0 is unlocked).
- **Data Source**: Must load campaign structure strictly from `campagne.json`.
- **Visual Direction**: The page must remain darker and more gothic than the main menu while preserving palette continuity with bronze, ember, shadow, and black-stone tones.
- **Layout Fit Rule**: The component must adapt to 100% of the available container height; content that exceeds available space must scroll vertically.
- **Overflow Rule**: Horizontal scrolling must be prevented at page level and inside mission/detail panels.
