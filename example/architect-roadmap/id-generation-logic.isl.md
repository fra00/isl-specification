# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./id-generation-logic

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./indexed-db-service.isl.md`

## Component: IdGenerationLogic
### Role: Business Logic
**Description**: Handles the generation of unique, incremental identifiers for Epics and Stories within their respective parent entities, and universally unique identifiers for primary keys.

### ⚡ Capabilities
#### generateEpicId
**Contract**: Generates a unique, incremental code for a new `@EpicEntity` within a specified `@ProjectEntity`. The code follows the format "EP-XXX", where XXX is a zero-padded, incrementing number.
- **Signature**: `(projectId: string)` -> `Promise<string>`
- **Flow**:
  1. Request all existing `@EpicEntity` instances from the `IndexedDbService`.
  2. Filter the retrieved epics to identify those whose `projectId` matches the provided `projectId`.
  3. Determine the highest numeric suffix from the `code` property of the filtered epics (e.g., if codes are "EP-001", "EP-005", the highest suffix is 5).
  4. IF no epics are found for the `projectId`, THEN the next number is 1.
  5. ELSE, the next number is the highest suffix incremented by 1.
  6. Format the next number into a three-digit, zero-padded string (e.g., 1 becomes "001", 12 becomes "012").
  7. Construct the final epic code in the format "EP-XXX".
  8. Return the generated epic code.
- **Side Effects**: None. This capability only reads data to determine the next ID.
- **🚨 Constraint**: The `projectId` provided MUST correspond to an existing `@ProjectEntity`.
- **✅ Acceptance Criteria**:
  - The generated ID is a string in the format "EP-XXX".
  - The numeric part of the ID is unique and incrementally higher than any existing epic code within the same `projectId`.
  - If no epics exist for the given `projectId`, the first generated ID is "EP-001".
- **🧪 Test Scenarios**:
  - Generate an ID for a project with no existing epics; verify "EP-001" is returned.
  - Generate an ID for a project with epics "EP-001" and "EP-003"; verify "EP-004" is returned.
  - Generate an ID for a project with epics "EP-009" and "EP-010"; verify "EP-011" is returned.

#### generateStoryId
**Contract**: Generates a unique, incremental code for a new `@StoryEntity` within a specified `@EpicEntity`. The code follows the format "ST-XXX", where XXX is a zero-padded, incrementing number.
- **Signature**: `(epicId: string)` -> `Promise<string>`
- **Flow**:
  1. Request all existing `@StoryEntity` instances from the `IndexedDbService`.
  2. Filter the retrieved stories to identify those whose `epicId` matches the provided `epicId`.
  3. Determine the highest numeric suffix from the `code` property of the filtered stories (e.g., if codes are "ST-001", "ST-004", the highest suffix is 4).
  4. IF no stories are found for the `epicId`, THEN the next number is 1.
  5. ELSE, the next number is the highest suffix incremented by 1.
  6. Format the next number into a three-digit, zero-padded string (e.g., 1 becomes "001", 12 becomes "012").
  7. Construct the final story code in the format "ST-XXX".
  8. Return the generated story code.
- **Side Effects**: None. This capability only reads data to determine the next ID.
- **🚨 Constraint**: The `epicId` provided MUST correspond to an existing `@EpicEntity`.
- **✅ Acceptance Criteria**:
  - The generated ID is a string in the format "ST-XXX".
  - The numeric part of the ID is unique and incrementally higher than any existing story code within the same `epicId`.
  - If no stories exist for the given `epicId`, the first generated ID is "ST-001".
- **🧪 Test Scenarios**:
  - Generate an ID for an epic with no existing stories; verify "ST-001" is returned.
  - Generate an ID for an epic with stories "ST-001" and "ST-002"; verify "ST-003" is returned.
  - Generate an ID for an epic with stories "ST-009" and "ST-010"; verify "ST-011" is returned.

#### generateUUID
**Contract**: Generates a universally unique identifier (UUID) string, suitable for use as a primary key for entities.
- **Signature**: `()` -> `string`
- **Flow**:
  1. Generate a string that is universally unique.
  2. Return the generated UUID string.
- **Side Effects**: None.
- **🚨 Constraint**: None.
- **✅ Acceptance Criteria**:
  - The generated string is a valid UUID format (e.g., `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).
  - The generated UUID is highly likely to be unique across all generated UUIDs.
- **🧪 Test Scenarios**:
  - Generate a UUID and verify its format matches the standard UUID v4 pattern.
  - Generate multiple UUIDs and verify they are distinct.