/**
 * @typedef {'action' | 'condition'} NodeType
 */

/**
 * Defines the available types for nodes in the flow chart.
 * @type {Record<string, NodeType>}
 */
export const NODE_TYPES = {
  ACTION: 'action',
  CONDITION: 'condition',
};

/**
 * @typedef {object} Tool
 * Represents a draggable tool available in the palette that can be used to create nodes.
 * @property {string} id - Unique identifier for the tool (e.g., 'tool-action', 'tool-condition').
 * @property {string} label - Display label for the tool (e.g., 'Azione', 'Condizione').
 * @property {NodeType} nodeType - The type of node this tool will create when dragged onto the canvas.
 */

/**
 * @typedef {object} Nodo
 * Represents a node placed on the flow chart canvas.
 * @property {string} nodeId - Unique identifier for the node.
 * @property {NodeType} type - The type of the node (e.g., 'action', 'condition').
 * @property {number} x - X-coordinate of the node on the canvas.
 * @property {number} y - Y-coordinate of the node on the canvas.
 * @property {string} label - Display label for the node.
 */

/**
 * @typedef {object} Connessione
 * Represents a connection between two nodes on the flow chart canvas.
 * @property {string} connectionId - Unique identifier for the connection.
 * @property {string} sourceNodeId - The ID of the source node.
 * @property {string} targetNodeId - The ID of the target node.
 * @property {string} label - Display label for the connection.
 */