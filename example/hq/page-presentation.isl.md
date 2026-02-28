# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./page-presentation

---

> **Reference**: PageNavigationEnum in `./domain-core.isl.md`
> **Reference**: GameSession in `./domain-session.isl.md`
> **Reference**: Domain object are defined in `./play-game.isl.md`.
> **Reference**: Domain object are defined in `./editor-game.isl.md`.
> **Reference**: Domain object are defined in `./main-menu.isl.md`.
> **Reference**: Domain object are defined in `./armory.isl.md`.
> **Reference**: Domain object are defined in `./dungeon.isl.md`.
> **Reference**: DungeonDescription in `./dungeon-description.isl.md`

## Component: PageContent

Contenitore delle pagine, al suo interno vengono visualizzate le varie `PageView` tramite naviagazione

### Role: Presentation

### 🔍 Appearance

width: 2/3 full width
height: 100vh
background : black
overflow nascosto

### 📦 Content

- current `PageView`
- `gameSession` state (GameSession object).

### ⚡ Capabilities

#### FirstLoad

**Contract**: Inizializzazione della pagina

**Trigger**:
caricamento della pagina

**Side Effects**:
showPageView se la pagina corrente è vuota visualizza quella di default

#### changePageView

**Contract**: Cambia la `PageView` corrente
**Signature**: `(nextPageView: > **Reference**: `PageNavigationEnum`in`./domain.isl.md`) => void`
**Side Effects**:
Setta in `NavigationStatus` nextPageView la valore passato in input

#### updateSession

- **Contract**: Updates the global game session state.
- **Signature**: `(session: GameSession) -> void`
- **Flow**:
  - Update local `gameSession` with the provided session.

#### startMission

- **Contract**: Handles the start of a mission.
- **Signature**: `(missionIndex: Integer) -> void`
- **Flow**:
  - Log or handle mission start logic.

#### showPageView

**Contract**: Mostra la `PageView` corrente
**Trigger**:
Quando cambia currentPageView su `NavigationStatus`
**Side Effects**:
Carica il componente PageView visualizzare
**Flow**:

1. SWITCH currentPageView (PageNavigationEnum)
   CASE `MAIN_MENU` visualizza il componente PageView `./main-menu.isl.md` .
   CASE `PLAY_GAME` visualizza il componente PageView `./play-game.isl.md` .
   CASE `EDITOR_GAME` visualizza il componente PageView `./editor-game.isl.md`
   CASE `SHOP` visualizza il componente PageView `./armory.isl.md` .
   CASE `DUNGEON` visualizza il componente PageView `./dungeon.isl.md` .
   CASE `DUNGEON_DESCRIPTION` visualizza il componente PageView `./dungeon-description.isl.md` .
