# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./changelog-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`

## Domain Concepts

### Type: ChangelogFilters
Defines the criteria for filtering `@ChangelogEntry` records.
- `entityType`: `@ChangelogEntityType` (Optional, filters by the type of entity modified)
- `entityId`: `string` (Optional, filters by the specific ID of the modified entity)
- `field`: `string` (Optional, filters by the name of the field that was modified)
- `startDate`: `string` (Optional, ISO 8601 date string, filters entries from this date onwards)
- `endDate`: `string` (Optional, ISO 8601 date string, filters entries up to this date)

## Component: ChangelogLogic
### Role: Business Logic
**Signature**: `(indexedDbService: IndexedDbService)`

### ⚡ Capabilities

#### recordChange
**Contract**: Creates a new changelog entry to record a modification to an entity's field. This capability is automatically triggered by other business logic components when an entity's state changes.
- **Signature**: `(entityType: @ChangelogEntityType, entityId: string, entityCode: string, field: string, oldValue: string, newValue: string)` -> `Promise<void>`
- **Flow**:
  1. Generate a unique identifier for the new `@ChangelogEntry`.
  2. Obtain the current timestamp in ISO 8601 format.
  3. Construct a new `@ChangelogEntry` object using the provided parameters and the generated ID and timestamp.
  4. Request `indexedDbService` to `addEntity` of type `changelog` with the constructed `@ChangelogEntry`.
- **Side Effects**: A new `@ChangelogEntry` is persisted in the IndexedDB `changelog` object store.
- **🚨 Constraint**: `oldValue` and `newValue` MUST be string representations of the field's value, suitable for storage and display. For complex objects or enums, their string equivalent (e.g., enum name, JSON string) should be used.
- **✅ Acceptance Criteria**:
  - A new changelog entry is successfully created and stored.
  - The stored entry accurately reflects the `entityType`, `entityId`, `entityCode`, `field`, `oldValue`, `newValue`, and `timestamp`.
- **🧪 Test Scenarios**:
  - Record a change for a `@ProjectEntity`'s `name` field and verify the entry is retrievable.
  - Record a change for an `@EpicEntity`'s `status` field (enum value) and verify string representation is stored.
  - Verify that multiple changes to the same entity result in multiple distinct changelog entries.

#### recordDeletion
**Contract**: Creates a new changelog entry to record the deletion of an entity.
- **Signature**: `(entityType: @ChangelogEntityType, entityId: string, entityCode: string)` -> `Promise<void>`
- **Flow**:
  1. Generate a unique identifier for the new `@ChangelogEntry`.
  2. Obtain the current timestamp in ISO 8601 format.
  3. Construct a new `@ChangelogEntry` object using the provided `entityType`, `entityId`, `entityCode`, the generated ID and timestamp, and specific values for `field` ("entity_status"), `oldValue` ("ACTIVE"), and `newValue` ("DELETED") to signify a deletion event.
  4. Request `indexedDbService` to `addEntity` of type `changelog` with the constructed `@ChangelogEntry`.
- **Side Effects**: A new `@ChangelogEntry` is persisted in the IndexedDB `changelog` object store.
- **✅ Acceptance Criteria**:
  - A new changelog entry is successfully created and stored, indicating an entity deletion.
  - The stored entry accurately reflects the `entityType`, `entityId`, `entityCode`, and the deletion status.
- **🧪 Test Scenarios**:
  - Record a deletion for a `@ProjectEntity` and verify the entry is retrievable with `field: "entity_status"` and `newValue: "DELETED"`.
  - Record a deletion for an `@EpicEntity` and verify the entry's details.
  - Verify that recording a deletion does not interfere with existing change records.

#### getChangelog
**Contract**: Retrieves historical modification records, with optional filtering capabilities.
- **Signature**: `(filters?: @ChangelogFilters)` -> `Promise<@ChangelogEntry[]>`
- **Flow**:
  1. Request `indexedDbService` to `getEntities` of type `changelog`.
  2. IF `filters` are provided, THEN:
     1. Filter the retrieved `@ChangelogEntry[]` based on `filters.entityType`.
     2. Filter the remaining entries based on `filters.entityId`.
     3. Filter the remaining entries based on `filters.field`.
     4. Filter the remaining entries based on `filters.startDate` (inclusive).
     5. Filter the remaining entries based on `filters.endDate` (inclusive).
  3. Return the array of filtered (or all) `@ChangelogEntry` objects.
- **Side Effects**: None.
- **✅ Acceptance Criteria**:
  - All changelog entries are returned if no filters are specified.
  - Entries are correctly filtered by `entityType`.
  - Entries are correctly filtered by `entityId`.
  - Entries are correctly filtered by `field`.
  - Entries are correctly filtered by `startDate` and `endDate` (date range).
  - An empty array is returned if no entries match the filters.
- **🧪 Test Scenarios**:
  - Retrieve all changelog entries and verify the count.
  - Retrieve entries filtered by a specific `@ChangelogEntityType.PROJECT` and verify only project changes are returned.
  - Retrieve entries filtered by a specific `entityId` and `field` (e.g., `epicId` and `status`).
  - Retrieve entries within a specific date range (e.g., "2023-01-01" to "2023-01-31").
  - Retrieve entries with a combination of all filter criteria.
  - Retrieve entries from an empty changelog store or with filters that yield no results, verifying an empty array is returned.