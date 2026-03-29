<!-- LOGIC TEST SCENARIOS FOR: main-menu.isl.md -->

# MainMenu.test.isl.md

## Scenario: Navigation Trigger on Menu Click
- **Given**: The `MainMenu` component is rendered; `onChangePageView` is provided as a mock function.
- **When**: The user clicks the "Gioca" menu item.
- **Assert (Expected Outcomes)**: 
    - `onChangePageView` is called exactly once.
    - The argument passed to `onChangePageView` is `PageNavigationEnum.PLAY_GAME`.

## Scenario: Editor Navigation Trigger on Menu Click
- **Given**: The `MainMenu` component is rendered; `onChangePageView` is provided as a mock function.
- **When**: The user clicks the "Editor" menu item.
- **Assert (Expected Outcomes)**: 
    - `onChangePageView` is called exactly once.
    - The argument passed to `onChangePageView` is `PageNavigationEnum.EDITOR_GAME`.

## Scenario: MouseOver Image Update for "Gioca"
- **Given**: The `MouseOverImage` component is initialized and empty.
- **When**: The user performs a `mouseOver` event on the "Gioca" menu item.
- **Assert (Expected Outcomes)**: 
    - The `MouseOverImage` source is updated to `/img/main-menu/nuova.jpg`.
    - The image maintains its aspect ratio within the 30% height constraint.

## Scenario: MouseOver Image Update for "Editor"
- **Given**: The `MouseOverImage` component is initialized and empty.
- **When**: The user performs a `mouseOver` event on the "Editor" menu item.
- **Assert (Expected Outcomes)**: 
    - The `MouseOverImage` source is updated to `/img/main-menu/editor.jpg`.
    - The image maintains its aspect ratio within the 30% height constraint.

## Scenario: Deterministic State Reset on Interaction
- **Given**: The user has triggered a `mouseOver` on "Gioca", causing the `MouseOverImage` to display.
- **When**: The user clicks a menu item to trigger `onChangePageView`.
- **Assert (Expected Outcomes)**: 
    - The navigation flow completes successfully.
    - The component ensures that any pending image loading states are cleared or unmounted as the view transitions, preventing memory leaks or stale image references in the `MouseOverImage` container.

## Scenario: Input Mapping Integrity
- **Given**: The `MainMenu` component is active.
- **When**: An invalid or undefined menu item is clicked (simulated via manual trigger).
- **Assert (Expected Outcomes)**: 
    - The `onChangePageView` function is NOT triggered.
    - The system state remains at the `MAIN_MENU` view, ensuring no illegal transitions occur due to malformed input.