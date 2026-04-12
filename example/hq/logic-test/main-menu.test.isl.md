# Project: Heroquest React Logic Tests

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-04-12
**Implementation**: ./logic-test/main-menu.test

---

> **Reference**: `./main-menu.isl.md`

## Domain Concepts

- `menu action plaque`: compact clickable entry for one destination on the home screen.
- `active backdrop`: background image and small active-state indicators driven by hover/focus.
- `ultra-compact viewport mode`: very-low-height branch where secondary copy is removed and the two main plaques share one row.

## Component: MainMenuLogicTests

### Role: Test

### ⚡ Scenarios

## Scenario: Play Navigation Trigger
- **Given**: `MainMenu` is mounted with `onChangePageView` mocked.
- **When**: The user activates the `GIOCA` action plaque.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called exactly once.
    - The argument is `PageNavigationEnum.PLAY_GAME`.

## Scenario: Editor Navigation Trigger
- **Given**: `MainMenu` is mounted with `onChangePageView` mocked.
- **When**: The user activates the `EDITOR` action plaque.
- **Assert (Expected Outcomes)**:
    - `onChangePageView` is called exactly once.
    - The argument is `PageNavigationEnum.EDITOR_GAME`.

## Scenario: Hover Activates Play Backdrop
- **Given**: The menu is in its default state.
- **When**: The user hovers or focuses the `GIOCA` action plaque.
- **Assert (Expected Outcomes)**:
    - The active backdrop resolves to `/img/main-menu/nuova.jpg`.
    - The active state pill shows the `Campagna` path.

## Scenario: Hover Activates Editor Backdrop
- **Given**: The menu is in its default state.
- **When**: The user hovers or focuses the `EDITOR` action plaque.
- **Assert (Expected Outcomes)**:
    - The active backdrop resolves to `/img/main-menu/editor.jpg`.
    - The active state pill shows the `Forgia` path.

## Scenario: Active State Falls Back To Default After Leave
- **Given**: The user previously hovered the `EDITOR` action plaque.
- **When**: The user leaves or blurs the plaque.
- **Assert (Expected Outcomes)**:
    - The hovered state is cleared.
    - The active backdrop falls back to the primary `GIOCA` entry.
    - The active state pill falls back to the primary `Campagna` hint.

## Scenario: Invalid Navigation Request Is Ignored
- **Given**: `MainMenu` is rendered.
- **When**: `clickMenuItems` receives an invalid or undefined `PageNavigationEnum` value.
- **Assert (Expected Outcomes)**:
    - The action is ignored.
    - `onChangePageView` is not called with invalid data.
    - The component remains on the current screen.

## Scenario: Processing State Prevents Duplicate Navigation
- **Given**: A valid menu action is already being processed.
- **When**: The user rapidly activates the same plaque again.
- **Assert (Expected Outcomes)**:
    - The second activation is ignored while `isProcessing` is true.
    - The component avoids duplicate navigation requests.

## Scenario: Compact Viewport Keeps Home Fully Visible
- **Given**: `MainMenu` is rendered inside a short viewport height that triggers compact mode.
- **When**: The component resolves its home layout.
- **Assert (Expected Outcomes)**:
    - `HeroQuest`, `GIOCA`, and `EDITOR` are visible inside the initial viewport.
    - The home screen remains contained inside the fixed runtime stage.
    - No document-level scrollbar is needed to reach the primary destinations.

## Scenario: Ultra-Compact Viewport Removes Non-Essential Copy
- **Given**: `MainMenu` is rendered inside a very low viewport height that triggers ultra-compact mode.
- **When**: The component resolves its home layout.
- **Assert (Expected Outcomes)**:
    - The short line under `HeroQuest` is not rendered.
    - The per-plaque secondary hint text is not rendered.
    - The `Entra` chip is not rendered inside the menu plaques.
    - The active-state pill remains visible.

## Scenario: Ultra-Compact Viewport Uses One Two-Column Action Row
- **Given**: `MainMenu` is rendered inside a very low viewport height that triggers ultra-compact mode.
- **When**: The action area is laid out.
- **Assert (Expected Outcomes)**:
    - `GIOCA` and `EDITOR` are placed in a two-column row.
    - Both plaques remain fully visible in the first frame.
    - The layout does not fall back to a stacked vertical column that pushes one plaque below the viewport.