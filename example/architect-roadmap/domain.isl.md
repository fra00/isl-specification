# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### Enum: ProjectStatus

Defines the possible states for a `@ProjectEntity`.

- `PLANNING`: The project is in the planning phase.
- `ACTIVE`: The project is currently active and in progress.
- `COMPLETED`: The project has been successfully completed.
- `PAUSED`: The project's work is temporarily suspended.

### Enum: EpicStatus

Defines the possible states for an `@EpicEntity`.

- `NOT_STARTED`: The epic has not yet begun.
- `IN_PROGRESS`: The epic is currently underway.
- `COMPLETED`: The epic has been completed.
- `BLOCKED`: The epic is blocked and cannot proceed (manual override).

### Enum: StoryStatus

Defines the possible states for a `@StoryEntity`.

- `NOT_STARTED`: The story has not yet begun.
- `IN_PROGRESS`: The story is currently underway.
- `COMPLETED`: The story has been completed.
- `BLOCKED`: The story is blocked and cannot proceed (manual override).

### Enum: Priority

Defines the urgency or importance level for `@EpicEntity` and `@StoryEntity`.

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### Enum: RiskLevel

Defines the assessed risk level for an `@EpicEntity`.

- `LOW`
- `MEDIUM`
- `HIGH`

### Enum: StoryPoints

Defines the standard Fibonacci sequence values for estimating `@StoryEntity` effort.

- `ONE` (1)
- `TWO` (2)
- `THREE` (3)
- `FIVE` (5)
- `EIGHT` (8)
- `THIRTEEN` (13)
- `TWENTY_ONE` (21)

### Enum: ChangelogEntityType

Defines the types of entities that can be recorded in the `@ChangelogEntry`.

- `PROJECT`
- `EPIC`
- `STORY`
- `TEAM_MEMBER`
- `CATEGORY`

### Enum: ImportMode

Defines the available strategies for importing data.

- `REPLACE_ALL`: Clears existing data before importing new data.
- `ADD_TO_EXISTING`: Adds new data to existing data, resolving conflicts by generating new IDs.

### Type: ProjectEntity

Represents a top-level project container.

- `id`: `string` (Unique identifier for the project)
- `name`: `string` (Name of the project)
- `description`: `string` (Detailed description of the project)
- `owner`: `string` (Name of the team member responsible for the project, references `@TeamMember.name`)
- `plannedStartDate`: `string` (ISO 8601 date string, e.g., "YYYY-MM-DD")
- `plannedEndDate`: `string` (ISO 8601 date string, e.g., "YYYY-MM-DD")
- `status`: `@ProjectStatus` (Current status of the project)
- `progress`: `number` (0-100, calculated at runtime based on child epics/stories completion)
- `createdAt`: `string` (ISO 8601 datetime string, timestamp of creation)
- `updatedAt`: `string` (ISO 8601 datetime string, timestamp of last update)

### Type: EpicEntity

Represents a major initiative or feature within a project.

- `id`: `string` (Unique identifier for the epic)
- `projectId`: `string` (ID of the parent project)
- `code`: `string` (Auto-generated unique code, e.g., "EP-001")
- `title`: `string` (Title of the epic)
- `description`: `string` (Detailed description of the epic)
- `priority`: `@Priority` (Importance level of the epic)
- `quarter`: `string` (e.g., "Q1", "Q2", "Q3", "Q4")
- `year`: `number` (Year of the quarter, e.g., 2023)
- `plannedStartDate`: `string` (ISO 8601 date string)
- `plannedEndDate`: `string` (ISO 8601 date string)
- `category`: `string` (Free text tag or references `@Category.name`)
- `owner`: `string` (Name of the team member responsible for the epic, references `@TeamMember.name`)
- `riskLevel`: `@RiskLevel` (Assessed risk level for the epic)
- `jiraRef`: `string` (Optional reference to a Jira Epic ID or URL)
- `isBlocked`: `boolean` (Manual flag to indicate if the epic is blocked)
- `createdAt`: `string` (ISO 8601 datetime string, timestamp of creation)
- `updatedAt`: `string` (ISO 8601 datetime string, timestamp of last update)

### Type: StoryEntity

Represents a unit of work within an epic.

- `id`: `string` (Unique identifier for the story)
- `epicId`: `string` (ID of the parent epic)
- `code`: `string` (Auto-generated unique code, e.g., "ST-001")
- `title`: `string` (Title of the story)
- `description`: `string` (Detailed description of the story)
- `priority`: `@Priority` (Importance level of the story)
- `storyPoints`: `@StoryPoints` (Estimated effort for the story)
- `assignee`: `string` (Name of the team member assigned to the story, references `@TeamMember.name`)
- `sprint`: `string` (Name or identifier of the sprint the story belongs to)
- `plannedStartDate`: `string` (ISO 8601 date string)
- `plannedEndDate`: `string` (ISO 8601 date string)
- `jiraRef`: `string` (Optional reference to a Jira Story ID or URL)
- `notes`: `string` (Additional notes for the story)
- `externalLinks`: `string[]` (Array of external URLs relevant to the story)
- `progress`: `number` (0-100, manually entered percentage of completion)
- `isBlocked`: `boolean` (Manual flag to indicate if the story is blocked)
- `createdAt`: `string` (ISO 8601 datetime string, timestamp of creation)
- `updatedAt`: `string` (ISO 8601 datetime string, timestamp of last update)

### Type: ChangelogEntry

Records historical modifications to entities.

- `id`: `string` (Unique identifier for the changelog entry)
- `entityType`: `@ChangelogEntityType` (Type of entity that was modified)
- `entityId`: `string` (ID of the modified entity)
- `entityCode`: `string` (Code of the modified entity, e.g., "EP-001", "ST-001")
- `field`: `string` (Name of the field that was modified)
- `oldValue`: `string` (String representation of the field's value before modification)
- `newValue`: `string` (String representation of the field's value after modification)
- `timestamp`: `string` (ISO 8601 datetime string, timestamp of the modification)

### Type: TeamMember

Represents a member of the development team.

- `id`: `string` (Unique identifier for the team member)
- `name`: `string` (Full name or identifier of the team member)
- `createdAt`: `string` (ISO 8601 datetime string, timestamp of creation)
- `updatedAt`: `string` (ISO 8601 datetime string, timestamp of last update)

### Type: Category

Represents a predefined category or tag for epics.

- `id`: `string` (Unique identifier for the category)
- `name`: `string` (Name of the category, e.g., "Frontend", "Backend", "Infra")
- `createdAt`: `string` (ISO 8601 datetime string, timestamp of creation)
- `updatedAt`: `string` (ISO 8601 datetime string, timestamp of last update)

### Type: ExportedData

Represents the structure of the JSON export file.

- `version`: `string` (Version of the export format, e.g., "1.0.0")
- `timestamp`: `string` (ISO 8601 datetime string, timestamp of export)
- `projects`: `@ProjectEntity[]`
- `epics`: `@EpicEntity[]`
- `stories`: `@StoryEntity[]`
- `changelog`: `@ChangelogEntry[]`
- `teamMembers`: `@TeamMember[]`
- `categories`: `@Category[]`
