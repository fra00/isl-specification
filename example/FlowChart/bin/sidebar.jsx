import React, { useCallback } from 'react';

/**
 * @typedef {object} ToolDefinition
 * @property {string} type - The unique identifier for the tool (e.g., 'Action', 'Condition').
 * @property {string} label - The display name for the tool.
 */

/**
 * Component: Sidebar
 * Contains the list of TOOLs that can be inserted into the SVG.
 * From here, components are dragged to the Main Content.
 *
 * Role: Presentation
 *
 * Appearance:
 * - Background Color: #f3f4f6 (light gray)
 * - Layout: Width 30%, Height 100%.
 * - Position: Relative (part of the flex layout), NOT fixed.
 * - TOOLs height 80px, width: 100%.
 */
export default function Sidebar() {
  /**
   * Defines the available tools that can be dragged from the sidebar.
   * @type {ToolDefinition[]}
   */
  const tools = [
    { type: 'Action', label: 'Action' },       // rectangular shape
    { type: 'Condition', label: 'Condition' }, // equilateral rhombus shape
  ];

  /**
   * Capability: Start Drag
   * Contract: Starts dragging a TOOL towards the Main Content.
   *
   * @param {React.DragEvent<HTMLDivElement>} event - The native drag event.
   * @param {string} toolType - The type identifier of the tool being dragged.
   * @returns {void}
   *
   * Trigger: DragStart on a list element.
   *
   * Flow:
   * 1. Sets data in `dataTransfer` with key `application/json` and value as a JSON string
   *    representing an object `{ type: toolType }`.
   * 2. Sets `effectAllowed` to 'copy' to indicate that the drag operation will result in a copy.
   *
   * Constraints:
   * - The list element MUST have `draggable="true"`.
   * - The dataTransfer key MUST be `application/json`.
   * - The dataTransfer value MUST be a JSON stringify of an object `{ type: toolType }`.
   */
  const handleDragStart = useCallback((event, toolType) => {
    // Set data for the drag operation
    event.dataTransfer.setData('application/json', JSON.stringify({ type: toolType }));
    // Specify the allowed drag effect
    event.dataTransfer.effectAllowed = 'copy';
  }, []); // No dependencies, so this function is stable across renders

  return (
    <div className="w-1/3 h-full bg-gray-100 p-4 flex flex-col gap-4 overflow-y-auto relative">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Tools</h2>
      {tools.map((tool) => (
        <div
          key={tool.type}
          draggable="true"
          onDragStart={(event) => handleDragStart(event, tool.type)}
          className="w-full h-20 p-2 bg-white border border-gray-300 shadow-sm cursor-grab flex items-center justify-center text-center text-gray-800 hover:bg-gray-50 transition-colors duration-200"
          aria-label={`Drag to add a ${tool.label} component`}
        >
          {tool.type === 'Action' && (
            // Rectangular shape for Action
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white rounded-md">
              {tool.label}
            </div>
          )}
          {tool.type === 'Condition' && (
            // Equilateral rhombus shape for Condition (a rotated square)
            // The inner square is sized to fit its diagonal within the parent's height (80px - 2*padding = 64px)
            // A 45x45px square has a diagonal of approx 63.6px, fitting well within 64px.
            <div className="relative w-[45px] h-[45px] bg-green-500 rotate-45 flex items-center justify-center">
              {/* Counter-rotate the text to make it readable */}
              <span className="absolute -rotate-45 text-white text-sm font-medium">{tool.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}