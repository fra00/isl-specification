# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./settings-logic

> **Reference**: Domain Concepts in `./domain.isl.md`
> **Reference**: Capabilities in `./indexed-db-service.isl.md`

## Component: SettingsLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService)`

### ⚡ Capabilities
#### addTeamMember
**Contract**: Adds a new team member to the application settings. The team member's name must be unique.
- **Signature**: `(name: string)` -> `Promise<@TeamMember>`
- **Flow**:
  1. Retrieve all existing `@TeamMember` entities using `indexedDbService.getEntities("teamMembers")`.
  2. IF any existing team member has a `name` that matches the provided `name` (case-insensitive), THEN:
     1. Reject the operation with an error indicating the name is not unique.
  3. ELSE:
     1. Generate a current ISO 8601 timestamp string for `createdAt` and `updatedAt`.
     2. Construct a new `@TeamMember` object with the provided `name` and timestamps.
     3. Add the new `@TeamMember` entity to the "teamMembers" object store using `indexedDbService.addEntity("teamMembers", newTeamMember)`.
     4. Return the newly created `@TeamMember` entity (including its generated `id`).
- **Side Effects**: Persists a new `@TeamMember` in IndexedDB.
- **🚨 Constraint**: The `name` of a team member MUST be unique.
- **✅ Acceptance Criteria**:
  - A new team member is successfully added and returned.
  - Attempting to add a team member with a non-unique name results in an error.
- **🧪 Test Scenarios**:
  - Add a team member with a unique name and verify it's returned with an ID.
  - Attempt to add a team member with a name that already exists and verify an error is thrown.

#### getTeamMembers
**Contract**: Retrieves all team members currently configured in the application settings.
- **Signature**: `()` -> `Promise<@TeamMember[]>`
- **Flow**:
  1. Retrieve all `@TeamMember` entities from the "teamMembers" object store using `indexedDbService.getEntities("teamMembers")`.
  2. Return the array of retrieved `@TeamMember` entities.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array containing all team members is returned.
  - If no team members exist, an empty array is returned.
- **🧪 Test Scenarios**:
  - Retrieve team members when the store is empty.
  - Add multiple team members and then retrieve them, verifying all are present.

#### updateTeamMember
**Contract**: Updates the name of an existing team member. The new name must be unique among other team members.
- **Signature**: `(id: string, name: string)` -> `Promise<void>`
- **Flow**:
  1. Retrieve all existing `@TeamMember` entities using `indexedDbService.getEntities("teamMembers")`.
  2. IF any existing team member (excluding the one being updated, identified by `id`) has a `name` that matches the provided `name` (case-insensitive), THEN:
     1. Reject the operation with an error indicating the name is not unique.
  3. ELSE:
     1. Generate a current ISO 8601 timestamp string for `updatedAt`.
     2. Update the `@TeamMember` entity with the given `id` in the "teamMembers" object store using `indexedDbService.updateEntity("teamMembers", id, { name: name, updatedAt: timestamp })`.
- **Side Effects**: Modifies an existing `@TeamMember` in IndexedDB.
- **🚨 Constraint**: The `name` of a team member MUST be unique among all *other* team members.
- **✅ Acceptance Criteria**:
  - An existing team member's name is successfully updated.
  - Attempting to update a team member with a non-existent `id` results in no change.
  - Attempting to update a team member with a name that already exists for *another* team member results in an error.
- **🧪 Test Scenarios**:
  - Update an existing team member's name and verify the change.
  - Attempt to update a team member's name to one already used by another team member and verify an error.
  - Update a team member's name to its own existing name (should succeed).

#### deleteTeamMember
**Contract**: Deletes a team member by their ID. A team member cannot be deleted if they are referenced as an `owner` or `assignee` in any existing `@ProjectEntity`, `@EpicEntity`, or `@StoryEntity`.
- **Signature**: `(id: string)` -> `Promise<void>`
- **Flow**:
  1. Retrieve the `@TeamMember` to be deleted using `indexedDbService.getEntity("teamMembers", id)`.
  2. IF the team member is not found, THEN:
     1. Resolve the promise without action.
  3. ELSE (team member found):
     1. Retrieve all `@ProjectEntity` entities using `indexedDbService.getEntities("projects")`.
     2. Retrieve all `@EpicEntity` entities using `indexedDbService.getEntities("epics")`.
     3. Retrieve all `@StoryEntity` entities using `indexedDbService.getEntities("stories")`.
     4. Check IF any `@ProjectEntity.owner` matches the team member's `name`.
     5. Check IF any `@EpicEntity.owner` matches the team member's `name`.
     6. Check IF any `@StoryEntity.assignee` matches the team member's `name`.
     7. IF any references are found, THEN:
        1. Reject the operation with an error indicating the team member is currently in use.
     8. ELSE:
        1. Delete the `@TeamMember` entity from the "teamMembers" object store using `indexedDbService.deleteEntity("teamMembers", id)`.
- **Side Effects**: Removes a `@TeamMember` from IndexedDB.
- **🚨 Constraint**: A team member MUST NOT be deleted if their `name` is referenced by any `@ProjectEntity.owner`, `@EpicEntity.owner`, or `@StoryEntity.assignee`.
- **✅ Acceptance Criteria**:
  - An existing team member is successfully deleted if not referenced.
  - Attempting to delete a non-existent team member results in no error.
  - Attempting to delete a team member that is referenced results in an error and the team member remains in the database.
- **🧪 Test Scenarios**:
  - Delete an existing team member that is not referenced and verify its removal.
  - Attempt to delete a team member that is referenced by a project, epic, or story and verify an error is thrown.

#### addCategory
**Contract**: Adds a new category to the application settings. The category's name must be unique.
- **Signature**: `(name: string)` -> `Promise<@Category>`
- **Flow**:
  1. Retrieve all existing `@Category` entities using `indexedDbService.getEntities("categories")`.
  2. IF any existing category has a `name` that matches the provided `name` (case-insensitive), THEN:
     1. Reject the operation with an error indicating the name is not unique.
  3. ELSE:
     1. Generate a current ISO 8601 timestamp string for `createdAt` and `updatedAt`.
     2. Construct a new `@Category` object with the provided `name` and timestamps.
     3. Add the new `@Category` entity to the "categories" object store using `indexedDbService.addEntity("categories", newCategory)`.
     4. Return the newly created `@Category` entity (including its generated `id`).
- **Side Effects**: Persists a new `@Category` in IndexedDB.
- **🚨 Constraint**: The `name` of a category MUST be unique.
- **✅ Acceptance Criteria**:
  - A new category is successfully added and returned.
  - Attempting to add a category with a non-unique name results in an error.
- **🧪 Test Scenarios**:
  - Add a category with a unique name and verify it's returned with an ID.
  - Attempt to add a category with a name that already exists and verify an error is thrown.

#### getCategories
**Contract**: Retrieves all categories currently configured in the application settings.
- **Signature**: `()` -> `Promise<@Category[]>`
- **Flow**:
  1. Retrieve all `@Category` entities from the "categories" object store using `indexedDbService.getEntities("categories")`.
  2. Return the array of retrieved `@Category` entities.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array containing all categories is returned.
  - If no categories exist, an empty array is returned.
- **🧪 Test Scenarios**:
  - Retrieve categories when the store is empty.
  - Add multiple categories and then retrieve them, verifying all are present.

#### updateCategory
**Contract**: Updates the name of an existing category. The new name must be unique among other categories.
- **Signature**: `(id: string, name: string)` -> `Promise<void>`
- **Flow**:
  1. Retrieve all existing `@Category` entities using `indexedDbService.getEntities("categories")`.
  2. IF any existing category (excluding the one being updated, identified by `id`) has a `name` that matches the provided `name` (case-insensitive), THEN:
     1. Reject the operation with an error indicating the name is not unique.
  3. ELSE:
     1. Generate a current ISO 8601 timestamp string for `updatedAt`.
     2. Update the `@Category` entity with the given `id` in the "categories" object store using `indexedDbService.updateEntity("categories", id, { name: name, updatedAt: timestamp })`.
- **Side Effects**: Modifies an existing `@Category` in IndexedDB.
- **🚨 Constraint**: The `name` of a category MUST be unique among all *other* categories.
- **✅ Acceptance Criteria**:
  - An existing category's name is successfully updated.
  - Attempting to update a category with a non-existent `id` results in no change.
  - Attempting to update a category with a name that already exists for *another* category results in an error.
- **🧪 Test Scenarios**:
  - Update an existing category's name and verify the change.
  - Attempt to update a category's name to one already used by another category and verify an error.
  - Update a category's name to its own existing name (should succeed).

#### deleteCategory
**Contract**: Deletes a category by its ID. A category cannot be deleted if it is referenced in any existing `@EpicEntity`.
- **Signature**: `(id: string)` -> `Promise<void>`
- **Flow**:
  1. Retrieve the `@Category` to be deleted using `indexedDbService.getEntity("categories", id)`.
  2. IF the category is not found, THEN:
     1. Resolve the promise without action.
  3. ELSE (category found):
     1. Retrieve all `@EpicEntity` entities using `indexedDbService.getEntities("epics")`.
     2. Check IF any `@EpicEntity.category` matches the category's `name`.
     3. IF any references are found, THEN:
        1. Reject the operation with an error indicating the category is currently in use.
     4. ELSE:
        1. Delete the `@Category` entity from the "categories" object store using `indexedDbService.deleteEntity("categories", id)`.
- **Side Effects**: Removes a `@Category` from IndexedDB.
- **🚨 Constraint**: A category MUST NOT be deleted if its `name` is referenced by any `@EpicEntity.category`.
- **✅ Acceptance Criteria**:
  - An existing category is successfully deleted if not referenced.
  - Attempting to delete a non-existent category results in no error.
  - Attempting to delete a category that is referenced results in an error and the category remains in the database.
- **🧪 Test Scenarios**:
  - Delete an existing category that is not referenced and verify its removal.
  - Attempt to delete a category that is referenced by an epic and verify an error is thrown.

#### resetDatabase
**Contract**: Clears all data from all object stores in the IndexedDB database, effectively resetting the application's local data.
- **Signature**: `()` -> `Promise<void>`
- **Flow**:
  1. Request `indexedDbService.clearAllData()`.
  2. Await the completion of the clear operation.
- **Side Effects**: Empties all data from the IndexedDB database.
- **✅ Acceptance Criteria**:
  - All data in the IndexedDB database is cleared.
- **🧪 Test Scenarios**:
  - Add various entities across different types.
  - Call `resetDatabase()`.
  - Verify that `getEntities()` for any entity type returns an empty array.