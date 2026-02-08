import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import MainContent from '../main-content';
import { useCoordinateUtils } from '../coordinates';

// Mock child components
vi.mock('../toolbar', () => ({
  default: vi.fn(({ getSvgElement, flowData, onLoadJson }) => (
    <div data-testid="toolbar">
      <button onClick={() => onLoadJson({ nodes: [], connections: [] })}>Load Empty</button>
      <button onClick={() => getSvgElement()}>Get SVG</button>
      <pre>{JSON.stringify(flowData)}</pre>
    </div>
  )),
}));
vi.mock('../sidebar', () => ({
  default: vi.fn(() => <div data-testid="sidebar">Sidebar</div>),
}));
vi.mock('../node', () => ({
  default: vi.fn(({ id, x, y, width, height, type, label, isSelected, onSelect, onDeselect, onDrag, onResize, onLabelChange, onDelete, onAnchorDragStart }) => (
    <g
      data-testid={`node-${id}`}
      data-node-id={id}
      transform={`translate(${x},${y})`}
      onMouseDown={(e) => {
        // Simulate node's own drag start if not part of group drag
        // The MainContent's handleSvgMouseDown will call e.preventDefault() if it starts a group drag
        if (!e.defaultPrevented) {
          onSelect(id, 'node');
          // For testing, we might want to simulate a drag immediately or just selection
          // onDrag(id, x, y); // This would be called by a separate drag handler in Node
        }
      }}
    >
      <rect width={width} height={height} fill="lightblue" stroke={isSelected ? '#3b82f6' : 'black'} strokeWidth={isSelected ? 2 : 1} />
      <text x={width / 2} y={height / 2} textAnchor="middle" alignmentBaseline="middle">{label}</text>
      {/* Anchor for connection testing */}
      <circle
        data-testid={`anchor-${id}-right`}
        cx={width} cy={height / 2} r="5" fill="red"
        onMouseDown={(e) => {
          e.stopPropagation(); // Prevent SVG's mousedown from triggering selection/panning
          onAnchorDragStart(id, 'right', x + width, y + height / 2);
        }}
      />
      <circle
        data-testid={`anchor-${id}-left`}
        cx={0} cy={height / 2} r="5" fill="red"
        onMouseDown={(e) => {
          e.stopPropagation();
          onAnchorDragStart(id, 'left', x, y + height / 2);
        }}
      />
    </g>
  )),
}));
vi.mock('../connection', () => ({
  default: vi.fn(({ id, startX, startY, endX, endY, isSelected, label, onSelect, onLabelChange, onDelete }) => (
    <g data-testid={`connection-${id}`} data-connection-id={id} onMouseDown={() => onSelect(id, 'connection')}>
      <path d={`M ${startX} ${startY} L ${endX} ${endY}`} stroke={isSelected ? '#3b82f6' : 'black'} strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x={(startX + endX) / 2} y={(startY + endY) / 2} fill="black">{label}</text>
    </g>
  )),
}));

// Mock useCoordinateUtils
vi.mock('../coordinates', () => ({
  useCoordinateUtils: vi.fn(() => ({
    toWorldCoordinates: vi.fn((svgElement, transformGroupElement, clientX, clientY) => {
      // Default mock: assume no pan/zoom, screen coords are world coords
      const rect = svgElement.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }),
  })),
}));

// Mock generateId to provide predictable IDs
let mockIdCounter = 1;
const mockGenerateId = () => `mock-item-${mockIdCounter++}`;
vi.mock('../main-content', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateId: mockGenerateId,
  };
});

describe('MainContent', () => {
  let mockToWorldCoordinates;

  beforeEach(() => {
    vi.clearAllMocks();
    mockIdCounter = 1; // Reset ID counter for each test

    // Reset the mock implementation for toWorldCoordinates for each test
    mockToWorldCoordinates = vi.fn((svgElement, transformGroupElement, clientX, clientY) => {
      // Default mock: assume a fixed SVG size and no pan/zoom for initial calculations
      const rect = svgElement.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    });
    useCoordinateUtils.mockReturnValue({ toWorldCoordinates: mockToWorldCoordinates });

    // Mock getBoundingClientRect for the SVG element to simulate its position and size
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0, y: 0, width: 800, height: 600, top: 0, right: 800, bottom: 600, left: 0,
      }),
    });
  });

  // Helper to get the SVG element
  const getSvg = () => screen.getByRole('graphics-document');

  // --- Appearance / Structure Tests ---
  it('renders TOOLBarMain, Sidebar, and the SVG canvas', () => {
    render(<MainContent />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(getSvg()).toBeInTheDocument();
  });

  it('renders SVG definitions for arrowhead marker and grid pattern', () => {
    render(<MainContent />);
    const svg = getSvg();
    expect(svg.querySelector('defs')).toBeInTheDocument();
    expect(svg.querySelector('marker#arrowhead')).toBeInTheDocument();
    expect(svg.querySelector('pattern#grid')).toBeInTheDocument();
  });

  it('renders a root group <g> element for transforms with initial transform', () => {
    render(<MainContent />);
    const svg = getSvg();
    const transformGroup = svg.querySelector('g[transform]');
    expect(transformGroup).toBeInTheDocument();
    expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)');
  });

  it('renders a "Reset View" button', () => {
    render(<MainContent />);
    expect(screen.getByText('Reset View')).toBeInTheDocument();
  });

  // --- Allow Drop Capability Tests ---
  it('calls preventDefault and sets dropEffect on dragOver', () => {
    render(<MainContent />);
    const svg = getSvg();
    const mockEvent = { preventDefault: vi.fn(), dataTransfer: { dropEffect: '' } };
    fireEvent.dragOver(svg, mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.dataTransfer.dropEffect).toBe('copy');
  });

  it('creates a new node on drop with correct properties and normalized type', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const initialNodesCount = screen.queryAllByTestId(/node-/).length;

    const dropData = { type: 'Action' };
    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() => JSON.stringify(dropData)),
      },
      clientX: 100,
      clientY: 100,
    };

    // Mock toWorldCoordinates to return a specific world coordinate
    mockToWorldCoordinates.mockReturnValue({ x: 100, y: 100 });

    fireEvent.drop(svg, mockEvent);

    await waitFor(() => {
      expect(screen.getAllByTestId(/node-/)).toHaveLength(initialNodesCount + 1);
    });

    expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('node-mock-item-1')).toHaveAttribute('transform', 'translate(50,50)'); // 100-50, 100-50
    expect(screen.getByTestId('node-mock-item-1')).toHaveTextContent('Action'); // Original label
    expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-item-1',
        x: 50,
        y: 50,
        width: 100,
        height: 50,
        type: 'action', // Normalized to lowercase
        label: 'Action',
      }),
      {}
    );
    expect(mockEvent.dataTransfer.getData).toHaveBeenCalledWith('application/json');
    expect(mockToWorldCoordinates).toHaveBeenCalledWith(
      expect.any(SVGSVGElement),
      expect.any(SVGGElement),
      100,
      100
    );
  });

  it('does not create a node if dataTransfer is invalid JSON', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const initialNodesCount = screen.queryAllByTestId(/node-/).length;

    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() => 'invalid json'),
      },
      clientX: 100,
      clientY: 100,
    };

    fireEvent.drop(svg, mockEvent);

    // Give it a moment to potentially re-render, then check
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(screen.queryAllByTestId(/node-/)).toHaveLength(initialNodesCount);
    expect(mockEvent.dataTransfer.getData).toHaveBeenCalledWith('application/json');
  });

  // --- Manage Selection Capability Tests ---
  it('selects a single node when clicked', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, {
      preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100
    });
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1); // Simulate click on node
    expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {}
    );
  });

  it('deselects previous item when a new item is selected', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 });
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 200, clientY: 200 });
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1 = screen.getByTestId('node-mock-item-1');
    const node2 = screen.getByTestId('node-mock-item-2');

    fireEvent.mouseDown(node1);
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: false }), {});
    });

    fireEvent.mouseDown(node2);
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: false }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: true }), {});
    });
  });

  it('clears selection when clicking on empty canvas space', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 });
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1);
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
    });

    fireEvent.mouseDown(svg, { clientX: 50, clientY: 50 }); // Click empty space
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: false }), {});
    });
  });

  // --- Create Connection Flow Tests ---
  it('starts drawing a temporary connection line on anchor drag start', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const anchor = screen.getByTestId('anchor-mock-item-1-right');
    // Node 1 is at (50,50) with width 100, height 50. Right anchor is at (150, 75) in world coords.
    // Assuming no pan/zoom, screen coords (150, 75) map directly to world coords (150, 75).
    fireEvent.mouseDown(anchor, { clientX: 150, clientY: 75 });

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 200, clientY: 150 });

    await waitFor(() => {
      const tempConnection = svg.querySelector('path[stroke="#94a3b8"]');
      expect(tempConnection).toBeInTheDocument();
      // Check path 'd' attribute for start/end points. getBezierPath is used.
      // Start: 150, 75 (world coords of anchor)
      // End: 200, 150 (world coords of mouse)
      expect(tempConnection).toHaveAttribute('d', expect.stringContaining('M 150 75 C 175 75, 175 150, 200 150'));
    });
  });

  it('creates a connection if dropped over a valid target anchor on a different node', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 100 }); // Node 2 at 250,50
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right'); // World: 150, 75
    const node2Anchor = screen.getByTestId('anchor-mock-item-2-left'); // World: 250, 75

    // Simulate drag from node1's right anchor
    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 }); // Screen coords for anchor

    // Simulate drag to node2's left anchor (within threshold)
    fireEvent.mouseMove(window, { clientX: 255, clientY: 75 }); // Screen coords near node2's anchor

    // Simulate mouse up
    fireEvent.mouseUp(window, { clientX: 255, clientY: 75 });

    await waitFor(() => {
      expect(screen.getByTestId('connection-mock-item-3')).toBeInTheDocument();
      expect(vi.mocked(require('../connection').default)).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-item-3',
          startX: 150,
          startY: 75,
          endX: 250, // Target anchor's world X
          endY: 75,  // Target anchor's world Y
          sourceNodeId: 'mock-item-1',
          sourceAnchor: 'right',
          targetNodeId: 'mock-item-2',
          targetAnchor: 'left',
        }),
        {}
      );
      expect(svg.querySelector('path[stroke="#94a3b8"]')).not.toBeInTheDocument(); // Temp connection should be gone
    });
  });

  it('does not create a connection if dropped over the same source node', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right'); // World: 150, 75

    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 });
    fireEvent.mouseMove(window, { clientX: 155, clientY: 75 }); // Drag back to same node
    fireEvent.mouseUp(window, { clientX: 155, clientY: 75 });

    await waitFor(() => {
      expect(screen.queryByTestId('connection-mock-item-2')).not.toBeInTheDocument();
      expect(svg.querySelector('path[stroke="#94a3b8"]')).not.toBeInTheDocument(); // Temp connection gone
    });
  });

  it('does not create a connection if dropped not over any valid target anchor', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 100 }); // Node 2 at 250,50
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right'); // World: 150, 75

    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 });
    fireEvent.mouseMove(window, { clientX: 500, clientY: 500 }); // Drag far away
    fireEvent.mouseUp(window, { clientX: 500, clientY: 500 });

    await waitFor(() => {
      expect(screen.queryByTestId('connection-mock-item-3')).not.toBeInTheDocument();
      expect(svg.querySelector('path[stroke="#94a3b8"]')).not.toBeInTheDocument(); // Temp connection gone
    });
  });

  // --- Handle Delete Request Tests ---
  it('deletes a node and its associated connections', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 100 }); // Node 2 at 250,50
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right');
    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 });
    fireEvent.mouseUp(window, { clientX: 255, clientY: 75 }); // Create connection mock-item-3
    await waitFor(() => expect(screen.getByTestId('connection-mock-item-3')).toBeInTheDocument());

    // Select node-mock-item-1
    fireEvent.mouseDown(screen.getByTestId('node-mock-item-1'));
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
    });

    // Simulate delete key press
    fireEvent.keyDown(window, { key: 'Delete' });

    await waitFor(() => {
      expect(screen.queryByTestId('node-mock-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('connection-mock-item-3')).not.toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument(); // Other node should remain
    });
  });

  it('deletes a connection when requested', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 100 }); // Node 2 at 250,50
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right');
    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 });
    fireEvent.mouseUp(window, { clientX: 255, clientY: 75 }); // Create connection mock-item-3
    await waitFor(() => expect(screen.getByTestId('connection-mock-item-3')).toBeInTheDocument());

    // Select connection-mock-item-3
    fireEvent.mouseDown(screen.getByTestId('connection-mock-item-3'));
    await waitFor(() => {
      expect(vi.mocked(require('../connection').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-3', isSelected: true }), {});
    });

    // Simulate delete key press
    fireEvent.keyDown(window, { key: 'Delete' });

    await waitFor(() => {
      expect(screen.queryByTestId('connection-mock-item-3')).not.toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });
  });

  it('clears selection if the deleted item was selected', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 });
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1);
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
    });

    fireEvent.keyDown(window, { key: 'Delete' });
    await waitFor(() => {
      expect(screen.queryByTestId('node-mock-item-1')).not.toBeInTheDocument();
      // Check if any node is selected (should be none)
      expect(vi.mocked(require('../node').default)).not.toHaveBeenCalledWith(expect.objectContaining({ isSelected: true }), {});
    });
  });

  // --- Handle Node Drag Tests ---
  it('updates node position on drag', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    // Get the mock Node component's props to call its onDrag handler
    const nodeMock = vi.mocked(require('../node').default).mock.results.find(r => r.value.props.id === 'mock-item-1').value;

    act(() => {
      nodeMock.props.onDrag('mock-item-1', 150, 150);
    });

    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toHaveAttribute('transform', 'translate(150,150)');
    });
  });

  // --- Handle Node Resize Tests ---
  it('updates node dimensions on resize', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const nodeMock = vi.mocked(require('../node').default).mock.results.find(r => r.value.props.id === 'mock-item-1').value;

    act(() => {
      nodeMock.props.onResize('mock-item-1', 200, 100);
    });

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'mock-item-1', width: 200, height: 100 }), {}
      );
    });
  });

  // --- Handle Node Label Change Tests ---
  it('updates node label on change and deselects items', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1); // Select it
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
    });

    const nodeMock = vi.mocked(require('../node').default).mock.results.find(r => r.value.props.id === 'mock-item-1').value;
    act(() => {
      nodeMock.props.onLabelChange('mock-item-1', 'New Action Label');
    });

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'mock-item-1', label: 'New Action Label', isSelected: false }), {} // Should be deselected
      );
    });
  });

  // --- Handle Connection Label Change Tests ---
  it('updates connection label on change', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 100 }); // Node 2 at 250,50
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    const node1Anchor = screen.getByTestId('anchor-mock-item-1-right');
    fireEvent.mouseDown(node1Anchor, { clientX: 150, clientY: 75 });
    fireEvent.mouseUp(window, { clientX: 255, clientY: 75 }); // Create connection mock-item-3
    await waitFor(() => expect(screen.getByTestId('connection-mock-item-3')).toBeInTheDocument());

    const connectionMock = vi.mocked(require('../connection').default).mock.results.find(r => r.value.props.id === 'mock-item-3').value;
    act(() => {
      connectionMock.props.onLabelChange('mock-item-3', 'New Connection Label');
    });

    await waitFor(() => {
      expect(vi.mocked(require('../connection').default)).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'mock-item-3', label: 'New Connection Label' }), {}
      );
    });
  });

  // --- Handle Load Json Tests ---
  it('loads new nodes and connections from JSON and clears selection', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    await waitFor(() => expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument());

    // Select node-mock-item-1
    fireEvent.mouseDown(screen.getByTestId('node-mock-item-1'));
    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
    });

    const toolbar = screen.getByTestId('toolbar');
    const loadButton = screen.getByText('Load Empty'); // Button to trigger onLoadJson

    const newData = {
      nodes: [{ id: 'loaded-node-1', x: 10, y: 10, width: 100, height: 50, type: 'start', label: 'Start' }],
      connections: [],
    };

    // Simulate onLoadJson call from toolbar
    act(() => {
      fireEvent.click(loadButton); // This will call onLoadJson with empty data
    });

    // Now, simulate a new load with actual data
    act(() => {
      vi.mocked(require('../toolbar').default).mock.calls[0][0].onLoadJson(newData);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('node-mock-item-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('node-loaded-node-1')).toBeInTheDocument();
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'loaded-node-1', isSelected: false }), {} // Should be deselected
      );
    });
  });

  // --- Panning Tests ---
  it('starts panning when Space key is pressed and mouse is down', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const transformGroup = svg.querySelector('g');

    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.mouseDown(svg, { clientX: 100, clientY: 100, button: 0 }); // Left click

    expect(svg).toHaveStyle('cursor: grabbing');
    expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)'); // Initial state

    fireEvent.mouseMove(window, { clientX: 150, clientY: 120 }); // Drag 50px right, 20px down

    await waitFor(() => {
      expect(transformGroup).toHaveAttribute('transform', 'translate(50, 20) scale(1)');
    });

    fireEvent.mouseUp(window);
    fireEvent.keyUp(window, { key: ' ' });
    expect(svg).toHaveStyle('cursor: default');
  });

  it('starts panning when middle mouse button is pressed', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const transformGroup = svg.querySelector('g');

    fireEvent.mouseDown(svg, { clientX: 100, clientY: 100, button: 1 }); // Middle click

    expect(svg).toHaveStyle('cursor: grabbing');
    expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)');

    fireEvent.mouseMove(window, { clientX: 150, clientY: 120 });

    await waitFor(() => {
      expect(transformGroup).toHaveAttribute('transform', 'translate(50, 20) scale(1)');
    });

    fireEvent.mouseUp(window);
    expect(svg).toHaveStyle('cursor: default');
  });

  it('resets pan and zoom to default on "Reset View" button click', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const transformGroup = svg.querySelector('g');

    // Simulate some pan and zoom
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.mouseDown(svg, { clientX: 100, clientY: 100, button: 0 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 120 });
    fireEvent.mouseUp(window);
    fireEvent.keyUp(window, { key: ' ' });

    // Mock toWorldCoordinates for zoom test
    mockToWorldCoordinates.mockImplementation((svgEl, groupEl, clientX, clientY) => {
      const currentTransform = groupEl.getAttribute('transform');
      const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)\s*scale\(([^)]+)\)/);
      const currentPanX = match ? parseFloat(match[1]) : 0;
      const currentPanY = match ? parseFloat(match[2]) : 0;
      const currentZoom = match ? parseFloat(match[3]) : 1;

      const rect = svgEl.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;

      const worldX = (screenX - currentPanX) / currentZoom;
      const worldY = (screenY - currentPanY) / currentZoom;
      return { x: worldX, y: worldY };
    });

    fireEvent.wheel(svg, { clientX: 100, clientY: 100, deltaY: -100 }); // Zoom in
    fireEvent.wheel(svg, { clientX: 100, clientY: 100, deltaY: -100 }); // Zoom in more

    await waitFor(() => {
      expect(transformGroup).not.toHaveAttribute('transform', 'translate(0, 0) scale(1)');
    });

    fireEvent.click(screen.getByText('Reset View'));

    await waitFor(() => {
      expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)');
    });
  });

  // --- Zoom Tests ---
  it('zooms in and out centered on cursor position', async () => {
    render(<MainContent />);
    const svg = getSvg();
    const transformGroup = svg.querySelector('g');

    // Initial state
    expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)');

    // Mock toWorldCoordinates to return a specific world point for zoom-to-cursor
    mockToWorldCoordinates.mockImplementation((svgEl, groupEl, clientX, clientY) => {
      const currentTransform = groupEl.getAttribute('transform');
      const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)\s*scale\(([^)]+)\)/);
      const currentPanX = match ? parseFloat(match[1]) : 0;
      const currentPanY = match ? parseFloat(match[2]) : 0;
      const currentZoom = match ? parseFloat(match[3]) : 1;

      const rect = svgEl.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;

      // Reverse the current transform to get world coordinates
      const worldX = (screenX - currentPanX) / currentZoom;
      const worldY = (screenY - currentPanY) / currentZoom;
      return { x: worldX, y: worldY };
    });

    // Zoom in (deltaY < 0)
    fireEvent.wheel(svg, { clientX: 100, clientY: 100, deltaY: -100 });
    await waitFor(() => {
      // Expected: newPanX = screenX - worldPoint.x * newZoom = 100 - 100 * 1.1 = -10
      // newPanY = screenY - worldPoint.y * newZoom = 100 - 100 * 1.1 = -10
      expect(transformGroup).toHaveAttribute('transform', 'translate(-10, -10) scale(1.1)');
    });

    // Zoom out (deltaY > 0)
    fireEvent.wheel(svg, { clientX: 100, clientY: 100, deltaY: 100 });
    await waitFor(() => {
      // From translate(-10, -10) scale(1.1)
      // newZoom = 1.1 / 1.1 = 1
      // worldPoint.x = (100 - (-10)) / 1.1 = 110 / 1.1 = 100
      // worldPoint.y = (100 - (-10)) / 1.1 = 110 / 1.1 = 100
      // newPanX = 100 - 100 * 1 = 0
      // newPanY = 100 - 100 * 1 = 0
      expect(transformGroup).toHaveAttribute('transform', 'translate(0, 0) scale(1)');
    });
  });

  // --- Group Selection Tests ---
  it('starts group selection on mouse down and drag on empty area', async () => {
    render(<MainContent />);
    const svg = getSvg();

    fireEvent.mouseDown(svg, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });

    await waitFor(() => {
      const selectionRect = svg.querySelector('rect[stroke="#3b82f6"]');
      expect(selectionRect).toBeInTheDocument();
      expect(selectionRect).toHaveAttribute('x', '50');
      expect(selectionRect).toHaveAttribute('y', '50');
      expect(selectionRect).toHaveAttribute('width', '100');
      expect(selectionRect).toHaveAttribute('height', '100');
    });
  });

  it('selects nodes completely enclosed by the selection rectangle on mouse up', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 300, clientY: 300 }); // Node 2 at 250,250
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    fireEvent.mouseDown(svg, { clientX: 40, clientY: 40 }); // Start selection slightly before node 1
    fireEvent.mouseMove(window, { clientX: 160, clientY: 160 }); // End selection slightly after node 1
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: false }), {});
      expect(svg.querySelector('rect[stroke="#3b82f6"]')).not.toBeInTheDocument(); // Selection rect removed
    });
  });

  it('deselects all selected components on mouse down on empty area after group selection', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 150, clientY: 150 }); // Node 2 at 100,100
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    // Perform group selection
    fireEvent.mouseDown(svg, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(window, { clientX: 210, clientY: 210 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: true }), {});
    });

    // Click on empty area to deselect
    fireEvent.mouseDown(svg, { clientX: 10, clientY: 10 });

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: false }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: false }), {});
    });
  });

  // --- Move Group Selection Tests ---
  it('moves all selected nodes while maintaining their relative offsets', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 200, clientY: 150 }); // Node 2 at 150,100
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    // Group select both nodes
    fireEvent.mouseDown(svg, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(window, { clientX: 260, clientY: 160 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: true }), {});
    });

    // Simulate drag on node-mock-item-1 (which is selected)
    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1, { clientX: 50, clientY: 50 }); // Click on node 1 (world 50,50)
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 }); // Drag by 50,50 world units

    await waitFor(() => {
      // Node 1 should move from 50,50 to 100,100
      expect(screen.getByTestId('node-mock-item-1')).toHaveAttribute('transform', 'translate(100,100)');
      // Node 2 should move from 150,100 to 200,150 (maintaining 100,50 offset from node 1)
      expect(screen.getByTestId('node-mock-item-2')).toHaveAttribute('transform', 'translate(200,150)');
    });

    fireEvent.mouseUp(window); // End group drag
  });

  it('handleNodeDrag is ignored if a group drag is active', async () => {
    render(<MainContent />);
    const svg = getSvg();
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Action' })) }, clientX: 100, clientY: 100 }); // Node 1 at 50,50
    fireEvent.drop(svg, { preventDefault: vi.fn(), dataTransfer: { getData: vi.fn(() => JSON.stringify({ type: 'Condition' })) }, clientX: 200, clientY: 150 }); // Node 2 at 150,100
    await waitFor(() => {
      expect(screen.getByTestId('node-mock-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-mock-item-2')).toBeInTheDocument();
    });

    // Group select both nodes
    fireEvent.mouseDown(svg, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(window, { clientX: 260, clientY: 160 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-1', isSelected: true }), {});
      expect(vi.mocked(require('../node').default)).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-item-2', isSelected: true }), {});
    });

    const node1 = screen.getByTestId('node-mock-item-1');
    fireEvent.mouseDown(node1, { clientX: 50, clientY: 50 }); // Start group drag

    const node1Mock = vi.mocked(require('../node').default).mock.results.find(r => r.value.props.id === 'mock-item-1').value;

    // Simulate onDrag from Node component, which should be ignored
    act(() => {
      node1Mock.props.onDrag('mock-item-1', 999, 999); // Try to drag to an arbitrary position
    });

    // Simulate global mouse move for group drag
    fireEvent.mouseMove(window, { clientX: 100, clientY: 100 }); // Drag by 50,50 world units

    await waitFor(() => {
      // Node 1 should have moved due to group drag, not the individual onDrag call
      expect(screen.getByTestId('node-mock-item-1')).toHaveAttribute('transform', 'translate(100,100)');
      // If onDrag was not ignored, it would have moved to 999,999
    });

    fireEvent.mouseUp(window);
  });
});