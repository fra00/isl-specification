# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./roadmap-timeline-presentation

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./epic-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./ui-components.isl.md`



## Component: RoadmapTimelinePresentation
### Role: Presentation
**Signature**: `(epicLogic: @EpicLogic, storyLogic: @StoryLogic, notificationService: @NotificationService)`
### Properties
- `_allProjectEpics`: `@EpicEntity[]` (Internal state, stores the full list of epics for the current project)
- `_currentFilteredEpics`: `@EpicEntity[]` (Internal state, the epics currently displayed after filters)
- `_currentGranularity`: `'quarter' | 'sprint'` (Internal state, default 'quarter')
- `_currentFilters`: `{ quarter?: string, category?: string, priority?: @Priority, owner?: string, risk?: @RiskLevel }` (Internal state)
- `_currentProjectId`: `string` (Internal state, the ID of the project being viewed)

### 📐 Appearance
- A main timeline area displaying epic bars.
- A filter bar at the top with dropdowns/inputs for `quarter`, `category`, `priority`, `owner`, `risk`.
- A toggle button/switch for `granularity` (Quarter/Sprint).
- A side panel that slides in/out for epic details.

### 📦 Content
- Contains filter controls (e.g., dropdowns, text inputs) for `quarter`, `category`, `priority`, `owner`, `risk`.
- Contains a granularity toggle button/switch.
- Contains a visual timeline grid component.
- Contains multiple visual "Epic Bar" elements, each representing an `@EpicEntity`.
  - Each Epic Bar displays `epic.title` and `epic.progress` using `@ProgressBar`.
  - Each Epic Bar's left border style/color indicates `epic.riskLevel` and `epic.isBlocked`.
  - Each Epic Bar has a hover tooltip showing `epic.title`, `epic.owner`, `epic.progress`, and the count of its stories.
- Contains an "Epic Detail Side Panel" component.
  - Displays `epic.code`, `epic.title`, `epic.description`, `epic.owner`, `epic.quarter`, `epic.year`, `epic.plannedStartDate`, `epic.plannedEndDate`, `epic.category`, `epic.jiraRef`.
  - Displays `epic.priority` using `@PriorityBadge`.
  - Displays `epic.riskLevel` using `@RiskBadge`.
  - Displays `epic.status` using `@StatusBadge`.
  - Displays `epic.progress` using `@ProgressBar`.
  - Lists associated `@StoryEntity` objects (code, title, assignee, sprint, progress).

### ⚡ Capabilities

#### RenderTimeline
**Contract**: Initializes the timeline view for a project with a given set of epics and display granularity. This is the initial entry point for displaying the roadmap.
- **Signature**: `(projectId: string, epics: @EpicEntity[], granularity: 'quarter' | 'sprint')` -> `void`
- **Flow**:
  1.  Set `this._currentProjectId = projectId`.
  2.  Set `this._allProjectEpics = epics`.
  3.  Set `this._currentFilteredEpics = epics` (initially no filters applied).
  4.  Set `this._currentGranularity = granularity`.
  5.  Call `_renderTimelineVisuals(this._currentFilteredEpics, this._currentGranularity)`.
- **Side Effects**: Stores project data, initializes internal state, renders the timeline UI.
- **✅ Acceptance Criteria**:
  - The timeline view is displayed with the provided epics.
  - Epics are correctly positioned and styled based on their properties.
  - Internal state (`_allProjectEpics`, `_currentFilteredEpics`, `_currentGranularity`, `_currentProjectId`) is initialized.
- **🧪 Test Scenarios**:
  - Render timeline with a list of epics and verify their visual representation.
  - Render timeline with an empty list of epics and verify an empty timeline is shown.

#### FilterTimeline
**Contract**: Applies filters to the currently loaded epics and updates the displayed timeline.
- **Signature**: `(quarter?: string, category?: string, priority?: @Priority, owner?: string, risk?: @RiskLevel)` -> `void`
- **Trigger**: User interaction with filter controls (e.g., selecting a value from a dropdown).
- **Flow**:
  1.  Update `this._currentFilters` with the provided filter parameters.
  2.  Filter `this._allProjectEpics` based on `this._currentFilters` to create `this._currentFilteredEpics`.
  3.  Call `_renderTimelineVisuals(this._currentFilteredEpics, this._currentGranularity)`.
- **Side Effects**: Updates internal filter state, re-renders the timeline UI.
- **✅ Acceptance Criteria**:
  - Only epics matching the applied filters are displayed.
  - Applying no filters (or clearing them) displays all epics.
  - Filtering by multiple criteria correctly combines them.
- **🧪 Test Scenarios**:
  - Apply a filter for a specific quarter and verify only epics in that quarter are shown.
  - Apply a filter for a category and verify only epics with that category are shown.
  - Apply multiple filters (e.g., quarter and owner) and verify correct subset is displayed.
  - Clear all filters and verify all epics are displayed again.

#### ToggleGranularity
**Contract**: Switches the timeline's horizontal axis granularity between quarter and sprint, and re-renders the view.
- **Signature**: `(newGranularity: 'quarter' | 'sprint')` -> `void`
- **Trigger**: User clicks a granularity toggle button.
- **Flow**:
  1.  Set `this._currentGranularity = newGranularity`.
  2.  Call `_renderTimelineVisuals(this._currentFilteredEpics, this._currentGranularity)`.
- **Side Effects**: Updates internal granularity state, re-renders the timeline UI with the new axis.
- **✅ Acceptance Criteria**:
  - The horizontal axis of the timeline changes to reflect the new granularity (quarters or sprints).
  - Epic bars are correctly positioned and sized according to the new granularity.
- **🧪 Test Scenarios**:
  - Toggle from 'quarter' to 'sprint' and verify axis labels and epic bar widths adjust.
  - Toggle from 'sprint' to 'quarter' and verify axis labels and epic bar widths adjust.

#### ShowEpicDetail
**Contract**: Displays a side panel with detailed information for a selected epic and its associated stories.
- **Signature**: `(epicId: string)` -> `void`
- **Trigger**: User clicks on an epic bar in the timeline.
- **Flow**:
  1.  Request `epicLogic` to `getEpic` using `epicId`.
  2.  IF the epic is found, THEN:
      1.  Request `storyLogic` to `getStoriesByEpic` using `epicId`.
      2.  Populate the "Epic Detail Side Panel" component with the retrieved epic data and the list of stories.
      3.  Make the "Epic Detail Side Panel" component visible.
  3.  ELSE (epic not found), THEN:
      1.  Request `notificationService` to `ShowError` with a message "Epic not found or could not be loaded."
- **Side Effects**: Displays a side panel, potentially shows an error notification.
- **🚨 Constraint**: The `epicId` MUST correspond to an existing `@EpicEntity`.
- **✅ Acceptance Criteria**:
  - A side panel appears, displaying the correct details for the selected epic.
  - The list of stories associated with the epic is displayed within the panel.
  - If the epic is not found, an error notification is shown.
- **🧪 Test Scenarios**:
  - Click on an epic bar and verify the detail panel opens with correct epic and story data.
  - Click on an epic bar for a non-existent epic (simulated) and verify an error notification is shown.

### Internal Helper Capability: _renderTimelineVisuals
**Contract**: Handles the actual rendering of the timeline grid and epic bars based on the provided data and granularity.
- **Signature**: `(epicsToDisplay: @EpicEntity[], granularity: 'quarter' | 'sprint')` -> `void`
- **Flow**:
  1.  Clear any previously rendered timeline elements.
  2.  Determine the overall time range (start year/quarter/sprint to end year/quarter/sprint) from `epicsToDisplay`.
  3.  Render the horizontal axis labels and grid lines based on the `granularity` and determined time range.
  4.  FOR EACH `epic` in `epicsToDisplay`:
      1.  Calculate the visual `x` position, `width`, and `y` position for the epic bar on the timeline grid based on `epic.plannedStartDate`, `epic.plannedEndDate`, and `granularity`.
      2.  Determine the bar's fill color based on `epic.status` (e.g., green for `@EpicStatus.COMPLETED`, blue for `@EpicStatus.IN_PROGRESS`, grey for `@EpicStatus.NOT_STARTED`).
      3.  Determine the bar's left border color and style based on `epic.riskLevel` (e.g., red for `@RiskLevel.HIGH`, orange for `@RiskLevel.MEDIUM`, green for `@RiskLevel.LOW`) and if `epic.isBlocked` (dashed red border).
      4.  Display the `epic.title` and `epic.progress` (using `@ProgressBar`) within the epic bar.
      5.  Attach a hover event listener to the epic bar to display a tooltip with `epic.title`, `epic.owner`, `epic.progress`, and the count of its stories (derived from `epic.progress` calculation or by fetching stories).
      6.  Attach a click event listener to the epic bar to trigger `ShowEpicDetail(epic.id)`.
- **Side Effects**: Updates the DOM to visually represent the timeline.
- **💡 Implementation Hint**: This capability would involve calculating pixel positions and widths based on dates and the chosen granularity, potentially using a date utility library.
- **✅ Acceptance Criteria**:
  - The timeline grid and epic bars are visually rendered correctly.
  - Epic bars reflect their status, risk, and blocked state through color and border styles.
  - Tooltips appear on hover with correct information.
  - Clicking an epic bar triggers `ShowEpicDetail`.
- **🧪 Test Scenarios**:
  - Render with various epic statuses and verify correct bar colors.
  - Render with various risk levels and blocked states and verify correct border styles.
  - Verify tooltip content on hover.
  - Verify `ShowEpicDetail` is triggered on click.