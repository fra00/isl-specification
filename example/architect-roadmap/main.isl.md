# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Concepts/Capabilities in `./dashboard-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./roadmap-timeline-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./backlog-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./reports-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./settings-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./data-management-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`
> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./project-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./epic-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./story-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./changelog-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./settings-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./data-management-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./ui-components.isl.md`

## Component: Main
### Role: Presentation
**Signature**: `()`
### 📦 Content
- A `Header` component displaying the application title and potentially global actions.
- A `NavigationSidebar` component containing links to different application views.
- A `MainContentArea` component where the active view is dynamically rendered.
- A `NotificationDisplay` area for showing messages from `@NotificationService`.
- A `ConfirmationDialog` component, globally available for destructive actions.

### ⚡ Capabilities
#### InitializeApplication
**Contract**: Initializes core services, sets up the application environment, and renders the initial UI. This is the primary entry point for the application's startup sequence.
- **Signature**: `()` -> `Promise<void>`
- **Flow**:
  1. Request `@IndexedDbService` to `initDB()` to ensure the database schema is ready.
  2. Instantiate all required business logic components: `@ProjectLogic`, `@EpicLogic`, `@StoryLogic`, `@ChangelogLogic`, `@SettingsLogic`, `@DataManagementLogic`, passing them their respective `@IndexedDbService` and other dependencies.
  3. Instantiate global UI services: `@NotificationService` and `@ConfirmationDialog` (from `@UiComponents`).
  4. Instantiate all presentation components, passing them their required logic components and UI services.
  5. Call `SetupRouting()` to define application routes.
  6. Call `RenderNavigation()` to display the main navigation menu.
  7. Call `DisplayCurrentView()` to render the view corresponding to the initial URL.
  8. Call `HandleGlobalEvents()` to set up listeners for navigation and other global interactions.
- **Side Effects**: Initializes IndexedDB, instantiates all application components, renders the initial application shell.
- **✅ Acceptance Criteria**:
  - The IndexedDB database is initialized without errors.
  - All core application services and components are instantiated.
  - The main application layout (header, navigation, content area) is rendered.
  - The initial view based on the URL is displayed.
- **🧪 Test Scenarios**:
  - Verify `InitializeApplication` completes successfully on first load.
  - Verify `IndexedDbService.initDB` is called.
  - Verify the dashboard view is rendered if no specific route is provided.

#### SetupRouting
**Contract**: Defines the application's internal routing rules, mapping URL paths to specific view rendering logic.
- **Signature**: `()` -> `void`
- **Flow**:
  1. Define routes for:
     - `/`: Dashboard
     - `/project/:id/roadmap`: Project Roadmap Timeline
     - `/project/:id/backlog`: Project Backlog
     - `/project/:id/reports`: Project Reports
     - `/settings`: Application Settings
     - `/data-management`: Data Management
  2. Associate each route with a handler function that, when triggered, will:
     1. Parse any parameters from the URL (e.g., `projectId`).
     2. Fetch necessary data using the appropriate business logic components.
     3. Request `DisplayCurrentView()` to render the corresponding presentation component with the fetched data.
- **Side Effects**: Configures the internal router, but does not immediately render a view.
- **✅ Acceptance Criteria**:
  - All specified routes are correctly defined.
  - Route handlers are correctly associated with their respective views.
- **🧪 Test Scenarios**:
  - Verify that navigating to `/` triggers the dashboard view logic.
  - Verify that navigating to `/project/123/roadmap` correctly extracts `projectId` "123" and triggers the roadmap view logic.

#### RenderNavigation
**Contract**: Renders the main application navigation menu, allowing users to switch between different views.
- **Signature**: `()` -> `void`
- **Flow**:
  1. Render the `NavigationSidebar` component.
  2. Populate the `NavigationSidebar` with links for:
     - "Dashboard" (path: `/`)
     - "Settings" (path: `/settings`)
     - "Data Management" (path: `/data-management`)
     - A dynamic list of projects, each with sub-links for "Roadmap", "Backlog", "Reports" (paths: `/project/:id/roadmap`, `/project/:id/backlog`, `/project/:id/reports`).
  3. Attach event listeners to each navigation link to trigger `NavigateTo()` with the corresponding path.
- **Side Effects**: Updates the DOM to display the navigation menu.
- **✅ Acceptance Criteria**:
  - The navigation sidebar is rendered and visible.
  - All primary navigation links are present and functional.
  - Project-specific navigation links are dynamically generated and functional.
- **🧪 Test Scenarios**:
  - Verify clicking "Dashboard" navigates to the dashboard.
  - Verify clicking a project's "Roadmap" link navigates to the correct project roadmap.

#### DisplayCurrentView
**Contract**: Renders the appropriate presentation component in the `MainContentArea` based on the current application route.
- **Signature**: `()` -> `Promise<void>`
- **Flow**:
  1. Clear any previously rendered content from the `MainContentArea`.
  2. Determine the current route and its parameters.
  3. IF the route is `/`, THEN:
     1. Request `@ProjectLogic` to `getAllProjects()`.
     2. Calculate `globalKpis` (active projects, total epics, completed stories this week) based on all projects and their associated epics/stories.
     3. Request `@DashboardPresentation` to `RenderDashboard()` with the retrieved projects and `globalKpis`.
  4. ELSE IF the route is `/project/:id/roadmap`, THEN:
     1. Extract `projectId` from the route.
     2. Request `@EpicLogic` to `getEpicsByProject(projectId)`.
     3. Request `@RoadmapTimelinePresentation` to `RenderTimeline()` with the retrieved epics and a default granularity (e.g., 'quarter').
  5. ELSE IF the route is `/project/:id/backlog`, THEN:
     1. Extract `projectId` from the route.
     2. Request `@EpicLogic` to `getEpicsByProject(projectId)`.
     3. FOR EACH `epic` in `epics`:
        1. Request `@StoryLogic` to `getStoriesByEpic(epic.id)`.
     4. Request `@BacklogPresentation` to `RenderBacklog()` with the retrieved epics and stories.
  6. ELSE IF the route is `/project/:id/reports`, THEN:
     1. Extract `projectId` from the route.
     2. Request `@ChangelogLogic` to `getChangelog()` for the project.
     3. Request `@ProjectLogic` to `getProject(projectId)` and `@EpicLogic` to `getEpicsByProject(projectId)` to gather data for progress trend and quarter summary.
     4. Prepare `seriesData` and `summaryData` for reports.
     5. Request `@ReportsPresentation` to `RenderProgressTrendChart()` and `RenderQuarterSummary()` with the prepared data.
     6. Request `@ReportsPresentation` to `RenderChangelogTable()` with the changelog entries and filter controls.
  7. ELSE IF the route is `/settings`, THEN:
     1. Request `@SettingsLogic` to `getTeamMembers()`.
     2. Request `@SettingsLogic` to `getCategories()`.
     3. Request `@SettingsPresentation` to `RenderTeamMembers()` and `RenderCategories()`.
     4. Request `@SettingsPresentation` to `RenderResetOption()`.
  8. ELSE IF the route is `/data-management`, THEN:
     1. Request `@DataManagementPresentation` to `RenderExportOptions()`.
     2. Request `@DataManagementPresentation` to `RenderImportOptions()`.
  9. ELSE (route not found), THEN:
     1. Display a "404 Not Found" message.
- **Side Effects**: Updates the content of the `MainContentArea` with the active view.
- **✅ Acceptance Criteria**:
  - The correct presentation component is rendered for each valid route.
  - Data required by the presentation components is fetched and passed correctly.
  - An appropriate message is displayed for unknown routes.
- **🧪 Test Scenarios**:
  - Navigate to dashboard and verify `DashboardPresentation.RenderDashboard` is called with project data.
  - Navigate to a project roadmap and verify `RoadmapTimelinePresentation.RenderTimeline` is called with epic data.
  - Navigate to settings and verify `SettingsPresentation.RenderTeamMembers`, `RenderCategories`, `RenderResetOption` are called.

#### NavigateTo
**Contract**: Updates the application's current route and triggers a re-render of the active view.
- **Signature**: `(path: string)` -> `void`
- **Trigger**: User clicks a navigation link, or a child component requests navigation (e.g., `@DashboardPresentation.NavigateToProjectDetail`).
- **Flow**:
  1. Update the browser's URL history to reflect the `path`.
  2. Call `DisplayCurrentView()` to render the view corresponding to the new `path`.
- **Side Effects**: Changes the browser's URL, updates the `MainContentArea`.
- **✅ Acceptance Criteria**:
  - The browser URL is updated to the new path.
  - `DisplayCurrentView` is triggered, leading to the rendering of the correct view.
- **🧪 Test Scenarios**:
  - Call `NavigateTo('/settings')` and verify the URL changes and settings view is displayed.
  - Call `NavigateTo('/project/abc/backlog')` and verify the URL changes and backlog view for project 'abc' is displayed.

#### HandleGlobalEvents
**Contract**: Sets up global event listeners to manage application-wide interactions, such as browser history changes and custom navigation events from child components.
- **Signature**: `()` -> `void`
- **Flow**:
  1. Add an event listener for the browser's `popstate` event:
     1. WHEN `popstate` occurs, THEN:
        1. Extract the current path from `window.location`.
        2. Call `DisplayCurrentView()` to render the view corresponding to the new path.
  2. Add a custom event listener for application-specific navigation events (e.g., 'app-navigate'):
     1. WHEN an 'app-navigate' event is dispatched (e.g., by `@DashboardPresentation.NavigateToProjectDetail`), THEN:
        1. Extract the `path` from the event details.
        2. Call `NavigateTo(path)`.
- **Side Effects**: Registers global event listeners.
- **✅ Acceptance Criteria**:
  - Browser back/forward buttons correctly update the view.
  - Custom navigation events from child components are caught and processed, leading to correct view changes.
- **🧪 Test Scenarios**:
  - Simulate a browser `popstate` event and verify the view updates.
  - Dispatch a custom 'app-navigate' event with a project detail path and verify navigation occurs.