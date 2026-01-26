import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * @typedef {object} ConnectionProps
 * @property {string} id - The unique identifier for the connection.
 * @property {number} startX - The X coordinate of the start point.
 * @property {number} startY - The Y coordinate of the start point.
 * @property {number} endX - The X coordinate of the end point.
 * @property {number} endY - The Y coordinate of the end point.
 * @property {boolean} isSelected - True if the connection is currently selected.
 * @property {string} [label] - The optional label for the connection.
 * @property {(id: string, type: 'connection') => void} onSelect - Callback when the connection is selected.
 * @property {(id: string, newLabel: string) => void} onLabelChange - Callback when the connection's label changes.
 * @property {(id: string, type: 'connection') => void} onDelete - Callback when the connection is requested to be deleted.
 */

/**
 * Connection component draws a single curved line between two coordinates with an optional label and delete button.
 * It handles selection, label editing, and deletion.
 * @param {ConnectionProps} props
 */
export default function Connection({
  id,
  startX,
  startY,
  endX,
  endY,
  isSelected,
  label,
  onSelect,
  onLabelChange,
  onDelete,
}) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label || '');
  const clickTimer = useRef(null);
  const clicks = useRef(0);
  const inputRef = useRef(null);

  // Calculate path data for a curved line (Bezier)
  // Using control points for a "Z" or "S" shape common in flowcharts
  // This creates a curve that goes horizontally from start, then vertically, then horizontally to end.
  const cp1x = startX + (endX - startX) / 2;
  const cp1y = startY;
  const cp2x = startX + (endX - startX) / 2;
  const cp2y = endY;
  const pathData = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  // Calculate midpoint for label and delete button positioning
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  /**
   * Handles single and double clicks on the connection line.
   * Distinguishes between single click (select) and double click (edit label) using a timer.
   * @param {React.MouseEvent<SVGPathElement | HTMLDivElement>} e - The mouse event.
   */
  const handleClick = useCallback((e) => {
    e.stopPropagation(); // Prevent canvas selection/deselection

    clicks.current++;

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    clickTimer.current = setTimeout(() => {
      if (clicks.current === 1) {
        console.log(`Connection ${id} selected.`);
        onSelect(id, 'connection');
      } else if (clicks.current === 2) {
        console.log(`Connection ${id} double clicked for editing.`);
        setIsEditingLabel(true);
        // Focus input after render cycle to ensure it's mounted
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      clicks.current = 0;
      clickTimer.current = null;
    }, 250); // 250ms threshold for double click
  }, [id, onSelect]);

  /**
   * Handles changes to the label input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleLabelChange = useCallback((e) => {
    setCurrentLabel(e.target.value);
  }, []);

  /**
   * Handles blur event on the label input field.
   * Emits onLabelChange and exits edit mode.
   * @param {React.FocusEvent<HTMLInputElement>} e - The focus event.
   */
  const handleLabelBlur = useCallback(() => {
    console.log(`Connection ${id} label changed to: ${currentLabel}`);
    onLabelChange(id, currentLabel);
    setIsEditingLabel(false);
  }, [id, currentLabel, onLabelChange]);

  /**
   * Handles key down events on the label input field.
   * Exits edit mode on Enter (and saves) or Esc (and cancels).
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleLabelKeyDown = useCallback((e) => {
    e.stopPropagation(); // Prevent canvas keydown events

    if (e.key === 'Enter') {
      inputRef.current?.blur(); // Trigger blur to save and exit
    } else if (e.key === 'Escape') {
      setCurrentLabel(label || ''); // Revert to original label
      setIsEditingLabel(false);
    }
  }, [label]);

  /**
   * Handles click on the delete button.
   * Emits onDelete event.
   * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event.
   */
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation(); // CRITICAL: Prevent parent SVG from catching the event and deselecting
    console.log(`Delete button clicked for connection ${id}.`);
    onDelete(id, 'connection');
  }, [id, onDelete]);

  // Effect to handle 'Delete' key press for selected connection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && e.key === 'Delete') {
        e.preventDefault(); // Prevent default browser behavior (e.g., backspace navigation)
        console.log(`Delete key pressed for connection ${id}.`);
        onDelete(id, 'connection');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, isSelected, onDelete]);

  // Update currentLabel if the prop changes while not editing
  useEffect(() => {
    if (!isEditingLabel) {
      setCurrentLabel(label || '');
    }
  }, [label, isEditingLabel]);

  // Dimensions for label/input foreignObject
  const labelWidth = isEditingLabel ? 150 : Math.max(50, (label?.length || 0) * 8 + 10);
  const labelHeight = isEditingLabel ? 30 : 20;

  return (
    <g>
      {/* Arrowhead definition - placed here for self-containment, ideally in parent SVG defs */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-gray-700" />
        </marker>
      </defs>

      {/* Invisible path for easier clicking/selection */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth="15" // Make it wider for easier interaction
        className="cursor-pointer"
        onClick={handleClick}
      />

      {/* Visible connection line */}
      <path
        d={pathData}
        fill="none"
        stroke={isSelected ? 'rgb(59, 130, 246)' : 'rgb(75, 85, 99)'} // Tailwind blue-500 vs gray-700
        strokeWidth={isSelected ? '3' : '2'}
        className="transition-all duration-100 ease-in-out cursor-pointer"
        markerEnd="url(#arrowhead)"
        onClick={handleClick}
      />

      {/* Label or Input Field */}
      {(label || isEditingLabel) && (
        <foreignObject
          x={midX - labelWidth / 2}
          y={midY - labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          className="overflow-visible"
        >
          {isEditingLabel ? (
            <input
              ref={inputRef}
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              className="w-full h-full p-1 text-center text-sm border border-blue-500 rounded shadow-md focus:outline-none"
            />
          ) : (
            <div
              className="flex items-center justify-center w-full h-full text-center text-sm font-medium text-gray-800 bg-white px-2 py-1 rounded shadow-sm cursor-pointer"
              onClick={handleClick} // Allow clicking on label to select/edit
            >
              {label}
            </div>
          )}
        </foreignObject>
      )}

      {/* Delete Button (visible when selected) */}
      {isSelected && (
        <foreignObject
          x={midX + 10} // Offset to the right of midpoint
          y={midY - 12} // Centered vertically (24/2 = 12)
          width="24"
          height="24"
          className="overflow-visible"
        >
          <button
            className="flex items-center justify-center w-full h-full bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onMouseDown={handleDeleteClick} // CRITICAL: Use onMouseDown with stopPropagation
            aria-label="Delete connection"
          >
            X
          </button>
        </foreignObject>
      )}
    </g>
  );
}