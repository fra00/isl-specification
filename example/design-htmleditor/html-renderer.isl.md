# Project: Html Renderer

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./html-renderer

## Component: HtmlRenderer
### Role: Presentation

### 🔍 Appearance
- A display area for rendered HTML.
- Occupies the right column of its parent container.
- Should have a white background and standard browser rendering behavior.
- Should visually separate its content from the editor (e.g., with a border).

### 📦 Content
- Contains a single `<div>` or `<iframe>` element designed to render arbitrary HTML content.

### ⚡ Capabilities
#### renderHtml
- **Contract**: Displays the provided HTML string as rendered content.
- **Signature**: `(htmlContent: string) => void`
- **Side Effects**: Updates the visual output of the component.

### 🚨 Constraints
- MUST correctly parse and render valid HTML strings.
- MUST NOT execute JavaScript embedded within the `htmlContent` for security reasons (unless explicitly configured, but for this spec, assume sandboxed rendering or sanitization).
- MUST update its displayed content immediately when `renderHtml` is invoked with new `htmlContent`.

### ✅ Acceptance Criteria
- Given a valid HTML string (e.g., `<h1>Hello</h1>`), the component renders it as a visible heading.
- Given an empty string, the component displays nothing or a blank area.
- Given an HTML string with invalid syntax, the component attempts to render it gracefully according to browser standards, without crashing.