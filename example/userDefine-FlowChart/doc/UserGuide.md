Welcome to the Flow Chart Builder! This guide will help you understand how to create, manage, and export your flowcharts.

---

## Understanding the Interface

The Flow Chart Builder's interface is designed to be intuitive, with distinct areas for different tasks:

### Main Canvas
This is the central area where you'll build your flowcharts. It features a clean white background with a subtle grid to help you align your elements precisely.

### Toolbox
Located on the left side of the application, the Toolbox contains different types of flowchart elements, called "Tools," that you can add to your canvas.
*   **Action**: A rectangular shape, typically used for process steps.
*   **Condition**: A diamond (rhombus) shape, used for decision points.

### Toolbar
At the top of the Main Canvas, you'll find the Toolbar, which provides various actions for managing and exporting your flowchart.

---

## Building Your Flowchart

### Adding Nodes
Nodes represent the individual steps or decisions in your flowchart.
*   **What you can do**: Add new steps or decisions to your flowchart.
*   **How to do it**: Simply drag an "Action" or "Condition" tool from the **Toolbox** (on the left) onto the **Main Canvas**.
*   **Appearance**: Nodes have a light lavender background with a light gray border. "Action" nodes are rectangular, while "Condition" nodes are diamond-shaped.

### Selecting and Deselecting Items
*   **What you can do**: Highlight a specific Node or Connection to interact with it, or clear all selections.
*   **How to do it**:
    *   **Select**: Click on any Node or Connection to select it. Only one item can be selected at a time.
    *   **Deselect**: To deselect all items, click on an empty area of the **Main Canvas**.

### Moving Nodes
*   **What you can do**: Change the position of a Node on the canvas.
*   **How to do it**: Click and drag a selected Node to move it to a new position.

### Resizing Nodes
*   **What you can do**: Adjust the width and height of a Node.
*   **How to do it**: When a Node is selected, a small square handle appears at its bottom-right corner. Click and drag this handle to change the Node's dimensions.

### Editing Node Labels
*   **What you can do**: Change the text displayed inside a Node.
*   **How to do it**: Double-click on a Node to open an input field. Type your new label, then press `Enter` or click outside the field to save your changes. Press `Esc` to cancel and revert to the original label.

### Deleting Nodes
*   **What you can do**: Remove a Node from your flowchart.
*   **How to do it**: Select a Node and then either press the `Del` key on your keyboard, or click the 'X' icon that appears in the top-right corner of the selected Node. Deleting a Node will also automatically remove any connections attached to it.

### Creating Connections
Connections are curved lines that link Nodes, indicating the flow of your process.
*   **What you can do**: Draw lines to connect two Nodes.
*   **How to do it**:
    1.  Hover your mouse over a Node, and four small square handles will appear on its top, bottom, left, and right sides.
    2.  Click and drag from one of these handles on your starting Node. A temporary line will follow your mouse.
    3.  Drag this line to a handle on a *different* target Node.
    4.  Release the mouse button to establish the connection between the two Nodes.
*   **Appearance**: Each connection has an arrowhead pointing towards the target Node.

### Editing Connection Labels
*   **What you can do**: Add or change text displayed on a connection line.
*   **How to do it**: Double-click on a Connection line or its existing label to open an input field. Type your new label, then press `Enter` or click outside to save. Press `Esc` to cancel.

### Deleting Connections
*   **What you can do**: Remove a connection line from your flowchart.
*   **How to do it**: Select a Connection, then either press the `Del` key on your keyboard, or click the 'X' icon that appears near the midpoint of the selected connection.

---

## Navigating the Canvas

### Panning (Moving the View)
*   **What you can do**: Move your view of the canvas without moving any components.
*   **How to do it**: Press and hold the `Space` key while dragging your mouse, or use your middle mouse button to drag the canvas. Your cursor will change to a grabbing hand.

### Zooming In and Out
*   **What you can do**: Increase or decrease the magnification of your flowchart.
*   **How to do it**: Use your mouse wheel to zoom in and out of the canvas. The zoom will be centered on your mouse cursor's position. You can also click the 'Reset View' button (if available in the Toolbar) to return to the default zoom level and position.

### Group Selection and Movement
*   **What you can do**: Select and move multiple Nodes simultaneously.
*   **How to do it**:
    1.  **Start Group Selection**: Click and drag your mouse on an empty area of the canvas. A dashed selection rectangle will appear.
    2.  **End Group Selection**: Release the mouse button. All Nodes completely enclosed within the rectangle will be selected and highlighted with a blue border.
    3.  **Move Group**: To move a group of selected Nodes, click and drag any one of the selected Nodes. All selected Nodes will move together, maintaining their relative positions.
    4.  **Deselect Group**: Click on an empty area of the canvas to deselect all Nodes.

---

## Managing Your Flowchart

The **Toolbar** provides several options for saving, loading, and exporting your flowchart.

### Exporting as JPG
*   **What you can do**: Save your entire flowchart as an image file.
*   **How to do it**: Click the 'Export JPG' button in the Toolbar. Your flowchart will be downloaded as a JPG image.

### Exporting as JSON
*   **What you can do**: Save your flowchart's data in a structured text file, allowing you to save and later load your work.
*   **How to do it**: Click the 'Export JSON' button in the Toolbar. Your flowchart data will be downloaded as a JSON file.

### Loading from JSON
*   **What you can do**: Open a previously saved flowchart from a JSON file.
*   **How to do it**: Click the 'Load JSON' button in the Toolbar. A file browser will appear, allowing you to select a JSON file from your computer.

### Exporting as Mermaid Code
*   **What you can do**: Convert your flowchart into Mermaid syntax, a popular markdown-like language for diagrams.
*   **How to do it**: Click the 'Export Mermaid' button in the Toolbar. A pop-up window will appear displaying the generated Mermaid code. This window will also include a 'Copy to Clipboard' button for easy transfer of the code.

---

## Text Input Fields
Throughout the application, whenever you need to enter text (e.g., when editing a Node or Connection label, or in a pop-up window), you'll interact with a standard text input field. These fields allow you to type text and may provide visual feedback (like different border colors) to indicate if the entered text is valid or invalid.