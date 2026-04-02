<!-- LOGIC TEST SCENARIOS FOR: main-menu.isl.md -->

# MainMenu.test.isl.md

## Scenario: Navigation Trigger Integrity
- **Given**: The `MainMenu` component is mounted with `onChangePageView` mocked.
- **When**: The user clicks the "Gioca" menu item.
- **Assert (Expected Outcomes)**:
    - The `onChangePageView` function is called exactly once.
    - The argument passed to `onChangePageView` is strictly `PageNavigationEnum.PLAY_GAME`.

## Scenario: Editor Navigation Trigger
- **Given**: The `MainMenu` component is mounted with `onChangePageView` mocked.
- **When**: The user clicks the "Editor" menu item.
- **Assert (Expected Outcomes)**:
    - The `onChangePageView` function is called exactly once.
    - The argument passed to `onChangePageView` is strictly `PageNavigationEnum.EDITOR_GAME`.

## Scenario: MouseOver Image Loading (Gioca)
- **Given**: The `MouseOverImage` component is initialized and empty.
- **When**: The user performs a `mouseOver` event on the "Gioca" menu item.
- **Assert (Expected Outcomes)**:
    - The `MouseOverImage` source URL is updated to `/img/main-menu/nuova.jpg`.
    - The `MouseOverImage` visibility state is set to active/visible.

## Scenario: MouseOver Image Loading (Editor)
- **Given**: The `MouseOverImage` component is initialized and empty.
- **When**: The user performs a `mouseOver` event on the "Editor" menu item.
- **Assert (Expected Outcomes)**:
    - The `MouseOverImage` source URL is updated to `/img/main-menu/editor.jpg`.
    - The `MouseOverImage` visibility state is set to active/visible.

## Scenario: Deterministic State Cleanup on Interaction
- **Given**: The user has hovered over "Gioca" (image is loaded).
- **When**: The user moves the mouse away from the menu item.
- **Assert (Expected Outcomes)**:
    - The `MouseOverImage` source is cleared or set to a null/default state.
    - The system ensures no memory leak or dangling reference to the previous image URL.
    - The flow transitions back to the idle state, ensuring the component is ready for the next `mouseOver` trigger.

## Scenario: Input Mapping Validation (Adversarial)
- **Given**: The `MainMenu` component is rendered.
- **When**: An attempt is made to trigger `clickMenuItems` with an undefined or invalid `PageNavigationEnum` value.
- **Assert (Expected Outcomes)**:
    - The component logic must reject the action.
    - `onChangePageView` must not be triggered with invalid data.
    - The system state remains unchanged (no navigation occurs).

## Scenario: Guaranteed Flow Continuity
- **Given**: The user clicks "Gioca".
- **When**: The `onChangePageView` callback is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must guarantee that the transition to the new view is initiated.
    - If the navigation process involves an asynchronous transition, the component must maintain a "processing" state that prevents double-clicks or redundant navigation triggers until the transition is complete or the component is unmounted.