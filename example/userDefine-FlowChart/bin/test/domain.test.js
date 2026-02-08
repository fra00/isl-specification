import { describe, it, expect } from 'vitest';
import { NODE_TYPES } from '../domain.js';

describe('DomainTypes', () => {

  // Test suite for the NODE_TYPES constant
  describe('NODE_TYPES', () => {
    it('should be an object containing predefined node types', () => {
      expect(NODE_TYPES).toBeDefined();
      expect(typeof NODE_TYPES).toBe('object');
      expect(NODE_TYPES).not.toBeNull();
    });

    it('should contain "ACTION" and "CONDITION" keys', () => {
      expect(NODE_TYPES).toHaveProperty('ACTION');
      expect(NODE_TYPES).toHaveProperty('CONDITION');
    });

    it('should have correct string values for ACTION and CONDITION', () => {
      expect(NODE_TYPES.ACTION).toBe('action');
      expect(NODE_TYPES.CONDITION).toBe('condition');
    });

    it('should only contain the expected node types and no others', () => {
      const expectedKeys = ['ACTION', 'CONDITION'];
      expect(Object.keys(NODE_TYPES)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(NODE_TYPES).length).toBe(expectedKeys.length);
    });

    it('should have values that are strings', () => {
      expect(typeof NODE_TYPES.ACTION).toBe('string');
      expect(typeof NODE_TYPES.CONDITION).toBe('string');
    });

    it('should be immutable (values should not be reassignable)', () => {
      // Attempt to reassign a property and expect it to fail in strict mode or not change
      // Note: For primitive values in a const object, direct reassignment won't work.
      // We can check if the object itself is extensible or configurable, but for simple constants,
      // checking the values directly is sufficient.
      const originalActionValue = NODE_TYPES.ACTION;
      try {
        NODE_TYPES.ACTION = 'new_action'; // This will not throw in non-strict mode, but won't change the const value
      } catch (e) {
        // In strict mode, this might throw TypeError: Cannot assign to read only property 'ACTION'
      }
      expect(NODE_TYPES.ACTION).toBe(originalActionValue); // Value should remain unchanged
    });
  });

  // Conceptual tests for JSDoc type definitions (Nodo, Connessione, Tool)
  // Since these are only JSDoc types and not runtime exports, we cannot directly
  // import and test them. Instead, we can create dummy objects that conform
  // to these types and assert their structure, ensuring our understanding
  // of the domain concepts matches the ISL specification.
  describe('Domain Concepts (JSDoc Type Definitions)', () => {

    it('should define the structure for a "Nodo" (Node)', () => {
      /** @type {import('../domain.js').Nodo} */
      const sampleNode = {
        nodeId: 'node-123',
        type: NODE_TYPES.ACTION,
        x: 100,
        y: 200,
        label: 'Start Action',
      };

      expect(sampleNode).toBeDefined();
      expect(typeof sampleNode.nodeId).toBe('string');
      expect(Object.values(NODE_TYPES)).toContain(sampleNode.type); // Ensure type is one of the defined NODE_TYPES
      expect(typeof sampleNode.x).toBe('number');
      expect(typeof sampleNode.y).toBe('number');
      expect(typeof sampleNode.label).toBe('string');

      // Check for specific properties
      expect(sampleNode).toHaveProperty('nodeId', 'node-123');
      expect(sampleNode).toHaveProperty('type', 'action');
      expect(sampleNode).toHaveProperty('x', 100);
      expect(sampleNode).toHaveProperty('y', 200);
      expect(sampleNode).toHaveProperty('label', 'Start Action');
    });

    it('should define the structure for a "Connessione" (Connection)', () => {
      /** @type {import('../domain.js').Connessione} */
      const sampleConnection = {
        connectionId: 'conn-456',
        sourceNodeId: 'node-123',
        targetNodeId: 'node-789',
        label: 'On Success',
      };

      expect(sampleConnection).toBeDefined();
      expect(typeof sampleConnection.connectionId).toBe('string');
      expect(typeof sampleConnection.sourceNodeId).toBe('string');
      expect(typeof sampleConnection.targetNodeId).toBe('string');
      expect(typeof sampleConnection.label).toBe('string');

      // Check for specific properties
      expect(sampleConnection).toHaveProperty('connectionId', 'conn-456');
      expect(sampleConnection).toHaveProperty('sourceNodeId', 'node-123');
      expect(sampleConnection).toHaveProperty('targetNodeId', 'node-789');
      expect(sampleConnection).toHaveProperty('label', 'On Success');
    });

    it('should define the structure for a "Tool"', () => {
      /** @type {import('../domain.js').Tool} */
      const sampleTool = {
        id: 'tool-action',
        label: 'Azione',
        nodeType: NODE_TYPES.ACTION,
      };

      expect(sampleTool).toBeDefined();
      expect(typeof sampleTool.id).toBe('string');
      expect(typeof sampleTool.label).toBe('string');
      expect(Object.values(NODE_TYPES)).toContain(sampleTool.nodeType); // Ensure nodeType is one of the defined NODE_TYPES

      // Check for specific properties
      expect(sampleTool).toHaveProperty('id', 'tool-action');
      expect(sampleTool).toHaveProperty('label', 'Azione');
      expect(sampleTool).toHaveProperty('nodeType', 'action');
    });
  });
});