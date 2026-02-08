This document provides a technical reference for the `Connection` component, detailing its role, capabilities, constraints, and implementation specifics based on the provided ISL specifications and real implementation signature.

---

# Flow Chart Connection Component Reference

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: `./connection.jsx`

---

## 1. Component Overview

The `Connection` component is a pure presentation component responsible for drawing a single line between two specified coordinates within a flow chart. It handles visual representation, user interaction for selection, label editing, and deletion requests.

### 1.1. Role and Responsibilities

*   **Role**: Presentation Component
*   **Responsibilities**:
    *   Visually render a curved line (Bezier) between a start and end point.
    *   Ensure the line includes an arrowhead at the target end.
    *   Display a delete icon button near the midpoint when the connection is selected.
    *   Display a text label at the midpoint if provided.
    *   Notify parent components upon selection of the connection.
    *   Provide an interactive mechanism for editing the connection's label.
    *   Request deletion of the connection based on user input (key press or button click).
    *   Manage its own visual state (e.g., selected/unselected appearance) based on props.

## 2. Public Capabilities (Methods/Interactions)

The `Connection` component exposes the following public capabilities, primarily through its rendering and event emission mechanisms.

### 2.1. Render Line

*   **Contract**: Draws the SVG path representing the connection.
*   **Input**:
    *   `id`: `string` - Unique identifier for the connection.
    *   `startX`: `number` - X-coordinate of the starting point.
    *   `startY`: `number` - Y-coordinate of the starting point.
    *   `endX`: `number` - X-coordinate of the ending point.
    *   `endY`: `number` - Y-coordinate of the ending point.
    *   `isSelected`: `boolean` - Indicates if the connection is currently selected, affecting its visual style.
    *   `label`: `string` - Text to be displayed at the midpoint of the connection.

### 2.2. Select Connection

*   **Contract**: Notifies the parent component that this connection has been selected.
*   **Input**:
    *   `id`: `string` - The unique identifier of the selected connection.
*   **Output**:
    *   `event`: `onSelect(id, 'connection')` - An event emitted to the parent.
*   **Trigger**:
    *   A single click on the connection line.
*   **Side Effects**:
    *   Emits the `onSelect` event.
    *   The visual style (e.g., thickness, color) of the connection changes, controlled by the `isSelected` prop.
*   **Cleanup**: None (state is managed by the parent component).

### 2.3. Edit Label

*   **Contract**: Allows editing the connection's label.
*   **Input**:
    *   `newLabel`: `string` - The updated label text.
*   **Output**:
    *   `event`: `onLabelChange(id, newLabel)` - An event emitted to the parent with the updated label.
*   **Trigger**:
    *   A double click on the connection line or its existing label.
*   **Side Effects**:
    *   Displays an input box at the midpoint of the connection for text entry.
*   **Flow**:
    1.  Detects a double click (distinguished from a single click using a timer).
    2.  An input field is displayed, centered at the connection's midpoint, typically embedded within the SVG using `<foreignObject>`.
    3.  Upon pressing `Enter` or losing focus (`Blur`) from the input field:
        *   The `onLabelChange` event is emitted with the connection's `id` and the `newLabel`.
        *   The component exits edit mode (the input field is hidden, and the static text label is shown).
    4.  Upon pressing `Esc`:
        *   Editing is canceled.
        *   The component exits edit mode (the input field is hidden, and the static text label is shown, reverting to the original label if no change was committed).

### 2.4. Delete Connection

*   **Contract**: Requests the deletion of this connection.
*   **Input**:
    *   `id`: `string` - The unique identifier of the connection to be deleted.
*   **Output**:
    *   `event`: `onDelete(id, 'connection')` - An event emitted to the parent.
*   **Trigger**:
    *   Pressing the `Del` key when the connection is selected.
    *   Clicking on the delete icon button displayed when the connection is selected.
*   **Side Effects**:
    *   Emits the `onDelete` event.

## 3. Real Implementation Signature

The `Connection` component is exported as a default React functional component.

```json
{
  "exports": [
    {
      "type": "default",
      "name": "Connection",
      "props": [
        "id",
        "startX",
        "startY",
        "endX",
        "endY",
        "isSelected",
        "label",
        "onSelect",
        "onLabelChange",
        "onDelete"
      ]
    }
  ]
}
```

### 3.1. Exported Component

*   **Name**: `Connection`
*   **Type**: Default export (React Functional Component)

### 3.2. Props

The `Connection` component accepts the following properties:

*   `id`: `string` - The unique identifier for the connection.
*   `startX`: `number` - The X-coordinate of the connection's start point.
*   `startY`: `number` - The Y-coordinate of the connection's start point.
*   `endX`: `number` - The X-coordinate of the connection's end point.
*   `endY`: `number` - The Y-coordinate of the connection's end point.
*   `isSelected`: `boolean` - A flag indicating if the connection is currently selected.
*   `label`: `string` - The text label to display on the connection.
*   `onSelect`: `function(id: string, type: 'connection')` - Callback function invoked when the connection is selected.
*   `onLabelChange`: `function(id: string, newLabel: string)` - Callback function invoked when the connection's label is updated.
*   `onDelete`: `function(id: string, type: 'connection')` - Callback function invoked when a request to delete the connection is made.

## 4. Critical Constraints

The following constraints are critical for the correct functionality and appearance of the `Connection` component:

*   **Arrowhead Requirement**: The rendered line **MUST** include an arrowhead at its end (target side). This is typically achieved using `marker-end="url(#arrowhead)"` in SVG.
*   **Delete Button Visibility**: When the connection is in a `selected` state (`isSelected` is `true`), a delete icon button (e.g., an 'X') **MUST** be displayed near the midpoint of the curved line.
*   **Delete Button Event Propagation**: The delete button's `onMouseDown` event handler **MUST** call `e.stopPropagation()`. This is **CRITICAL** to prevent the event from propagating to the main canvas or parent elements, which could inadvertently deselect the connection before the delete click is registered.

## 5. Dependencies

Based on the provided ISL, the `Connection` component does not explicitly reference or depend on other specific components within the system. It is designed as a self-contained presentation component that communicates with its parent via events.