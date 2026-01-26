import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * @typedef {object} ConnectionProps
 * @property {string} id - The unique ID of the connection.
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
 * Connection component draws a single curved line (Bezier) between two coordinates.
 * It supports selection, label editing via double-click, and deletion.
 *
 * @param {ConnectionProps} props
 * @returns {JSX.Element}
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
  const clickTimerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync currentLabel with prop label when it changes externally
  useEffect(() => {
    setCurrentLabel(label || '');
  }, [label]);

  // Calculate midpoint for label and delete button, and control points for Bezier curve
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Simple quadratic Bezier control point calculation for a smooth arc
  // Offset perpendicular to the line segment to create curvature
  const controlX = midX + (startY - endY) * 0.3;
  const controlY = midY + (endX - startX) * 0.3;

  const pathData = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;

  /**
   * Handles click events on the connection path, distinguishing between single and double clicks.
   * A single click triggers selection, a double click triggers label editing.
   * @param {React.MouseEvent<SVGPathElement>} e - The mouse event.
   */
  const handlePathClick = useCallback((e) => {
    console.log(`Connection ${id} clicked.`);
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      setIsEditingLabel(true);
      console.log(`Connection ${id} double-clicked. Entering edit mode.`);
    } else {
      clickTimerRef.current = setTimeout(() => {
        onSelect(id, 'connection');
        console.log(`Connection ${id} selected.`);
        clickTimerRef.current = null;
      }, 250); // 250ms threshold for double click
    }
  }, [id, onSelect]);

  /**
   * Handles double click specifically on the label text to enter edit mode.
   * @param {React.MouseEvent<SVGTextElement>} e - The mouse event.
   */
  const handleLabelDoubleClick = useCallback((e) => {
    e.stopPropagation(); // Prevent path click from also firing
    setIsEditingLabel(true);
    console.log(`Connection ${id} label double-clicked. Entering edit mode.`);
  }, [id]);

  /**
   * Handles blur event on the label input field.
   * Emits onLabelChange if editing was active and exits edit mode.
   */
  const handleInputBlur = useCallback(() => {
    if (isEditingLabel) {
      onLabelChange(id, currentLabel);
      setIsEditingLabel(false);
      console.log(`Connection ${id} label changed to: "${currentLabel}" and exited edit mode.`);
    }
  }, [id, currentLabel, isEditingLabel, onLabelChange]);

  /**
   * Handles key down events on the label input field.
   * 'Enter' key confirms changes, 'Escape' key cancels editing.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleInputKeyDown = useCallback((e) => {
    e.stopPropagation(); // Stop propagation to prevent canvas events
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur to save changes
    } else if (e.key === 'Escape') {
      setCurrentLabel(label || ''); // Revert to original label
      setIsEditingLabel(false);
      console.log(`Connection ${id} label editing cancelled.`);
    }
  }, [id, label]);

  /**
   * Handles click event on the delete button.
   * Emits onDelete event.
   * @param {React.MouseEvent<SVGGElement>} e - The mouse event.
   */
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation(); // CRITICAL: Prevent parent canvas from deselecting
    onDelete(id, 'connection');
    console.log(`Connection ${id} delete requested.`);
  }, [id, onDelete]);

  // Effect to focus the input field when editing starts
  useEffect(() => {
    if (isEditingLabel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Select all text for easy editing
    }
  }, [isEditingLabel]);

  // Effect to listen for 'Delete' key press when the connection is selected
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isSelected && e.key === 'Delete') {
        console.log(`Connection ${id} selected, Delete key pressed.`);
        onDelete(id, 'connection');
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isSelected, id, onDelete]);

  return (
    <g>
      {/* SVG Definitions for Arrowhead Marker */}
      <defs>
        <marker id={`arrowhead-${id}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className={isSelected ? "fill-blue-500" : "fill-gray-400"} />
        </marker>
      </defs>

      {/* Connection Path */}
      <path
        d={pathData}
        className={`
          ${isSelected ? 'stroke-blue-500 stroke-[4px]' : 'stroke-gray-400 stroke-[2px]'}
          fill-none cursor-pointer transition-all duration-200 ease-in-out
        `}
        markerEnd={`url(#arrowhead-${id})`}
        onClick={handlePathClick}
      />

      {/* Label or Input Field */}
      {isEditingLabel ? (
        <foreignObject x={midX - 75} y={midY - 15} width="150" height="30">
          <input
            ref={inputRef}
            type="text"
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-full h-full text-center bg-white border border-blue-500 rounded shadow-md text-sm"
            style={{ outline: 'none' }} // Remove default focus outline
            onMouseDown={(e) => e.stopPropagation()} // Prevent canvas drag/select when interacting with input
          />
        </foreignObject>
      ) : (
        label && (
          <text
            x={midX}
            y={midY - 10}
            textAnchor="middle"
            className={`
              ${isSelected ? 'fill-blue-700' : 'fill-gray-600'}
              text-xs cursor-pointer select-none
            `}
            onDoubleClick={handleLabelDoubleClick}
          >
            {label}
          </text>
        )
      )}

      {/* Delete Button (visible only when selected) */}
      {isSelected && (
        <g
          transform={`translate(${midX + 10}, ${midY - 25})`}
          className="cursor-pointer"
          onMouseDown={handleDeleteClick} // CRITICAL: Stop propagation to prevent canvas deselect
        >
          <circle r="10" className="fill-red-500 hover:fill-red-600" />
          <text x="0" y="4" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
            X
          </text>
        </g>
      )}
    </g>
  );
}