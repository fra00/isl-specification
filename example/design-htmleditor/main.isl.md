# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: HtmlInputEditor component in `./html-input-editor.isl.md`
> **Reference**: HtmlRenderer component in `./html-renderer.isl.md`

## Component: Main
### Role: Presentation

### 🔍 Appearance
- A full-width container divided into two equal columns.
- The left column contains the `HtmlInputEditor`.
- The right column contains the `HtmlRenderer`.
- A vertical separator line or gap should be visible between the two columns.

### 📦 Content
- Contains two child components:
    - `HtmlInputEditor` (in the left column)
    - `HtmlRenderer` (in the right column)

### ⚡ Capabilities
#### initialize
- **Contract**: Sets up the initial state of the WYSIWYG editor.
- **Signature**: `() => void`
- **Side Effects**: Sets the initial `htmlContent` state.

### 🚨 Constraints
- MUST maintain a single source of truth for the HTML content being edited and rendered.
- MUST ensure that changes in the `HtmlInputEditor` are immediately reflected in the `HtmlRenderer`.

### ✅ Acceptance Criteria
- Upon initialization, both the `HtmlInputEditor` and `HtmlRenderer` display an empty string (or a default placeholder HTML).
- When a user types "Hello World" into the `HtmlInputEditor`, the `HtmlRenderer` immediately displays "Hello World" as rendered text.
- When the `HtmlInputEditor` content is updated to `<p>New paragraph</p>`, the `HtmlRenderer` updates to show a rendered paragraph with "New paragraph".

### 💡 Implementation Hints
- The `Main` component can manage the `htmlContent` state internally.
- The `htmlContent` state should be passed as a `value` prop to `HtmlInputEditor` and as an `htmlContent` prop to `HtmlRenderer`.
- The `onHtmlChange` event from `HtmlInputEditor` should trigger an update to the `Main` component's internal `htmlContent` state.