import React from 'react';

/**
 * @typedef {Object} Tool
 * @property {string} type - The unique type identifier for the tool (e.g., "Action", "Condition").
 * @property {string} label - The display label for the tool.
 * @property {string} shapeClass - TailwindCSS classes for the visual shape of the tool.
 * @property {string} textClass - TailwindCSS classes for the text inside the tool's shape.
 */

/**
 * Sidebar component displays a vertical list of draggable tools that can be inserted into a flow chart.
 * Each tool can be dragged to initiate a drag-and-drop operation.
 *
 * @returns {JSX.Element} The Sidebar component.
 */
export default function Sidebar() {
  /**
   * Handles the `dragstart` event for a tool.
   * It sets the data to be transferred during the drag operation and specifies the allowed effect.
   *
   * @param {React.DragEvent<HTMLDivElement>} event - The native drag event.
   * @param {string} toolType - The type of the tool being dragged (e.g., "Action", "Condition").
   * @returns {void}
   */
  const handleDragStart = (event, toolType) => {
    // Set the data to be transferred. The key is 'application/json' and the value is a JSON string
    // representing an object with the tool's type.
    event.dataTransfer.setData('application/json', JSON.stringify({ type: toolType }));
    // Specify that the allowed drag effect is 'copy'.
    event.dataTransfer.effectAllowed = 'copy';
  };

  /**
   * Defines the list of available tools with their properties.
   * @type {Tool[]}
   */
  const tools = [
    {
      type: 'Action',
      label: 'Action',
      // Rectangular shape for Action tool
      shapeClass: 'bg-blue-500 rounded-lg',
      textClass: 'text-white',
    },
    {
      type: 'Condition',
      label: 'Condition',
      // For rhombus shape: an outer square rotated 45 degrees, with inner text rotated -45 degrees
      // to appear upright. The draggable container itself remains unrotated.
      shapeClass: 'bg-green-500 transform rotate-45 flex items-center justify-center',
      textClass: 'text-white transform -rotate-45',
    },
  ];

  return (
    <div className="w-[30%] h-full bg-gray-100 p-4 flex flex-col items-center space-y-4 shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Tools</h2>
      <div className="w-full flex flex-col items-center space-y-4">
        {tools.map((tool) => (
          <div
            key={tool.type}
            className="w-full h-20 bg-white shadow-md rounded-lg flex items-center justify-center cursor-grab p-2"
            draggable="true" // Enable dragging for this element
            onDragStart={(event) => handleDragStart(event, tool.type)}
          >
            {/* Visual representation of the tool's shape and label */}
            <div className={`w-16 h-16 flex items-center justify-center ${tool.shapeClass}`}>
              <span className={`text-sm font-medium ${tool.textClass}`}>
                {tool.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}