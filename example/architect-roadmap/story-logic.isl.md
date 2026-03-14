# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./story-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`
> **Reference**: Concepts/Capabilities in `./changelog-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./id-generation-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./progress-calculation-logic.isl.md`

## Component: StoryLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService, changelogLogic: ChangelogLogic, idGenerationLogic: IdGenerationLogic, progressCalculationLogic: ProgressCalculationLogic)`
### ⚡ Capabilities
#### createStory
**Contract**: Creates a new Story entity, generates its unique ID and code, sets initial properties, and persists it in the database.
- **Signature**: `(epicId: string, data: Omit<@StoryEntity, 'id' | 'epicId' | 'code' | 'progress' | 'isBlocked' | 'createdAt' | 'updatedAt'>)` -> `Promise<@StoryEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `epics` with `epicId` to validate its existence.
  3. IF the epic is not found, THEN throw an error indicating an invalid `epicId`.
  4. Request `idGenerationLogic` to `generateUUID` for the story's `id`.
  5. Request `idGenerationLogic` to `generateStoryId` using the provided `epicId` for the story's `code`.
  6. Construct a new `@StoryEntity` object, merging the provided `data` with:
     - `id`: the generated UUID.
     - `epicId`: the provided `epicId`.
     - `code`: the generated story code.
     - `progress`: `0` (initial progress).
     - `isBlocked`: `false` (initial state).
     - `createdAt`: the current timestamp.
     - `updatedAt`: the current timestamp.
  7. Request `indexedDbService` to `addEntity` of type `stories` with the newly constructed `@StoryEntity`.
  8. Request `changelogLogic` to `recordChange` for the creation event, noting the `id`, `code`, `entityType` as `@ChangelogEntityType.STORY`, `field` as "entity_status", `oldValue` as "CREATED", and `newValue` as `@StoryStatus.NOT_STARTED`.
  9. Return the created `@StoryEntity`.
- **Side Effects**: A new `@StoryEntity` is persisted in IndexedDB. A new `@ChangelogEntry` is recorded.
- **🚨 Constraint**: The `epicId` MUST correspond to an existing `@EpicEntity`.
- **✅ Acceptance Criteria**:
  - A new story is successfully created with a unique ID and code.
  - The story's initial `progress` is 0 and `isBlocked` is false.
  - `createdAt` and `updatedAt` timestamps are set.
  - A changelog entry for the creation is recorded.
  - The created story object is returned.
  - An error is thrown if the `epicId` is invalid.
- **🧪 Test Scenarios**:
  - Create a story for an existing epic and verify its properties and changelog entry.
  - Attempt to create a story with a non-existent `epicId` and verify an error is thrown.
  - Verify that `progress` is initialized to 0 and `isBlocked` to false.

#### getStory
**Contract**: Retrieves a single Story entity by its unique identifier.
- **Signature**: `(id: string)` -> `Promise<@StoryEntity | undefined>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `stories` with the provided `id`.
  2. Return the retrieved `@StoryEntity` or `undefined` if not found.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - The correct `@StoryEntity` is returned when a valid `id` is provided.
  - `undefined` is returned when no story matches the `id`.
- **🧪 Test Scenarios**:
  - Retrieve an existing story by its ID and verify its data.
  - Attempt to retrieve a non-existent story by ID and verify `undefined` is returned.

#### getStoriesByEpic
**Contract**: Retrieves all Story entities associated with a specific Epic.
- **Signature**: `(epicId: string)` -> `Promise<@StoryEntity[]>`
- **Flow**:
  1. Request `indexedDbService` to `getEntities` of type `stories`.
  2. Filter the retrieved `@StoryEntity[]` to include only those where `story.epicId` matches the provided `epicId`.
  3. Return the array of filtered `@StoryEntity` objects.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array of stories belonging to the specified epic is returned.
  - An empty array is returned if no stories are linked to the epic or if the epic does not exist.
- **🧪 Test Scenarios**:
  - Retrieve stories for an epic with multiple linked stories and verify all are returned.
  - Retrieve stories for an epic with no linked stories and verify an empty array is returned.
  - Retrieve stories for a non-existent epic and verify an empty array is returned.

#### updateStory
**Contract**: Updates an existing Story entity with new data, recording changes in the changelog.
- **Signature**: `(id: string, data: Partial<Omit<@StoryEntity, 'id' | 'epicId' | 'code' | 'progress' | 'createdAt' | 'updatedAt'>>)` -> `Promise<@StoryEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `stories` with the provided `id`.
  3. IF the story is not found, THEN throw an error indicating the story does not exist.
  4. Store the original story object.
  5. FOR EACH `field` in `data`:
     1. IF `data[field]` is different from `originalStory[field]`, THEN:
        1. Request `changelogLogic` to `recordChange` with `entityType` as `@ChangelogEntityType.STORY`, `entityId` as `id`, `entityCode` as `originalStory.code`, `field`, `oldValue` (string representation of `originalStory[field]`), and `newValue` (string representation of `data[field]`).
  6. Create an `updatedStory` object by merging `originalStory` with `data`.
  7. Set `updatedStory.updatedAt` to the current timestamp.
  8. IF `data.isBlocked` was provided or `data.progress` was provided (though `progress` is handled by `updateStoryProgress`), THEN:
     1. Request `progressCalculationLogic` to `deriveStatus` using `updatedStory.progress` and `updatedStory.isBlocked`.
     2. IF the derived status is different from `originalStory.status`, THEN:
        1. Request `changelogLogic` to `recordChange` for the `status` field.
     3. Set `updatedStory.status` to the derived status.
  9. Request `indexedDbService` to `updateEntity` of type `stories` with `id` and `updatedStory`.
  10. Return the `updatedStory`.
- **Side Effects**: The `@StoryEntity` in IndexedDB is modified. New `@ChangelogEntry` records are created for each changed field.
- **🚨 Constraint**: The `id` MUST correspond to an existing `@StoryEntity`. `data` MUST NOT attempt to modify `id`, `epicId`, `code`, `progress`, or `createdAt`.
- **✅ Acceptance Criteria**:
  - An existing story's properties are updated in the database.
  - `updatedAt` is updated to the current timestamp.
  - A changelog entry is recorded for each modified field.
  - The derived `status` is correctly updated if `isBlocked` changes.
  - The updated story object is returned.
  - An error is thrown if the `id` is invalid.
- **🧪 Test Scenarios**:
  - Update a story's `title` and `assignee` and verify changes and changelog entries.
  - Update `isBlocked` from `false` to `true` and verify `status` derivation and changelog.
  - Attempt to update a non-existent story and verify an error is thrown.
  - Verify that `id`, `epicId`, `code`, `progress`, `createdAt` cannot be changed via this capability.

#### deleteStory
**Contract**: Deletes a Story entity from the database and records the deletion in the changelog.
- **Signature**: `(id: string)` -> `Promise<void>`
- **Flow**:
  1. Request `indexedDbService` to `getEntity` of type `stories` with the provided `id`.
  2. IF the story is not found, THEN resolve the promise without action.
  3. Request `changelogLogic` to `recordDeletion` with `entityType` as `@ChangelogEntityType.STORY`, `entityId` as `id`, and `entityCode` as `story.code`.
  4. Request `indexedDbService` to `deleteEntity` of type `stories` with the provided `id`.
- **Side Effects**: The `@StoryEntity` is removed from IndexedDB. A new `@ChangelogEntry` for deletion is recorded.
- **✅ Acceptance Criteria**:
  - The specified story is successfully removed from the database.
  - A changelog entry indicating deletion is recorded.
  - No error is thrown if attempting to delete a non-existent story.
- **🧪 Test Scenarios**:
  - Delete an existing story and verify it can no longer be retrieved and a changelog entry exists.
  - Attempt to delete a non-existent story and verify no error occurs.

#### getStoriesByProject
**Contract**: Retrieves all Story entities associated with a specific Project.
- **Signature**: `(projectId: string)` -> `Promise<@StoryEntity[]>`
- **Flow**:
  1. Request `indexedDbService` to `getEntities` of type `epics`.
  2. Filter the retrieved `@EpicEntity[]` to include only those where `epic.projectId` matches the provided `projectId`.
  3. Extract the `id` of each filtered epic into a list of `epicIdsForProject`.
  4. Request `indexedDbService` to `getEntities` of type `stories`.
  5. Filter the retrieved `@StoryEntity[]` to include only those where `story.epicId` is present in `epicIdsForProject`.
  6. Return the array of filtered `@StoryEntity` objects.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array of stories belonging to the specified project (via their associated epics) is returned.
  - An empty array is returned if no epics are linked to the project, or if no stories are linked to those epics.
- **🧪 Test Scenarios**:
  - Retrieve stories for a project with multiple epics and stories, verifying all relevant stories are returned.
  - Retrieve stories for a project with no linked epics, verifying an empty array is returned.
  - Retrieve stories for a project with epics but no linked stories, verifying an empty array is returned.
  - Retrieve stories for a non-existent project and verify an empty array is returned.

#### updateStoryProgress
**Contract**: Updates the manual progress percentage of a Story, automatically deriving its new status, and records changes in the changelog.
- **Signature**: `(id: string, progress: number)` -> `Promise<@StoryEntity>`
- **Flow**:
  1. Obtain the current timestamp in ISO 8601 format.
  2. Request `indexedDbService` to `getEntity` of type `stories` with the provided `id`.
  3. IF the story is not found, THEN throw an error indicating the story does not exist.
  4. Store the `originalProgress` and `originalStatus`.
  5. IF `progress` is less than 0 or greater than 100, THEN throw an error for invalid progress value.
  6. Set `story.progress` to the new `progress` value.
  7. Request `progressCalculationLogic` to `deriveStatus` using `story.progress` and `story.isBlocked`.
  8. Set `story.status` to the derived status.
  9. Set `story.updatedAt` to the current timestamp.
  10. Request `changelogLogic` to `recordChange` for the `progress` field, using `originalProgress` and `story.progress`.
  11. IF `story.status` is different from `originalStatus`, THEN:
      1. Request `changelogLogic` to `recordChange` for the `status` field, using `originalStatus` and `story.status`.
  12. Request `indexedDbService` to `updateEntity` of type `stories` with `id` and `story`.
  13. Return the updated `@StoryEntity`.
- **Side Effects**: The `progress`, `status`, and `updatedAt` fields of the `@StoryEntity` in IndexedDB are modified. New `@ChangelogEntry` records are created for `progress` and potentially `status`.
- **🚨 Constraint**: The `id` MUST correspond to an existing `@StoryEntity`. The `progress` value MUST be between 0 and 100 (inclusive).
- **✅ Acceptance Criteria**:
  - The story's `progress` is updated to the new value.
  - The story's `status` is correctly derived and updated based on the new `progress` and `isBlocked` flag.
  - `updatedAt` is updated to the current timestamp.
  - Changelog entries are recorded for `progress` and `status` (if `status` changed).
  - The updated story object is returned.
  - An error is thrown if the `id` is invalid or `progress` is out of range.
- **🧪 Test Scenarios**:
  - Update a story's progress from 0 to 50 and verify `progress` and `status` (NOT_STARTED -> IN_PROGRESS) updates and changelog entries.
  - Update a story's progress from 90 to 100 and verify `progress` and `status` (IN_PROGRESS -> COMPLETED) updates and changelog entries.
  - Update a story's progress while `isBlocked` is true and verify `status` remains BLOCKED.
  - Attempt to update progress for a non-existent story and verify an error is thrown.
  - Attempt to update progress with a value outside 0-100 range and verify an error is thrown.