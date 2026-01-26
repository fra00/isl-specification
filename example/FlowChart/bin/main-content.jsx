import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import TOOLBarMain from './toolbar.jsx';
import Sidebar from './sidebar.jsx';
import Node from './node.jsx';
import Connection from './connection.jsx';
import { useCoordinateUtils } from './coordinates.js';

/**
 * @typedef {object} NodeData
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} type - 'action' or 'condition'
 * @property {string} label
 */

/**
 * @typedef {object} ConnectionData
 * @property {string} id
 * @property {string} sourceNodeId
 * @property {string} targetNodeId
 * @property {string} sourceAnchor
 * @property {string} targetAnchor
 * @property {string} label
 */

/**
 * @typedef {object} ConnectionRenderData
 * @property {string} id
 * @property {number} startX
 * @property {number} startY
 * @property {number} endX
 * @property {number} endY
 * @property {boolean} isSelected
 * @property {string} label
 */

/**
 * @typedef {object} SelectionRect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

const NODE_WIDTH = 150;
const NODE_HEIGHT = 80;
const ANCHOR_THRESHOLD = 20; // px for connection snapping
const ZOOM_SENSITIVITY = 0.001; // How fast zoom changes
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2.0;

export default function MainContent() {
  const [nodes, setNodes] = useState(/** @type {NodeData[]} */ ([]));
  const [connections, setConnections] = useState(/** @type {ConnectionData[]} */ ([]));

  // For single item selection (last clicked)
  const [selectedId, setSelectedId] = useState(/** @type {string | null} */ (null));
  const [selectedType, setSelectedType] = useState(/** @type {'node' | 'connection' | null} */ (null));

  // For group selection
  const [selectedNodeIds, setSelectedNodeIds] = useState(/** @type {Set<string>} */ (new Set()));
  const [selectedConnectionIds, setSelectedConnectionIds] = useState(/** @type {Set<string>} */ (new Set()));

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 }); // Client coordinates where pan started

  const [isConnecting, setIsConnecting] = useState(false);
  const [tempConnection, setTempConnection] = useState(/** @type {{ startX: number, startY: number, endX: number, endY: number } | null} */ (null));
  const sourceNodeIdRef = useRef(/** @type {string | null} */ (null));
  const sourceAnchorTypeRef = useRef(/** @type {string | null} */ (null));

  const [isSelectingGroup, setIsSelectingGroup] = useState(false);
  const [selectionRect, setSelectionRect] = useState(/** @type {SelectionRect | null} */ (null));
  const selectionStartRef = useRef({ x: 0, y: 0 }); // World coordinates where selection started

  // Refs for group drag logic
  const initialDraggedNodePositionRef = useRef(/** @type {{x: number, y: number} | null} */ (null));
  const initialSelectedNodePositionsRef = useRef(/** @type {Map<string, {x: number, y: number}> | null} */ (null));

  const svgRef = useRef(/** @type {SVGSVGElement | null} */ (null));
  const transformGroupRef = useRef(/** @type {SVGGraphicsElement | null} */ (null));

  const { toWorldCoordinates } = useCoordinateUtils();

  /**
   * Generates a unique ID.
   * @returns {string}
   */
  const generateId = useCallback(() => Date.now().toString(36) + Math.random().toString(36).substring(2, 7), []);

  /**
   * Calculates the world coordinates of an anchor point for a given node.
   * @param {NodeData} node
   * @param {string} anchorType - 'top', 'bottom', 'left', 'right'
   * @returns {{x: number, y: number}}
   */
  const getAnchorPoint = useCallback((node, anchorType) => {
    const { x, y, width, height } = node;
    switch (anchorType) {
      case 'top': return { x: x + width / 2, y: y };
      case 'bottom': return { x: x + width / 2, y: y + height };
      case 'left': return { x: x, y: y + height / 2 };
      case 'right': return { x: x + width, y: y + height / 2 };
      default: return { x: x, y: y };
    }
  }, []);

  /**
   * Handles drag over event to allow dropping.
   * @param {React.DragEvent<HTMLDivElement>} event
   */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  /**
   * Handles drop event to create a new node.
   * @param {React.DragEvent<HTMLDivElement>} event
   */
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    if (!svgRef.current || !transformGroupRef.current) return;

    const data = event.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const { type: rawType } = JSON.parse(data);
      const type = rawType.toLowerCase();

      const { x: worldX, y: worldY } = toWorldCoordinates(
        svgRef.current,
        transformGroupRef.current,
        event.clientX,
        event.clientY
      );

      const newNode = {
        id: generateId(),
        x: worldX - NODE_WIDTH / 2,
        y: worldY - NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
    } catch (error) {
      console.error('Failed to parse dropped data:', error);
    }
  }, [generateId, nodes.length, toWorldCoordinates]);

  /**
   * Handles selection of a node or connection.
   * @param {string} id
   * @param {'node' | 'connection'} type
   */
  const handleSelect = useCallback((id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    setSelectedNodeIds(new Set()); // Clear group selection
    setSelectedConnectionIds(new Set()); // Clear group selection
  }, []);

  /**
   * Handles deselection of an item or clears all selections.
   * @param {string | null} [id=null] - The ID of the item to deselect. If null, clears all selections.
   */
  const handleDeselect = useCallback((id = null) => {
    if (id === selectedId) {
      setSelectedId(null);
      setSelectedType(null);
    }
    if (selectedNodeIds.has(id)) {
      const newSet = new Set(selectedNodeIds);
      newSet.delete(id);
      setSelectedNodeIds(newSet);
    }
    if (selectedConnectionIds.has(id)) {
      const newSet = new Set(selectedConnectionIds);
      newSet.delete(id);
      setSelectedConnectionIds(newSet);
    }
    if (!id || (selectedId === id && selectedNodeIds.size === 0 && selectedConnectionIds.size === 0)) {
      // If no ID provided, or if the last selected item is being deselected and no group is selected
      setSelectedId(null);
      setSelectedType(null);
      setSelectedNodeIds(new Set());
      setSelectedConnectionIds(new Set());
    }
  }, [selectedId, selectedNodeIds, selectedConnectionIds]);

  /**
   * Handles the start of a connection drag from a node anchor.
   * @param {string} nodeId
   * @param {string} anchorType
   * @param {number} x
   * @param {number} y
   */
  const handleAnchorDragStart = useCallback((nodeId, anchorType, x, y) => {
    setIsConnecting(true);
    setTempConnection({ startX: x, startY: y, endX: x, endY: y });
    sourceNodeIdRef.current = nodeId;
    sourceAnchorTypeRef.current = anchorType;
  }, []);

  /**
   * Calculates the path for a Bezier curve connection.
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   * @returns {string} SVG path string
   */
  const calculateBezierPath = useCallback((startX, startY, endX, endY) => {
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const curveFactor = 0.5; // Adjust for more or less curve

    let path = `M ${startX} ${startY}`;

    // Simple horizontal/vertical bezier for now
    if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
      // More horizontal
      const midX = startX + (endX - startX) * curveFactor;
      path += ` C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
    } else {
      // More vertical
      const midY = startY + (endY - startY) * curveFactor;
      path += ` C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
    }

    return path;
  }, []);

  /**
   * Calculates connection render data (start/end coordinates).
   * @type {ConnectionRenderData[]}
   */
  const connectionRenderData = useMemo(() => {
    return connections.map((conn) => {
      const sourceNode = nodes.find((n) => n.id === conn.sourceNodeId);
      const targetNode = nodes.find((n) => n.id === conn.targetNodeId);

      if (!sourceNode || !targetNode) {
        console.warn(`Missing node for connection ${conn.id}`);
        return null;
      }

      const { x: startX, y: startY } = getAnchorPoint(sourceNode, conn.sourceAnchor);
      const { x: endX, y: endY } = getAnchorPoint(targetNode, conn.targetAnchor);

      return {
        id: conn.id,
        startX,
        startY,
        endX,
        endY,
        isSelected: selectedId === conn.id || selectedConnectionIds.has(conn.id),
        label: conn.label,
      };
    }).filter(Boolean);
  }, [connections, nodes, getAnchorPoint, selectedId, selectedConnectionIds]);

  /**
   * Handles deletion of a node or connection.
   * @param {string} id
   * @param {'node' | 'connection'} type
   */
  const handleDelete = useCallback((id, type) => {
    if (type === 'node') {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      setConnections((prevConnections) =>
        prevConnections.filter((conn) => conn.sourceNodeId !== id && conn.targetNodeId !== id)
      );
    } else if (type === 'connection') {
      setConnections((prevConnections) => prevConnections.filter((conn) => conn.id !== id));
    }
    handleDeselect(id); // Deselect the item after deletion
  }, [handleDeselect]);

  /**
   * Handles node drag event.
   * @param {string} id - The ID of the node being dragged.
   * @param {number} newX - The new X coordinate for the dragged node.
   * @param {number} newY - The new Y coordinate for the dragged node.
   */
  const handleNodeDrag = useCallback((id, newX, newY) => {
    setNodes((prevNodes) => {
      // If this is the very first drag event in a sequence, capture initial states
      if (!initialDraggedNodePositionRef.current) {
        const draggedNode = prevNodes.find(node => node.id === id);
        if (!draggedNode) return prevNodes;

        initialDraggedNodePositionRef.current = { x: draggedNode.x, y: draggedNode.y };

        // If the dragged node is part of a multi-selection, store initial positions for all selected nodes
        if (selectedNodeIds.has(id) && selectedNodeIds.size > 1) {
          const initialPositions = new Map();
          selectedNodeIds.forEach(selectedId => {
            const node = prevNodes.find(n => n.id === selectedId);
            if (node) {
              initialPositions.set(selectedId, { x: node.x, y: node.y });
            }
          });
          initialSelectedNodePositionsRef.current = initialPositions;
        } else {
          // If it's a single drag, ensure group selection is cleared and only this node is selected
          setSelectedNodeIds(new Set([id]));
          setSelectedConnectionIds(new Set());
          setSelectedId(id);
          setSelectedType('node');
          initialSelectedNodePositionsRef.current = null; // No group to track
        }
      }

      // Calculate the delta based on the movement of the *currently dragged node*
      const initialX = initialDraggedNodePositionRef.current.x;
      const initialY = initialDraggedNodePositionRef.current.y;
      const dx = newX - initialX;
      const dy = newY - initialY;

      // Apply the delta
      return prevNodes.map((node) => {
        if (selectedNodeIds.has(node.id) && initialSelectedNodePositionsRef.current) {
          // This node is part of the group being dragged
          const startPos = initialSelectedNodePositionsRef.current.get(node.id);
          if (startPos) {
            return { ...node, x: startPos.x + dx, y: startPos.y + dy };
          }
        } else if (node.id === id && !initialSelectedNodePositionsRef.current) {
          // This is the single node being dragged (no group selection active)
          return { ...node, x: newX, y: newY };
        }
        return node;
      });
    });
  }, [selectedNodeIds]); // `nodes` is accessed via `prevNodes` in `setNodes`.

  /**
   * Handles node resize event.
   * @param {string} id
   * @param {number} width
   * @param {number} height
   */
  const handleNodeResize = useCallback((id, width, height) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, width, height } : node))
    );
  }, []);

  /**
   * Handles node label change event.
   * @param {string} id
   * @param {string} label
   */
  const handleNodeLabelChange = useCallback((id, label) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, label } : node))
    );
  }, []);

  /**
   * Handles connection label change event.
   * @param {string} id
   * @param {string} label
   */
  const handleConnectionLabelChange = useCallback((id, label) => {
    setConnections((prevConnections) =>
      prevConnections.map((conn) => (conn.id === id ? { ...conn, label } : conn))
    );
  }, []);

  /**
   * Handles loading flow data from JSON.
   * @param {{ nodes: NodeData[], connections: ConnectionData[] }} data
   */
  const handleLoadJson = useCallback((data) => {
    setNodes(data.nodes || []);
    setConnections(data.connections || []);
    setSelectedId(null);
    setSelectedType(null);
    setSelectedNodeIds(new Set());
    setSelectedConnectionIds(new Set());
  }, []);

  /**
   * Handles mouse down event on the SVG canvas.
   * @param {React.MouseEvent<SVGSVGElement>} event
   */
  const handleCanvasMouseDown = useCallback((event) => {
    if (!svgRef.current || !transformGroupRef.current) return;

    const { x: worldX, y: worldY } = toWorldCoordinates(
      svgRef.current,
      transformGroupRef.current,
      event.clientX,
      event.clientY
    );

    // Panning (Space key + Left click OR Middle click)
    if (event.button === 1 || (event.button === 0 && event.nativeEvent.code === 'Space')) {
      event.preventDefault(); // Prevent default middle click behavior (e.g., autoscroll)
      setIsPanning(true);
      panStartRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
      return;
    }

    // Group selection start (Left click on empty area)
    if (event.button === 0 && !event.target.closest('.node-element, .connection-element')) {
      handleDeselect(); // Deselect any single item or group
      setIsSelectingGroup(true);
      selectionStartRef.current = { x: worldX, y: worldY };
      setSelectionRect({ x: worldX, y: worldY, width: 0, height: 0 });
      return;
    }

    // Deselect all if clicking on empty canvas and not starting group selection
    if (!event.target.closest('.node-element, .connection-element')) {
      handleDeselect();
    }
  }, [pan, toWorldCoordinates, handleDeselect]);

  /**
   * Handles mouse move event on the SVG canvas.
   * @param {React.MouseEvent<SVGSVGElement>} event
   */
  const handleCanvasMouseMove = useCallback((event) => {
    if (!svgRef.current || !transformGroupRef.current) return;

    const { x: worldX, y: worldY } = toWorldCoordinates(
      svgRef.current,
      transformGroupRef.current,
      event.clientX,
      event.clientY
    );

    // Panning
    if (isPanning) {
      setPan({
        x: event.clientX - panStartRef.current.x,
        y: event.clientY - panStartRef.current.y,
      });
      return;
    }

    // Connection creation (temporary line)
    if (isConnecting && tempConnection) {
      setTempConnection((prev) => (prev ? { ...prev, endX: worldX, endY: worldY } : null));
      return;
    }

    // Group selection rectangle drawing
    if (isSelectingGroup && selectionRect) {
      const startX = selectionStartRef.current.x;
      const startY = selectionStartRef.current.y;
      const newX = Math.min(startX, worldX);
      const newY = Math.min(startY, worldY);
      const newWidth = Math.abs(worldX - startX);
      const newHeight = Math.abs(worldY - startY);
      setSelectionRect({ x: newX, y: newY, width: newWidth, height: newHeight });
      return;
    }
  }, [isPanning, isConnecting, tempConnection, isSelectingGroup, selectionRect, pan, toWorldCoordinates]);

  /**
   * Handles mouse up event on the SVG canvas.
   * @param {React.MouseEvent<SVGSVGElement>} event
   */
  const handleCanvasMouseUp = useCallback((event) => {
    if (!svgRef.current || !transformGroupRef.current) return;

    const { x: worldX, y: worldY } = toWorldCoordinates(
      svgRef.current,
      transformGroupRef.current,
      event.clientX,
      event.clientY
    );

    // End Panning
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    // End Connection creation
    if (isConnecting) {
      setIsConnecting(false);
      setTempConnection(null);

      const sourceNodeId = sourceNodeIdRef.current;
      const sourceAnchorType = sourceAnchorTypeRef.current;

      if (!sourceNodeId || !sourceAnchorType) return;

      let targetNodeId = null;
      let targetAnchorType = null;

      // Find potential target anchor
      for (const node of nodes) {
        if (node.id === sourceNodeId) continue; // Cannot connect to self

        const anchors = ['top', 'bottom', 'left', 'right'];
        for (const anchorType of anchors) {
          const { x: anchorX, y: anchorY } = getAnchorPoint(node, anchorType);
          const distance = Math.hypot(worldX - anchorX, worldY - anchorY);

          if (distance < ANCHOR_THRESHOLD) {
            targetNodeId = node.id;
            targetAnchorType = anchorType;
            break;
          }
        }
        if (targetNodeId) break;
      }

      if (targetNodeId && targetAnchorType) {
        const newConnection = {
          id: generateId(),
          sourceNodeId,
          targetNodeId,
          sourceAnchor: sourceAnchorType,
          targetAnchor: targetAnchorType,
          label: '',
        };
        setConnections((prev) => [...prev, newConnection]);
      }

      sourceNodeIdRef.current = null;
      sourceAnchorTypeRef.current = null;
      return;
    }

    // End Group selection
    if (isSelectingGroup) {
      setIsSelectingGroup(false);
      if (selectionRect) {
        const newSelectedNodeIds = new Set();
        nodes.forEach((node) => {
          // Check if node is completely enclosed by selectionRect
          const nodeRect = { x: node.x, y: node.y, width: node.width, height: node.height };
          if (
            nodeRect.x >= selectionRect.x &&
            nodeRect.y >= selectionRect.y &&
            nodeRect.x + nodeRect.width <= selectionRect.x + selectionRect.width &&
            nodeRect.y + nodeRect.height <= selectionRect.y + selectionRect.height
          ) {
            newSelectedNodeIds.add(node.id);
          }
        });
        setSelectedNodeIds(newSelectedNodeIds);
        setSelectedConnectionIds(new Set()); // Clear connection selection
        setSelectedId(null); // Clear single selection
      }
      setSelectionRect(null);
      return;
    }
  }, [isPanning, isConnecting, tempConnection, nodes, getAnchorPoint, generateId, isSelectingGroup, selectionRect, toWorldCoordinates]);

  /**
   * Handles mouse wheel event for zooming.
   * @param {React.WheelEvent<SVGSVGElement>} event
   */
  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (!svgRef.current || !transformGroupRef.current) return;

    const scaleAmount = event.deltaY * -ZOOM_SENSITIVITY;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (1 + scaleAmount)));

    const { x: mouseWorldX, y: mouseWorldY } = toWorldCoordinates(
      svgRef.current,
      transformGroupRef.current,
      event.clientX,
      event.clientY
    );

    // Calculate new pan to keep the mouse position fixed in world space
    const newPanX = event.clientX - mouseWorldX * newZoom;
    const newPanY = event.clientY - mouseWorldY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [zoom, pan, toWorldCoordinates]);

  /**
   * Resets the view to default pan and zoom.
   */
  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  // Keyboard event listener for Delete key
  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedId) {
          handleDelete(selectedId, selectedType);
        } else if (selectedNodeIds.size > 0) {
          selectedNodeIds.forEach(id => handleDelete(id, 'node'));
          setSelectedNodeIds(new Set()); // Clear after deleting
        } else if (selectedConnectionIds.size > 0) {
          selectedConnectionIds.forEach(id => handleDelete(id, 'connection'));
          setSelectedConnectionIds(new Set()); // Clear after deleting
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, selectedType, selectedNodeIds, selectedConnectionIds, handleDelete]);

  // Reset drag state on mouse up/leave (anywhere on canvas)
  useEffect(() => {
    const resetDragState = () => {
      initialDraggedNodePositionRef.current = null;
      initialSelectedNodePositionsRef.current = null;
    };
    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('mouseup', resetDragState);
      svgElement.addEventListener('mouseleave', resetDragState);
    }
    return () => {
      if (svgElement) {
        svgElement.removeEventListener('mouseup', resetDragState);
        svgElement.removeEventListener('mouseleave', resetDragState);
      }
    };
  }, []);

  // Cursor style for panning
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.cursor = isPanning ? 'grabbing' : 'default';
    }
  }, [isPanning]);

  /**
   * Returns the SVG element for the toolbar's export functions.
   * @returns {SVGSVGElement | null}
   */
  const getSvgElementForExport = useCallback(() => svgRef.current, []);

  const flowData = useMemo(() => ({ nodes, connections }), [nodes, connections]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <TOOLBarMain
          getSvgElement={getSvgElementForExport}
          flowData={flowData}
          onLoadJson={handleLoadJson}
        />
        <div
          className="relative flex-grow bg-white"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            backgroundImage: `linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp} // End drag/pan/connect if mouse leaves SVG
            onWheel={handleWheel}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
              </marker>
            </defs>

            <g
              ref={transformGroupRef}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
              {/* Connections */}
              {connectionRenderData.map((conn) => (
                <Connection
                  key={conn.id}
                  id={conn.id}
                  startX={conn.startX}
                  startY={conn.startY}
                  endX={conn.endX}
                  endY={conn.endY}
                  isSelected={conn.isSelected}
                  label={conn.label}
                  onSelect={handleSelect}
                  onLabelChange={handleConnectionLabelChange}
                  onDelete={handleDelete}
                />
              ))}

              {/* Nodes */}
              {nodes.map((node) => (
                <Node
                  key={node.id}
                  id={node.id}
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  type={node.type}
                  label={node.label}
                  isSelected={selectedId === node.id || selectedNodeIds.has(node.id)}
                  onSelect={handleSelect}
                  onDrag={handleNodeDrag}
                  onResize={handleNodeResize}
                  onLabelChange={handleNodeLabelChange}
                  onDelete={handleDelete}
                  onAnchorDragStart={handleAnchorDragStart}
                  onDeselect={handleDeselect}
                />
              ))}

              {/* Temporary Connection Line */}
              {isConnecting && tempConnection && (
                <path
                  d={calculateBezierPath(
                    tempConnection.startX,
                    tempConnection.startY,
                    tempConnection.endX,
                    tempConnection.endY
                  )}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}

              {/* Group Selection Rectangle */}
              {isSelectingGroup && selectionRect && (
                <rect
                  x={selectionRect.x}
                  y={selectionRect.y}
                  width={selectionRect.width}
                  height={selectionRect.height}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </g>
          </svg>
          {/* Reset View Button */}
          <button
            onClick={resetView}
            className="absolute bottom-4 right-4 bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}