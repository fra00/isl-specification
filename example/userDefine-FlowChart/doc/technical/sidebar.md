# Component: Sidebar Technical Reference

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: `./sidebar.jsx`

---

## 1. Summary

The `Sidebar` component serves as a **presentation** layer, displaying a vertical list of available "TOOLs" that can be inserted into the main SVG canvas. Its primary responsibility is to facilitate the initiation of drag-and-drop operations for these tools, allowing users to drag them from the sidebar towards the Main Content area.

### 1.1 Role

Presentation

### 1.2 Responsibilities

*   Display a list of predefined "TOOLs" (e.g., Action, Condition).
*   Provide visual representation and styling for the sidebar and its tools.
*   Initiate the drag operation when a user starts dragging a tool.
*   Set appropriate `dataTransfer` properties during a drag operation.

## 2. Public Capabilities

### 2.1 `Start Drag`

Initiates the dragging of a "TOOL" from the sidebar towards the Main Content area.

*   **Contract**: Starts dragging a `TOOL` towards the Main Content.
*   **Trigger**: `DragStart` event on a list element representing a tool.
*   **Signature**:
    *   **Input**:
        *   `event`: `DragEvent` - The native drag event object.
        *   `toolType`: `string` - The identifier for the type of tool being dragged (e.g., "Action", "Condition").
    *   **Output**: `NONE` (This function primarily performs side effects).
*   **Side Effects**:
    *   Sets data in the `dataTransfer` object of the `DragEvent`.
    *   Sets `effectAllowed` to `'copy'` on the `dataTransfer` object.
*   **Constraints**:
    *   The list element triggering the drag MUST have the `draggable="true"` attribute.
    *   The `dataTransfer` object MUST contain data with the key `application/json`.
    *   The value associated with `application/json` MUST be a JSON stringified object in the format `{ "type": toolType }` (e.g., `{ "type": "Action" }`).

## 3. Real Implementation Details

Based on the provided `Real Implementation Signature`, the `Sidebar` component is exported as a default React component.

### 3.1 Exported Components/Functions

*   **Name**: `Sidebar`
*   **Type**: Default export

### 3.2 Props

The `Sidebar` component does not explicitly define or accept any public props according to the current implementation signature.

## 4. Critical Constraints

The following constraints are critical for the correct functioning and appearance of the `Sidebar` component:

*   **Tool Button Rotation**: The visual representation of the "TOOLs" (buttons or elements) MUST NOT be rotated.
*   **Draggable Attribute**: Any list element intended to be dragged MUST have the `draggable="true"` HTML attribute set.
*   **Data Transfer Format**: During a drag operation, the `dataTransfer` object MUST contain data under the key `application/json`. The value for this key MUST be a JSON string representing an object with a `type` property, e.g., `{ "type": "Action" }`.

## 5. Dependencies

The `Sidebar` component interacts with the following:

*   **Browser Drag-and-Drop API**: Relies on native `DragEvent` and `dataTransfer` mechanisms for its `Start Drag` capability.
*   **Main Content (Implicit)**: While not explicitly defined as a direct dependency in the ISL, the `Sidebar`'s primary function of initiating drags implies an interaction with a "Main Content" area where these tools are intended to be dropped. This suggests a consumer-producer relationship where the `Sidebar` produces draggable items for another component to consume.
*   **Internal Tool Definitions**: The component relies on internal definitions for the available "TOOLs" (e.g., "Action", "Condition") and their associated shapes.