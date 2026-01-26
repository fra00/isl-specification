# Project: Flow Chart Toolbar

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./toolbar.jsx

---

## Component: TOOLBarMain

The Main Content TOOLbar will contain possible actions to perform with the generated graph

### Role: Presentation

### 📦 Content

- export jpg button
- export json button
- load json button
- export mermaid button

### ⚡ Capabilities

#### esporta jpg

**Contract**: exports the SVG content into a jpg image, Pre-condition: SVG rasterized
**Signature**:

- **Input**: NONE (Uses `getSvgElement` prop)
- **Output**: NONE (Triggers download)

**trigger**: click on export jpg button

#### esporta json

**Contract**: exports the flow in json format
**Signature**:

- **Input**: NONE (Uses `flowData` prop)
- **Output**: NONE (Triggers download)

**trigger**: click on export json button

#### load json

**Contract**: loads a flow from a json file.
**Signature**:

- **Input**: NONE (Uses hidden file input)
- **Output**: event: onLoadJson(data)

**trigger**: click on load json button

#### esporta mermaid

**Contract**: exports in mermaid format, iterates over nodes array to create definitions and connections array to create edges. displays conversion text in a modal.
**Signature**:

- **Input**: NONE (Uses `flowData` prop)
- **Output**: NONE (Triggers modal)

**trigger**: click on export mermaid button
**Side Effects**:

- Open dialog
- show into a multi row TextInput mermaid code

**Constraint**:

- Must include connection labels if present (e.g. A -->|Label| B).
- Must use `sourceNodeId` and `targetNodeId` properties from the connection object to identify nodes (do NOT use `source` or `target`).
- **Data Access**: Retrieve nodes and connections from `props.flowData`.
- dialog MUST have button copy to clipboard
