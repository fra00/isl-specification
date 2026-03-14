# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./dashboard-presentation

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./project-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./ui-components.isl.md`

## Component: DashboardPresentation
### Role: Presentation
**Signature**: `(projectLogic: @ProjectLogic, notificationService: @NotificationService)`
### 📐 Appearance
- A main header section displaying global Key Performance Indicators (KPIs).
- A filter bar containing dropdowns for `ProjectStatus` and `year`.
- A grid or list layout for displaying individual project cards.
- Each project card visually represents a `@ProjectEntity`.
### 📦 Content
- `GlobalKpiDisplay` (internal element): Displays `activeProjects`, `totalEpics`, `completedStoriesThisWeek`.
- `FilterControls` (internal element): Contains dropdowns for `@ProjectStatus` and `year` selection.
- `ProjectCard` (internal component, rendered for each project):
  - Project `name` and `owner`.
  - `@StatusBadge` displaying `project.status`.
  - `@ProgressBar` displaying `project.progress`.
  - Text labels for `total epics`, `overdue epics`, `blocked epics` specific to the project.
### ⚡ Capabilities
#### RenderDashboard
**Contract**: Renders the global dashboard view, displaying an overview of all projects with key metrics and filtering options.
- **Signature**: `(projects: @ProjectEntity[], globalKpis: { activeProjects: number, totalEpics: number, completedStoriesThisWeek: number })`
- **Flow**:
  1. Display the `globalKpis` in the `GlobalKpiDisplay` section.
  2. Render the `FilterControls` with options for `@ProjectStatus` (PLANNING, ACTIVE, COMPLETED, PAUSED) and relevant `year` values (e.g., current year, previous years).
  3. FOR EACH `project` in `projects`:
     1. Render a `ProjectCard` component.
     2. Display `project.name`, `project.owner`.
     3. Display `project.status` using a `@StatusBadge`.
     4. Display `project.progress` using a `@ProgressBar`.
     5. Display the count of total epics, overdue epics, and blocked epics associated with the `project`. (These counts are assumed to be pre-calculated and available within the `project` object or derived from `globalKpis` context).
     6. Make the `ProjectCard` interactive to trigger `NavigateToProjectDetail` when clicked, passing `project.id`.
- **Side Effects**: Updates the DOM to display the dashboard.
- **✅ Acceptance Criteria**:
  - Global KPIs are displayed correctly.
  - Filter controls are rendered and functional.
  - Each project is displayed with its name, owner, status, progress bar, and key epic metrics.
  - Project cards are clickable to navigate to project details.
- **🧪 Test Scenarios**:
  - Render with an empty `projects` array and verify "No projects found" message (or similar) is displayed.
  - Render with multiple projects in different statuses and verify correct display of `StatusBadge` and `ProgressBar`.
  - Verify global KPIs are accurately displayed.
  - Verify clicking a project card triggers `NavigateToProjectDetail` with the correct project ID.

#### FilterProjects
**Contract**: Applies filters to the displayed projects based on the selected status and/or year.
- **Signature**: `(status?: @ProjectStatus, year?: number)`
- **Trigger**: User selects a filter option from the `FilterControls`.
- **Flow**:
  1. Request `projectLogic` to `getAllProjects()` to retrieve the complete list of projects.
  2. Filter the retrieved projects:
     - IF `status` is provided, THEN include only projects where `project.status` matches the provided `status`.
     - IF `year` is provided, THEN include only projects where `project.plannedStartDate` or `project.plannedEndDate` falls within the specified `year`.
  3. Re-render the dashboard by calling `RenderDashboard` with the filtered list of projects and the current `globalKpis`.
  4. IF an error occurs during project retrieval or filtering, THEN request `notificationService` to `ShowError` with an appropriate message.
- **Side Effects**: Updates the displayed list of projects on the dashboard.
- **✅ Acceptance Criteria**:
  - Projects are filtered correctly by `status`.
  - Projects are filtered correctly by `year`.
  - Both filters can be applied simultaneously.
  - If no projects match the filters, the dashboard displays an appropriate message.
  - Errors during filtering are handled and reported via `NotificationService`.
- **🧪 Test Scenarios**:
  - Filter by `ACTIVE` status and verify only active projects are shown.
  - Filter by a specific `year` and verify only projects within that year are shown.
  - Filter by both `COMPLETED` status and a `year` and verify the intersection.
  - Filter with no matching projects and verify the empty state message.
  - Simulate an error during `getAllProjects` and verify an error notification.

#### NavigateToProjectDetail
**Contract**: Triggers navigation to the detailed view of a specific project.
- **Signature**: `(id: string)`
- **Trigger**: User clicks on a `ProjectCard`.
- **Flow**:
  1. Trigger a global application navigation event, passing the `id` of the selected project. This event is expected to be handled by a higher-level component (e.g., `main.isl.md`) responsible for routing.
- **Side Effects**: Changes the application's active view/route to the project detail page.
- **✅ Acceptance Criteria**:
  - A navigation event is triggered with the correct project `id`.
  - The application's route changes to the project detail view.
- **🧪 Test Scenarios**:
  - Click a project card and verify the navigation event is dispatched with the correct project ID.