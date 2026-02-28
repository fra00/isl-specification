# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./dungeon-description

---

> **Reference**: PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: GameSession in `./domain-session.isl.md`

## Component: DungeonDescription

### Role: Presentation

**Signature**:

- `gameSession`: GameSession (Current session state).
- `onChangePageView`: (nextPage: PageNavigationEnum) -> void (Callback to navigate).
- `onUpdateSession`: (session: GameSession) -> void (Callback to update session).

### 🔍 Appearance

- **Layout**: Centered content box with a parchment or dark theme.
- **Title**: "Mission Description".
- **Text**: The `description` text from th current map in `gameSession.currentMap.header.descrizione`, scrollable if long.
- **Actions**: Row of buttons.
  - "Entra nel dungeon" (Primary action).
  - "Armeria" (Secondary action).
  - "Indietro" (Tertiary action).

### 📦 Content

- **Description Text**: Displays the `description`.
- **Buttons**:
  - Enter Button.
  - Shop Button.
  - Back Button.

### ⚡ Capabilities

#### handleInteraction

- **Contract**: Delegates user actions to parent callbacks.
- **Trigger**: User clicks one of the buttons.
- **Flow**:
  - IF "Entra nel dungeon" clicked -> - onChangePageView to `PageNavigationEnum.DUNGEON`.
  - IF "Armeria" clicked -> - onChangePageView to `PageNavigationEnum.SHOP`.
  - IF "Indietro" clicked -> - onChangePageView to `PageNavigationEnum.PLAY_GAME`.
