# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./domain-core

---

## Component: GameDomainCore

### Role: Domain

## Domain Concepts

### 📦 Content/Structure

#### `PageNavigationEnum`

define the possibile PageView for navigation.

- `MAIN_MENU`: principal menu (Default).
- `PLAY_GAME`: game area.
- `EDITOR_GAME`: editor for game.
- `SHOP`: equipment shop.
- `DUNGEON`: game board view.
- `DUNGEON_DESCRIPTION`: description of the current mission.

#### `NavigationStatus`

contain current status of navigation.

- `currentPageView`: Current page view (@PageNavigationEnum).
