# Project: Html Input Editor

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./html-input-editor

## Component: HtmlInputEditor
### Role: Presentation

### 🔍 Appearance
- A multi-line text input area.
- Occupies the left column of its parent container.
- Resizable vertically.
- Font should be monospaced for code editing.

### 📦 Content
- Contains a single `<textarea>` HTML element.

### ⚡ Capabilities
#### onHtmlChange
- **Contract**: Notifies parent component when the HTML content in the editor changes.
- **Signature**: `(newHtmlContent: string) => void`
- **Side Effects**: None. Emits an event.

### 🚨 Constraints
- MUST allow free-form text input.
- MUST display the provided `value` prop as its content.
- MUST trigger `onHtmlChange` whenever its content is modified by the user.

### ✅ Acceptance Criteria
- When a user types into the editor, the `onHtmlChange` capability is invoked with the updated content.
- The editor displays the initial HTML content provided to it.
- The editor's content can be fully cleared or replaced by user input.