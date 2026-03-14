# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./data-management-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`
> **Reference**: Concepts/Capabilities in `./project-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./epic-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./story-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./changelog-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./settings-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./id-generation-logic.isl.md`

## Component: DataManagementLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService, projectLogic: ProjectLogic, epicLogic: EpicLogic, storyLogic: StoryLogic, changelogLogic: ChangelogLogic, settingsLogic: SettingsLogic, idGenerationLogic: IdGenerationLogic)`

### ⚡ Capabilities
#### exportToJson
**Contract**: Gathers all application data from IndexedDB, formats it into a versioned `@ExportedData` structure, and returns it as a JSON string. This capability prepares data for backup or sharing.
- **Signature**: `()` -> `Promise<string>` (JSON string representing `@ExportedData`)
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `projectLogic` to `getAllProjects()` to retrieve all `@ProjectEntity` instances with their calculated progress.
  3. Initialize an empty array for `allEpics`.
  4. FOR EACH `project` in the retrieved projects:
     1. Request `epicLogic` to `getEpicsByProject(project.id)` to retrieve all `@EpicEntity` instances associated with the project, including their derived status.
     2. Add the retrieved epics to `allEpics`.
  5. Initialize an empty array for `allStories`.
  6. FOR EACH `epic` in `allEpics`:
     1. Request `storyLogic` to `getStoriesByEpic(epic.id)` to retrieve all `@StoryEntity` instances associated with the epic.
     2. Add the retrieved stories to `allStories`.
  7. Request `changelogLogic` to `getChangelog()` to retrieve all `@ChangelogEntry` instances.
  8. Request `settingsLogic` to `getTeamMembers()` to retrieve all `@TeamMember` instances.
  9. Request `settingsLogic` to `getCategories()` to retrieve all `@Category` instances.
  10. Construct an `@ExportedData` object with:
      - `version`: "1.0.0" (or current application version).
      - `timestamp`: the current timestamp.
      - `projects`: the retrieved projects.
      - `epics`: `allEpics`.
      - `stories`: `allStories`.
      - `changelog`: the retrieved changelog entries.
      - `teamMembers`: the retrieved team members.
      - `categories`: the retrieved categories.
  11. Convert the `@ExportedData` object to a JSON string.
  12. Return the JSON string.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - A JSON string representing a complete `@ExportedData` object is returned.
  - The exported data includes all projects, epics, stories, changelog entries, team members, and categories.
  - The `version` and `timestamp` fields are correctly populated.
  - Calculated fields (e.g., `progress` for projects, `status` for epics) are included in the exported entities.
- **🧪 Test Scenarios**:
  - Export data from an empty database and verify an `@ExportedData` object with empty arrays is returned.
  - Export data from a database containing projects, epics, stories, changelog, team members, and categories, and verify all data is present and correctly structured in the JSON output.
  - Verify the `version` and `timestamp` in the exported JSON.

#### importFromJson
**Contract**: Parses a JSON string, validates its schema against `@ExportedData`, and imports the data into IndexedDB based on the specified `@ImportMode`. Handles ID conflicts for `ADD_TO_EXISTING` mode by generating new IDs and remapping references.
- **Signature**: `(fileContent: string, mode: @ImportMode)` -> `Promise<void>`
- **Flow**:
  1. Attempt to parse `fileContent` into a JavaScript object, `importedData`.
  2. IF parsing fails, THEN throw an error indicating invalid JSON format.
  3. Validate `importedData` against the `@ExportedData` schema. This includes checking for required top-level arrays (`projects`, `epics`, etc.) and basic structure of entities within those arrays.
  4. IF schema validation fails, THEN throw an error indicating invalid data structure.
  5. Obtain the current timestamp in ISO 8601 format.
  6. IF `mode` is `@ImportMode.REPLACE_ALL`, THEN:
     1. Request `indexedDbService` to `clearAllData()`.
     2. FOR EACH entity type (`projects`, `epics`, `stories`, `changelog`, `teamMembers`, `categories`):
        1. FOR EACH `entity` in `importedData[entityType]`:
           1. Set `entity.createdAt` and `entity.updatedAt` (or `timestamp` for changelog) to the current timestamp.
           2. Request `indexedDbService` to `addEntity(entityType, entity)`.
  7. ELSE (`mode` is `@ImportMode.ADD_TO_EXISTING`):
     1. Initialize `idMapping = {}` (a dictionary to store `originalId -> newId` mappings for conflicting IDs).
     2. Initialize `entitiesToImport = { projects: [], epics: [], stories: [], changelog: [], teamMembers: [], categories: [] }`.
     3. FOR EACH entity type (`teamMembers`, `categories`, `projects`, `epics`, `stories`, `changelog`) in a dependency-aware order:
        1. Retrieve all existing entities of the current `entityType` from `indexedDbService`.
        2. FOR EACH `importedEntity` in `importedData[entityType]`:
           1. Store `originalId = importedEntity.id`.
           2. IF an existing entity with `importedEntity.id` is found in the database, THEN:
              1. Request `idGenerationLogic` to `generateUUID()` to create a `newId`.
              2. Store `idMapping[originalId] = newId`.
              3. Set `importedEntity.id = newId`.
           2. Update `importedEntity.createdAt` and `importedEntity.updatedAt` (or `timestamp` for changelog) to the current timestamp.
           3. IF `importedEntity` has parent references (`projectId`, `epicId`, `entityId` for changelog), THEN:
              1. IF `idMapping[importedEntity.projectId]` exists, THEN `importedEntity.projectId = idMapping[importedEntity.projectId]`.
              2. IF `idMapping[importedEntity.epicId]` exists, THEN `importedEntity.epicId = idMapping[importedEntity.epicId]`.
              3. IF `idMapping[importedEntity.entityId]` exists, THEN `importedEntity.entityId = idMapping[importedEntity.entityId]`.
           4. Add `importedEntity` to `entitiesToImport[entityType]`.
     4. FOR EACH entity type in `entitiesToImport`:
        1. FOR EACH `entity` in `entitiesToImport[entityType]`:
           1. Request `indexedDbService` to `addEntity(entityType, entity)`.
- **Side Effects**: Modifies the IndexedDB database by clearing existing data (if `REPLACE_ALL`) or adding new entities.
- **🚨 Constraint**: The `fileContent` MUST be a valid JSON string conforming to the `@ExportedData` schema.
- **✅ Acceptance Criteria**:
  - Valid JSON data is successfully imported into the database.
  - If `REPLACE_ALL` mode is used, the database is cleared before new data is added.
  - If `ADD_TO_EXISTING` mode is used:
    - Entities with conflicting IDs are assigned new unique IDs.
    - References to re-ID'd entities (e.g., `projectId`, `epicId`, `entityId`) are correctly updated within the imported dataset.
    - Existing data in the database remains untouched unless an ID conflict occurs and a new ID is generated for the imported entity.
  - `createdAt` and `updatedAt` (or `timestamp` for changelog) fields of imported entities are updated to the current import time.
  - An error is thrown if the JSON is invalid or the schema does not match `@ExportedData`.
- **🧪 Test Scenarios**:
  - Import a valid JSON file in `REPLACE_ALL` mode and verify the database contains only the imported data.
  - Import a valid JSON file in `ADD_TO_EXISTING` mode with no ID conflicts and verify all new data is added alongside existing data.
  - Import a valid JSON file in `ADD_TO_EXISTING` mode with ID conflicts (e.g., a project with the same ID as an existing one) and verify new IDs are generated for conflicting entities and their children's references are updated.
  - Attempt to import an invalid JSON string and verify an error is thrown.
  - Attempt to import a JSON string with an invalid `@ExportedData` schema (e.g., missing `projects` array) and verify an error is thrown.

#### exportToExcel
**Contract**: Gathers all application data, including calculated progress and status, and structures it into a format suitable for generating a multi-sheet Excel file.
- **Signature**: `()` -> `Promise<{ projects: @ProjectEntity[], epics: @EpicEntity[], stories: @StoryEntity[], sprints: { sprint: string, stories: @StoryEntity[] }[], changelog: @ChangelogEntry[] }>`
- **Flow**:
  1. Request `projectLogic` to `getAllProjects()` to retrieve all `@ProjectEntity` instances with their calculated progress.
  2. Initialize `allEpics = []` and `allStories = []`.
  3. FOR EACH `project` in the retrieved projects:
     1. Request `epicLogic` to `getEpicsByProject(project.id)` to retrieve all `@EpicEntity` instances associated with the project, including their derived status.
     2. Add these epics to `allEpics`.
     3. FOR EACH `epic` retrieved for the current project:
        1. Request `storyLogic` to `getStoriesByEpic(epic.id)` to retrieve all `@StoryEntity` instances associated with the epic.
        2. Add these stories to `allStories`.
  4. Request `changelogLogic` to `getChangelog()` to retrieve all `@ChangelogEntry` instances.
  5. Group `allStories` by their `sprint` property to create the `sprints` sheet data. Stories without a `sprint` should be grouped under a "No Sprint" category.
  6. Construct and return an object containing the structured data for each Excel sheet:
     - `projects`: the retrieved `@ProjectEntity[]`.
     - `epics`: `allEpics` (`@EpicEntity[]`).
     - `stories`: `allStories` (`@StoryEntity[]`).
     - `sprints`: an array of objects, each containing `sprint` (string) and `stories` (`@StoryEntity[]`).
     - `changelog`: the retrieved `@ChangelogEntry[]`.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An object containing arrays of entities for each required Excel sheet (projects, epics, stories, sprints, changelog) is returned.
  - Projects and epics include their calculated `progress` and derived `status`.
  - Stories are correctly grouped by `sprint` for the `sprints` sheet.
  - All relevant data from the database is included in the respective sheets.
- **🧪 Test Scenarios**:
  - Export data from an empty database and verify the returned object contains empty arrays for all sheets.
  - Export data from a database with projects, epics, and stories, and verify that all entities are present in their respective sheets.
  - Verify that project and epic `progress` and `status` are correctly calculated and included.
  - Verify that stories are correctly grouped by `sprint` in the `sprints` sheet.
  - Verify that all changelog entries are included.