# Project: Flow Chart Connection

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./connection.jsx

---

## Component: Connection

Pure presentation component drawing a SINGLE line between two coordinates.

### Role: Presentation

### 🔍 Appearance

**Connection** is represented as a curved line (Bezier) between two points.

- **Arrowhead**: The line MUST have an arrowhead at the end (target side). Use `marker-end="url(#arrowhead)"`.
- **Delete Button**: When selected, a delete icon button (e.g. 'X') MUST be displayed near the midpoint of the curve.
- **Label**: Text displayed at the midpoint of the curve (if present).

### ⚡ Capabilities

#### Render Line

**Contract**: Draws the SVG path.
**Signature**:

- **Input**:
  - id: string
  - startX: number
  - startY: number
  - endX: number
  - endY: number
  - isSelected: boolean
  - label: string

#### Select **Connection**

**Contract**: Notify selection of **Connection**.
**Signature**:

- **Input**:
  - id: string
- **Output**: - event: onSelect(id, 'connection')
  **Trigger**: Click on **Connection** line.
  **Side Effects**:

- Emits `onSelect` event.
- Visual style (thickness, color) is controlled by `isSelected` prop.

**Cleanup**

- None (State is managed by parent).

**💡 Implementation Hint**:

- add logs to display in console :
- selected line
- Use a timer (e.g. 200-300ms) to distinguish between single click (Select) and double click (Edit Label).

#### Edit Label

**Contract**: Edit connection label.
**Signature**:

- **Input**:
  - newLabel: string
- **Output**: - event: onLabelChange(id, newLabel)
  **Trigger**: Double click on the connection line or label.
  **Side Effects**:
- Displays an input box at the midpoint.
  **Flow**:

1. Detect double click (using timer to avoid conflict with Select).
2. Show input field centered at midpoint (using foreignObject).
3. On Enter/Blur:
   - Emit `onLabelChange`.
   - **Exit edit mode** (hide input field and show text label).
4. On Esc:
   - Cancel editing.
   - **Exit edit mode**.
     **💡 Implementation Hint**:

- Use `<foreignObject>` to embed the HTML input within the SVG.
- Stop propagation on the input events to prevent dragging/selection of canvas.

#### Delete connection

**Contract**: Request deletion of **Connection**.
**Signature**:

- **Input**:
  - id: string
- **Output**: - event: onDelete(id, 'connection')
  **Trigger**:

- Pressing `Del` key when **Connection** is selected.
- Click on the delete icon button.

**Side Effects**:

- Emits `onDelete` event.

**💡 Implementation Hint**:

- **CRITICAL**: The delete button MUST handle `onMouseDown` and call `e.stopPropagation()` to prevent the main canvas from catching the event and deselecting the connection before the click is registered.
