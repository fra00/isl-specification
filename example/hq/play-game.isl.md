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

**Signature**:

- `gameSession`: @GameSession (Current state of the session, nullable).
- `onChangePageView`: (nextPage: @PageNavigationEnum) -> void (Callback to change page).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update the session state).
- `campaign`: @Campaign (Provided by MainContent).
- `staticHeroes`: List<@Hero> (Provided by MainContent).
- `staticEquipment`: List<@Equipment> (Provided by MainContent).

### 🔍 Appearance

- A centered layout displaying the Campaign Title.
- **State: Mission List**:
  - A list of missions rendered as cards or list items.
  - Visual distinction between **Completed**, **Available** (Next), and **Locked** missions.
  - A "Back to Menu" button.
- **State: Mission Details**:
  - Renders the `DungeonDescription` component.

### 📦 Content

- **Campaign Title**: Displays `nome_campagna` from the loaded JSON.
- **Mission List**: Iterates over `missioni`.
  - **Mission Item**:
    - Title: `titolo`.
    - Status Indicator: Determine based on `index` vs `maxUnlockedMissionIndex`.
- **Dungeon Description**: Visible only when a mission is selected.
  - **Props**:
    - `description`: `currentMap.header.descrizione`.
- **Loading State**: Displays IF `campaign` or `staticHeroes` is null.

### ⚡ Capabilities

#### internal State

- `maxUnlockedMissionIndex`: Integer (Highest mission index accessible).
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
    - Create or Update @GameSession:
      - Set `heroes` to `savedData.heroes`.
      - Set `currentMap` to the loaded map.
      - Set `currentMissionIndex` to `index`.
      - Set `isHeroOrderConfirmed` to false.
    - Trigger `onUpdateSession(updatedSession)`.
    - onChangePageView to @PageNavigationEnum.DUNGEON_DESCRIPTION
  - ELSE:
    - (Optional) Show visual feedback that the mission is locked.

#### goBack

- **Contract**: Returns to the main menu.
- **Trigger**: User clicks "Back" button.
- **Flow**:
  - onChangePageView to @PageNavigationEnum.MAIN_MENU.

### 🚨 Constraints

- **Progression Rule**: The user MUST NOT be able to start a mission with an index higher than `currentMissionIndex`.
- **Default State**: If no `gameSession` exists, the user is treated as a new player (only @Mission 0 is unlocked).
- **Data Source**: Must load campaign structure strictly from `campagne.json`.
