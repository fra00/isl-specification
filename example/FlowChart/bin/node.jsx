import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} NodeProps
 * @property {string} id - The unique identifier for the node.
 * @property {number} x - The x-coordinate of the node's position.
 * @property {number} y - The y-coordinate of the node's position.
 * @property {number} width - The width of the node.
 * @property {number} height - The height of the node.
 * @property {'action' | 'condition'} type - The type of the node, determines its shape.
 * @property {string} label - The text label displayed on the node.
 * @property {boolean} isSelected - Indicates if the node is currently selected.
 * @property {(id: string, type: 'node') => void} onSelect - Callback when the node is selected.
 * @property {(id: string, newX: number, newY: number) => void} onDrag - Callback when the node is dragged.
 * @property {(id: string, newWidth: number, newHeight: number) => void} onResize - Callback when the node is resized.
 * @property {(id: string, newLabel: string) => void} onLabelChange - Callback when the node's label changes.
 * @property {(id: string, type: 'node') => void} onDelete - Callback when the node is requested to be deleted.
 * @property {(id: string, anchorType: 'top' | 'bottom' | 'left' | 'right', x: number, y: number) => void} onAnchorDragStart - Callback when a connection drag starts from an anchor.
 * @property {(id: string) => void} onDeselect - Callback to deselect the node, typically used during label editing.
 */

/**
 * Node component for a flow chart.
 * Renders a node with a label, interaction handles, and supports drag, resize, label editing, and deletion.
 *
 * @param {NodeProps} props
 * @returns {JSX.Element} An SVG group element representing the node.
 */
function Node({
  id,
  x,
  y,
  width,
  height,
  type,
  label,
  isSelected,
  onSelect,
  onDrag,
  onResize,
  onLabelChange,
  onDelete,
  onAnchorDragStart,
  onDeselect,
}) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const [showInteractionHandles, setShowInteractionHandles] = useState(false);
  const inputRef = useRef(null);
  const clickTimerRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    setCurrentLabel(label); // Update currentLabel if prop changes
  }, [label]);

  // --- Capability: MouseOver Node ---
  const handleMouseEnter = useCallback(() => {
    setShowInteractionHandles(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowInteractionHandles(false);
  }, []);

  // --- Capability: Select Node & edit label Node (double click detection) ---
  const handleNodeClick = useCallback((e) => {
    e.stopPropagation(); // Prevent global click handlers from firing
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      // Double click detected, activate label edit mode
      console.log('Node: Double click detected, activating label edit.');
      setIsEditingLabel(true);
      onDeselect(id); // Emit onDeselect to clear selection
      // Wait a small interval to ensure input is rendered and focusable
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // Select text for easier editing
      }, 50);
    } else {
      // First click, set timer for double click detection
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        if (!isEditingLabel) { // Only select if not already editing
          console.log('Node: Single click detected, selecting node.');
          onSelect(id, 'node');
        }
      }, 300); // 300ms for double click detection
    }
  }, [id, onSelect, onDeselect, isEditingLabel]);

  // --- Capability: move ---
  const handleDragStart = useCallback((e) => {
    if (isEditingLabel) return; // Do not drag if editing label
    e.stopPropagation(); // Prevent other handlers from firing
    const startX = e.clientX;
    const startY = e.clientY;
    const initialNodeX = x;
    const initialNodeY = y;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onDrag(id, initialNodeX + deltaX, initialNodeY + deltaY);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (nodeRef.current) {
        nodeRef.current.style.cursor = isSelected ? 'grab' : 'default'; // Restore cursor
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    if (nodeRef.current) {
      nodeRef.current.style.cursor = 'grabbing'; // Change cursor while dragging
    }
  }, [id, x, y, onDrag, isEditingLabel, isSelected]);

  // --- Capability: resize ---
  const handleResizeStart = useCallback((e) => {
    e.stopPropagation(); // Prevent node drag from starting
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = width;
    const initialHeight = height;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newWidth = Math.max(50, initialWidth + deltaX); // Min width 50
      const newHeight = Math.max(30, initialHeight + deltaY); // Min height 30
      onResize(id, newWidth, newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [id, width, height, onResize]);

  // --- Capability: Start Connection Drag ---
  const handleAnchorDragStart = useCallback((e, anchorType) => {
    e.stopPropagation(); // Prevent node drag
    const anchorX = x + (anchorType === 'left' ? 0 : anchorType === 'right' ? width : width / 2);
    const anchorY = y + (anchorType === 'top' ? 0 : anchorType === 'bottom' ? height : height / 2);
    onAnchorDragStart(id, anchorType, anchorX, anchorY);
  }, [id, x, y, width, height, onAnchorDragStart]);

  // --- Capability: edit label Node (input handlers) ---
  const handleLabelInputChange = useCallback((e) => {
    setCurrentLabel(e.target.value);
  }, []);

  const handleLabelInputKeyDown = useCallback((e) => {
    // CRITICAL: Stop propagation of keydown events
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation();
      console.log(`Node: Stopped propagation for key: ${e.key}`);
      return;
    }

    if (e.key === 'Enter') {
      console.log('Node: Enter pressed, saving label.');
      onLabelChange(id, currentLabel);
      setIsEditingLabel(false);
    } else if (e.key === 'Escape') {
      console.log('Node: Escape pressed, canceling label edit.');
      setCurrentLabel(label); // Restore original label
      setIsEditingLabel(false);
    }
    e.stopPropagation(); // Stop propagation for all keydown events in the input
  }, [id, currentLabel, label, onLabelChange]);

  const handleLabelInputBlur = useCallback(() => {
    if (isEditingLabel) {
      console.log('Node: Input blurred, saving label.');
      onLabelChange(id, currentLabel);
      setIsEditingLabel(false);
    }
  }, [id, currentLabel, isEditingLabel, onLabelChange]);

  // --- Capability: delete ---
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation(); // CRITICAL: Prevent node drag from starting
    console.log('Node: Delete button clicked.');
    onDelete(id, 'node');
  }, [id, onDelete]);

  // Handle global 'Del' key press for deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace')) {
        console.log('Node: Delete key pressed for selected node.');
        onDelete(id, 'node');
        e.preventDefault(); // Prevent browser back/forward or other default actions
      }
    };

    if (isSelected) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, isSelected, onDelete]);

  // Calculate shape specific attributes
  let shapeElement;
  const strokeColor = isSelected ? '#3b82f6' : '#94a3b8'; // Blue for selected, gray for unselected
  const strokeWidth = isSelected ? 2 : 1;

  if (type.toLowerCase() === 'action') {
    shapeElement = (
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="8" // Rounded corners for action nodes
        ry="8"
        fill="#e0e7ff"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  } else if (type.toLowerCase() === 'condition') {
    // Rhombus points: (width/2, 0), (width, height/2), (width/2, height), (0, height/2)
    const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
    shapeElement = (
      <polygon
        points={points}
        fill="#e0e7ff"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
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
        rx="8"
        ry="8"
        fill="#e0e7ff"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  const showControls = isSelected || showInteractionHandles;

  return (
    <g
      ref={nodeRef}
      transform={`translate(${x},${y})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleNodeClick}
      onMouseDown={handleDragStart} // Node drag handler
      style={{ cursor: isSelected ? 'grab' : 'default' }}
    >
      {/* Main Shape */}
      {shapeElement}

      {/* Label */}
      {isEditingLabel ? (
        <foreignObject x="0" y="0" width={width} height={height}>
          <input
            ref={inputRef}
            type="text"
            value={currentLabel}
            onChange={handleLabelInputChange}
            onKeyDown={handleLabelInputKeyDown}
            onBlur={handleLabelInputBlur}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              padding: '0 8px',
              boxSizing: 'border-box',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              fontSize: '14px',
              outline: 'none',
            }}
            className="focus:ring-2 focus:ring-blue-500" // Tailwind for focus style
          />
        </foreignObject>
      ) : (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1f2937" // Dark gray text
          style={{ userSelect: 'none', pointerEvents: 'none' }} // Prevent text selection/drag
        >
          {label}
        </text>
      )}

      {/* Interaction Handles (Connection Handles, Resize Handle, Delete Button) */}
      {showControls && (
        <>
          {/* Connection Handles (Z-index: Node > Connection Handles) */}
          {/* Top Anchor */}
          <circle
            cx={width / 2}
            cy={0}
            r="6"
            fill="#3b82f6" // Blue
            stroke="#ffffff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorDragStart(e, 'top')}
          />
          {/* Bottom Anchor */}
          <circle
            cx={width / 2}
            cy={height}
            r="6"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorDragStart(e, 'bottom')}
          />
          {/* Left Anchor */}
          <circle
            cx={0}
            cy={height / 2}
            r="6"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorDragStart(e, 'left')}
          />
          {/* Right Anchor */}
          <circle
            cx={width}
            cy={height / 2}
            r="6"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="1"
            cursor="crosshair"
            onMouseDown={(e) => handleAnchorDragStart(e, 'right')}
          />

          {/* Resize Handle (Z-index: Connection Handles > resize handle) */}
          <rect
            x={width - 10}
            y={height - 10}
            width="10"
            height="10"
            fill="#3b82f6" // Blue
            stroke="#ffffff"
            strokeWidth="1"
            cursor="nwse-resize"
            onMouseDown={handleResizeStart}
          />

          {/* Delete Icon Button (Z-index: resize handle > Delete Icon Button) */}
          <circle
            cx={width}
            cy={0}
            r="10"
            fill="#ef4444" // Red
            stroke="#ffffff"
            strokeWidth="1"
            cursor="pointer"
            onMouseDown={handleDeleteClick} // CRITICAL: Stop propagation here
          />
          <text
            x={width}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="12"
            style={{ pointerEvents: 'none' }} // Ensure click goes to circle
          >
            X
          </text>
        </>
      )}
    </g>
  );
}

export default Node;