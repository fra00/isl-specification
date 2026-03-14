# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./indexed-db-service

> **Reference**: Domain Concepts in `./domain.isl.md`

## Component: IndexedDbService

### Role: Backend

**Signature**: `(dbName: string, dbVersion: number)`

### ⚡ Capabilities

#### initDB

- **Contract**: Initializes the IndexedDB database, creating or upgrading object stores for all core entities. This operation ensures the database schema is ready for data persistence.
- **Signature**: `()` -> `Promise<void>`
- **Flow**:
  1. Request to open the IndexedDB database with the specified name and version.
  2. IF the database version is new or higher than the existing one, THEN:
     1. FOR EACH entity type (`@ProjectEntity`, `@EpicEntity`, `@StoryEntity`, `@ChangelogEntry`, `@TeamMember`, `@Category`):
        1. Create an object store with the entity type name as its key.
        2. Configure the object store to use `id` as the key path.
        3. Configure the object store to auto-increment IDs if `id` is not provided during addition.
  3. Await the successful completion of the database opening and schema creation/upgrade.
- **Side Effects**: Creates or upgrades the IndexedDB database and its object stores in the user's browser.
- **✅ Acceptance Criteria**:
  - The IndexedDB database is successfully opened or created.
  - All required object stores (`ProjectEntity`, `EpicEntity`, `StoryEntity`, `ChangelogEntry`, `TeamMember`, `Category`) are present in the database.
  - Each object store is configured to use `id` as its key path.
- **🧪 Test Scenarios**:
  - Verify `initDB` successfully creates a new database with all object stores when called for the first time.
  - Verify `initDB` successfully upgrades the database schema (e.g., adding a new object store) when called with an incremented version number.
  - Verify `initDB` does not alter the database schema when called with the same version number as an existing database.

#### addEntity

- **Contract**: Adds a new entity of a specified type to its corresponding object store.
- **Signature**: `(entityType: string, data: @ProjectEntity | @EpicEntity | @StoryEntity | @ChangelogEntry | @TeamMember | @Category)` -> `Promise<string>` (Returns the ID of the newly added entity)
- **Flow**:
  1. Create a read-write transaction for the specified `entityType` object store.
  2. Access the target object store.
  3. Add the provided `data` to the object store.
  4. Await the completion of the add operation.
  5. Return the key (ID) generated or used for the added entity.
- **Side Effects**: Persists the new entity data in the IndexedDB.
- **🚨 Constraint**: The `data` object MUST contain an `id` property if it's not intended for IndexedDB to auto-generate one. If `id` is provided, it MUST be unique within its object store.
- **✅ Acceptance Criteria**:
  - A new entity is successfully stored in the correct object store.
  - The ID of the added entity is returned.
  - Attempting to add an entity with a duplicate `id` (if `id` is provided and not auto-incremented) results in an error.
- **🧪 Test Scenarios**:
  - Add a `@ProjectEntity` and verify its ID is returned and it can be retrieved.
  - Add an `@EpicEntity` without providing an `id` and verify an auto-generated ID is returned.
  - Attempt to add an entity with an `id` that already exists in the store and verify an error is handled.

#### getEntities

- **Contract**: Retrieves all entities of a specified type from its corresponding object store.
- **Signature**: `(entityType: string)` -> `Promise<(@ProjectEntity | @EpicEntity | @StoryEntity | @ChangelogEntry | @TeamMember | @Category)[]>`
- **Flow**:
  1. Create a read-only transaction for the specified `entityType` object store.
  2. Access the target object store.
  3. Request all objects from the object store.
  4. Await the completion of the request.
  5. Return the array of retrieved entities.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - An array containing all entities of the specified type is returned.
  - If no entities exist for the type, an empty array is returned.
- **🧪 Test Scenarios**:
  - Retrieve all `@ProjectEntity` instances and verify the returned array matches the expected count and data.
  - Retrieve entities from an empty object store and verify an empty array is returned.

#### getEntity

- **Contract**: Retrieves a single entity by its type and unique identifier.
- **Signature**: `(entityType: string, id: string)` -> `Promise<@ProjectEntity | @EpicEntity | @StoryEntity | @ChangelogEntry | @TeamMember | @Category | undefined>`
- **Flow**:
  1. Create a read-only transaction for the specified `entityType` object store.
  2. Access the target object store.
  3. Request the object with the given `id` from the object store.
  4. Await the completion of the request.
  5. Return the retrieved entity, or `undefined` if not found.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - The entity matching the `id` is returned.
  - If no entity matches the `id`, `undefined` is returned.
- **🧪 Test Scenarios**:
  - Retrieve an existing `@EpicEntity` by its `id` and verify its data.
  - Attempt to retrieve a non-existent entity by `id` and verify `undefined` is returned.

#### updateEntity

- **Contract**: Updates an existing entity of a specified type with new data.
- **Signature**: `(entityType: string, id: string, data: Partial<@ProjectEntity | @EpicEntity | @StoryEntity | @ChangelogEntry | @TeamMember | @Category>)` -> `Promise<void>`
- **Flow**:
  1. Create a read-write transaction for the specified `entityType` object store.
  2. Access the target object store.
  3. Retrieve the existing entity using the provided `id`.
  4. IF the entity is found, THEN:
     1. Merge the `data` (partial update) with the existing entity's properties.
     2. Put the updated entity back into the object store.
     3. Await the completion of the put operation.
  5. ELSE (entity not found), THEN:
     1. Resolve the promise without action or indicate failure.
- **Side Effects**: Modifies the existing entity data in the IndexedDB.
- **✅ Acceptance Criteria**:
  - An existing entity's properties are updated in the database.
  - Attempting to update a non-existent entity does not result in an error and the database remains unchanged.
- **🧪 Test Scenarios**:
  - Update the `name` of an existing `@ProjectEntity` and verify the change upon retrieval.
  - Attempt to update a non-existent `@StoryEntity` and verify no error occurs and no new entity is created.

#### deleteEntity

- **Contract**: Deletes an entity of a specified type by its unique identifier.
- **Signature**: `(entityType: string, id: string)` -> `Promise<void>`
- **Flow**:
  1. Create a read-write transaction for the specified `entityType` object store.
  2. Access the target object store.
  3. Delete the object with the given `id` from the object store.
  4. Await the completion of the delete operation.
- **Side Effects**: Removes the entity data from the IndexedDB.
- **✅ Acceptance Criteria**:
  - The entity matching the `id` is removed from the database.
  - Attempting to delete a non-existent entity does not result in an error.
- **🧪 Test Scenarios**:
  - Delete an existing `@Category` by its `id` and verify it can no longer be retrieved.
  - Attempt to delete a non-existent entity by `id` and verify no error occurs.

#### clearAllData

- **Contract**: Clears all data from all object stores within the database. This effectively resets the application's local data.
- **Signature**: `()` -> `Promise<void>`
- **Flow**:
  1. Create a read-write transaction for all object stores (`projects`, `epics`, `stories`, `changelog`, `teamMembers`, `categories`).
  2. FOR EACH object store in the transaction:
     1. Request to clear all data from the current object store.
     2. Await the completion of the clear operation for that store.
  3. Await the completion of the entire transaction.
- **Side Effects**: Empties all data from the IndexedDB database.
- **✅ Acceptance Criteria**:
  - All object stores in the database are empty after the operation.
- **🧪 Test Scenarios**:
  - Add multiple entities across different types.
  - Call `clearAllData`.
  - Verify that `getEntities` for any type returns an empty array.
