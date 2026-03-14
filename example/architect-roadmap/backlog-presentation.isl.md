# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./backlog-presentation

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Component: EpicLogic, Capabilities: createEpic, updateEpic, deleteEpic in `./epic-logic.isl.md`
> **Reference**: Component: StoryLogic, Capabilities: createStory, updateStory, deleteStory, updateStoryProgress in `./story-logic.isl.md`
> **Reference**: Component: ProgressBar, Component: ProgressSlider, Component: StatusBadge, Component: PriorityBadge, Component: RiskBadge, Component: ConfirmationDialog, Component: NotificationService in `./ui-components.isl.md`

## Component: BacklogPresentation
### Role: Presentation
**Signature**:
- `epics`: `@EpicEntity[]` - The list of epics to display in the backlog.
- `stories`: `@StoryEntity[]` - The list of stories to display, associated with the epics.
- `epicLogic`: `EpicLogic` - Business logic component for managing epics.
- `storyLogic`: `StoryLogic` - Business logic component for managing stories.
- `notificationService`: `NotificationService` - Service for displaying user notifications.

### 📐 Appearance
- A hierarchical tree-table structure.
- Expand/collapse icons next to epic titles to toggle visibility of child stories.
- Visual indicators (badges, progress bars) for status, priority, risk, and blocked state.
- Action buttons (Edit, Delete, Toggle Blocked, Add Story) are visible on hover or in a dedicated column.
- Inline form for adding new stories appears directly under the parent epic.
- Modals or side panels for editing entity details.

### 📦 Content
- Contains a table with rows for `@EpicEntity` and nested rows for `@StoryEntity`.
- Each `@EpicEntity` row displays:
    - Expand/Collapse control
    - `code`
    - `title`
    - `quarter` and `year`
    - `@PriorityBadge` for `priority`
    - `@RiskBadge` for `riskLevel`
    - `owner`
    - `@ProgressBar` for calculated epic progress
    - `@StatusBadge` for derived epic status
    - `jiraRef`
    - Action buttons: Edit, Delete, Toggle Blocked, Add Story Inline.
- Each `@StoryEntity` row (nested under its parent epic) displays:
    - `code`
    - `title`
    - `assignee`
    - `sprint`
    - `@PriorityBadge` for `priority`
    - `storyPoints`
    - `@ProgressSlider` for manual story progress
    - `@StatusBadge` for derived story status
    - `jiraRef`
    - Action buttons: Edit, Delete, Toggle Blocked.
- Contains a `@ConfirmationDialog` for delete operations.

### ⚡ Capabilities
#### RenderBacklog
**Contract**: Renders the interactive tree-table backlog view using the provided epics and stories.
**Signature**: `(epics: @EpicEntity[], stories: @StoryEntity[])`
**Flow**:
1.  Display a table structure.
2.  FOR EACH `epic` in `epics`:
    1.  Render a table row representing the `epic`.
    2.  Display `epic.code`, `epic.title`, `epic.quarter`, `epic.year`, `epic.owner`, `epic.jiraRef`.
    3.  Render a `@PriorityBadge` with `epic.priority`.
    4.  Render a `@RiskBadge` with `epic.riskLevel`.
    5.  Render a `@ProgressBar` with `epic.progress`.
    6.  Render a `@StatusBadge` with `epic.status`.
    7.  Display action buttons for Edit, Delete, Toggle Blocked, and Add Story Inline, linked to their respective capabilities.
    8.  IF the `epic` is marked as expanded in the UI's internal state, THEN:
        1.  Filter `stories` to find all `story` where `story.epicId` matches `epic.id`.
        2.  FOR EACH filtered `story`:
            1.  Render a nested table row representing the `story`.
            2.  Display `story.code`, `story.title`, `story.assignee`, `story.sprint`, `story.storyPoints`, `story.jiraRef`.
            3.  Render a `@PriorityBadge` with `story.priority`.
            4.  Render a `@ProgressSlider` with `story.progress`, `onChange` linked to `UpdateStoryProgress`, and `isDisabled` set to `story.isBlocked`.
            5.  Render a `@StatusBadge` with `story.status`.
            6.  Display action buttons for Edit, Delete, and Toggle Blocked, linked to their respective capabilities.
**Side Effects**: Updates the DOM to display the backlog.

#### ExpandEpic
**Contract**: Toggles the visibility of stories associated with a specific epic.
**Signature**: `(id: string)`
**Trigger**: User clicks the expand/collapse icon next to an epic's title.
**Flow**:
1.  Update the internal UI state to toggle the `expanded` flag for the epic identified by `id`.
2.  Re-render the affected epic row and its child stories based on the new `expanded` state.
**Side Effects**: Changes the visual presentation of the backlog.

#### UpdateStoryProgress
**Contract**: Updates the progress of a specific story and provides user feedback.
**Signature**: `(storyId: string, progress: number)`
**Trigger**: User interacts with a `@ProgressSlider` for a story.
**Flow**:
1.  Request `storyLogic` to `updateStoryProgress` with `storyId` and `progress`.
2.  IF the update is successful, THEN:
    1.  Request `notificationService` to `ShowSuccess` with a message like "Story progress updated successfully."
    2.  Re-render the affected story row and its parent epic row to reflect the updated progress and derived status.
3.  ELSE (an error occurs), THEN:
    1.  Request `notificationService` to `ShowError` with the error message.
**Side Effects**: Modifies the `@StoryEntity` in the database, triggers changelog entries, updates UI.
**🚨 Constraint**: The `progress` value MUST be between 0 and 100 (inclusive).

#### EditEntity
**Contract**: Opens an editable form or modal to modify the details of an Epic or Story.
**Signature**: `(entityType: 'epic' | 'story', id: string)`
**Trigger**: User clicks the "Edit" action button for an Epic or Story.
**Flow**:
1.  Display an editable form or modal pre-filled with the current data of the entity identified by `id` and `entityType`.
2.  On form submission (user confirms changes):
    1.  IF `entityType` is 'epic', THEN request `epicLogic` to `updateEpic(id, formData)`.
    2.  IF `entityType` is 'story', THEN request `storyLogic` to `updateStory(id, formData)`.
    3.  IF the update is successful, THEN:
        1.  Request `notificationService` to `ShowSuccess` with a message like "Entity updated successfully."
        2.  Close the form/modal.
        3.  Re-render the affected entity's row to reflect the changes.
    4.  ELSE (an error occurs), THEN:
        1.  Request `notificationService` to `ShowError` with the error message.
**Side Effects**: Modifies the `@EpicEntity` or `@StoryEntity` in the database, triggers changelog entries, updates UI.

#### DeleteEntity
**Contract**: Prompts the user for confirmation and then deletes an Epic or Story.
**Signature**: `(entityType: 'epic' | 'story', id: string)`
**Trigger**: User clicks the "Delete" action button for an Epic or Story.
**Flow**:
1.  Display a `@ConfirmationDialog` with a message like "Are you sure you want to delete this [Epic/Story]? This action cannot be undone."
2.  On `ConfirmationDialog.onConfirm`:
    1.  IF `entityType` is 'epic', THEN request `epicLogic` to `deleteEpic(id)`.
    2.  IF `entityType` is 'story', THEN request `storyLogic` to `deleteStory(id)`.
    3.  IF the deletion is successful, THEN:
        1.  Request `notificationService` to `ShowSuccess` with a message like "Entity deleted successfully."
        2.  Remove the deleted entity's row (and its child stories if an epic) from the display.
    4.  ELSE (an error occurs), THEN:
        1.  Request `notificationService` to `ShowError` with the error message.
**Side Effects**: Removes the `@EpicEntity` (and its stories) or `@StoryEntity` from the database, triggers changelog entries, updates UI.

#### ToggleBlocked
**Contract**: Toggles the `isBlocked` flag for an Epic or Story and updates its derived status.
**Signature**: `(entityType: 'epic' | 'story', id: string)`
**Trigger**: User clicks the "Toggle Blocked" action button for an Epic or Story.
**Flow**:
1.  Retrieve the current entity data (either from `epics` or `stories` based on `entityType` and `id`).
2.  Determine the `newBlockedState` by inverting the current `isBlocked` flag.
3.  IF `entityType` is 'epic', THEN request `epicLogic` to `updateEpic(id, { isBlocked: newBlockedState })`.
4.  IF `entityType` is 'story', THEN request `storyLogic` to `updateStory(id, { isBlocked: newBlockedState })`.
5.  IF the update is successful, THEN:
    1.  Request `notificationService` to `ShowSuccess` with a message indicating whether the entity is now "blocked" or "unblocked".
    2.  Re-render the affected entity's row to reflect the updated `isBlocked` flag and derived `status`.
6.  ELSE (an error occurs), THEN:
    1.  Request `notificationService` to `ShowError` with the error message.
**Side Effects**: Modifies the `@EpicEntity` or `@StoryEntity` in the database, triggers changelog entries, updates UI.

#### AddStoryInline
**Contract**: Displays an inline form to quickly add a new story under a specified epic.
**Signature**: `(epicId: string)`
**Trigger**: User clicks the "Add Story" action button for an Epic.
**Flow**:
1.  Display an inline form (e.g., a new row with input fields) directly under the epic identified by `epicId`. The form should allow input for `title`, `assignee`, `storyPoints`, `priority`, `sprint`, `plannedStartDate`, `plannedEndDate`, `jiraRef`, `notes`, `externalLinks`.
2.  On form submission (user confirms new story details):
    1.  Request `storyLogic` to `createStory(epicId, formData)`.
    2.  IF the creation is successful, THEN:
        1.  Request `notificationService` to `ShowSuccess` with a message like "Story added successfully."
        2.  Add the newly created story row to the display under its parent epic.
        3.  Clear and hide the inline form.
    3.  ELSE (an error occurs), THEN:
        1.  Request `notificationService` to `ShowError` with the error message.
**Side Effects**: Creates a new `@StoryEntity` in the database, triggers changelog entry, updates UI.