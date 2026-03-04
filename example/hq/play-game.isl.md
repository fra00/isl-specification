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
> **Reference**: GameSession in `./domain-session.isl.md`
> **Reference**: HeroState in `./domain-session.isl.md`
> **Reference**: DungeonDescription in `./dungeon-description.isl.md`

## Component: PlayGame

### Role: Presentation

**Signature**:

- `gameSession`: @GameSession (Current state of the session, nullable).
- `onChangePageView`: (nextPage: @PageNavigationEnum) -> void (Callback to change page).
- `onUpdateSession`: (session: @GameSession) -> void (Callback to update the session state).

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
    - Status Indicator: (e.g., Checkmark for completed, Lock icon for locked).
- **Dungeon Description**: Visible only when a mission is selected.
  - **Props**:
    - `description`: `currentMap.header.descrizione`.
- **Loading State**: Displays while fetching `campagne.json`.

### ⚡ Capabilities

#### internal State

- `statsHeroes`
- `campaign`
- `gameSession`

#### initSession

- **Contract**: Fetches the campaign definition from the static JSON file.
- **Trigger**: On Component Mount.
- **Flow**:
  - Fetch data from `/jsonData/campagne.json`.
  - Parse response into @Campaign structure.
  - Ignore data with x or y equals to 0. The data aren't zero based.
  - Store in local state `campaign`.
  - Handle fetch errors (e.g., log to console).
  - Fetch data from `/jsonData/heroes.json`.
  - Parse response into List<@Hero> structure
  - Store in local state `statsHeroes`.

#### selectMission

- **Contract**: Loads the selected mission map, updates the session
- **Signature**: `(index: Integer)`
- **Flow**:
  - Determine `maxAccessibleIndex`:
    - IF `gameSession` is present THEN `gameSession.currentMissionIndex`.
    - ELSE `0` (Start from the first mission).
  - IF `index` <= `maxAccessibleIndex` THEN:
    - Identify the mission file from `campaign.missioni[index].file`.
    - Fetch map data from `/jsonData/map/[filename]` (extension is included in the filename).
    - Parse into @MapDefinition.
    - Create or Update @GameSession:
      - Create `heroes` list by mapping `statsHeroes` to `HeroState`:
        - `heroId`: `Hero.id`
        - `currentBody`: `Hero.corpo`
        - `currentMind`: `Hero.mente`
        - `gold`: 500
        - `inventory`: []
        - `equipment`: []
        - `hero`: current `heroes` stats
      - Set `currentMap` to the loaded map.
      - Set `currentMissionIndex` to `index`.
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
