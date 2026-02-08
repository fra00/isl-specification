This document provides a technical reference for the `TOOLBarMain` component, detailing its role, capabilities, constraints, and implementation specifics based on the provided ISL specifications and real implementation signature.

---

# Component: TOOLBarMain - Technical Reference

**Project**: Flow Chart Toolbar
**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: `./toolbar.jsx`

---

## 1. Role and Responsibilities

The `TOOLBarMain` component serves as the primary presentation layer for actions related to a generated flow chart graph. Its core responsibility is to provide users with interactive controls to manage and export the flow chart data in various formats.

**Role**: Presentation

**Key Responsibilities**:
*   Facilitate the export of the current SVG graph content into a JPG image.
*   Enable the export of the underlying flow data into a JSON format.
*   Provide functionality to load new flow data from a JSON file.
*   Support the conversion and display of the flow data into Mermaid syntax, including a mechanism to copy the generated code.

---

## 2. Public Capabilities/Methods

The `TOOLBarMain` component exposes the following public capabilities, primarily triggered by user interaction with its UI elements:

### 2.1. `esporta jpg`

*   **Contract**: Exports the SVG content of the generated graph into a JPG image file.
    *   **Pre-condition**: The SVG content must be rasterized before export.
*   **Signature**:
    *   **Input**: NONE (internally uses the `getSvgElement` prop to access the SVG content).
    *   **Output**: NONE (initiates a file download in the browser).
*   **Trigger**: User click on the "export jpg" button.

### 2.2. `esporta json`

*   **Contract**: Exports the current flow chart data into a JSON file.
*   **Signature**:
    *   **Input**: NONE (internally uses the `flowData` prop to access the flow chart data).
    *   **Output**: NONE (initiates a file download in the browser).
*   **Trigger**: User click on the "export json" button.

### 2.3. `load json`

*   **Contract**: Allows users to load a flow chart from a selected JSON file, updating the application state.
*   **Signature**:
    *   **Input**: NONE (utilizes a hidden file input element to select a file).
    *   **Output**: `event: onLoadJson(data)` - Emits an event with the parsed JSON data from the loaded file.
*   **Trigger**: User click on the "load json" button.

### 2.4. `esporta mermaid`

*   **Contract**: Converts the current flow chart data into Mermaid syntax. The generated Mermaid code is then displayed in a modal dialog for review and copying.
*   **Signature**:
    *   **Input**: NONE (internally uses the `flowData` prop to access nodes and connections).
    *   **Output**: NONE (triggers the display of a modal dialog).
*   **Trigger**: User click on the "export mermaid" button.
*   **Side Effects**:
    *   Opens a modal dialog.
    *   Displays the generated Mermaid code within a multi-row text input field inside the dialog.

---

## 3. Real Implementation Signature

Based on the provided `Real Implementation Signature`, the `TOOLBarMain` component is exported as a default React component.

```json
{
  "exports": [
    {
      "type": "default",
      "name": "TOOLBarMain",
      "props": [
        "getSvgElement",
        "flowData",
        "onLoadJson"
      ]
    }
  ]
}
```

**Exported Component**:
*   **Name**: `TOOLBarMain`
*   **Type**: Default export

**Accepted Props**:
*   `getSvgElement`: A function prop expected to return the SVG DOM element for export operations.
*   `flowData`: An object prop containing the current state of the flow chart, including nodes and connections.
*   `onLoadJson`: A callback function prop that is invoked when a JSON file is successfully loaded, passing the parsed data.

---

## 4. Critical Constraints

The following critical constraints are defined for the `TOOLBarMain` component, particularly concerning the `esporta mermaid` capability:

*   **Mermaid Connection Labels**: When generating Mermaid syntax, if connection labels are present in the `flowData`, they **must** be included in the output (e.g., `A -->|Label| B`).
*   **Node Identification for Mermaid**: For identifying source and target nodes in Mermaid connections, the implementation **must** use the `sourceNodeId` and `targetNodeId` properties from the connection object. The properties `source` or `target` **must NOT** be used.
*   **Data Access for Mermaid**: All necessary nodes and connections data for Mermaid conversion **must** be retrieved from the `props.flowData` object.
*   **Mermaid Dialog Functionality**: The modal dialog displaying the Mermaid code **MUST** include a "copy to clipboard" button to allow users to easily copy the generated code.

---

## 5. Component Dependencies

The `TOOLBarMain` component relies on external data and functions provided via its props to fulfill its responsibilities. These props represent its primary dependencies on other components or the application state:

*   **`getSvgElement`**: This prop is a dependency for the `esporta jpg` capability. It expects a function that can provide the SVG element to be rasterized and exported. This implies a dependency on a component or utility that manages the SVG rendering.
*   **`flowData`**: This prop is a crucial dependency for both `esporta json` and `esporta mermaid` capabilities. It expects an object containing the complete flow chart data (nodes, connections, etc.). This indicates a dependency on a data management layer or a parent component that holds the application's flow state.
*   **`onLoadJson`**: This prop is a dependency for the `load json` capability. It expects a callback function that the component will invoke with the parsed JSON data after a file has been successfully loaded. This signifies a dependency on a parent component to handle the loaded data and update the application state accordingly.