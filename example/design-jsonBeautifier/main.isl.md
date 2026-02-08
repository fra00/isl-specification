# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Orchestrates the UI and business logic for the JSON beautifier application.
> **Reference**: Uses `JsonBeautifierService` for logic. See `./logic.isl.md`
> **Reference**: Uses `JsonInputArea`, `JsonOutputArea`, and `BeautifyButton` for UI. See `./ui.isl.md`

## Component: Main
### Role: Presentation
**Signature**: None (This is the application's entry point)

### 🔍 Appearance
- A main container that holds all other components.
- Layout: Two primary columns.
  - Left Column: Contains the `JsonInputArea`.
  - Right Column: Contains the `JsonOutputArea`.
- A `BeautifyButton` positioned centrally between or below the two columns.
- Overall padding and spacing for readability.
### 📦 Content
- `JsonInputArea` component.
- `JsonOutputArea` component.
- `BeautifyButton` component.

### ⚡ Capabilities
#### initializeState
**Contract**: Sets the initial state for the raw and beautified JSON.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Initialize `rawJsonState: string` to an empty string.
  2. Initialize `beautifiedJsonState: string` to an empty string.
**Side Effects**:
  - Sets the initial internal state variables.

#### handleRawJsonChange
**Contract**: Updates the `rawJsonState` when the user types in the input area.
**Signature**:
  - Input: `newRawJson: string` (The updated raw JSON string from `JsonInputArea`)
  - Output: `void`
**Flow**:
  1. Update `rawJsonState` with `newRawJson`.
**Side Effects**:
  - `rawJsonState` is updated.

#### handleBeautifyRequest
**Contract**: Processes the `rawJsonState` to produce a beautified version and updates `beautifiedJsonState`.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Request `JsonBeautifierService.beautifyJson` with `rawJsonState`.
  2. Update `beautifiedJsonState` with the result from `JsonBeautifierService.beautifyJson`.
**Side Effects**:
  - `beautifiedJsonState` is updated.

#### handleCopyRequest
**Contract**: Copies the current `beautifiedJsonState` to the user's clipboard.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. Request `JsonBeautifierService.copyToClipboard` with `beautifiedJsonState`.
**Side Effects**:
  - The user's clipboard content is updated.

### 🚨 Constraints
- The `JsonInputArea` MUST display `rawJsonState`.
- The `JsonOutputArea` MUST display `beautifiedJsonState`.
- The `JsonInputArea`'s `onChange` callback MUST be connected to `handleRawJsonChange`.
- The `BeautifyButton`'s `onClick` callback MUST be connected to `handleBeautifyRequest`.
- The `JsonOutputArea`'s `onCopy` callback MUST be connected to `handleCopyRequest`.
### ✅ Acceptance Criteria
- When the application loads, both input and output areas are empty.
- Typing in the `JsonInputArea` updates its content.
- Clicking "Beautify JSON" formats the content of `JsonInputArea` and displays it in `JsonOutputArea`.
- If the content in `JsonInputArea` is invalid JSON, clicking "Beautify JSON" displays an error message in `JsonOutputArea`.
- Clicking "Copy JSON" copies the content of `JsonOutputArea` to the clipboard.