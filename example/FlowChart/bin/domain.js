/**
 * @typedef {'action' | 'condition'} FlowChartNodeType
 * Represents the available types for a flow chart node, corresponding to the available tools.
 */

/**
 * @typedef {object} Nodo
 * Represents a node placed on the flow chart canvas.
 * @property {string} nodeId - Unique identifier for the node.
 * @property {FlowChartNodeType} type - The type of the node (e.g., 'action', 'condition').
 * @property {number} x - The x-coordinate position of the node.
 * @property {number} y - The y-coordinate position of the node.
 * @property {string} label - The display label for the node.
 */

/**
 * @typedef {object} Connessione
 * Represents a connection between two nodes in the flow chart.
 * @property {string} connectionId - Unique identifier for the connection.
 * @property {string} sourceNodeId - The ID of the source node.
 * @property {string} targetNodeId - The ID of the target node.
 * @property {string} label - The display label for the connection.
 */

/**
 * Constants representing the available types for flow chart nodes (TOOLS).
 * These values are used for the `type` property of a `Nodo`.
 * @type {Object.<string, FlowChartNodeType>}
 */
export const FLOW_CHART_NODE_TYPES = {
  ACTION: 'action',
  CONDITION: 'condition',
};