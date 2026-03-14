# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./project-logic

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: Component: IndexedDbService in `./indexed-db-service.isl.md`
> **Reference**: Component: ChangelogLogic in `./changelog-logic.isl.md`
> **Reference**: Component: ProgressCalculationLogic in `./progress-calculation-logic.isl.md`
> **Reference**: Component: EpicLogic in `./epic-logic.isl.md`
> **Reference**: Component: IdGenerationLogic in `./id-generation-logic.isl.md`

## Component: ProjectLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService, changelogLogic: ChangelogLogic, progressCalculationLogic: ProgressCalculationLogic, epicLogic: EpicLogic, idGenerationLogic: IdGenerationLogic)`
### ⚡ Capabilities
#### createProject
**Contract**: Creates a new Project entity, generates its unique ID, sets initial properties, and persists it in the database.
- **Signature**: `(data: Omit<@ProjectEntity, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>)` -> `Promise<@ProjectEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `idGenerationLogic` to `generateUUID` for the project's `id`.
  3. Construct a new `@ProjectEntity` object, merging the provided `data` with:
     - `id`: the generated UUID.
     - `status`: `@ProjectStatus.PLANNING` (initial state).
     - `progress`: `0` (initial state).
     - `createdAt`: the current timestamp.
     - `updatedAt`: the current timestamp.
  4. Request `indexedDbService` to `addEntity` of type `projects` with the newly constructed `@ProjectEntity`.
  5. Request `changelogLogic` to `recordChange` for the creation event, noting the `id`, `name` (as `entityCode`), `entityType` as `@ChangelogEntityType.PROJECT`, `field` as "entity_status", `oldValue` as "CREATED", and `newValue` as `@ProjectStatus.PLANNING`.
  6. Return the created `@ProjectEntity`.
- **Side Effects**: A new `@ProjectEntity` is persisted in IndexedDB. A new `@ChangelogEntry` is recorded.
- **✅ Acceptance Criteria**:
  - A new project is successfully created with a unique ID.
  - The project's initial `status` is `PLANNING` and `progress` is `0`.
  - `createdAt` and `updatedAt` timestamps are set.
  - A changelog entry for the creation is recorded.
  - The created project object is returned.
- **🧪 Test Scenarios**:
  - Create a project with valid data and verify its properties and changelog entry.
  - Verify that `progress` is initialized to 0 and `status` to `PLANNING`.

#### getProject
**Contract**: Retrieves a single Project entity by its unique identifier, calculating its current progress.
- **Signature**: `(id: string)` -> `Promise<@ProjectEntity | undefined>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `projects` with the provided `id`.
  2. IF the project is found, THEN:
     1. Request `epicLogic` to `getEpicsByProject` using the project's `id`.
     2. Request `progressCalculationLogic` to `calculateProjectProgress` using the retrieved epics.
     3. Set the project's `progress` to the calculated progress.
     4. Return the enriched `@ProjectEntity`.
  3. ELSE (project not found), THEN:
     1. Return `undefined`.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - The correct `@ProjectEntity` is returned when a valid `id` is provided, with its `progress` correctly calculated.
  - `undefined` is returned when no project matches the `id`.
- **🧪 Test Scenarios**:
  - Retrieve an existing project by its ID and verify its data and calculated progress.
  - Attempt to retrieve a non-existent project by ID and verify `undefined` is returned.
  - Retrieve a project with linked epics and verify its progress is correctly calculated.

#### getAllProjects
**Contract**: Retrieves all Project entities, calculating their current progress.
- **Signature**: `()` -> `Promise<@ProjectEntity[]>`
- **Flow**:
  1. Request `indexedDbService` to `getEntities` of type `projects`.
  2. FOR EACH `project` in the retrieved projects:
     1. Request `epicLogic` to `getEpicsByProject` using the `project.id`.
     2. Request `progressCalculationLogic` to `calculateProjectProgress` using the retrieved epics.
     3. Set the `project.progress` to the calculated progress.
  3. Return the array of enriched `@ProjectEntity` objects.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array containing all projects is returned.
  - Each returned project has its `progress` correctly calculated based on its linked epics.
  - An empty array is returned if no projects exist.
- **🧪 Test Scenarios**:
  - Retrieve all projects and verify the count and calculated progress for each.
  - Retrieve projects from an empty store and verify an empty array is returned.

#### updateProject
**Contract**: Updates an existing Project entity with new data, recording changes in the changelog.
- **Signature**: `(id: string, data: Partial<Omit<@ProjectEntity, 'id' | 'progress' | 'createdAt' | 'updatedAt'>>)` -> `Promise<@ProjectEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `projects` with the provided `id`.
  3. IF the project is not found, THEN throw an error indicating the project does not exist.
  4. Store the `originalProject` object.
  5. Create an `updatedProject` object by merging `originalProject` with `data`.
  6. Set `updatedProject.updatedAt` to the current timestamp.
  7. FOR EACH `field` in `data`:
     1. IF `data[field]` is different from `originalProject[field]`, THEN:
        1. Request `changelogLogic` to `recordChange` with `entityType` as `@ChangelogEntityType.PROJECT`, `entityId` as `id`, `entityCode` as `originalProject.name`, `field`, `oldValue` (string representation of `originalProject[field]`), and `newValue` (string representation of `data[field]`).
  8. Request `indexedDbService` to `updateEntity` of type `projects` with `id` and `updatedProject`.
  9. Request `epicLogic` to `getEpicsByProject` using `updatedProject.id`.
  10. Request `progressCalculationLogic` to `calculateProjectProgress` using the retrieved epics.
  11. Set `updatedProject.progress` to the calculated progress.
  12. Return the `updatedProject`.
- **Side Effects**: The `@ProjectEntity` in IndexedDB is modified. New `@ChangelogEntry` records are created for each changed field.
- **🚨 Constraint**: The `id` MUST correspond to an existing `@ProjectEntity`. `data` MUST NOT attempt to modify `id`, `progress`, or `createdAt`.
- **✅ Acceptance Criteria**:
  - An existing project's properties are updated in the database.
  - `updatedAt` is updated to the current timestamp.
  - A changelog entry is recorded for each modified field.
  - The updated project object is returned with its `progress` recalculated.
  - An error is thrown if the `id` is invalid.
- **🧪 Test Scenarios**:
  - Update a project's `name` and `owner` and verify changes and changelog entries.
  - Update a project's `status` and verify the change and changelog entry.
  - Attempt to update a non-existent project and verify an error is thrown.
  - Verify that `id`, `progress`, `createdAt` cannot be changed via this capability.

#### deleteProject
**Contract**: Deletes a Project entity and all its associated Epics and Stories from the database, recording deletions in the changelog.
- **Signature**: `(id: string)` -> `Promise<void>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `projects` with the provided `id`.
  2. IF the project is not found, THEN resolve the promise without action.
  3. Store the `projectName` from the retrieved project.
  4. Request `epicLogic` to `getEpicsByProject` using the provided `id`.
  5. FOR EACH `epic` in the retrieved epics:
     1. Request `epicLogic` to `deleteEpic` using `epic.id`.
  6. Request `changelogLogic` to `recordDeletion` with `entityType` as `@ChangelogEntityType.PROJECT`, `entityId` as `id`, and `entityCode` as `projectName`.
  7. Request `indexedDbService` to `deleteEntity` of type `projects` with the provided `id`.
- **Side Effects**: The `@ProjectEntity` and all linked `@EpicEntity` and `@StoryEntity` instances are removed from IndexedDB. New `@ChangelogEntry` records for project, epic, and story deletions are created.
- **✅ Acceptance Criteria**:
  - The specified project is successfully removed from the database.
  - All epics linked to the project are also removed.
  - All stories linked to those epics are also removed.
  - A changelog entry indicating the project's deletion is recorded.
  - Changelog entries for each deleted epic and story are recorded (handled by `epicLogic.deleteEpic`).
  - No error is thrown if attempting to delete a non-existent project.
- **🧪 Test Scenarios**:
  - Delete an existing project with linked epics and stories and verify the project, all epics, all stories, and their respective changelog entries are created.
  - Attempt to delete an existing project with no linked epics and verify the project and its changelog entry are created.
  - Attempt to delete a non-existent project and verify no error occurs.