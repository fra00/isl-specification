# Project: Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./logic

> **Reference**: Defines core JSON processing and clipboard operations.

## Component: JsonBeautifierService
### Role: Business Logic
**Signature**: None

### ⚡ Capabilities
#### beautifyJson
**Contract**: Parses a raw JSON string and returns a formatted, human-readable JSON string with a standard indentation.
**Signature**:
  - Input: `rawJson: string` (The unformatted JSON string)
  - Output: `beautifiedJson: string` (The formatted JSON string)
**Flow**:
  1. TRY:
     1. Parse `rawJson` into a JavaScript object.
     2. Stringify the object with an indentation of 2 spaces.
     3. Return the resulting string as `beautifiedJson`.
  2. CATCH (parsing error):
     1. Return an error message string indicating invalid JSON.
**Side Effects**: None

#### copyToClipboard
**Contract**: Copies the provided text string to the user's clipboard.
**Signature**:
  - Input: `text: string` (The text to be copied)
  - Output: `void`
**Flow**:
  1. Attempt to write `text` to the system clipboard.
**Side Effects**:
  - The user's clipboard content is updated with `text`.
### 🚨 Constraints
- The `beautifyJson` capability MUST use 2 spaces for indentation.
- The `copyToClipboard` capability MUST handle potential browser security restrictions or user permissions gracefully, without crashing the application.
### ✅ Acceptance Criteria
- When `beautifyJson` receives valid JSON, it returns a string with 2-space indentation.
- When `beautifyJson` receives invalid JSON, it returns a descriptive error message string.
- When `copyToClipboard` is invoked with a string, that string becomes available in the system clipboard.