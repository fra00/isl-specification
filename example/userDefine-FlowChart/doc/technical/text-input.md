# Component Reference: TextInput

## 1. Overview

The `TextInput` component is a fundamental UI element designed for user text entry within the Flow Chart project. It serves a **Presentation** role, focusing on capturing user input and providing immediate visual feedback based on validation.

## 2. Role and Responsibilities

The primary role of the `TextInput` component is to facilitate user text input. Its responsibilities include:
*   Providing an interactive input field for text entry.
*   Displaying typed text.
*   Triggering validation based on user interaction (`onBlur`).
*   Providing clear visual feedback (border color) indicating the validity of the entered text.

## 3. Public Capabilities/Methods

The `TextInput` component exposes the following public capabilities:

### 3.1. `input text`

*   **Contract**: Allows the user to enter text into the input field.
*   **Signature**:
    *   **Input**: `event: ChangeEvent` (standard DOM change event)
    *   **Output**: `NONE` (State update occurs internally)
*   **Trigger**: Activated when the input box gains focus and the user types characters from the keyboard.
*   **Side Effects**: The characters typed by the user are displayed within the input box.

### 3.2. `validate`

*   **Contract**: Evaluates the entered text against predefined validation rules.
*   **Signature**:
    *   **Input**: `value: string` (The text string to be validated)
    *   **Output**: `isValid: boolean` (Returns `true` if the text is valid, `false` otherwise)
*   **Trigger**: Invoked when the input field loses focus (`onBlur` event).
*   **Side Effects**:
    *   If the entered text is valid, the input box border changes to a green color (`#10b981`).
    *   If the entered text is invalid, the input box border changes to a red color (`#ef4444`).

## 4. Real Implementation Signature

Based on the provided `Real Implementation Signature`, the component is exported as a default React component.

```json
{
  "exports": [
    {
      "type": "default",
      "name": "TextInput",
      "props": []
    }
  ]
}
```

**Details**:
*   The component is exported as the `default` export from its module.
*   Its name in the consuming context will typically be `TextInput` (e.g., `import TextInput from './text-input.jsx';`).
*   The `props` array is empty, indicating that no explicit public props are documented in this signature. This implies that any configuration or data flow might be handled internally, via context, or that props are implicitly expected (e.g., standard HTML input props) but not explicitly listed in this ISL signature.

## 5. Critical Constraints

The following critical constraints are defined for the `TextInput` component, primarily related to its appearance and behavior:

### 5.1. Appearance Constraints

*   **Input Box Styling**:
    *   Rounded corners with a radius of `4px`.
    *   Default border color: light gray (`#d1d5db`).
    *   Internal padding: `8px`.
*   **Placeholder Text Styling**:
    *   Color: dark gray (`#6b7280`).

### 5.2. Behavioral Constraints

*   **Validation Feedback**:
    *   Upon successful validation, the input box border *must* turn green (`#10b981`).
    *   Upon failed validation, the input box border *must* turn red (`#ef4444`).

## 6. Dependencies

Based on the provided ISL specification, there are no explicit references to other components, indicating that `TextInput` is designed to be a self-contained UI element without direct component-level dependencies defined within this document.