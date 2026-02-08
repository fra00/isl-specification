# Project: Ui

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./ui

> **Reference**: Defines the presentation components for JSON input and output.
> **Reference**: Depends on `JsonBeautifierService` for copy functionality in `JsonOutputArea`. See `./logic.isl.md`

## Component: JsonInputArea
### Role: Presentation
**Signature**:
  - `value: string` (The current content of the input area)
  - `onChange: (newValue: string) => void` (Callback function triggered when the input value changes)

### 🔍 Appearance
- A multi-line text input field (textarea).
- Label: "Raw JSON"
- Width: Occupies available space within its container.
- Height: Sufficient to display multiple lines of text.
### 📦 Content
- A `textarea` HTML element.
### ⚡ Capabilities
#### updateValue
**Contract**: Updates the internal value of the input area and notifies the parent component of the change.
**Signature**:
  - Input: `event: Event` (Browser input event containing the new value)
  - Output: `void`
**Flow**:
  1. Extract the new string value from the `event`.
  2. Pass the new string value to the `onChange` callback.
### 🚨 Constraints
- The input area MUST be editable by the user.
- The `onChange` callback MUST be triggered on every user input that changes the value.
### ✅ Acceptance Criteria
- User input in the textarea updates the `value` prop via `onChange`.
- The displayed text in the textarea always reflects the `value` prop.

## Component: JsonOutputArea
### Role: Presentation
**Signature**:
  - `value: string` (The content to display in the output area)
  - `onCopy: () => void` (Callback function triggered when the copy button is clicked)

### 🔍 Appearance
- A multi-line text display area (textarea, read-only).
- Label: "Beautified JSON"
- Width: Occupies available space within its container.
- Height: Sufficient to display multiple lines of text.
- A `Button` element positioned below or next to the text area.
  - Button Text: "Copy JSON"
### 📦 Content
- A `textarea` HTML element (read-only).
- A `Button` element.
### ⚡ Capabilities
#### triggerCopy
**Contract**: Notifies the parent component that the copy action has been requested.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. When the "Copy JSON" button is clicked, execute the `onCopy` callback.
### 🚨 Constraints
- The output area MUST NOT be editable by the user.
- The "Copy JSON" button MUST be visible and clickable.
### ✅ Acceptance Criteria
- The displayed text in the textarea always reflects the `value` prop.
- Clicking the "Copy JSON" button triggers the `onCopy` callback.

## Component: BeautifyButton
### Role: Presentation
**Signature**:
  - `onClick: () => void` (Callback function triggered when the button is clicked)

### 🔍 Appearance
- A standard button element.
- Button Text: "Beautify JSON"
### 📦 Content
- A `Button` HTML element.
### ⚡ Capabilities
#### triggerBeautify
**Contract**: Notifies the parent component that the beautify action has been requested.
**Signature**:
  - Input: None
  - Output: `void`
**Flow**:
  1. When the "Beautify JSON" button is clicked, execute the `onClick` callback.
### 🚨 Constraints
- The button MUST be visible and clickable.
### ✅ Acceptance Criteria
- Clicking the "Beautify JSON" button triggers the `onClick` callback.