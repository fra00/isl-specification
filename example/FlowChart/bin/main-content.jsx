import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import TOOLBarMain from "./toolbar";
import Sidebar from "./sidebar";
import Node from "./node";
import Connection from "./connection";
import { useCoordinateUtils } from "./coordinates";

// Helper for unique IDs
const generateId = () => crypto.randomUUID();

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
 * @property {string} sourceAnchorType
 * @property {string} targetAnchorType
 * @property {string} [label]
 */

/**
 * @typedef {object} ConnectionRenderData
 * @property {string} id
 * @property {number} startX
 * @property {number} startY
 * @property {number} endX
 * @property {number} endY
 * @property {boolean} isSelected
 * @property {string} [label]
 */

/**
 * @typedef {object} FlowData
 * @property {NodeData[]} nodes
 * @property {ConnectionData[]} connections
 */

/**
 * MainContent component is the main body where TOOLs are dragged and rendered.
 * It manages the state of nodes, connections, selection, pan, and zoom.
 * @returns {JSX.Element} The MainContent component.
 */
export default function MainContent() {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    /**
     * @type {string | string[] | null}
     */
    const [selectedId, setSelectedId] = useState(null);
    /**
     * @type {'node' | 'connection' | 'node-group' | null}
     */
    const [selectedType, setSelectedType] = useState(null);

    const [isPanning, setIsPanning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPanOffset, setStartPanOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    /**
     * @type {{startX: number, startY: number, endX: number, endY: number, sourceNodeId: string, sourceAnchorType: string} | null}
     */
    const [tempConnection, setTempConnection] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    /**
     * @type {{x: number, y: number, width: number, height: number} | null}
     */
    const [selectionRect, setSelectionRect] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    /**
     * @type {{x: number, y: number} | null}
     */
    const [selectionStartPoint, setSelectionStartPoint] = useState(null);

    const [mermaidCode, setMermaidCode] = useState('');
    const [showMermaidModal, setShowMermaidModal] = useState(false);

    const [isSpacePressed, setIsSpacePressed] = useState(false);

    const svgRef = useRef(null);
    const transformGroupRef = useRef(null);

    const { toWorldCoordinates } = useCoordinateUtils();

    // --- Capabilities: Allow Drop ---
    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    // --- Capabilities: drop ---
    const handleDrop = useCallback((event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');
        if (data) {
            try {
                const { type: rawType } = JSON.parse(data);
                const type = rawType.toLowerCase(); // Data Normalization

                if (svgRef.current && transformGroupRef.current) {
                    const { x: worldX, y: worldY } = toWorldCoordinates(
                        svgRef.current,
                        transformGroupRef.current,
                        event.clientX,
                        event.clientY
                    );

                    const newNode = {
                        id: generateId(),
                        x: worldX - 50, // Center the node roughly
                        y: worldY - 25,
                        width: 100,
                        height: 50,
                        type: type,
                        label: `${rawType} ${nodes.length + 1}`,
                    };
                    setNodes((prevNodes) => [...prevNodes, newNode]);
                }
            } catch (error) {
                console.error("Failed to parse dropped data:", error);
            }
        }
    }, [nodes.length, toWorldCoordinates]);

    // --- Capabilities: Manage Selection & Handle Deselect ---
    const handleSelect = useCallback((id, type) => {
        setSelectedId(id);
        setSelectedType(type);
    }, []);

    const handleDeselect = useCallback(() => {
        setSelectedId(null);
        setSelectedType(null);
    }, []);

    // --- Capabilities: Handle Delete Request ---
    const handleDelete = useCallback((id, type) => {
        if (type === 'node') {
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
            setConnections((prevConnections) =>
                prevConnections.filter((conn) => conn.sourceNodeId !== id && conn.targetNodeId !== id)
            );
        } else if (type === 'connection') {
            setConnections((prevConnections) => prevConnections.filter((conn) => conn.id !== id));
        }
        // If the deleted item was selected, deselect it
        if ((Array.isArray(selectedId) && selectedId.includes(id)) || selectedId === id) {
            handleDeselect();
        }
    }, [selectedId, handleDeselect]);

    // --- Capabilities: Handle Node Drag & move group selection ---
    const handleNodeDrag = useCallback((id, newX, newY) => {
        setNodes((prevNodes) => {
            const draggedNode = prevNodes.find((node) => node.id === id);
            if (!draggedNode) return prevNodes;

            const dx = newX - draggedNode.x;
            const dy = newY - draggedNode.y;

            // If a group is selected and the dragged node is part of it
            if (selectedType === 'node-group' && Array.isArray(selectedId) && selectedId.includes(id)) {
                return prevNodes.map((node) => {
                    if (selectedId.includes(node.id)) {
                        return { ...node, x: node.x + dx, y: node.y + dy };
                    }
                    return node;
                });
            } else {
                // Single node drag
                return prevNodes.map((node) =>
                    node.id === id ? { ...node, x: newX, y: newY } : node
                );
            }
        });
    }, [selectedId, selectedType]);

    // --- Capabilities: Handle Node Resize ---
    const handleNodeResize = useCallback((id, width, height) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, width, height } : node
            )
        );
    }, []);

    // --- Capabilities: Handle Node Label Change ---
    const handleNodeLabelChange = useCallback((id, newLabel) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, label: newLabel } : node
            )
        );
        handleDeselect(); // As per spec, deselect after label change
    }, [handleDeselect]);

    // --- Capabilities: Handle Connection Label Change ---
    const handleConnectionLabelChange = useCallback((id, newLabel) => {
        setConnections((prevConnections) =>
            prevConnections.map((conn) =>
                conn.id === id ? { ...conn, label: newLabel } : conn
            )
        );
    }, []);

    // --- Capabilities: Handle Load Json ---
    const handleLoadJson = useCallback((data) => {
        if (data && Array.isArray(data.nodes) && Array.isArray(data.connections)) {
            setNodes(data.nodes);
            setConnections(data.connections);
            handleDeselect();
            setPanOffset({ x: 0, y: 0 });
            setZoom(1);
        } else {
            console.error("Invalid JSON data structure for loading flow.");
        }
    }, [handleDeselect]);

    // --- Capabilities: Create Connection Flow (Helper for anchor coordinates) ---
    const getAnchorCoordinates = useCallback((node, anchorType) => {
        const { x, y, width, height } = node;
        switch (anchorType) {
            case 'top': return { x: x + width / 2, y: y };
            case 'bottom': return { x: x + width / 2, y: y + height };
            case 'left': return { x: x, y: y + height / 2 };
            case 'right': return { x: x + width, y: y + height / 2 };
            default: return { x: x + width / 2, y: y + height / 2 }; // Fallback to center
        }
    }, []);

    const handleAnchorDragStart = useCallback((nodeId, anchorType, x, y) => {
        setIsConnecting(true);
        setTempConnection({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            sourceNodeId: nodeId,
            sourceAnchorType: anchorType,
        });
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (svgRef.current && transformGroupRef.current) {
            const { x: worldX, y: worldY } = toWorldCoordinates(
                svgRef.current,
                transformGroupRef.current,
                event.clientX,
                event.clientY
            );

            // --- Panning ---
            if (isPanning) {
                const dx = worldX - startPanOffset.x;
                const dy = worldY - startPanOffset.y;
                setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
                setStartPanOffset({ x: worldX, y: worldY }); // Update start for continuous pan
                return; // Prevent other interactions while panning
            }

            // --- Create Connection Flow (temporary line) ---
            if (isConnecting && tempConnection) {
                setTempConnection((prev) => ({
                    ...prev,
                    endX: worldX,
                    endY: worldY,
                }));
            }

            // --- start group selection ---
            if (isSelecting && selectionStartPoint) {
                const rectX = Math.min(selectionStartPoint.x, worldX);
                const rectY = Math.min(selectionStartPoint.y, worldY);
                const rectWidth = Math.abs(selectionStartPoint.x - worldX);
                const rectHeight = Math.abs(selectionStartPoint.y - worldY);
                setSelectionRect({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });
            }
        }
    }, [isPanning, startPanOffset, panOffset, isConnecting, tempConnection, isSelecting, selectionStartPoint, toWorldCoordinates]);

    const handleMouseUp = useCallback((event) => {
        setIsPanning(false);

        // --- Create Connection Flow (finalize connection) ---
        if (isConnecting && tempConnection) {
            if (svgRef.current && transformGroupRef.current) {
                const { x: mouseWorldX, y: mouseWorldY } = toWorldCoordinates(
                    svgRef.current,
                    transformGroupRef.current,
                    event.clientX,
                    event.clientY
                );

                let targetNode = null;
                let targetAnchorType = null;
                const ANCHOR_THRESHOLD = 20; // pixels

                for (const node of nodes) {
                    if (node.id === tempConnection.sourceNodeId) continue; // Target Node MUST be different from Source Node

                    const anchors = ['top', 'bottom', 'left', 'right'];
                    for (const anchorType of anchors) {
                        const { x: anchorX, y: anchorY } = getAnchorCoordinates(node, anchorType);
                        const distance = Math.sqrt(
                            Math.pow(mouseWorldX - anchorX, 2) + Math.pow(mouseWorldY - anchorY, 2)
                        );
                        if (distance < ANCHOR_THRESHOLD) {
                            targetNode = node;
                            targetAnchorType = anchorType;
                            break;
                        }
                    }
                    if (targetNode) break;
                }

                if (targetNode && targetAnchorType) {
                    const newConnection = {
                        id: generateId(),
                        sourceNodeId: tempConnection.sourceNodeId,
                        targetNodeId: targetNode.id,
                        sourceAnchorType: tempConnection.sourceAnchorType,
                        targetAnchorType: targetAnchorType,
                        label: '', // Default empty label
                    };
                    setConnections((prevConnections) => [...prevConnections, newConnection]);
                }
            }
            setTempConnection(null);
            setIsConnecting(false);
        }

        // --- end group selection ---
        if (isSelecting && selectionRect) {
            const newSelectedIds = [];
            nodes.forEach(node => {
                // Check if node is completely enclosed in the selection rectangle
                const nodeLeft = node.x;
                const nodeRight = node.x + node.width;
                const nodeTop = node.y;
                const nodeBottom = node.y + node.height;

                const rectLeft = selectionRect.x;
                const rectRight = selectionRect.x + selectionRect.width;
                const rectTop = selectionRect.y;
                const rectBottom = selectionRect.y + selectionRect.height;

                if (
                    nodeLeft >= rectLeft &&
                    nodeRight <= rectRight &&
                    nodeTop >= rectTop &&
                    nodeBottom <= rectBottom
                ) {
                    newSelectedIds.push(node.id);
                }
            });
            if (newSelectedIds.length > 0) {
                setSelectedId(newSelectedIds); // Store array of IDs for group selection
                setSelectedType('node-group');
            } else {
                handleDeselect();
            }
            setSelectionRect(null);
            setSelectionStartPoint(null);
            setIsSelecting(false);
        }
    }, [isPanning, isConnecting, tempConnection, nodes, getAnchorCoordinates, toWorldCoordinates, isSelecting, selectionRect, handleDeselect]);

    // --- Capabilities: Panning & start group selection & deselect group selection ---
    const handleMouseDown = useCallback((event) => {
        if (svgRef.current && transformGroupRef.current) {
            const { x: worldX, y: worldY } = toWorldCoordinates(
                svgRef.current,
                transformGroupRef.current,
                event.clientX,
                event.clientY
            );

            // --- Panning ---
            if (event.button === 1 || (event.button === 0 && isSpacePressed)) { // Middle mouse button or Space + Left click
                setIsPanning(true);
                setStartPanOffset({ x: worldX, y: worldY });
                event.preventDefault(); // Prevent default browser drag behavior
                return;
            }

            // If clicking on empty space (svg or transform group), deselect everything and potentially start group selection
            if (event.target === svgRef.current || event.target === transformGroupRef.current) {
                handleDeselect();
                // --- start group selection ---
                setIsSelecting(true);
                setSelectionStartPoint({ x: worldX, y: worldY });
                setSelectionRect({ x: worldX, y: worldY, width: 0, height: 0 });
            }
        }
    }, [handleDeselect, toWorldCoordinates, isSpacePressed]);

    // --- Capabilities: Calculate Connection Coordinates ---
    const connectionRenderData = useMemo(() => {
        return connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.sourceNodeId);
            const targetNode = nodes.find((n) => n.id === conn.targetNodeId);

            if (!sourceNode || !targetNode) {
                console.warn(`Missing node for connection ${conn.id}`);
                return null;
            }

            const { x: startX, y: startY } = getAnchorCoordinates(sourceNode, conn.sourceAnchorType);
            const { x: endX, y: endY } = getAnchorCoordinates(targetNode, conn.targetAnchorType);

            return {
                id: conn.id,
                startX,
                startY,
                endX,
                endY,
                isSelected: selectedId === conn.id && selectedType === 'connection',
                label: conn.label,
            };
        }).filter(Boolean);
    }, [connections, nodes, selectedId, selectedType, getAnchorCoordinates]);

    // --- Capabilities: Zoom ---
    const handleWheel = useCallback((event) => {
        event.preventDefault();
        if (!svgRef.current || !transformGroupRef.current) return;

        const scaleFactor = 1.1;
        const newZoom = event.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
        const clampedZoom = Math.max(0.1, Math.min(5, newZoom)); // Clamp zoom level

        const { x: mouseWorldX, y: mouseWorldY } = toWorldCoordinates(
            svgRef.current,
            transformGroupRef.current,
            event.clientX,
            event.clientY
        );

        // Calculate new pan offset to keep the mouse position stable in world coordinates
        const newPanX = event.clientX - (mouseWorldX * clampedZoom);
        const newPanY = event.clientY - (mouseWorldY * clampedZoom);

        setZoom(clampedZoom);
        setPanOffset({ x: newPanX, y: newPanY });

    }, [zoom, panOffset, toWorldCoordinates]);

    const resetView = useCallback(() => {
        setPanOffset({ x: 0, y: 0 });
        setZoom(1);
    }, []);

    // Keyboard event listener for Delete key and Space key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                if (selectedId && selectedType) {
                    if (Array.isArray(selectedId)) { // Group selection
                        selectedId.forEach(id => handleDelete(id, 'node'));
                    } else {
                        handleDelete(selectedId, selectedType);
                    }
                    handleDeselect();
                }
            }
            if (event.key === ' ') {
                setIsSpacePressed(true);
                event.preventDefault(); // Prevent page scroll
            }
        };

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
    }, [selectedId, selectedType, handleDelete, handleDeselect]);

    // --- TOOLBarMain capabilities (Mermaid Export) ---
    const getSvgElement = useCallback(() => svgRef.current, []);

    const flowData = useMemo(() => ({ nodes, connections }), [nodes, connections]);

    const handleExportMermaid = useCallback(() => {
        let mermaidString = 'graph TD\n';

        // Add nodes
        nodes.forEach(node => {
            let shape = '';
            switch (node.type) {
                case 'action':
                    shape = `[${node.label}]`; // Rectangular
                    break;
                case 'condition':
                    shape = `{${node.label}}`; // Rhombus
                    break;
                default:
                    shape = `(${node.label})`; // Default to rounded rect
            }
            mermaidString += `    ${node.id}${shape}\n`;
        });

        // Add connections
        connections.forEach(conn => {
            const sourceNode = nodes.find(n => n.id === conn.sourceNodeId);
            const targetNode = nodes.find(n => n.id === conn.targetNodeId);

            if (sourceNode && targetNode) {
                const labelPart = conn.label ? `|${conn.label}|` : '';
                mermaidString += `    ${sourceNode.id} -->${labelPart} ${targetNode.id}\n`;
            }
        });

        setMermaidCode(mermaidString);
        setShowMermaidModal(true);
    }, [nodes, connections]);

    const copyMermaidToClipboard = useCallback(() => {
        navigator.clipboard.writeText(mermaidCode).then(() => {
            alert('Mermaid code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy mermaid code: ', err);
        });
    }, [mermaidCode]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* TOOLBarMain */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 shadow-md p-2">
                {/*
                    NOTE: TOOLBarMain's interface does not explicitly list onExportMermaid or onResetView.
                    Assuming it's flexible or will be updated to accept these props.
                */}
                <TOOLBarMain
                    getSvgElement={getSvgElement}
                    flowData={flowData}
                    onLoadJson={handleLoadJson}
                    onExportMermaid={handleExportMermaid}
                    onResetView={resetView}
                />
            </div>

            {/* Sidebar */}
            <div className="w-1/5 bg-gray-100 p-4 pt-16 flex-shrink-0"> {/* pt-16 to account for toolbar */}
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow bg-white relative pt-16"> {/* pt-16 to account for toolbar */}
                <svg
                    ref={svgRef}
                    className="absolute inset-0 w-full h-full"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                    style={{ cursor: isPanning ? 'grabbing' : (isConnecting ? 'crosshair' : (isSelecting ? 'crosshair' : 'default')) }}
                >
                    {/* SVG Definitions for Arrowhead */}
                    <defs>
                        <marker
                            id="arrowhead"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
                        </marker>
                    </defs>

                    {/* Grid Background */}
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 L 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Root Group for Pan and Zoom Transforms */}
                    <g
                        ref={transformGroupRef}
                        transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}
                    >
                        {/* Render Connections */}
                        {connectionRenderData.map((conn) =>
                            conn && (
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
                            )
                        )}

                        {/* Render Temporary Connection Line */}
                        {tempConnection && (
                            <path
                                d={`M ${tempConnection.startX} ${tempConnection.startY} L ${tempConnection.endX} ${tempConnection.endY}`}
                                stroke="blue"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                            />
                        )}

                        {/* Render Nodes */}
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
                                isSelected={
                                    (selectedType === 'node' && selectedId === node.id) ||
                                    (selectedType === 'node-group' && Array.isArray(selectedId) && selectedId.includes(node.id))
                                }
                                onSelect={handleSelect}
                                onDrag={handleNodeDrag}
                                onResize={handleNodeResize}
                                onLabelChange={handleNodeLabelChange}
                                onDelete={handleDelete}
                                onAnchorDragStart={handleAnchorDragStart}
                                onDeselect={handleDeselect}
                            />
                        ))}

                        {/* Render Selection Rectangle */}
                        {isSelecting && selectionRect && (
                            <rect
                                x={selectionRect.x}
                                y={selectionRect.y}
                                width={selectionRect.width}
                                height={selectionRect.height}
                                fill="rgba(0, 120, 215, 0.1)"
                                stroke="#0078D7"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                            />
                        )}
                    </g>
                </svg>
            </div>

            {/* Mermaid Export Modal */}
            {showMermaidModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
                        <h2 className="text-xl font-bold mb-4">Mermaid Code Export</h2>
                        <textarea
                            className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono text-sm"
                            readOnly
                            value={mermaidCode}
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={copyMermaidToClipboard}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Copy to Clipboard
                            </button>
                            <button
                                onClick={() => setShowMermaidModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}