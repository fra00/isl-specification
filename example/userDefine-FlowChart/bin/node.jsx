import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * @typedef {'action' | 'condition'} NodeType
 */

/**
 * @typedef {Object} NodeProps
 * @property {string} id - The unique identifier for the node.
 * @property {number} x - The x-coordinate of the node's top-left corner.
 * @property {number} y - The y-coordinate of the node's top-left corner.
 * @property {number} width - The width of the node.
 * @property {number} height - The height of the node.
 * @property {NodeType} type - The type of the node ('action' or 'condition').
 * @property {string} label - The text label for the node.
 * @property {boolean} isSelected - True if the node is currently selected.
 * @property {(id: string, type: 'node') => void} onSelect - Callback when the node is selected.
 * @property {(id: string) => void} onDeselect - Callback when the node is deselected (e.g., during label edit).
 * @property {(id: string, newX: number, newY: number) => void} onDrag - Callback when the node is dragged.
 * @property {(id: string, newWidth: number, newHeight: number) => void} onResize - Callback when the node is resized.
 * @property {(id: string, newLabel: string) => void} onLabelChange - Callback when the node's label changes.
 * @property {(id: string, type: 'node') => void} onDelete - Callback when the node is requested to be deleted.
 * @property {(nodeId: string, anchorType: string, x: number, y: number) => void} onAnchorDragStart - Callback when a connection drag starts from an anchor.
 */

/**
 * Node component for a flow chart.
 * @param {NodeProps} props
 */
export default function Node({
  id,
  x,
  y,
  width,
  height,
  type,
  label,
  isSelected,
  onSelect,
  onDeselect,
  onDrag,
  onResize,
  onLabelChange,
  onDelete,
  onAnchorDragStart,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const labelInputRef = useRef(null);
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const nodeStartCoords = useRef({ x: 0, y: 0 });
  const resizeStartCoords = useRef({ x: 0, y: 0 });
  const nodeStartDimensions = useRef({ width: 0, height: 0 });

  // Update currentLabel if prop.label changes while not editing
  useEffect(() => {
    if (!isEditingLabel) {
      setCurrentLabel(label);
    }
  }, [label, isEditingLabel]);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      console.log('Node: Applying focus to textbox.');
      labelInputRef.current.focus();
      labelInputRef.current.select(); // Select all text
    }
  }, [isEditingLabel]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleNodeClick = useCallback((e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the SVG canvas
    if (!isEditingLabel) {
      onSelect(id, 'node');
    }
  }, [id, isEditingLabel, onSelect]);

  const handleNodeDoubleClick = useCallback((e) => {
    e.stopPropagation();
    console.log('Node: Double click detected, entering label edit mode.');
    setIsEditingLabel(true);
    onDeselect(id); // Emit onDeselect to clear selection
    // Small interval to avoid conflicts and ensure foreignObject is rendered
    // before attempting to focus.
    setTimeout(() => {
      if (labelInputRef.current) {
        labelInputRef.current.focus();
        labelInputRef.current.select();
      }
    }, 50); // A small delay
  }, [id, onDeselect]);

  const saveLabelEdit = useCallback(() => {
    console.log('Node: Label edit saved.');
    onLabelChange(id, currentLabel);
    setIsEditingLabel(false);
  }, [id, currentLabel, onLabelChange]);

  const cancelLabelEdit = useCallback(() => {
    console.log('Node: Label edit cancelled.');
    setCurrentLabel(label); // Restore original label
    setIsEditingLabel(false);
  }, [label]);

  const handleInputKeyDown = useCallback((e) => {
    // CRITICAL: Stop propagation of keydown events (specifically Delete and Backspace)
    // on the input element to prevent triggering global deletion handlers.
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation();
      return;
    }
    if (e.key === 'Enter') {
      e.stopPropagation();
      saveLabelEdit();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      cancelLabelEdit();
    }
  }, [saveLabelEdit, cancelLabelEdit]);

  const handleInputBlur = useCallback(() => {
    console.log('Node: On blur, saving label edit.');
    saveLabelEdit();
  }, [saveLabelEdit]);

  const handleLabelInputChange = useCallback((e) => {
    setCurrentLabel(e.target.value);
  }, []);

  const handleDragMouseDown = useCallback((e) => {
    e.stopPropagation(); // Prevent node selection on drag start
    if (isEditingLabel) return;

    onSelect(id, 'node'); // Select node if not already selected
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    nodeStartCoords.current = { x, y };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartCoords.current.x;
      const dy = moveEvent.clientY - dragStartCoords.current.y;
      onDrag(id, nodeStartCoords.current.x + dx, nodeStartCoords.current.y + dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [id, x, y, isEditingLabel, onDrag, onSelect]);

  const handleResizeMouseDown = useCallback((e) => {
    e.stopPropagation(); // Prevent node drag from starting
    resizeStartCoords.current = { x: e.clientX, y: e.clientY };
    nodeStartDimensions.current = { width, height };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - resizeStartCoords.current.x;
      const dy = moveEvent.clientY - resizeStartCoords.current.y;
      const newWidth = Math.max(20, nodeStartDimensions.current.width + dx); // Min width 20
      const newHeight = Math.max(20, nodeStartDimensions.current.height + dy); // Min height 20
      onResize(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [id, width, height, onResize]);

  const handleDeleteClick = useCallback((e) => {
    // CRITICAL: The delete button MUST handle onMouseDown and call e.stopPropagation()
    // to prevent the Node's drag logic from starting.
    e.stopPropagation();
    onDelete(id, 'node');
  }, [id, onDelete]);

  const handleAnchorMouseDown = useCallback((anchorType, e) => {
    e.stopPropagation(); // Prevent node drag/selection
    const anchorX = x + (anchorType === 'left' ? 0 : anchorType === 'right' ? width : width / 2);
    const anchorY = y + (anchorType === 'top' ? 0 : anchorType === 'bottom' ? height : height / 2);
    onAnchorDragStart(id, anchorType, anchorX, anchorY);
  }, [id, x, y, width, height, onAnchorDragStart]);

  // Determine shape based on type
  let shapeElement;
  const commonShapeProps = {
    fill: '#e0e7ff',
    stroke: isSelected ? '#3b82f6' : '#94a3b8', // Blue for selected, gray for unselected
    strokeWidth: isSelected ? 2 : 1,
    onMouseDown: handleDragMouseDown,
    onDoubleClick: handleNodeDoubleClick,
    onClick: handleNodeClick,
  };

  if (type.toLowerCase() === 'action') {
    shapeElement = (
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="5" // Rounded corners for action nodes
        ry="5"
        {...commonShapeProps}
      />
    );
  } else if (type.toLowerCase() === 'condition') {
    // Rhombus points: (width/2, 0), (width, height/2), (width/2, height), (0, height/2)
    const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
    shapeElement = (
      <polygon
        points={points}
        {...commonShapeProps}
      />
    );
  } else {
    // Default to rect if type is unknown
    shapeElement = (
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="5"
        ry="5"
        {...commonShapeProps}
      />
    );
  }

  const showHandles = isHovered || isSelected;

  // Connection handle dimensions
  const handleSize = 10;
  const halfHandleSize = handleSize / 2;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isSelected ? 'grabbing' : 'grab' }} // Cursor for the whole group
    >
      {/* Main Shape */}
      {shapeElement}

      {/* Label */}
      {isEditingLabel ? (
        <foreignObject x="0" y="0" width={width} height={height}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              ref={labelInputRef}
              type="text"
              value={currentLabel}
              onChange={handleLabelInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              style={{
                width: 'calc(100% - 10px)', // Small padding
                height: 'calc(100% - 10px)',
                border: '1px solid #3b82f6',
                borderRadius: '3px',
                textAlign: 'center',
                fontSize: '14px',
                background: '#fff',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </foreignObject>
      ) : (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#333"
          fontSize="14"
          pointerEvents="none" // Allow mouse events to pass through to the shape
        >
          {label}
        </text>
      )}

      {/* Connection Handles (Z-index: Node > Connection Handles) */}
      {showHandles && !isEditingLabel && (
        <>
          {/* Top Handle */}
          <rect
            x={width / 2 - halfHandleSize}
            y={-halfHandleSize}
            width={handleSize}
            height={handleSize}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorMouseDown('top', e)}
          />
          {/* Bottom Handle */}
          <rect
            x={width / 2 - halfHandleSize}
            y={height - halfHandleSize}
            width={handleSize}
            height={handleSize}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorMouseDown('bottom', e)}
          />
          {/* Left Handle */}
          <rect
            x={-halfHandleSize}
            y={height / 2 - halfHandleSize}
            width={handleSize}
            height={handleSize}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorMouseDown('left', e)}
          />
          {/* Right Handle */}
          <rect
            x={width - halfHandleSize}
            y={height / 2 - halfHandleSize}
            width={handleSize}
            height={handleSize}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorMouseDown('right', e)}
          />
        </>
      )}

      {/* Resize Handle (Z-index: Connection Handles > Resize Handle) */}
      {showHandles && !isEditingLabel && (
        <rect
          x={width - halfHandleSize}
          y={height - halfHandleSize}
          width={handleSize}
          height={handleSize}
          fill="#ef4444" // Red for resize
          stroke="#fff"
          strokeWidth="1"
          cursor="nwse-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}

      {/* Delete Icon Button (Z-index: Resize Handle > Delete Icon Button) */}
      {isSelected && !isEditingLabel && (
        <g
          transform={`translate(${width - 20}, -10)`} // Position top-right
          cursor="pointer"
          onClick={handleDeleteClick}
          onMouseDown={handleDeleteClick} // CRITICAL: Stop propagation on mousedown
        >
          <circle cx="10" cy="10" r="10" fill="#ef4444" /> {/* Red background circle */}
          <line x1="5" y1="5" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="#fff" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}