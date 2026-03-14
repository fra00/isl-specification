# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./ui-components

> **Reference**: Concepts/Capabilities in `./domain.isl.md`

## Component: ProgressBar
### Role: Presentation
**Description**: Displays a visual progress bar with a percentage value.
**Signature**:
- `value`: `number` (0-100) - The current progress percentage.
- `color`: `string` (optional) - A CSS-compatible color string for the bar. If not provided, the color is determined by the `value`.

### 📐 Appearance
- A horizontal bar element.
- The filled portion of the bar visually represents the `value` percentage.
- The color of the filled portion is determined by the `color` prop if provided, otherwise:
    - Green for `value` >= 90.
    - Yellow for `value` >= 50 and < 90.
    - Orange for `value` >= 20 and < 50.
    - Red for `value` < 20.
- A text label displaying the `value` followed by "%" is centered within or next to the bar.

### 📦 Content
- A container element for the bar.
- An inner element representing the filled progress.
- A text element displaying the percentage.

### 🚨 Global Constraints
- The `value` MUST be a number between 0 and 100 (inclusive). Values outside this range SHOULD be clamped.

### ✅ Acceptance Criteria
- The progress bar visually represents the `value` correctly.
- The color changes according to the `value` if no `color` prop is provided.
- The percentage text is displayed correctly.

## Component: ProgressSlider
### Role: Presentation
**Description**: An interactive slider component for manually setting a progress percentage.
**Signature**:
- `value`: `number` (0-100) - The current progress percentage.
- `onChange`: `(newValue: number) => void` - Callback function triggered when the slider value changes.
- `isDisabled`: `boolean` - If true, the slider cannot be interacted with.

### 📐 Appearance
- A horizontal slider input element.
- A numerical display showing the current `value` next to the slider.
- When `isDisabled` is true, the slider appears visually muted and non-interactive.

### 📦 Content
- A slider input element.
- A text element displaying the current `value`.

### ⚡ Capabilities
#### UpdateProgress
**Contract**: Allows the user to change the progress value via the slider.
**Trigger**: User interaction with the slider (e.g., dragging, clicking).
**Flow**:
1. When the user interacts with the slider and changes its position:
2. The `onChange` callback is triggered with the `newValue` from the slider.
**Side Effects**:
- The visual representation of the slider updates to reflect the `newValue`.
- The numerical display updates to show the `newValue`.
**🚨 Constraint**:
- The slider MUST be non-interactive if `isDisabled` is true.
- The `newValue` passed to `onChange` MUST be a number between 0 and 100 (inclusive).

### ✅ Acceptance Criteria
- The slider's position accurately reflects the `value` prop.
- Moving the slider triggers the `onChange` callback with the correct new value.
- The slider is visibly disabled and unresponsive to input when `isDisabled` is true.

## Component: StatusBadge
### Role: Presentation
**Description**: Displays a colored badge representing the status of an entity.
**Signature**:
- `status`: `@ProjectStatus` | `@EpicStatus` | `@StoryStatus` - The status to display.

### 📐 Appearance
- A small, rectangular badge with rounded corners.
- The background color of the badge is determined by the `status`:
    - `PLANNING`, `NOT_STARTED`: Gray
    - `ACTIVE`, `IN_PROGRESS`: Blue
    - `COMPLETED`: Green
    - `PAUSED`, `BLOCKED`: Red
- The text color is contrasting (e.g., white for dark backgrounds, black for light backgrounds).

### 📦 Content
- A text element displaying the string representation of the `status` enum value (e.g., "Planning", "In Progress").

### ✅ Acceptance Criteria
- The badge displays the correct text for the given `status`.
- The badge's background color matches the specified color for each status.

## Component: PriorityBadge
### Role: Presentation
**Description**: Displays a colored badge representing the priority level of an entity.
**Signature**:
- `priority`: `@Priority` - The priority level to display.

### 📐 Appearance
- A small, rectangular badge with rounded corners.
- The background color of the badge is determined by the `priority`:
    - `LOW`: Green
    - `MEDIUM`: Blue
    - `HIGH`: Orange
    - `CRITICAL`: Red
- The text color is contrasting.

### 📦 Content
- A text element displaying the string representation of the `priority` enum value (e.g., "Low", "Critical").

### ✅ Acceptance Criteria
- The badge displays the correct text for the given `priority`.
- The badge's background color matches the specified color for each priority level.

## Component: RiskBadge
### Role: Presentation
**Description**: Displays a colored badge representing the risk level of an entity.
**Signature**:
- `risk`: `@RiskLevel` - The risk level to display.

### 📐 Appearance
- A small, rectangular badge with rounded corners.
- The background color of the badge is determined by the `risk`:
    - `LOW`: Green
    - `MEDIUM`: Orange
    - `HIGH`: Red
- The text color is contrasting.

### 📦 Content
- A text element displaying the string representation of the `risk` enum value (e.g., "Low", "High").

### ✅ Acceptance Criteria
- The badge displays the correct text for the given `risk`.
- The badge's background color matches the specified color for each risk level.

## Component: ConfirmationDialog
### Role: Presentation
**Description**: A modal dialog for requesting user confirmation before proceeding with a destructive or important action.
**Signature**:
- `message`: `string` - The message to display to the user.
- `onConfirm`: `() => void` - Callback function triggered when the user confirms the action.
- `onCancel`: `() => void` (optional) - Callback function triggered when the user cancels the action.

### 📐 Appearance
- A modal overlay that covers the rest of the application, preventing interaction.
- A central dialog box containing the `message`, a "Confirm" button, and a "Cancel" button.
- The "Confirm" button is typically styled to indicate a primary or destructive action (e.g., red).
- The "Cancel" button is typically styled as a secondary action.

### 📦 Content
- A text element displaying the `message`.
- A button labeled "Confirm".
- A button labeled "Cancel".

### ⚡ Capabilities
#### ShowDialog
**Contract**: Makes the confirmation dialog visible to the user.
**Trigger**: An external request to display the dialog.
**Flow**:
1. The dialog becomes visible, displaying the provided `message`.
2. The application's main content becomes inaccessible until the dialog is closed.
**Side Effects**:
- The dialog is rendered on screen.

#### HandleConfirm
**Contract**: Processes the user's decision to confirm the action.
**Trigger**: User clicks the "Confirm" button.
**Flow**:
1. When the "Confirm" button is clicked:
2. The `onConfirm` callback is triggered.
3. The dialog is dismissed (hidden).
**Side Effects**:
- The dialog is removed from the screen.

#### HandleCancel
**Contract**: Processes the user's decision to cancel the action.
**Trigger**: User clicks the "Cancel" button or dismisses the dialog (e.g., by pressing ESC or clicking outside the dialog if supported).
**Flow**:
1. When the "Cancel" button is clicked (or dialog is dismissed):
2. If `onCancel` is provided, it is triggered.
3. The dialog is dismissed (hidden).
**Side Effects**:
- The dialog is removed from the screen.

### ✅ Acceptance Criteria
- The dialog appears with the correct message and buttons when `ShowDialog` is triggered.
- Clicking "Confirm" executes `onConfirm` and closes the dialog.
- Clicking "Cancel" (or dismissing) executes `onCancel` (if provided) and closes the dialog.
- The dialog prevents interaction with the underlying application when visible.

## Component: NotificationService
### Role: Presentation
**Description**: Provides a global service for displaying temporary, dismissible notifications to the user.
**Signature**: None (Service is typically instantiated once and used via its capabilities).

### 📐 Appearance
- Notifications appear as small, non-intrusive pop-up messages, typically in a corner of the screen (e.g., top-right or bottom-right).
- Each notification has a distinct visual style (color, icon) based on its type (success, error, info, warning).
- Notifications automatically disappear after a short duration (e.g., 3-5 seconds) or can be manually dismissed by the user.

### 📦 Content
- A notification container.
- For each notification: an icon (optional), a title/message text, and a close button (optional).

### ⚡ Capabilities
#### ShowSuccess
**Contract**: Displays a success notification.
**Signature**: `message: string` - The success message to display.
**Flow**:
1. A notification with a success-themed appearance (e.g., green background, checkmark icon) is displayed.
2. The `message` is shown within the notification.
3. The notification remains visible for a predefined duration or until manually dismissed.
**Side Effects**:
- A new notification element is added to the UI.

#### ShowError
**Contract**: Displays an error notification.
**Signature**: `message: string` - The error message to display.
**Flow**:
1. A notification with an error-themed appearance (e.g., red background, 'X' icon) is displayed.
2. The `message` is shown within the notification.
3. The notification remains visible for a predefined duration or until manually dismissed.
**Side Effects**:
- A new notification element is added to the UI.

#### ShowInfo
**Contract**: Displays an informational notification.
**Signature**: `message: string` - The informational message to display.
**Flow**:
1. A notification with an info-themed appearance (e.g., blue background, 'i' icon) is displayed.
2. The `message` is shown within the notification.
3. The notification remains visible for a predefined duration or until manually dismissed.
**Side Effects**:
- A new notification element is added to the UI.

#### ShowWarning
**Contract**: Displays a warning notification.
**Signature**: `message: string` - The warning message to display.
**Flow**:
1. A notification with a warning-themed appearance (e.g., yellow/orange background, exclamation icon) is displayed.
2. The `message` is shown within the notification.
3. The notification remains visible for a predefined duration or until manually dismissed.
**Side Effects**:
- A new notification element is added to the UI.

### ✅ Acceptance Criteria
- Calling any `Show` capability displays a notification with the correct message and theme.
- Notifications automatically disappear after a short timeout.
- Notifications can be manually dismissed by the user (if a close button is present).