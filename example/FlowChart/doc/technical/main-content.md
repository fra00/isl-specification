# Technical Reference Manual: Main Content Component

## 1. Component Overview

*   **Component Name**: Main Content
*   **Version**: 1.0.0
*   **ISL Version**: 1.6.1
*   **Implementation**: `./main-content.jsx`

### 1.1 Role and Responsibilities

The `Main Content` component serves as the primary canvas for the Flow Chart application. Its core role is **Presentation**, providing the interactive area where users can build and manipulate flowcharts.

Its key responsibilities include:

*   **Canvas Management**: Providing a visual background with alignment aids and managing the overall SVG structure, including definitions and a transformable root group.
*   **Node and Connection Orchestration**: Rendering `Nodes` and `Connections`, handling their lifecycle (creation, selection, deselection, deletion, updates).
*   **Drag-and-Drop Handling**: Facilitating the dropping of `TOOLs` from the `TOOLBarMain` to create new `Nodes` on the canvas.
*   **Interactive Viewport**: Implementing panning and zoom functionalities to navigate the flowchart canvas.
*   **Selection Management**: Supporting both single-item selection (Nodes, Connections) and group selection of Nodes, including movement of selected groups.
*   **Connection Flow Management**: Guiding the user through the process of creating connections between Nodes, including temporary line drawing and target validation.
*   **Data Integration**: Handling the loading of flowchart data from JSON structures.

### 1.2 Appearance

*   **Background**: White (`#ffffff`).
*   **Grid**: Features light background rows and columns to assist with `TOOL` (Node) alignment.
*   **SVG Definitions**: Includes `<defs>` with an arrowhead marker (id: "arrowhead", `orient="auto"`) for connection arrows.
*   **Root Group**: A `<g>` element (referenced as `transformGroupRef`) that encapsulates all `Nodes`, `Connections`, and the `Temporary Connection Line`. This group is the sole target for pan and zoom transformations.

## 2. Public Capabilities

The `Main Content` component exposes the following public capabilities:

### 2.1 Allow Drop

*   **Contract**: Enables the component to accept dropped items.
*   **Signature**:
    *   **Input**: `event: DragEvent`
    *   **Output**: `NONE` (Side effect)
*   **Trigger**: `dragOver` event on the container.
*   **Side Effects**:
    *   Calls `event.preventDefault()` to allow dropping.
    *   Sets `event.dataTransfer.dropEffect` to 'copy'.

### 2.2 drop

*   **Contract**: Converts a dropped `TOOL` into a `Node` and renders it on the canvas.
*   **Signature**:
    *   **Input**: `event: DragEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: Drop of a `Node` (represented as a `TOOL`) on the `Main Content` area.
*   **Side Effects**:
    *   Draws the new `Node` on the `Main Content`.

### 2.3 Manage Selection

*   **Contract**: Handles exclusive selection between `Nodes` and `Connections`.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `type: 'node' | 'connection'`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onSelect` event from a `Node` or `Connection`.
*   **Side Effects**:
    *   Updates `selectedId` state.
    *   Ensures only one item is selected at a time.

### 2.4 Handle Deselect

*   **Contract**: Deselects a specific item or clears the entire selection.
*   **Signature**:
    *   **Input**: `id: string` (optional)
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onDeselect` event from a `Node` or a general deselect action.
*   **Side Effects**:
    *   Clears the current selection.

### 2.5 Create Connection Flow

*   **Contract**: Orchestrates the process of creating connections between `Nodes`.
*   **Signature**:
    *   **Input**:
        *   `nodeId: string`
        *   `anchorType: string`
        *   `x: number`
        *   `y: number`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onAnchorDragStart` event from a `Node`.
*   **Flow**:
    1.  Stores the source node ID and anchor type.
    2.  Tracks mouse movement to draw a temporary preview line.
    3.  On `MouseUp`, checks if the mouse is over a valid target `Node` Anchor.
        *   **Logic**: Calculates the distance from the mouse cursor to ALL anchors of ALL nodes.
        *   If the distance is less than a predefined threshold (e.g., 20px), the anchor is accepted as a target.
        *   Does NOT rely solely on the `Node` bounding box for target detection.
    4.  If a valid target is found, a new `Connection` entity is created.
*   **Side Effects**:
    *   Adds a new connection to the application state.

### 2.6 Calculate Connection Coordinates

*   **Contract**: Computes the precise start and end coordinates for each connection based on node positions and anchor types.
*   **Signature**:
    *   **Input**:
        *   `nodes: Node[]`
        *   `connections: Connection[]`
    *   **Output**: `renderData: ConnectionRenderData[]`
*   **Trigger**: Render cycle.
*   **Logic**:
    *   For each connection, it looks up the source and target `Node` positions (`x`, `y`, `w`, `h`).
    *   Calculates exact anchor coordinates (e.g., for a 'right' anchor: `x + w`, `y + h/2`).
    *   Passes these calculated coordinates to the `Connection` component for rendering.

### 2.7 Handle Delete Request

*   **Contract**: Manages deletion requests for `Nodes` or `Connections`.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `type: 'node' | 'connection'`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onDelete` event from a `Node` or `Connection`.
*   **Side Effects**:
    *   If a `Node` is deleted: Removes the `Node` and all `Connections` attached to it.
    *   If a `Connection` is deleted: Removes only that `Connection`.
    *   Clears the selection if the deleted item was currently selected.

### 2.8 Handle Node Drag

*   **Contract**: Updates the position of a `Node` on the canvas.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `x: number`
        *   `y: number`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onDrag` event from a `Node`.
*   **Side Effects**:
    *   Updates the `x` and `y` coordinates of the specified `Node`.

### 2.9 Handle Node Resize

*   **Contract**: Updates the dimensions of a `Node`.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `width: number`
        *   `height: number`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onResize` event from a `Node`.
*   **Side Effects**:
    *   Updates the `width` and `height` of the specified `Node`.

### 2.10 Handle Node Label Change

*   **Contract**: Updates the label text of a `Node`.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `label: string`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onLabelChange` event from a `Node`.
*   **Side Effects**:
    *   Updates the `label` of the specified `Node`.

### 2.11 Handle Connection Label Change

*   **Contract**: Updates the label text of a `Connection`.
*   **Signature**:
    *   **Input**:
        *   `id: string`
        *   `label: string`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onLabelChange` event from a `Connection`.
*   **Side Effects**:
    *   Updates the `label` of the specified `Connection`.

### 2.12 Handle Load Json

*   **Contract**: Replaces the current flowchart data with new data loaded from a JSON object.
*   **Signature**:
    *   **Input**: `data: { nodes: Node[], connections: Connection[] }`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `onLoadJson` event from `TOOLBarMain`.
*   **Side Effects**:
    *   Replaces the current collection of nodes and connections with the provided loaded data.

### 2.13 Panning

*   **Contract**: Allows the user to move the view of the canvas without altering the positions of the components within it.
*   **Signature**:
    *   **Input**: `event: MouseEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: Pressing the `Space` key + `MouseDown` (or middle mouse button) and dragging.
*   **Side Effects**:
    *   The mouse cursor changes to a grabbing icon.
    *   Updates the pan (translate) transform of the `Root Group`.

### 2.14 Zoom

*   **Contract**: Increases or decreases the magnification of the canvas view.
*   **Signature**:
    *   **Input**: `event: WheelEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: Mouse Wheel rotation.
*   **Side Effects**:
    *   Updates the scale (zoom) transform of the `Root Group`.
    *   A "Reset View" button should be available to return to zoom 1.0 and offset 0,0.

### 2.15 start group selection

*   **Contract**: Initiates the process of selecting multiple components using a selection rectangle.
*   **Signature**:
    *   **Input**: `event: MouseEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `MouseDown` and start drag on an empty area of the `Main Content`.
*   **Side Effects**:
    *   Draws a selection rectangle (dashed line) on the canvas during the drag operation.

### 2.16 end group selection

*   **Contract**: Finalizes the multiple component selection based on the drawn rectangle.
*   **Signature**:
    *   **Input**: `event: MouseEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `MouseUp` on an empty area of `Main Content` after a `start group selection` has occurred.
*   **Side Effects**:
    *   All `Nodes` completely enclosed within the selection rectangle are marked as selected.
    *   Selected `Nodes` display a blue border (`#3b82f6`) 2px thick.
    *   The selection rectangle (dashed line) is removed.

### 2.17 deselect group selection

*   **Contract**: Clears all currently selected components.
*   **Signature**:
    *   **Input**: `event: MouseEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `MouseDown` on an empty area of `Main Content` after an `end group selection` has occurred.
*   **Side Effects**:
    *   Deselects all currently selected components.

### 2.18 move group selection

*   **Contract**: Moves a group of selected `Nodes` simultaneously.
*   **Signature**:
    *   **Input**: `event: MouseEvent`
    *   **Output**: `NONE` (State update)
*   **Trigger**: `MouseDown` and start drag on one of the already selected `Nodes`.
*   **Side Effects**:
    *   All selected `Nodes` move together based on the mouse movement.

## 3. Real Implementation Signature

The actual exported component from `./main-content.jsx` is:

```json
{
  "exports": [
    {
      "type": "default",
      "name": "MainContent",
      "props": []
    }
  ]
}
```

This indicates that the `MainContent` component is exported as the default export and does not accept any external props directly. All interactions and state management are handled internally or through callbacks to parent components (not explicitly defined in this ISL for the `MainContent` component itself, but implied by the capabilities).

## 4. Critical Constraints

The following critical constraints must be adhered to for correct functionality:

*   **Drop Operation**:
    *   MUST read data from `dataTransfer` using the key `application/json`.
    *   MUST parse the JSON string, expecting the structure `{ type: string }`.
    *   **Data Normalization**: The extracted `type` MUST be converted to lowercase (e.g., 'Action' -> 'action') before creating the `Node`.
    *   **Coordinate Mapping Strategy**: MUST use `CoordinateUtils.toWorldCoordinates` to convert drop event coordinates. This utility requires the root SVG element and the Transform Group (`<g>`) as arguments.
    *   **Transform Implementation**: Pan (`translate`) and Zoom (`scale`) transforms MUST ONLY be applied to the **Root Group** (`<g>`). The root `<svg>` element MUST NOT have any transform style/attribute.
    *   **Layout Awareness**: The `<svg>` element should remain static with `width` and `height` set to `100%`.

*   **Create Connection Flow**:
    *   The target `Node` for a connection MUST be different from the source `Node`.
    *   The temporary connection line MUST be rendered inside the **Root Group** (`<g>`) to ensure it shares the same coordinate system (Pan/Zoom) as the `Nodes`.

*   **Zoom Functionality**:
    *   Zoom MUST be centered on the current mouse cursor position (Zoom-to-Cursor).
    *   **Math Formula (Strict)**:
        1.  Get the SVG container's bounding rectangle: `rect = svgRef.current.getBoundingClientRect()`.
        2.  Calculate the mouse position relative to the SVG container: `screenX = event.clientX - rect.left`, `screenY = event.clientY - rect.top`.
        3.  Get the mouse position in world space using the utility: `worldPoint = CoordinateUtils.toWorldCoordinates(event.clientX, event.clientY)`.
        4.  Calculate the new pan: `newPanX = screenX - worldPoint.x * newZoom`, `newPanY = screenY - worldPoint.y * newZoom`.
    *   **Transform Target**: Apply the transform to the **Root Group** (`<g>`), NEVER to the `<svg>` element.

*   **Move Group Selection**:
    *   Selected `Nodes` MUST be moved while maintaining their original offset relative to each other.

## 5. Dependencies

The `Main Content` component has the following dependencies, based on the `Reference` declarations:

*   **TOOLBarMain**: Defined in `toolbar.isl.md`. (Used for `onLoadJson` trigger).
*   **Sidebar**: Defined in `sidebar.isl.md`. (Implicitly, as `TOOLs` are dragged from here).
*   **Nodo** (Node): Defined in `node.isl.md`. (Manages creation, selection, drag, resize, label change, delete).
*   **Connection**: Defined in `connection.isl.md`. (Manages creation, selection, label change, delete).
*   **CoordinateUtils**: Defined in `coordinates.isl.md`. (Crucial for coordinate transformations, especially for drop and zoom).