# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./progress-calculation-logic

> **Reference**: StoryEntity, EpicEntity, ProjectStatus, EpicStatus, StoryStatus in ./domain.isl.md

## Business Logic: Progress Calculation

### Role: Business Logic
**Description**: Provides pure functions for calculating progress percentages and deriving status for various entities based on their progress and blocking status. These functions are designed to be side-effect free and deterministic, ensuring consistent and reliable progress reporting across the application.

### ⚡ Capabilities

#### calculateStoryProgress
**Contract**: Retrieves and normalizes the effective progress percentage for a given story. Since story progress is manually entered, this function primarily ensures the value is within valid bounds (0-100) for subsequent calculations.
**Signature**:
  - Input: `story`: `@StoryEntity`
  - Output: `number` (0-100)
**Flow**:
  1. Retrieve the `progress` value from the input `story`.
  2. IF `story.progress` is not a number, is `null`, or is less than 0, THEN treat it as 0.
  3. ELSE IF `story.progress` is greater than 100, THEN treat it as 100.
  4. ELSE, use the `story.progress` value as is.
  5. Return the normalized progress value.
**✅ Acceptance Criteria**:
  - MUST return the `progress` value of the story if it is between 0 and 100 (inclusive).
  - MUST return 0 if the story's `progress` is undefined, null, or less than 0.
  - MUST return 100 if the story's `progress` is greater than 100.
**🧪 Test Scenarios**:
  - Given a story with `progress: 50`, THEN `calculateStoryProgress` returns 50.
  - Given a story with `progress: 0`, THEN `calculateStoryProgress` returns 0.
  - Given a story with `progress: 100`, THEN `calculateStoryProgress` returns 100.
  - Given a story with `progress: -10`, THEN `calculateStoryProgress` returns 0.
  - Given a story with `progress: 120`, THEN `calculateStoryProgress` returns 100.
  - Given a story with `progress: null`, THEN `calculateStoryProgress` returns 0.
  - Given a story with `progress: undefined`, THEN `calculateStoryProgress` returns 0.

#### deriveStatus
**Contract**: Derives the status of an entity (Story or Epic) based on its progress percentage and a manual `isBlocked` flag. The `BLOCKED` status takes precedence over all other derived statuses.
**Signature**:
  - Input:
    - `progress`: `number` (0-100)
    - `isBlocked`: `boolean`
  - Output: `@StoryStatus` | `@EpicStatus` (The output type is generic, as the logic applies to both)
**Flow**:
  1. IF `isBlocked` is `true`, THEN the status is `BLOCKED`.
  2. ELSE IF `progress` is `0`, THEN the status is `NOT_STARTED`.
  3. ELSE IF `progress` is `100`, THEN the status is `COMPLETED`.
  4. ELSE (if `progress` is between 1 and 99 inclusive), THEN the status is `IN_PROGRESS`.
**🚨 Constraint**:
  - The `progress` input MUST be a number between 0 and 100 (inclusive) for accurate status derivation.
**✅ Acceptance Criteria**:
  - MUST return `BLOCKED` if `isBlocked` is true, regardless of `progress`.
  - MUST return `NOT_STARTED` if `progress` is 0 and `isBlocked` is false.
  - MUST return `IN_PROGRESS` if `progress` is between 1 and 99 (inclusive) and `isBlocked` is false.
  - MUST return `COMPLETED` if `progress` is 100 and `isBlocked` is false.
**🧪 Test Scenarios**:
  - Given `progress: 50`, `isBlocked: true`, THEN `deriveStatus` returns `BLOCKED`.
  - Given `progress: 0`, `isBlocked: true`, THEN `deriveStatus` returns `BLOCKED`.
  - Given `progress: 100`, `isBlocked: true`, THEN `deriveStatus` returns `BLOCKED`.
  - Given `progress: 0`, `isBlocked: false`, THEN `deriveStatus` returns `NOT_STARTED`.
  - Given `progress: 1`, `isBlocked: false`, THEN `deriveStatus` returns `IN_PROGRESS`.
  - Given `progress: 50`, `isBlocked: false`, THEN `deriveStatus` returns `IN_PROGRESS`.
  - Given `progress: 99`, `isBlocked: false`, THEN `deriveStatus` returns `IN_PROGRESS`.
  - Given `progress: 100`, `isBlocked: false`, THEN `deriveStatus` returns `COMPLETED`.

#### calculateEpicProgress
**Contract**: Calculates the overall progress percentage for an Epic based on the arithmetic mean of its associated Stories' progress.
**Signature**:
  - Input: `stories`: `@StoryEntity[]` (An array of Story entities belonging to the epic)
  - Output: `number` (0-100, rounded to the nearest integer)
**Flow**:
  1. IF the `stories` array is empty, `null`, or `undefined`, THEN return 0.
  2. Initialize `totalProgress` to 0.
  3. FOR EACH `story` IN `stories`:
     1. Calculate the story's effective progress using `calculateStoryProgress(story)`.
     2. Add the calculated story progress to `totalProgress`.
  4. Calculate the `averageProgress` by dividing `totalProgress` by the number of `stories`.
  5. Round `averageProgress` to the nearest integer.
  6. Return the rounded `averageProgress`.
**🚨 Constraint**:
  - The `progress` field of each `@StoryEntity` in the input array MUST be a number or coercible to a number for calculation. Invalid values will be normalized by `calculateStoryProgress`.
**✅ Acceptance Criteria**:
  - MUST return 0 if the input `stories` array is empty, null, or undefined.
  - MUST calculate the arithmetic mean of all story progresses, using `calculateStoryProgress` for each story.
  - MUST round the final average progress to the nearest integer.
**🧪 Test Scenarios**:
  - Given `stories: []`, THEN `calculateEpicProgress` returns 0.
  - Given `stories: [{ progress: 50 }, { progress: 50 }]`, THEN `calculateEpicProgress` returns 50.
  - Given `stories: [{ progress: 0 }, { progress: 100 }]`, THEN `calculateEpicProgress` returns 50.
  - Given `stories: [{ progress: 30 }, { progress: 60 }, { progress: 90 }]`, THEN `calculateEpicProgress` returns 60.
  - Given `stories: [{ progress: 33 }, { progress: 33 }, { progress: 33 }]`, THEN `calculateEpicProgress` returns 33.
  - Given `stories: [{ progress: 33 }, { progress: 33 }, { progress: 34 }]`, THEN `calculateEpicProgress` returns 33. (Rounding 33.33 to 33)
  - Given `stories: [{ progress: 33 }, { progress: 33 }, { progress: 35 }]`, THEN `calculateEpicProgress` returns 34. (Rounding 33.66 to 34)
  - Given `stories: [{ progress: -10 }, { progress: 110 }]`, THEN `calculateEpicProgress` returns 50 (after clamping to 0 and 100 by `calculateStoryProgress`).

#### calculateProjectProgress
**Contract**: Calculates the overall progress percentage for a Project based on the arithmetic mean of its associated Epics' progress. Each Epic's progress is calculated dynamically from its stories.
**Signature**:
  - Input: `epics`: `@EpicEntity[]` (An array of Epic entities belonging to the project)
  - Output: `number` (0-100, rounded to the nearest integer)
**Flow**:
  1. IF the `epics` array is empty, `null`, or `undefined`, THEN return 0.
  2. Initialize `totalEpicProgress` to 0.
  3. FOR EACH `epic` IN `epics`:
     1. Calculate the `currentEpicProgress` by invoking `calculateEpicProgress` with `epic.stories`.
     2. Add `currentEpicProgress` to `totalEpicProgress`.
  4. Calculate the `averageProjectProgress` by dividing `totalEpicProgress` by the number of `epics`.
  5. Round `averageProjectProgress` to the nearest integer.
  6. Return the rounded `averageProjectProgress`.
**🚨 Constraint**:
  - Each `@EpicEntity` in the input array MUST contain a `stories` property which is an array of `@StoryEntity` for accurate calculation.
**✅ Acceptance Criteria**:
  - MUST return 0 if the input `epics` array is empty, null, or undefined.
  - MUST calculate the arithmetic mean of all epic progresses, where each epic's progress is determined by calling `calculateEpicProgress` on its stories.
  - MUST round the final average project progress to the nearest integer.
**🧪 Test Scenarios**:
  - Given `epics: []`, THEN `calculateProjectProgress` returns 0.
  - Given `epics: [{ id: 'e1', stories: [{ progress: 50 }] }, { id: 'e2', stories: [{ progress: 50 }] }]`, THEN `calculateProjectProgress` returns 50.
  - Given `epics: [{ id: 'e1', stories: [{ progress: 0 }] }, { id: 'e2', stories: [{ progress: 100 }] }]`, THEN `calculateProjectProgress` returns 50.
  - Given `epics: [{ id: 'e1', stories: [{ progress: 30 }] }, { id: 'e2', stories: [{ progress: 60 }] }, { id: 'e3', stories: [{ progress: 90 }] }]`, THEN `calculateProjectProgress` returns 60.
  - Given `epics: [{ id: 'e1', stories: [{ progress: 33 }] }, { id: 'e2', stories: [{ progress: 33 }] }, { id: 'e3', stories: [{ progress: 33 }] }]`, THEN `calculateProjectProgress` returns 33.
  - Given `epics: [{ id: 'e1', stories: [{ progress: 75.5 }] }]`, THEN `calculateProjectProgress` returns 76. (Assuming `calculateEpicProgress` rounds correctly)

#### deriveProjectStatus
**Contract**: Derives the status of a Project based on its progress percentage, respecting a manually set `PAUSED` status unless the project is 100% complete.
**Signature**:
  - Input:
    - `progress`: `number` (0-100)
    - `currentStatus`: `@ProjectStatus`
  - Output: `@ProjectStatus`
**Flow**:
  1. IF `progress` is `100`, THEN the status is `COMPLETED`.
  2. ELSE IF `currentStatus` is `PAUSED`, THEN the status is `PAUSED`.
  3. ELSE IF `progress` is `0`, THEN the status is `PLANNING`.
  4. ELSE (if `progress` is between 1 and 99 inclusive), THEN the status is `ACTIVE`.
**🚨 Constraint**:
  - The `progress` input MUST be a number between 0 and 100 (inclusive) for accurate status derivation.
**✅ Acceptance Criteria**:
  - MUST return `COMPLETED` if `progress` is 100, even if `currentStatus` is `PAUSED`.
  - MUST return `PAUSED` if `currentStatus` is `PAUSED` and `progress` is not 100.
  - MUST return `PLANNING` if `progress` is 0 and `currentStatus` is not `PAUSED`.
  - MUST return `ACTIVE` if `progress` is between 1 and 99 (inclusive) and `currentStatus` is not `PAUSED`.
**🧪 Test Scenarios**:
  - Given `progress: 100`, `currentStatus: PAUSED`, THEN `deriveProjectStatus` returns `COMPLETED`.
  - Given `progress: 50`, `currentStatus: PAUSED`, THEN `deriveProjectStatus` returns `PAUSED`.
  - Given `progress: 0`, `currentStatus: PAUSED`, THEN `deriveProjectStatus` returns `PAUSED`.
  - Given `progress: 0`, `currentStatus: ACTIVE`, THEN `deriveProjectStatus` returns `PLANNING`.
  - Given `progress: 1`, `currentStatus: PLANNING`, THEN `deriveProjectStatus` returns `ACTIVE`.
  - Given `progress: 50`, `currentStatus: PLANNING`, THEN `deriveProjectStatus` returns `ACTIVE`.
  - Given `progress: 99`, `currentStatus: ACTIVE`, THEN `deriveProjectStatus` returns `ACTIVE`.
  - Given `progress: 100`, `currentStatus: ACTIVE`, THEN `deriveProjectStatus` returns `COMPLETED`.
  - Given `progress: 0`, `currentStatus: COMPLETED`, THEN `deriveProjectStatus` returns `PLANNING`. (Assuming a completed project can be reset to 0 progress, status would revert to PLANNING if not PAUSED)