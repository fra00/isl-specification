# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./jira-integration-backend

> **Reference**: Concepts/Capabilities in `./domain.isl.md`

## Domain Concepts

### Type: JiraEpicData
Represents a simplified structure of an Epic fetched from Jira. This type is a placeholder for future full Jira API integration.
- `id`: `string` (The unique internal identifier of the Jira Epic, e.g., "10001")
- `key`: `string` (The human-readable key of the Jira Epic, e.g., "PROJ-123")
- `summary`: `string` (The title/summary of the Jira Epic)
- `description`: `string` (The detailed description of the Jira Epic)
- `status`: `string` (The current status in Jira, e.g., "To Do", "In Progress", "Done")
- `priority`: `string` (The priority in Jira, e.g., "Highest", "High", "Medium")
- `assignee`: `string` (The name of the assignee in Jira, if any)
- `startDate`: `string` (ISO 8601 date string, if available in Jira)
- `endDate`: `string` (ISO 8601 date string, if available in Jira)
- `components`: `string[]` (List of components associated with the Epic in Jira)

### Type: JiraStoryData
Represents a simplified structure of a Story (or Task/Bug) fetched from Jira. This type is a placeholder for future full Jira API integration.
- `id`: `string` (The unique internal identifier of the Jira Story, e.g., "10002")
- `key`: `string` (The human-readable key of the Jira Story, e.g., "PROJ-456")
- `summary`: `string` (The title/summary of the Jira Story)
- `description`: `string` (The detailed description of the Jira Story)
- `status`: `string` (The current status in Jira, e.g., "Open", "In Progress", "Resolved")
- `priority`: `string` (The priority in Jira, e.g., "Highest", "High", "Medium")
- `storyPoints`: `number` (The story points in Jira, if estimated)
- `assignee`: `string` (The name of the assignee in Jira, if any)
- `sprint`: `string` (The name of the sprint in Jira, if assigned)
- `startDate`: `string` (ISO 8601 date string, if available in Jira)
- `endDate`: `string` (ISO 8601 date string, if available in Jira)
- `labels`: `string[]` (List of labels associated with the Story in Jira)

## Component: JiraIntegrationBackend
### Role: Backend
**Signature**: `(config: { jiraApiBaseUrl: string, jiraAuthToken: string })`
  * `jiraApiBaseUrl`: `string` (The base URL for the Jira API, e.g., "https://your-jira.atlassian.net/rest/api/2")
  * `jiraAuthToken`: `string` (The authentication token for accessing the Jira API)

### ⚡ Capabilities

#### getJiraEpic
**Contract**: Fetches a Jira Epic's data using its internal Jira ID. This capability is currently stubbed and returns mock data for specific IDs.
**Signature**: `(jiraEpicId: string) => Promise<@JiraEpicData | null>`
**Flow**:
1.  Receive `jiraEpicId`.
2.  **IF** `jiraEpicId` is "EPIC-STUB-001" **THEN**
    *   Return a `Promise` resolving to a mock `@JiraEpicData` object with predefined values.
3.  **ELSE IF** `jiraEpicId` is "EPIC-STUB-002" **THEN**
    *   Return a `Promise` resolving to a different mock `@JiraEpicData` object.
4.  **ELSE**
    *   Return a `Promise` resolving to `null`.
**Side Effects**: None (for the stubbed version).
**💡 Implementation Hint**: In a future real implementation, this would involve making an authenticated HTTP GET request to the Jira API's `/issue/{jiraEpicId}` endpoint, parsing the JSON response, and mapping relevant fields to the `@JiraEpicData` structure.
**🚨 Constraint**: This capability is currently stubbed and MUST NOT perform actual external network requests.
**✅ Acceptance Criteria**:
-   When `getJiraEpic` is called with "EPIC-STUB-001", it MUST return a `Promise` that resolves to a non-null `@JiraEpicData` object containing the first set of mock data.
-   When `getJiraEpic` is called with "EPIC-STUB-002", it MUST return a `Promise` that resolves to a non-null `@JiraEpicData` object containing the second set of mock data.
-   When `getJiraEpic` is called with any other ID, it MUST return a `Promise` that resolves to `null`.
**🧪 Test Scenarios**:
-   Test `getJiraEpic("EPIC-STUB-001")` returns expected mock data for the first stub.
-   Test `getJiraEpic("EPIC-STUB-002")` returns expected mock data for the second stub.
-   Test `getJiraEpic("NON-EXISTENT-JIRA-ID")` returns `null`.

#### getJiraStory
**Contract**: Fetches a Jira Story's data using its internal Jira ID. This capability is currently stubbed and returns mock data for specific IDs.
**Signature**: `(jiraStoryId: string) => Promise<@JiraStoryData | null>`
**Flow**:
1.  Receive `jiraStoryId`.
2.  **IF** `jiraStoryId` is "STORY-STUB-001" **THEN**
    *   Return a `Promise` resolving to a mock `@JiraStoryData` object with predefined values.
3.  **ELSE IF** `jiraStoryId` is "STORY-STUB-002" **THEN**
    *   Return a `Promise` resolving to a different mock `@JiraStoryData` object.
4.  **ELSE**
    *   Return a `Promise` resolving to `null`.
**Side Effects**: None (for the stubbed version).
**💡 Implementation Hint**: In a future real implementation, this would involve making an authenticated HTTP GET request to the Jira API's `/issue/{jiraStoryId}` endpoint, parsing the JSON response, and mapping relevant fields to the `@JiraStoryData` structure.
**🚨 Constraint**: This capability is currently stubbed and MUST NOT perform actual external network requests.
**✅ Acceptance Criteria**:
-   When `getJiraStory` is called with "STORY-STUB-001", it MUST return a `Promise` that resolves to a non-null `@JiraStoryData` object containing the first set of mock data.
-   When `getJiraStory` is called with "STORY-STUB-002", it MUST return a `Promise` that resolves to a non-null `@JiraStoryData` object containing the second set of mock data.
-   When `getJiraStory` is called with any other ID, it MUST return a `Promise` that resolves to `null`.
**🧪 Test Scenarios**:
-   Test `getJiraStory("STORY-STUB-001")` returns expected mock data for the first stub.
-   Test `getJiraStory("STORY-STUB-002")` returns expected mock data for the second stub.
-   Test `getJiraStory("NON-EXISTENT-JIRA-ID")` returns `null`.

### 💡 Global Hints
-   The `config` object in the component's signature is a placeholder for future API configuration (e.g., base URL, authentication credentials). For the current stubbed version, these values are not actively used.
-   The stubbed data should be simple but representative, allowing dependent modules to simulate integration without actual Jira connectivity.
-   When implementing the actual integration, consider using a robust HTTP client library and proper error handling for API calls (e.g., network errors, authentication failures, rate limiting).
-   Mapping between Jira's potentially complex and customizable issue structure and the simpler `@EpicEntity` / `@StoryEntity` will be a key part of the future implementation. This might involve custom field lookups and status translations.

### 🚨 Global Constraints
-   This module MUST NOT make any actual external network requests in its current stubbed state.
-   The returned data types (`@JiraEpicData`, `@JiraStoryData`) are simplified representations and may need expansion and refinement when full Jira integration is implemented.
-   The stubbed data MUST be static and deterministic, returning the same mock data for the same input IDs consistently.