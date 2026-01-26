# Project: Flow Chart Main Content

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main-content.jsx

> **Reference**: TOOLBarMain defined in `toolbar.isl.md`
> **Reference**: Sidebar defined in `sidebar.isl.md`
> **Reference**: Nodo defined in `node.isl.md`
> **Reference**: Connection defined in `connection.isl.md`
> **Reference**: CoordinateUtils defined in `coordinates.isl.md`

---

## Component: Main Content

Main body (main content) is where **TOOLs** are dragged.

### Role: Presentation

### 🔍 Appearance

- background-color: #ffffff (white)
- light background rows and columns to facilitate **TOOL** alignment

### 📦 Content

- **TOOLBarMain**
- is the area where **TOOLs** are dragged and rendered.
- **SVG Definitions**: Must include `<defs>` with a marker for connection arrows (id: "arrowhead") with `orient="auto"`.
- **Root Group**: A `<g>` element (ref="transformGroupRef") that wraps all Nodes, Connections, and the **Temporary Connection Line**. This group MUST receive the Pan and Zoom transforms.

### ⚡ Capabilities

#### Allow Drop

**Contract**: Enables the component to accept dropped items.
**Signature**:

- **Input**:
  - event: DragEvent
- **Output**: NONE (Side effect)
  **Trigger**: `dragOver` event on the container.
  **Side Effects**:

- Calls `event.preventDefault()` to allow dropping.
- Sets `event.dataTransfer.dropEffect` to 'copy'.

#### drop

**Contract**: the dropped **TOOL** is converted into a **Node**
**Signature**:

- **Input**:
  - event: DragEvent
- **Output**: NONE (State update)
  **Trigger**: Drop of **Node** on **Main Content**
  **Side Effects**:

- draws the Node on the **Main Content**

**🚨 Constraint**:

- MUST read data from `dataTransfer` using the key `application/json`.
- MUST parse the JSON string. Expected structure: `{ type: string }` (e.g., `{ "type": "Action" }`).
- **Data Normalization**: The extracted `type` MUST be converted to lowercase (e.g. 'Action' -> 'action') before creating the Node.
- **Coordinate Mapping Strategy**: MUST use `CoordinateUtils.toWorldCoordinates` to convert drop event coordinates. Pass the root SVG and the Transform Group `<g>`.
- **Transform Implementation**: Apply Pan (`translate`) and Zoom (`scale`) ONLY to the **Root Group** `<g>`. The root `<svg>` element MUST NOT have any transform style/attribute.
- **Layout Awareness**: The `<svg>` element should remain static (width/height 100%).

#### Manage Selection

**Contract**: Handles exclusive selection between Nodes and Connections.
**Signature**:

- **Input**:
  - id: string
  - type: 'node' | 'connection'
- **Output**: NONE (State update)
  **Trigger**: `onSelect` event from a Node or Connection.
  **Side Effects**:

- Updates `selectedId` state.
- Ensures only one item is selected at a time.

#### Handle Deselect

**Contract**: Deselects a specific item or clears selection.
**Signature**:
  - **Input**:
    - id: string (optional)
  - **Output**: NONE (State update)
**Trigger**: `onDeselect` event from a Node.
**Side Effects**:
- Clears the selection.

#### Create Connection Flow

**Contract**: Orchestrates connection creation between Nodes.
**Signature**:

- **Input**:
  - nodeId: string
  - anchorType: string
  - x: number
  - y: number
- **Output**: NONE (State update)
  **Trigger**: `onAnchorDragStart` event from a Node.
  **Flow**:

1. Store source node ID and anchor type.
2. Track mouse movement to draw a temporary preview line.
3. On `MouseUp`, check if over a valid target Node Anchor.
   - **Logic**: Calculate distance from mouse to ALL anchors of ALL nodes.
   - If distance < threshold (e.g. 20px), accept as target.
   - Do NOT rely solely on Node bounding box.
4. If valid target found, create a new Connection entity.

**Side Effects**:

- Adds new connection to state.
  **🚨 Constraint**:
- Target Node MUST be different from Source Node.
- The temporary line MUST be rendered inside the **Root Group** to share the same coordinate system (Pan/Zoom) as the Nodes.

#### Calculate Connection Coordinates

**Contract**: Computes start/end coordinates for each connection.
**Signature**:

- **Input**:
  - nodes: Node[]
  - connections: Connection[]
- **Output**: - renderData: ConnectionRenderData[]
  **Trigger**: Render cycle.
  **Logic**:

- For each connection, lookup source and target Node positions (x, y, w, h).
- Calculate exact anchor coordinates (e.g., 'right' = x + w, y + h/2).
- Pass these coordinates to the **Connection** component.

#### Handle Delete Request

**Contract**: Handles deletion requests from child components.
**Signature**:

- **Input**:
  - id: string
  - type: 'node' | 'connection'
- **Output**: NONE (State update)
  **Trigger**: `onDelete` event from a Node or Connection.
  **Side Effects**:

- If Node: Removes Node and all connected Connections.
- If Connection: Removes Connection.
- Clears selection if deleted item was selected.

#### Handle Node Drag

**Contract**: Updates Node position.
**Signature**:

- **Input**:
  - id: string
  - x: number
  - y: number
- **Output**: NONE (State update)
  **Trigger**: `onDrag` event from a Node.
  **Side Effects**:

- Updates x and y coordinates of the Node.

#### Handle Node Resize

**Contract**: Updates Node dimensions.
**Signature**:

- **Input**:
  - id: string
  - width: number
  - height: number
- **Output**: NONE (State update)
  **Trigger**: `onResize` event from a Node.
  **Side Effects**:

- Updates width and height of the Node.

#### Handle Node Label Change

**Contract**: Updates Node label.
**Signature**:

- **Input**:
  - id: string
  - label: string
- **Output**: NONE (State update)
  **Trigger**: `onLabelChange` event from a Node.
  **Side Effects**:

- Updates label of the Node.

#### Handle Connection Label Change

**Contract**: Updates Connection label.
**Signature**:
  - **Input**:
    - id: string
    - label: string
  - **Output**: NONE (State update)
**Trigger**: `onLabelChange` event from a Connection.
**Side Effects**:

- Updates label of the Connection.

#### Handle Load Json

**Contract**: Updates the flow with data loaded from JSON.
**Signature**:
  - **Input**:
    - data: { nodes: Node[], connections: Connection[] }
  - **Output**: NONE (State update)
**Trigger**: `onLoadJson` event from TOOLBarMain.
**Side Effects**:
- Replaces current nodes and connections with loaded data.

#### Panning

**Contract**: Moving the view without moving the components.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (State update)
  **Trigger**: pressing Space key + MouseDown (or middle mouse button)
  **Side Effects**:
  Cursor: changes to grabbing.

#### Zoom

**Contract**: Increases or decreases the view zoom.
**Signature**:

- **Input**:
  - event: WheelEvent
- **Output**: NONE (State update)
  **Trigger**: Mouse Wheel rotation.
  **Side Effects**:

- add "Reset View" button to return to zoom 1.0 and offset 0,0.
  **🚨 Constraint**:
- zoom MUST be centered on the current mouse cursor position (Zoom-to-Cursor).
- **Math Formula**: Use `CoordinateUtils.toWorldCoordinates` to get the mouse position in world space *before* zoom. Then calculate new pan based on that stable world point.
- **Transform Target**: Apply the transform to the **Root Group** `<g>`, NEVER to the `<svg>` element.

#### start group selection

**Contract**: Start multiple component selection.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (State update)
  **Trigger**:

- MouseDown and start drag on empty area of Main Content.
  **Side Effects**:
- Draws a selection rectangle (dashed line) during drag.

#### end group selection

**Contract**: End multiple component selection.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (State update)
  **Trigger**:

- MouseUp on empty area of Main Content and a **start group selection** has already occurred.
  **Side Effects**:
- all **Nodes** completely enclosed in the rectangle are selected.
- Selected **Nodes** show a blue border (#3b82f6) 2px thick.
  **Cleanup**
- removes the selection rectangle (dashed line).

#### deselect group selection

**Contract**: Deselects all selected components.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (State update)
  **Trigger**: MouseDown on empty area of Main Content and an **end group selection** has already occurred.
  **Side Effects**: deselects all selected components

#### move group selection

**Contract**: Moves a group of selected nodes.
**Signature**:

- **Input**:
  - event: MouseEvent
- **Output**: NONE (State update)
  **Trigger**: MouseDown start drag and on one of the selected nodes.
  **Side Effects**:

- All selected nodes move based on mouse movement.

**🚨 Constraint**:

- Selected nodes MUST be moved maintaining the original offset between them.
