import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import TOOLBarMain from "./toolbar";
import Sidebar from "./sidebar";
import Node from "./node";
import Connection from "./connection";
import { useCoordinateUtils } from "./coordinates";

// Helper for unique IDs
let nextId = 1;
const generateId = () => `item-${nextId++}`;

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
 * @property {string} sourceAnchor - 'top', 'bottom', 'left', 'right'
 * @property {string} targetNodeId
 * @property {string} targetAnchor - 'top', 'bottom', 'left', 'right'
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
 * @typedef {object} SelectedItem
 * @property {string} id
 * @property {'node' | 'connection'} type
 */

/**
 * MainContent component is the main body where tools are dragged and rendered.
 * It manages the state of nodes, connections, selection, panning, and zooming.
 * @returns {JSX.Element} The MainContent UI.
 */
export default function MainContent() {
    /** @type {NodeData[]} */
    const [nodes, setNodes] = useState([]);
    /** @type {ConnectionData[]} */
    const [connections, setConnections] = useState([]);
    /**
     * @type {SelectedItem[]}
     * Manages multiple selections. When a single item is clicked, this array contains only that item.
     * When a group is selected, it contains all items in the group.
     */
    const [selectedItems, setSelectedItems] = useState([]);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    /** @type {({ x: number, y: number } | null)} */
    const [startPanCoords, setStartPanCoords] = useState(null);
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    /** @type {React.MutableRefObject<SVGSVGElement | null>} */
    const svgRef = useRef(null);
    /** @type {React.MutableRefObject<SVGGraphicsElement | null>} */
    const transformGroupRef = useRef(null);

    const { toWorldCoordinates } = useCoordinateUtils();

    /** @type {React.MutableRefObject<{ nodeId: string, anchorType: string, x: number, y: number } | null>} */
    const sourceAnchorRef = useRef(null);
    /** @type {React.MutableRefObject<{ startX: number, startY: number, endX: number, endY: number } | null>} */
    const tempConnectionRef = useRef(null);
    /** @type {({ startX: number, startY: number, endX: number, endY: number } | null)} */
    const [tempConnectionState, setTempConnectionState] = useState(null); // State for rendering temp connection

    const [isSelecting, setIsSelecting] = useState(false);
    /** @type {({ x: number, y: number } | null)} */
    const [selectionStartCoords, setSelectionStartCoords] = useState(null);
    /** @type {({ x: number, y: number, width: number, height: number } | null)} */
    const [selectionRect, setSelectionRect] = useState(null);

    const [isDraggingGroup, setIsDraggingGroup] = useState(false);
    /** @type {React.MutableRefObject<{ x: number, y: number, originalNodePositions: { [key: string]: { x: number, y: number } } } | null>} */
    const groupDragStartCoords = useRef(null);
    /** @type {React.MutableRefObject<{ [key: string]: { dx: number, dy: number } }>} */
    const groupDragOffsets = useRef({}); // Map: nodeId -> { dx, dy } relative to the clicked node

    /**
     * Calculates the world coordinates for a specific anchor point of a node.
     * @param {NodeData} node - The node object.
     * @param {string} anchorType - The type of anchor ('top', 'bottom', 'left', 'right').
     * @returns {{x: number, y: number}} The world coordinates of the anchor.
     */
    const getAnchorPoint = useCallback((node, anchorType) => {
        let anchorX = node.x;
        let anchorY = node.y;

        switch (anchorType) {
            case 'top':
                anchorX = node.x + node.width / 2;
                anchorY = node.y;
                break;
            case 'bottom':
                anchorX = node.x + node.width / 2;
                anchorY = node.y + node.height;
                break;
            case 'left':
                anchorX = node.x;
                anchorY = node.y + node.height / 2;
                break;
            case 'right':
                anchorX = node.x + node.width;
                anchorY = node.y + node.height / 2;
                break;
            default:
                break;
        }
        return { x: anchorX, y: anchorY };
    }, []);

    /**
     * Generates a Bezier curve path string for an SVG connection.
     * @param {number} startX - The starting X coordinate.
     * @param {number} startY - The starting Y coordinate.
     * @param {number} endX - The ending X coordinate.
     * @param {number} endY - The ending Y coordinate.
     * @returns {string} The SVG path string.
     */
    const getBezierPath = useCallback((startX, startY, endX, endY) => {
        // Simple horizontal/vertical offset for control points
        const cp1x = startX + (endX - startX) / 2;
        const cp1y = startY;
        const cp2x = startX + (endX - startX) / 2;
        const cp2y = endY;

        return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
    }, []);

    /**
     * Handles the drag over event on the SVG canvas.
     * @param {React.DragEvent<SVGSVGElement>} event - The drag event.
     */
    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    /**
     * Handles the drop event on the SVG canvas, creating a new node.
     * @param {React.DragEvent<SVGSVGElement>} event - The drop event.
     */
    const handleDrop = useCallback((event) => {
        event.preventDefault();
        if (!svgRef.current || !transformGroupRef.current) return;

        try {
            const data = event.dataTransfer.getData('application/json');
            const { type } = JSON.parse(data);

            const worldCoords = toWorldCoordinates(
                svgRef.current,
                transformGroupRef.current,
                event.clientX,
                event.clientY
            );

            const newNode = {
                id: generateId(),
                x: worldCoords.x - 50, // Center the node roughly
                y: worldCoords.y - 25,
                width: 100,
                height: 50,
                type: type.toLowerCase(),
                label: type
            };
            setNodes((prevNodes) => [...prevNodes, newNode]);
        } catch (error) {
            console.error("Failed to parse dropped data:", error);
        }
    }, [toWorldCoordinates]);

    /**
     * Manages the selection of a node or connection.
     * If multiple items are currently selected, this will deselect them and select only the new item.
     * @param {string} id - The ID of the item to select.
     * @param {'node' | 'connection'} type - The type of the item.
     */
    const handleSelect = useCallback((id, type) => {
        setSelectedItems([{ id, type }]);
    }, []);

    /**
     * Deselects all currently selected items.
     */
    const handleDeselect = useCallback(() => {
        setSelectedItems([]);
    }, []);

    /**
     * Handles the start of a connection drag from a node anchor.
     * @param {string} nodeId - The ID of the source node.
     * @param {string} anchorType - The type of anchor ('top', 'bottom', 'left', 'right').
     * @param {number} x - The X coordinate of the anchor in world space.
     * @param {number} y - The Y coordinate of the anchor in world space.
     */
    const handleAnchorDragStart = useCallback((nodeId, anchorType, x, y) => {
        sourceAnchorRef.current = { nodeId, anchorType, x, y };
        tempConnectionRef.current = { startX: x, startY: y, endX: x, endY: y };
        setTempConnectionState({ startX: x, startY: y, endX: x, endY: y });
    }, []);

    /**
     * Handles deletion requests for nodes or connections.
     * @param {string} id - The ID of the item to delete.
     * @param {'node' | 'connection'} type - The type of the item.
     */
    const handleDelete = useCallback((id, type) => {
        if (type === 'node') {
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
            setConnections((prevConnections) =>
                prevConnections.filter(
                    (conn) => conn.sourceNodeId !== id && conn.targetNodeId !== id
                )
            );
        } else if (type === 'connection') {
            setConnections((prevConnections) => prevConnections.filter((conn) => conn.id !== id));
        }
        setSelectedItems((prevSelected) => prevSelected.filter(item => item.id !== id));
    }, []);

    /**
     * Handles node drag events, updating its position.
     * If a group drag is active, this function will be ignored as the global mousemove handles it.
     * @param {string} id - The ID of the node.
     * @param {number} newX - The new X coordinate.
     * @param {number} newY - The new Y coordinate.
     */
    const handleNodeDrag = useCallback((id, newX, newY) => {
        if (isDraggingGroup) {
            return;
        }
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === id ? { ...node, x: newX, y: newY } : node))
        );
    }, [isDraggingGroup]);

    /**
     * Handles node resize events, updating its dimensions.
     * @param {string} id - The ID of the node.
     * @param {number} newWidth - The new width.
     * @param {number} newHeight - The new height.
     */
    const handleNodeResize = useCallback((id, newWidth, newHeight) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, width: newWidth, height: newHeight } : node
            )
        );
    }, []);

    /**
     * Handles node label change events.
     * @param {string} id - The ID of the node.
     * @param {string} newLabel - The new label.
     */
    const handleNodeLabelChange = useCallback((id, newLabel) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === id ? { ...node, label: newLabel } : node))
        );
        setSelectedItems([]); // Deselect after editing label as per contract
    }, []);

    /**
     * Handles connection label change events.
     * @param {string} id - The ID of the connection.
     * @param {string} newLabel - The new label.
     */
    const handleConnectionLabelChange = useCallback((id, newLabel) => {
        setConnections((prevConnections) =>
            prevConnections.map((conn) => (conn.id === id ? { ...conn, label: newLabel } : conn))
        );
    }, []);

    /**
     * Handles loading flow data from a JSON file.
     * @param {{ nodes: NodeData[], connections: ConnectionData[] }} data - The loaded flow data.
     */
    const handleLoadJson = useCallback((data) => {
        setNodes(data.nodes || []);
        setConnections(data.connections || []);
        setSelectedItems([]);
    }, []);

    /**
     * Resets the view to default pan and zoom.
     */
    const resetView = useCallback(() => {
        setPan({ x: 0, y: 0 });
        setZoom(1);
    }, []);

    // Global Mouse Move and Mouse Up handlers
    useEffect(() => {
        /**
         * Handles global mouse move events for panning, connection drawing, selection, and group drag.
         * @param {MouseEvent} event - The mouse event.
         */
        const handleGlobalMouseMove = (event) => {
            if (!svgRef.current || !transformGroupRef.current) return;

            if (isPanning && startPanCoords) {
                const dx = event.clientX - startPanCoords.x;
                const dy = event.clientY - startPanCoords.y;
                setPan((prevPan) => ({
                    x: prevPan.x + dx,
                    y: prevPan.y + dy,
                }));
                setStartPanCoords({ x: event.clientX, y: event.clientY });
            } else if (sourceAnchorRef.current && tempConnectionRef.current) {
                const worldCoords = toWorldCoordinates(
                    svgRef.current,
                    transformGroupRef.current,
                    event.clientX,
                    event.clientY
                );
                tempConnectionRef.current.endX = worldCoords.x;
                tempConnectionRef.current.endY = worldCoords.y;
                setTempConnectionState({ ...tempConnectionRef.current });
            } else if (isSelecting && selectionStartCoords) {
                const currentX = event.clientX;
                const currentY = event.clientY;

                const rectScreenX = Math.min(selectionStartCoords.x, currentX);
                const rectScreenY = Math.min(selectionStartCoords.y, currentY);
                const rectScreenWidth = Math.abs(currentX - selectionStartCoords.x);
                const rectScreenHeight = Math.abs(currentY - selectionStartCoords.y);

                // Convert screen coordinates of selection rectangle to world coordinates
                const worldStart = toWorldCoordinates(svgRef.current, transformGroupRef.current, rectScreenX, rectScreenY);
                const worldEnd = toWorldCoordinates(svgRef.current, transformGroupRef.current, rectScreenX + rectScreenWidth, rectScreenY + rectScreenHeight);

                setSelectionRect({
                    x: worldStart.x,
                    y: worldStart.y,
                    width: worldEnd.x - worldStart.x,
                    height: worldEnd.y - worldStart.y,
                });
            } else if (isDraggingGroup && groupDragStartCoords.current) {
                const worldCurrent = toWorldCoordinates(
                    svgRef.current,
                    transformGroupRef.current,
                    event.clientX,
                    event.clientY
                );

                const dx = worldCurrent.x - groupDragStartCoords.current.x;
                const dy = worldCurrent.y - groupDragStartCoords.current.y;

                setNodes(prevNodes => prevNodes.map(node => {
                    const isSelected = selectedItems.some(item => item.id === node.id && item.type === 'node');
                    if (isSelected) {
                        const offset = groupDragOffsets.current[node.id];
                        return {
                            ...node,
                            x: groupDragStartCoords.current.originalNodePositions[node.id].x + dx + offset.dx,
                            y: groupDragStartCoords.current.originalNodePositions[node.id].y + dy + offset.dy,
                        };
                    }
                    return node;
                }));
            }
        };

        /**
         * Handles global mouse up events for ending panning, connection drawing, selection, and group drag.
         * @param {MouseEvent} event - The mouse event.
         */
        const handleGlobalMouseUp = (event) => {
            if (isPanning) {
                setIsPanning(false);
                setStartPanCoords(null);
            }

            if (sourceAnchorRef.current && tempConnectionRef.current) {
                const source = sourceAnchorRef.current;
                const worldEnd = toWorldCoordinates(
                    svgRef.current,
                    transformGroupRef.current,
                    event.clientX,
                    event.clientY
                );

                let targetAnchor = null;
                const ANCHOR_THRESHOLD = 20 / zoom; // Adjust threshold based on zoom level

                // Find potential target anchor
                for (const node of nodes) {
                    if (node.id === source.nodeId) continue; // Cannot connect to self

                    const anchors = ['top', 'bottom', 'left', 'right'];
                    for (const type of anchors) {
                        const { x, y } = getAnchorPoint(node, type);
                        const distance = Math.sqrt(
                            Math.pow(worldEnd.x - x, 2) + Math.pow(worldEnd.y - y, 2)
                        );
                        if (distance < ANCHOR_THRESHOLD) {
                            targetAnchor = { nodeId: node.id, anchorType: type, x, y };
                            break;
                        }
                    }
                    if (targetAnchor) break;
                }

                if (targetAnchor) {
                    const newConnection = {
                        id: generateId(),
                        sourceNodeId: source.nodeId,
                        sourceAnchor: source.anchorType,
                        targetNodeId: targetAnchor.nodeId,
                        targetAnchor: targetAnchor.anchorType,
                        label: '',
                    };
                    setConnections((prevConnections) => [...prevConnections, newConnection]);
                }

                sourceAnchorRef.current = null;
                tempConnectionRef.current = null;
                setTempConnectionState(null);
            }

            if (isSelecting) {
                setIsSelecting(false);
                setSelectionStartCoords(null);
                if (selectionRect) {
                    const newSelectedItems = nodes.filter(node => {
                        // Check if node is completely enclosed by selectionRect
                        return (
                            node.x >= selectionRect.x &&
                            node.y >= selectionRect.y &&
                            node.x + node.width <= selectionRect.x + selectionRect.width &&
                            node.y + node.height <= selectionRect.y + selectionRect.height
                        );
                    }).map(node => ({ id: node.id, type: 'node' }));
                    setSelectedItems(newSelectedItems);
                }
                setSelectionRect(null);
            }

            if (isDraggingGroup) {
                setIsDraggingGroup(false);
                groupDragStartCoords.current = null;
                groupDragOffsets.current = {};
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isPanning, startPanCoords, toWorldCoordinates, nodes, getAnchorPoint, isSelecting, selectionStartCoords, selectionRect, isDraggingGroup, selectedItems, zoom]);

    // Keyboard event handlers for Space (panning) and Delete
    useEffect(() => {
        /**
         * Handles keyboard down events.
         * @param {KeyboardEvent} event - The keyboard event.
         */
        const handleKeyDown = (event) => {
            if (event.key === ' ') {
                event.preventDefault(); // Prevent scrolling
                setIsSpacePressed(true);
            } else if (event.key === 'Delete' || event.key === 'Backspace') {
                if (selectedItems.length > 0) {
                    // Delete all selected items
                    selectedItems.forEach(item => handleDelete(item.id, item.type));
                    setSelectedItems([]);
                }
            }
        };

        /**
         * Handles keyboard up events.
         * @param {KeyboardEvent} event - The keyboard event.
         */
        const handleKeyUp = (event) => {
            if (event.key === ' ') {
                setIsSpacePressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [selectedItems, handleDelete]);

    /**
     * Handles mouse down events on the SVG canvas for panning or starting selection.
     * This handler is attached to the root SVG element and uses event bubbling to detect clicks on nodes/connections.
     * @param {React.MouseEvent<SVGSVGElement>} event - The mouse event.
     */
    const handleSvgMouseDown = useCallback((event) => {
        if (!svgRef.current || !transformGroupRef.current) return;

        // Determine if a node or connection was clicked by checking data attributes on closest elements.
        // Node and Connection components are expected to add `data-node-id` or `data-connection-id` to their root SVG elements.
        const targetElement = event.target.closest('[data-node-id], [data-connection-id]');
        const clickedNodeId = targetElement?.dataset?.nodeId;
        const clickedConnectionId = targetElement?.dataset?.connectionId;

        if (isSpacePressed || event.button === 1) { // Space key or middle mouse button for panning
            event.preventDefault();
            setIsPanning(true);
            setStartPanCoords({ x: event.clientX, y: event.clientY });
            svgRef.current.style.cursor = 'grabbing';
            return;
        }

        if (event.button === 0) { // Left click
            if (clickedNodeId) {
                const isNodeSelected = selectedItems.some(item => item.id === clickedNodeId && item.type === 'node');

                if (selectedItems.length > 1 && isNodeSelected) {
                    // If clicking a selected node that is part of a multi-selection, start group drag.
                    setIsDraggingGroup(true);
                    const worldStart = toWorldCoordinates(
                        svgRef.current,
                        transformGroupRef.current,
                        event.clientX,
                        event.clientY
                    );
                    groupDragStartCoords.current = {
                        x: worldStart.x,
                        y: worldStart.y,
                        originalNodePositions: {}
                    };

                    const offsets = {};
                    const clickedNode = nodes.find(n => n.id === clickedNodeId);
                    if (clickedNode) {
                        selectedItems.forEach(item => {
                            if (item.type === 'node') {
                                const node = nodes.find(n => n.id === item.id);
                                if (node) {
                                    offsets[node.id] = {
                                        dx: node.x - clickedNode.x, // Offset relative to the clicked node
                                        dy: node.y - clickedNode.y,
                                    };
                                    groupDragStartCoords.current.originalNodePositions[node.id] = { x: node.x, y: node.y };
                                }
                            }
                        });
                    }
                    groupDragOffsets.current = offsets;
                    // Do NOT stop propagation. Let the Node component's own onMouseDown/onDrag fire.
                    // handleNodeDrag will then decide to ignore it if isDraggingGroup is true.
                    return;
                } else if (!isNodeSelected || selectedItems.length > 1) {
                    // If clicking an unselected node, or clicking a selected node when multiple are selected,
                    // deselect all others and select only this one.
                    handleSelect(clickedNodeId, 'node');
                    // Do NOT stop propagation. Let the Node component's own onMouseDown/onDrag fire.
                    return;
                }
                // If clicking an already single-selected node, let Node component handle its drag/selection.
                // Its onSelect will be called, then its onDrag.
                return;

            } else if (clickedConnectionId) {
                handleSelect(clickedConnectionId, 'connection');
                // Do NOT stop propagation. Let the Connection component's own onMouseDown fire.
                return;
            } else {
                // Clicked on empty space
                handleDeselect();
                setIsSelecting(true);
                setSelectionStartCoords({ x: event.clientX, y: event.clientY });
            }
        }
    }, [isSpacePressed, selectedItems, nodes, toWorldCoordinates, handleSelect, handleDeselect]);

    /**
     * Handles mouse up events on the SVG canvas.
     * @param {React.MouseEvent<SVGSVGElement>} event - The mouse event.
     */
    const handleSvgMouseUp = useCallback((event) => {
        if (isPanning) {
            svgRef.current.style.cursor = isSpacePressed ? 'grab' : 'default';
        }
    }, [isPanning, isSpacePressed]);

    /**
     * Handles mouse wheel events for zooming.
     * @param {React.WheelEvent<SVGSVGElement>} event - The wheel event.
     */
    const handleWheel = useCallback((event) => {
        event.preventDefault();
        if (!svgRef.current || !transformGroupRef.current) return;

        const scaleFactor = 1.1;
        const newZoom = event.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;

        // Zoom-to-Cursor logic (Strictly following the provided formula)
        const rect = svgRef.current.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;

        const worldPoint = toWorldCoordinates(
            svgRef.current,
            transformGroupRef.current,
            event.clientX,
            event.clientY
        );

        const newPanX = screenX - worldPoint.x * newZoom;
        const newPanY = screenY - worldPoint.y * newZoom;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
    }, [zoom, toWorldCoordinates]);

    // Memoized connection render data to calculate start/end coordinates for each connection.
    const connectionRenderData = useMemo(() => {
        return connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.sourceNodeId);
            const targetNode = nodes.find((n) => n.id === conn.targetNodeId);

            if (!sourceNode || !targetNode) return null;

            const sourcePoint = getAnchorPoint(sourceNode, conn.sourceAnchor);
            const targetPoint = getAnchorPoint(targetNode, conn.targetAnchor);

            return {
                id: conn.id,
                startX: sourcePoint.x,
                startY: sourcePoint.y,
                endX: targetPoint.x,
                endY: targetPoint.y,
                isSelected: selectedItems.some(item => item.id === conn.id && item.type === 'connection'),
                label: conn.label,
            };
        }).filter(Boolean);
    }, [connections, nodes, getAnchorPoint, selectedItems]);

    // Memoized flow data for the toolbar (export JSON, Mermaid)
    const flowData = useMemo(() => ({ nodes, connections }), [nodes, connections]);

    return (
        <div className="flex flex-row h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-grow bg-gray-100 relative">
                <TOOLBarMain
                    getSvgElement={() => svgRef.current}
                    flowData={flowData}
                    onLoadJson={handleLoadJson}
                />
                <div className="flex-grow relative bg-white">
                    <svg
                        ref={svgRef}
                        className={`absolute inset-0 w-full h-full ${isSpacePressed ? 'cursor-grab' : 'cursor-default'}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onMouseDown={handleSvgMouseDown}
                        onMouseUp={handleSvgMouseUp}
                        onWheel={handleWheel}
                    >
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                            </pattern>
                            <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
                            </marker>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#grid)" />

                        <g ref={transformGroupRef} transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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
                                    isSelected={selectedItems.some(item => item.id === node.id && item.type === 'node')}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
                                    onDrag={handleNodeDrag}
                                    onResize={handleNodeResize}
                                    onLabelChange={handleNodeLabelChange}
                                    onDelete={handleDelete}
                                    onAnchorDragStart={handleAnchorDragStart}
                                />
                            ))}

                            {tempConnectionState && (
                                <path
                                    d={getBezierPath(
                                        tempConnectionState.startX,
                                        tempConnectionState.startY,
                                        tempConnectionState.endX,
                                        tempConnectionState.endY
                                    )}
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                />
                            )}

                            {selectionRect && (
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
                    <button
                        onClick={resetView}
                        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600"
                    >
                        Reset View
                    </button>
                </div>
            </div>
        </div>
    );
}