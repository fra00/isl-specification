# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./reports-presentation

> **Reference**: ProjectStatus, EpicStatus, StoryStatus, ChangelogEntityType, EpicEntity, ProjectEntity, ChangelogEntry in `./domain.isl.md`
> **Reference**: ChangelogFilters in `./changelog-logic.isl.md`
> **Reference**: Capabilities in `./project-logic.isl.md`
> **Reference**: Capabilities in `./epic-logic.isl.md`
> **Reference**: StatusBadge in `./ui-components.isl.md`

## Domain Concepts

### Type: ProgressTrendDataPoint
Represents a single data point for a progress trend chart.
- `date`: `string` (ISO 8601 date string, e.g., "YYYY-MM-DD")
- `progress`: `number` (0-100, the progress percentage at that date)

### Type: ProgressTrendChartSeries
Represents a series of progress data points for a specific entity (e.g., a project).
- `name`: `string` (Name of the entity, e.g., Project Name)
- `data`: `@ProgressTrendDataPoint[]`

### Type: EpicStatusSummary
Represents a count of epics for a specific status within a quarter.
- `status`: `@EpicStatus`
- `count`: `number`

### Type: QuarterSummaryEntry
Represents a summary of epics for a specific quarter and year.
- `quarter`: `string` (e.g., "Q1")
- `year`: `number`
- `epicSummaries`: `@EpicStatusSummary[]` (Breakdown of epics by status)
- `totalEpics`: `number` (Total number of epics in this quarter)

## Component: ReportsPresentation
### Role: Presentation
**Signature**: None (This component is a stateless renderer, receiving all data and callbacks via its capabilities.)

### 📐 Appearance
- A main container for reports, typically organized into distinct sections for clarity.
- Charts should be visually appealing, responsive, and potentially interactive (e.g., tooltips on hover).
- Tables should be clear, with readable fonts, appropriate spacing, and pagination controls if needed.
- Filter UI elements for the changelog table should be intuitive and easy to use.

### 📦 Content
- Contains a dedicated area for displaying the progress trend chart.
- Contains a dedicated area for displaying the quarter summary.
- Contains a dedicated area for the changelog table, including its filtering controls (e.g., dropdowns, date pickers, text inputs) and a "Clear Filters" button.
- Utilizes `@StatusBadge` components for visually representing epic statuses in the quarter summary.

### ⚡ Capabilities

#### RenderProgressTrendChart
**Contract**: Displays a line chart showing the progress trend over time for one or more entities.
- **Signature**: `(seriesData: @ProgressTrendChartSeries[])` -> `void`
- **Flow**:
  1. Clear any previously rendered chart content within the designated progress trend area.
  2. Render a line chart component.
  3. Configure the chart to use the provided `seriesData`, mapping the `date` property of each `@ProgressTrendDataPoint` to the X-axis and the `progress` property to the Y-axis.
  4. Ensure the Y-axis scale is appropriately set from 0 to 100 to represent percentages.
  5. Display clear labels for both axes and a legend to distinguish between multiple series if present.
  6. Enable interactive features such as tooltips that appear on hover over data points, displaying the exact date and corresponding progress value.
- **✅ Acceptance Criteria**:
  - A line chart is successfully rendered within its designated area.
  - The chart accurately visualizes the `progress` over `date` for all provided series.
  - Multiple series are clearly distinguishable (e.g., by different colors or line styles).
  - Chart axes are correctly labeled and scaled from 0 to 100 for progress.
  - Interactive tooltips display detailed information (date, progress) when hovering over data points.

#### RenderQuarterSummary
**Contract**: Displays a summary of epics per quarter, categorized by their status.
- **Signature**: `(summaryData: @QuarterSummaryEntry[])` -> `void`
- **Flow**:
  1. Clear any previously rendered content within the designated quarter summary area.
  2. FOR EACH `quarterEntry` in the `summaryData` array:
     1. Create a distinct visual block or card to represent the summary for `quarterEntry.quarter` and `quarterEntry.year`.
     2. Display the `quarterEntry.totalEpics` count prominently within this block.
     3. FOR EACH `statusSummary` in `quarterEntry.epicSummaries`:
        1. Display the `statusSummary.status` using a `@StatusBadge` component to provide a consistent visual representation.
        2. Display the `statusSummary.count` (number of epics with that status) adjacent to its corresponding status badge.
- **✅ Acceptance Criteria**:
  - A clear summary view is rendered for each quarter provided in `summaryData`.
  - Each quarter's summary block includes its year and the total number of epics for that quarter.
  - Epics within each quarter are correctly grouped and counted by their status.
  - `@StatusBadge` components are correctly used to visually represent epic statuses.

#### RenderChangelogTable
**Contract**: Displays a paginated table of changelog entries, along with user interface controls for filtering.
- **Signature**: `(entries: @ChangelogEntry[], currentFilters: @ChangelogFilters, onApplyFilters: (newFilters: @ChangelogFilters) => void, onClearFilters: () => void)` -> `void`
- **Flow**:
  1. Clear any previously rendered content within the designated changelog table area.
  2. Render a set of filter input controls (e.g., dropdowns for `entityType`, a text input for `field`, and date pickers for `startDate` and `endDate`).
  3. Initialize these filter controls with the values provided in `currentFilters`.
  4. Render a "Clear Filters" button, typically alongside the filter inputs.
  5. Render a table structure with the following columns: `Timestamp`, `Entity Type`, `Entity Code`, `Field`, `Old Value`, `New Value`.
  6. Populate the table rows with the data from the `entries` array, ensuring each field is mapped to its correct column.
  7. Attach an event listener to each filter input control:
     1. On any change event, construct a `newFilters` object by collecting the current values from all filter inputs.
     2. Trigger the `onApplyFilters` callback, passing the `newFilters` object.
  8. Attach an event listener to the "Clear Filters" button:
     1. On click, trigger the `onClearFilters` callback.
- **Side Effects**: User interaction with filter controls or the "Clear Filters" button will trigger the provided callbacks (`onApplyFilters`, `onClearFilters`). These callbacks are expected to cause external data fetching and subsequent re-rendering of this component with updated `entries` and `currentFilters`.
- **🚨 Constraint**: This component is responsible only for rendering the UI and emitting filter events. It MUST NOT perform data fetching or complex business logic. The `entries` array MUST be pre-filtered and paginated by the calling logic before being passed to this component.
- **✅ Acceptance Criteria**:
  - A table is rendered displaying all provided `changelog entries` with correct column mapping.
  - Filter input fields are present and correctly pre-filled with the values from `currentFilters`.
  - A "Clear Filters" button is present and functional.
  - Changing any filter input triggers the `onApplyFilters` callback with the updated filter state.
  - Clicking the "Clear Filters" button triggers the `onClearFilters` callback.
  - The table content is updated correctly when new `entries` are provided.