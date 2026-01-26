import React from 'react';

/**
 * Sidebar component displays a list of draggable tools that can be inserted into a flow chart.
 * It allows users to drag "Action" and "Condition" tools onto a canvas.
 */
export default function Sidebar() {
  /**
   * Handles the drag start event for a tool.
   * Sets the dataTransfer object with the tool type and sets the effectAllowed to 'copy'.
   *
   * @param {React.DragEvent<HTMLDivElement>} event - The drag event object.
   * @param {string} toolType - The type of the tool being dragged (e.g., "Action", "Condition").
   * @returns {void}
   */
  const handleDragStart = (event, toolType) => {
    // Set the data to be transferred during the drag operation.
    // The key is 'application/json' and the value is a JSON string representing the tool type.
    event.dataTransfer.setData('application/json', JSON.stringify({ type: toolType }));
    // Specify that the drag operation is a 'copy' operation.
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-[30%] h-full bg-gray-100 p-4 relative flex flex-col items-center space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tools</h2>

      {/* Action Tool */}
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, 'Action')}
        className="w-40 h-20 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-grab shadow-md hover:shadow-lg transition-all duration-200 ease-in-out text-lg font-medium text-blue-700"
      >
        Action
      </div>

      {/* Condition Tool (Rhombus shape) */}
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, 'Condition')}
        className="relative w-40 h-40 flex items-center justify-center cursor-grab shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
      >
        {/* The actual rhombus shape */}
        <div className="absolute w-full h-full bg-white border-2 border-green-500 transform rotate-45"></div>
        {/* Text inside the rhombus, rotated back to be horizontal */}
        <span className="absolute transform -rotate-45 text-lg font-medium text-green-700">
          Condition
        </span>
      </div>
    </aside>
  );
}