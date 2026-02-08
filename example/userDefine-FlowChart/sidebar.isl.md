# Project: Flow Chart Sidebar

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./sidebar.jsx

---

## Component: Sidebar

Contains the list of **TOOLs** that can be inserted into the SVG,
from here components are dragged **start drag**

### Role: Presentation

### 🔍 Appearance

- **Background Color**: #f3f4f6 (light gray)
- **Layout**: Width 30%, Height 100%.
- **Position**: Relative (part of the flex layout), NOT fixed.

- **TOOLs** height 80px, width: 100%

**🚨 Constraint**:
- the **TOOLs** Button MUST NOT be rotate
### ⚡ Capabilities

#### Start Drag

**Contract**: Starts dragging a **TOOL** towards the Main Content.
**Signature**:

- **Input**:
  - event: DragEvent
  - toolType: string
- **Output**: NONE (Side effect on dataTransfer)
  **Trigger**: DragStart on a list element.
  **Side Effects**:

- Sets data in `dataTransfer`.
- Sets `effectAllowed` to 'copy'.

**🚨 Constraint**:

- The list element MUST have `draggable="true"`.
- Key: `application/json`
- Value: JSON stringify of object `{ type: toolType }` (e.g., `{ "type": "Action" }`).

### 📦 Content

Vertical list of available **TOOLs**:

- Action => rectangular shape
- Condition => equilateral rhombus shape
