# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./epic-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`
> **Reference**: Concepts/Capabilities in `./changelog-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./id-generation-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./progress-calculation-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./story-logic.isl.md`

## Component: EpicLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService, changelogLogic: ChangelogLogic, idGenerationLogic: IdGenerationLogic, progressCalculationLogic: ProgressCalculationLogic, storyLogic: StoryLogic)`
### ⚡ Capabilities
#### createEpic
**Contract**: Creates a new Epic entity, generates its unique ID and code, sets initial properties, and persists it in the database.
- **Signature**: `(projectId: string, data: Omit<@EpicEntity, 'id' | 'projectId' | 'code' | 'createdAt' | 'updatedAt'>)` -> `Promise<@EpicEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `projects` with `projectId` to validate its existence.
  3. IF the project is not found, THEN throw an error indicating an invalid `projectId`.
  4. Request `idGenerationLogic` to `generateUUID` for the epic's `id`.
  5. Request `idGenerationLogic` to `generateEpicId` using the provided `projectId` for the epic's `code`.
  6. Construct a new `@EpicEntity` object, merging the provided `data` with:
     - `id`: the generated UUID.
     - `projectId`: the provided `projectId`.
     - `code`: the generated epic code.
     - `isBlocked`: `false` (initial state).
     - `createdAt`: the current timestamp.
     - `updatedAt`: the current timestamp.
  7. Set the initial `status` of the new epic to `@EpicStatus.NOT_STARTED`.
  8. Request `indexedDbService` to `addEntity` of type `epics` with the newly constructed `@EpicEntity`.
  9. Request `changelogLogic` to `recordChange` for the creation event, noting the `id`, `code`, `entityType` as `@ChangelogEntityType.EPIC`, `field` as "entity_status", `oldValue` as "CREATED", and `newValue` as `@EpicStatus.NOT_STARTED`.
  10. Return the created `@EpicEntity`.
- **Side Effects**: A new `@EpicEntity` is persisted in IndexedDB. A new `@ChangelogEntry` is recorded.
- **🚨 Constraint**: The `projectId` MUST correspond to an existing `@ProjectEntity`.
- **✅ Acceptance Criteria**:
  - A new epic is successfully created with a unique ID and code.
  - The epic's initial `isBlocked` is false and `status` is `NOT_STARTED`.
  - `createdAt` and `updatedAt` timestamps are set.
  - A changelog entry for the creation is recorded.
  - The created epic object is returned.
  - An error is thrown if the `projectId` is invalid.
- **🧪 Test Scenarios**:
  - Create an epic for an existing project and verify its properties and changelog entry.
  - Attempt to create an epic with a non-existent `projectId` and verify an error is thrown.
  - Verify that `isBlocked` is initialized to false and `status` to `NOT_STARTED`.

#### getEpic
**Contract**: Retrieves a single Epic entity by its unique identifier.
- **Signature**: `(id: string)` -> `Promise<@EpicEntity | undefined>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `epics` with the provided `id`.
  2. IF the epic is found, THEN:
     1. Request `storyLogic` to `getStoriesByEpic` using the epic's `id`.
     2. Request `progressCalculationLogic` to `calculateEpicProgress` using the retrieved stories.
     3. Request `progressCalculationLogic` to `deriveStatus` using the calculated progress and the epic's `isBlocked` flag.
     4. Set the epic's `status` to the derived status.
     5. Return the enriched `@EpicEntity`.
  3. ELSE (epic not found), THEN:
     1. Return `undefined`.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - The correct `@EpicEntity` is returned when a valid `id` is provided, with its `status` correctly derived.
  - `undefined` is returned when no epic matches the `id`.
- **🧪 Test Scenarios**:
  - Retrieve an existing epic by its ID and verify its data and derived status.
  - Attempt to retrieve a non-existent epic by ID and verify `undefined` is returned.
  - Retrieve an epic with linked stories and verify its progress and status are correctly calculated.

#### getEpicsByProject
**Contract**: Retrieves all Epic entities associated with a specific Project, calculating their progress and deriving their status.
- **Signature**: `(projectId: string)` -> `Promise<@EpicEntity[]>`
- **Flow**:
  1. Request `indexedDbService` to `getEntities` of type `epics`.
  2. Filter the retrieved `@EpicEntity[]` to include only those where `epic.projectId` matches the provided `projectId`.
  3. FOR EACH filtered `epic`:
     1. Request `storyLogic` to `getStoriesByEpic` using the `epic.id`.
     2. Request `progressCalculationLogic` to `calculateEpicProgress` using the retrieved stories.
     3. Request `progressCalculationLogic` to `deriveStatus` using the calculated progress and the `epic.isBlocked` flag.
     4. Set the `epic.status` to the derived status.
  4. Return the array of filtered and enriched `@EpicEntity` objects.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array of epics belonging to the specified project is returned.
  - Each returned epic has its `status` correctly derived based on its linked stories and `isBlocked` flag.
  - An empty array is returned if no epics are linked to the project or if the project does not exist.
- **🧪 Test Scenarios**:
  - Retrieve epics for a project with multiple linked epics and verify all are returned with correct derived statuses.
  - Retrieve epics for a project with no linked epics and verify an empty array is returned.
  - Retrieve epics for a non-existent project and verify an empty array is returned.

#### updateEpic
**Contract**: Updates an existing Epic entity with new data, recording changes in the changelog.
- **Signature**: `(id: string, data: Partial<Omit<@EpicEntity, 'id' | 'projectId' | 'code' | 'createdAt' | 'updatedAt'>>)` -> `Promise<@EpicEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `epics` with the provided `id`.
  3. IF the epic is not found, THEN throw an error indicating the epic does not exist.
  4. Store the `originalEpic` object.
  5. Create an `updatedEpic` object by merging `originalEpic` with `data`.
  6. Set `updatedEpic.updatedAt` to the current timestamp.
  7. FOR EACH `field` in `data`:
     1. IF `data[field]` is different from `originalEpic[field]`, THEN:
        1. Request `changelogLogic` to `recordChange` with `entityType` as `@ChangelogEntityType.EPIC`, `entityId` as `id`, `entityCode` as `originalEpic.code`, `field`, `oldValue` (string representation of `originalEpic[field]`), and `newValue` (string representation of `data[field]`).
  8. IF `data.isBlocked` was provided AND `data.isBlocked` is different from `originalEpic.isBlocked`, THEN:
     1. Request `storyLogic` to `getStoriesByEpic` using `updatedEpic.id`.
     2. Request `progressCalculationLogic` to `calculateEpicProgress` using the retrieved stories.
     3. Request `progressCalculationLogic` to `deriveStatus` using the calculated progress and `updatedEpic.isBlocked`.
     4. IF the derived status is different from `originalEpic.status`, THEN:
        1. Request `changelogLogic` to `recordChange` for the `status` field, using `originalEpic.status` and the derived status.
     5. Set `updatedEpic.status` to the derived status.
  9. Request `indexedDbService` to `updateEntity` of type `epics` with `id` and `updatedEpic`.
  10. Return the `updatedEpic`.
- **Side Effects**: The `@EpicEntity` in IndexedDB is modified. New `@ChangelogEntry` records are created for each changed field.
- **🚨 Constraint**: The `id` MUST correspond to an existing `@EpicEntity`. `data` MUST NOT attempt to modify `id`, `projectId`, `code`, or `createdAt`.
- **✅ Acceptance Criteria**:
  - An existing epic's properties are updated in the database.
  - `updatedAt` is updated to the current timestamp.
  - A changelog entry is recorded for each modified field.
  - The derived `status` is correctly updated if `isBlocked` changes.
  - The updated epic object is returned.
  - An error is thrown if the `id` is invalid.
- **🧪 Test Scenarios**:
  - Update an epic's `title` and `owner` and verify changes and changelog entries.
  - Update `isBlocked` from `false` to `true` and verify `status` derivation and changelog.
  - Attempt to update a non-existent epic and verify an error is thrown.
  - Verify that `id`, `projectId`, `code`, `createdAt` cannot be changed via this capability.

#### deleteEpic
**Contract**: Deletes an Epic entity and all its associated Stories from the database, recording deletions in the changelog.
- **Signature**: `(id: string)` -> `Promise<void>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `epics` with the provided `id`.
  2. IF the epic is not found, THEN resolve the promise without action.
  3. Store the `epicCode` from the retrieved epic.
  4. Request `storyLogic` to `getStoriesByEpic` using the provided `id`.
  5. FOR EACH `story` in the retrieved stories:
     1. Request `storyLogic` to `deleteStory` using `story.id`.
  6. Request `changelogLogic` to `recordDeletion` with `entityType` as `@ChangelogEntityType.EPIC`, `entityId` as `id`, and `entityCode` as `epicCode`.
  7. Request `indexedDbService` to `deleteEntity` of type `epics` with the provided `id`.
- **Side Effects**: The `@EpicEntity` and all linked `@StoryEntity` instances are removed from IndexedDB. New `@ChangelogEntry` records for epic and story deletions are created.
- **✅ Acceptance Criteria**:
  - The specified epic is successfully removed from the database.
  - All stories linked to the epic are also removed.
  - A changelog entry indicating the epic's deletion is recorded.
  - Changelog entries for each deleted story are recorded (handled by `storyLogic.deleteStory`).
  - No error is thrown if attempting to delete a non-existent epic.
- **🧪 Test Scenarios**:
  - Delete an existing epic with linked stories and verify the epic, all stories, and their respective changelog entries are created.
  - Attempt to delete an existing epic with no linked stories and verify the epic and its changelog entry are created.
  - Attempt to delete a non-existent epic and verify no error occurs.