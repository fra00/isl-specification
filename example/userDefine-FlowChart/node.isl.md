# Project: Flow Chart Node

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./node.jsx

---

## Component: Node

### Role: Presentation

### 🔍 Appearance

- Fill color: #e0e7ff (light lavender)
- Stroke: #94a3b8 (1px width)
- Text alignment: Centered (use SVG text attributes like `text-anchor="middle"`).
- Z-index hierarchy **Node** > **Connection Handles** > **resize handle** > **Delete Icon Button** (from lowest to highest)
  Each dropped **TOOL** is a **Node**:

### 📦 Content

- Root element: `<g>` (Group).
- Shape:
  - If `type` (case-insensitive) is 'action': Render a `<rect>`.
  - If `type` (case-insensitive) is 'condition': Render a Rhombus using `<polygon>` or `<path>`.
- Label: Render a `<text>` element centered inside the shape.
  **Constraint**: Render shapes using local coordinates (relative to 0,0) inside the group. The group itself is translated to the node's (x,y) position.

### ⚡ Capabilities

#### Interaction Handles

**Contract**: draws handles for dragging **Connection** and handles for Node resizing
**Signature**:

- **Input**: NONE
- **Output**: NONE (Visual only)
  **Side Effects**:

- Draws a square for **Node** resize **resize handle** positioned bottom-right of **Node**.
- Draws 4 **Connection Handles** from which to start or end a **Connection** in the middle of each side of the **Node** (top, bottom, left, right).

**Cleanup**

- Clears resize handler
- Clears **Connection** handlers

#### MouseOver **Node**

**Contract**: MouseOver of **Node** displays **Interaction Handles** (**Connection Handles**, **resize handle**) and **Delete Icon Button**.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (Visual only)
  **Trigger**: MouseOver on **Node**.
  **Side Effects**:

- Shows **Interaction Handles** (**Connection Handles**, **resize handle**) and **Delete Icon Button**.

**Cleanup**

- Removes **Interaction Handles** (**Connection Handles**, **resize handle**) and **Delete Icon Button**.

#### Select **Node**

**Contract**: Notify selection of **Node**.
**Signature**:

- **Input**:
  - id: string
- **Output**: - event: onSelect(id, 'node')
  **Trigger**: Click on **Node**.
  **Side Effects**:

- Emits `onSelect` event.
- Visuals (border, controls) are controlled by `isSelected` prop.

**Cleanup**

- None (State is managed by parent).

#### Start Connection Drag

**Contract**: Notify start of connection creation.
**Signature**:

- **Input**:
  - anchorType: string
  - x: number
  - y: number
- **Output**: - event: onAnchorDragStart(id, anchorType, x, y)
  **Trigger**: MouseDown on an **Connection Handles**.
  **Side Effects**:

- Emits `onAnchorDragStart(anchorType, x, y)`.

#### move

**Contract**: Moving **Node** inside main area.
**Signature**:

- **Input**:
  - newX: number
  - newY: number
- **Output**: - event: onDrag(id, newX, newY)
  **Trigger**: MouseDown on **Node**.
  **Side Effects**:

- Emits `onDrag` event with new coordinates.
- If **Node** is selected, cursor changes to grabbing.

#### resize

**Contract**: Resizing **Node** via bounding box.
**Signature**:

- **Input**:
  - width: number
  - height: number
- **Output**: - event: onResize(id, width, height)
  **Trigger**: Drag of **resize handles**.
  **Side Effects**:

- Emits `onResize` event with new dimensions.

#### edit **label** Node

**Contract**: Edit **Node** label content.
**Signature**:

- **Input**:
  - newLabel: string
- **Output**:
  - event: onLabelChange(id, newLabel)
  - event: onDeselect(id)
    **Trigger**: Double click on **Node**.
    **Side Effects**:

- **Node** label changes to an inline textbox
- The textbox label is pre-filled with current text.
  **Flow**:

1. Replaces **Node** label with an inline textbox.
2. **Emit `onDeselect`** to clear selection (prevents global delete actions during editing).
3. The textbox is pre-filled with current text.
4. wait a small interval to avoid conflicts with Node selection event.
5. Apply Focus to textbox.
6. User edits text.
7. Pressing `Enter` emits `onLabelChange` with new text.
8. Pressing `Esc` cancels changes and restores original text.
9. On `blur` (click outside) emits `onLabelChange` with new text.

**💡 Implementation Hint**:

- receives MouseDown
- initialize a timer to detect double click (e.g. 300ms)
- if a second click is detected within the established time, activate label edit mode
- create an HTML textbox positioned exactly over the **Node** label
- handle `keydown` events for `Enter` and `Esc`
- **CRITICAL**: Stop propagation of `keydown` events (specifically `Delete` and `Backspace`) on the input element to prevent triggering global deletion handlers.
- add logs to display flow steps in console
- Use `<foreignObject>` to embed the HTML input within the SVG.

#### delete

**Contract**: Request deletion of **Node**.
**Signature**:

- **Input**:
  - id: string
- **Output**: - event: onDelete(id, 'node')
  **Trigger**:

- Pressing `Del` key when **Node** is selected.
- If Node Selected display delete **Icon Button Delete** positioned in top right corner of **Node**.

**Side Effects**:

- Emits `onDelete` event.

**🚨 Constraint**:

- **CRITICAL**: The delete button MUST handle `onMouseDown` and call `e.stopPropagation()` to prevent the Node's drag logic from starting.

### 🚨 Global Constraint

- The Node component MUST return a `<g>` element (SVG Group) as the root.
- Use native SVG elements (`<rect>`, `<path>`, `<text>`, `<polygon>`) for rendering shapes and labels. Do NOT use `<div>` or other HTML elements for the node structure.
- For the **edit label** capability (text input), use `<foreignObject>` to embed an HTML `<input>` element.
