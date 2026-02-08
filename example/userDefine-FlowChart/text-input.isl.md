# Project: Flow Chart TextInput

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./text-input.jsx

---

## Component: TextInput

Input for text entry

### Role: Presentation

### 🔍 Appearance

- Input box: rounded corners (4px), light gray border (#d1d5db), padding 8px
- Placeholder text: dark gray (#6b7280)

### ⚡ Capabilities

#### input text

**Contract**: Allows user to enter text.
**Signature**:
  - **Input**:
    - event: ChangeEvent
  - **Output**: NONE (State update)
**Trigger**: Focus on input box and typing from keyboard.
**Side Effects**:

- Typed text appears in input box.

#### validate

**Contract**: Validates entered text based on specific rules.
**Signature**:
  - **Input**:
    - value: string
  - **Output**:
    - isValid: boolean
**Trigger**: `onBlur` event (when input loses focus).
**Side Effects**:

- If text is valid, shows a green border (#10b981).
- If text is invalid, shows a red border (#ef4444)
