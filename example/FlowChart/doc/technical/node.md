# Technical Reference Manual: Node Component

## 1. Component Overview

### Role and Responsibilities

The `Node` component serves as the **Presentation** layer for individual elements within a flow chart. Its primary role is to visually represent a node, handle user interactions, and emit events to a parent component or state manager for data manipulation.

**Key Responsibilities:**

*   **Visual Representation**: Renders different shapes (rectangle for 'action', rhombus for 'condition') and a centered label based on its `type` and `label` props.
*   **Interaction Management**: Displays and manages interactive elements such as connection handles, resize handles, and a delete button based on user mouse interactions (mouseover, selection).
*   **Event Emission**: Notifies parent components of user actions through specific events:
    *   Node selection (`onSelect`, `onDeselect`).
    *   Node movement (`onDrag`).
    *   Node resizing (`onResize`).
    *   Label content changes (`onLabelChange`).
    *   Initiation of connection dragging (`onAnchorDragStart`).
    *   Node deletion requests (`onDelete`).
*   **Coordinate Management**: Renders its internal shapes using local coordinates (relative to 0,0) and relies on its parent to translate the entire group to its absolute (x,y) position.
*   **Input Handling**: Provides an inline editing mechanism for its label using an embedded HTML input.

## 2. Public Capabilities and Methods

The `Node` component exposes the following interactive capabilities and their associated event outputs:

### 2.1. Interaction Handles

*   **Contract**: Draws visual handles for initiating connections and resizing the node.
*   **Input**: None
*   **Output**: None (Visual only)
*   **Side Effects**:
    *   Draws a square `resize handle` positioned at the bottom-right of the Node.
    *   Draws four `Connection Handles` (top, bottom, left, right) in the middle of each side of the Node.
*   **Cleanup**: Clears resize and connection handlers when not needed (e.g., on mouse out).

### 2.2. MouseOver Node

*   **Contract**: Displays interactive elements when the mouse cursor hovers over the Node.
*   **Input**: `event: MouseEvent`
*   **Output**: None (Visual only)
*   **Trigger**: MouseOver on the Node.
*   **Side Effects**: Shows `Interaction Handles` (Connection Handles, resize handle) and the `Delete Icon Button`.
*   **Cleanup**: Removes `Interaction Handles` and `Delete Icon Button` when the mouse leaves the Node area.

### 2.3. Select Node

*   **Contract**: Notifies the application when the Node is selected.
*   **Input**: `id: string` (The unique identifier of the Node)
*   **Output**: `event: onSelect(id, 'node')`
*   **Trigger**: Click on the Node.
*   **Side Effects**:
    *   Emits an `onSelect` event with the Node's ID and type.
    *   Visual feedback (e.g., border, controls) is controlled by the `isSelected` prop.
*   **Cleanup**: None (Selection state is managed by a parent component).

### 2.4. Start Connection Drag

*   **Contract**: Notifies the application when a user begins dragging from a connection anchor to create a new connection.
*   **Input**:
    *   `anchorType: string` (e.g., 'top', 'bottom', 'left', 'right')
    *   `x: number` (X-coordinate of the anchor)
    *   `y: number` (Y-coordinate of the anchor)
*   **Output**: `event: onAnchorDragStart(id, anchorType, x, y)`
*   **Trigger**: MouseDown on one of the `Connection Handles`.
*   **Side Effects**: Emits an `onAnchorDragStart` event with the Node's ID, anchor type, and starting coordinates.

### 2.5. Move Node

*   **Contract**: Handles the dragging of the Node within the main canvas area.
*   **Input**:
    *   `newX: number` (New X-coordinate for the Node)
    *   `newY: number` (New Y-coordinate for the Node)
*   **Output**: `event: onDrag(id, newX, newY)`
*   **Trigger**: MouseDown on the Node (followed by a drag gesture).
*   **Side Effects**:
    *   Emits an `onDrag` event with the Node's ID and its new coordinates.
    *   If the Node is selected, the cursor changes to a "grabbing" state.

### 2.6. Resize Node

*   **Contract**: Allows resizing the Node via its bounding box handles.
*   **Input**:
    *   `width: number` (New width of the Node)
    *   `height: number` (New height of the Node)
*   **Output**: `event: onResize(id, width, height)`
*   **Trigger**: Drag of the `resize handles`.
*   **Side Effects**: Emits an `onResize` event with the Node's ID and its new dimensions.

### 2.7. Edit Node Label

*   **Contract**: Provides an inline editing mechanism for the Node's label content.
*   **Input**: `newLabel: string` (The updated text for the label)
*   **Output**:
    *   `event: onLabelChange(id, newLabel)`
    *   `event: onDeselect(id)`
*   **Trigger**: Double click on the Node.
*   **Side Effects**:
    *   The Node's static label is replaced with an inline HTML textbox.
    *   The textbox is pre-filled with the current label text.
*   **Flow**:
    1.  Upon double-click, the Node label is replaced with an inline textbox.
    2.  An `onDeselect` event is emitted to clear any global selection, preventing conflicts during editing.
    3.  A short delay is introduced to prevent conflicts with the initial Node selection event.
    4.  The textbox receives focus, allowing the user to edit.
    5.  Pressing `Enter` or clicking outside (blur) triggers an `onLabelChange` event with the `newLabel` and closes the textbox.
    6.  Pressing `Esc` cancels the edit, restores the original label, and closes the textbox without emitting `onLabelChange`.
*   **Implementation Hint**: Uses `<foreignObject>` to embed an HTML `<input>` element within the SVG.

### 2.8. Delete Node

*   **Contract**: Requests the deletion of the Node.
*   **Input**: `id: string` (The unique identifier of the Node)
*   **Output**: `event: onDelete(id, 'node')`
*   **Trigger**:
    *   Pressing the `Del` key when the Node is selected.
    *   Clicking the `Delete Icon Button` (displayed when the Node is selected, positioned top-right).
*   **Side Effects**: Emits an `onDelete` event with the Node's ID and type.

## 3. Real Implementation Signature

The `Node` component is exported as a default React component from `./node.jsx`.

```json
{
  "exports": [
    {
      "type": "default",
      "name": "Node",
      "props": [
        "id",
        "x",
        "y",
        "width",
        "height",
        "type",
        "label",
        "isSelected",
        "onSelect",
        "onDeselect",
        "onDrag",
        "onResize",
        "onLabelChange",
        "onDelete",
        "onAnchorDragStart"
      ]
    }
  ]
}
```

### Exported Component and Props

*   **Component Name**: `Node` (default export)
*   **Props**:
    *   `id`: `string` - Unique identifier for the node.
    *   `x`: `number` - X-coordinate of the node's position.
    *   `y`: `number` - Y-coordinate of the node's position.
    *   `width`: `number` - Width of the node.
    *   `height`: `number` - Height of the node.
    *   `type`: `string` - Defines the node's shape ('action' for rect, 'condition' for rhombus).
    *   `label`: `string` - Text content displayed inside the node.
    *   `isSelected`: `boolean` - Indicates if the node is currently selected, affecting its visual state.
    *   `onSelect`: `function(id: string, type: string)` - Callback triggered when the node is selected.
    *   `onDeselect`: `function(id: string)` - Callback triggered when the node is deselected (e.g., during label editing).
    *   `onDrag`: `function(id: string, newX: number, newY: number)` - Callback triggered when the node is dragged.
    *   `onResize`: `function(id: string, width: number, height: number)` - Callback triggered when the node is resized.
    *   `onLabelChange`: `function(id: string, newLabel: string)` - Callback triggered when the node's label is edited.
    *   `onDelete`: `function(id: string, type: string)` - Callback triggered when a request to delete the node is made.
    *   `onAnchorDragStart`: `function(id: string, anchorType: string, x: number, y: number)` - Callback triggered when a connection drag starts from an anchor.

## 4. Critical Constraints

The following constraints are critical for the correct functioning and integration of the `Node` component:

*   **Content - Local Coordinates**: Shapes (rectangle, rhombus) and the label **MUST** be rendered using local coordinates (relative to 0,0) within the SVG group. The parent component is responsible for translating the entire `<g>` element to the node's absolute `(x,y)` position.
*   **Edit Label - Event Propagation**: When editing the label, the embedded HTML input element **MUST** stop propagation of `keydown` events (specifically `Delete` and `Backspace`) to prevent them from triggering global deletion handlers while the user is typing.
*   **Delete Button - Event Propagation**: The `Delete Icon Button` **MUST** handle its `onMouseDown` event and call `e.stopPropagation()` to prevent the Node's drag logic from inadvertently starting when the button is clicked.
*   **Global - Root Element**: The `Node` component **MUST** return an SVG `<g>` element (Group) as its root element.
*   **Global - Native SVG Elements**: For rendering shapes and labels, the component **MUST** use native SVG elements (`<rect>`, `<path>`, `<text>`, `<polygon>`). It **MUST NOT** use `<div>` or other HTML elements for the primary node structure.
*   **Global - Label Editing Embedding**: For the `edit label` capability, the component **MUST** use `<foreignObject>` to embed an HTML `<input>` element within the SVG context.

## 5. Component Dependencies and Interactions

The `Node` component interacts with or implies the existence of several other components and systems:

*   **Connection Handles**: Visual elements drawn by the `Node` to initiate `Connection` creation.
*   **Resize Handle**: A visual element drawn by the `Node` to allow resizing.
*   **Delete Icon Button**: A visual element drawn by the `Node` to trigger deletion.
*   **Connection Component/System**: The `Node` emits `onAnchorDragStart` events, indicating it's the source for a potential `Connection`. It also implies that `Connections` might terminate at its `Connection Handles`.
*   **Tool Component/System**: The ISL states "Each dropped **TOOL** is a **Node**," suggesting a `Tool` component or system is responsible for creating and placing `Node` instances.
*   **Parent Component / State Manager**: The `Node` component is highly interactive and emits numerous events (`onSelect`, `onDrag`, `onResize`, `onLabelChange`, `onDelete`, `onAnchorDragStart`). These events imply a parent component or a global state management system that consumes these events to update the application's data model and re-render the flow chart.
*   **SVG Rendering Context**: The component relies on being rendered within an SVG context, as it exclusively uses SVG elements for its structure and appearance.