import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Node from '../node.jsx';

// Helper to create mock props
const createMockProps = (overrides = {}) => ({
  id: 'node-1',
  x: 100,
  y: 100,
  width: 100,
  height: 50,
  type: 'action',
  label: 'Start',
  isSelected: false,
  onSelect: vi.fn(),
  onDeselect: vi.fn(),
  onDrag: vi.fn(),
  onResize: vi.fn(),
  onLabelChange: vi.fn(),
  onDelete: vi.fn(),
  onAnchorDragStart: vi.fn(),
  ...overrides,
});

describe('Node Component', () => {
  let mockProps;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Mock window.addEventListener and removeEventListener for drag/resize tests
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
    mockProps = createMockProps();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to get the main shape element (rect or polygon)
  const getMainShape = (container) => container.querySelector('rect, polygon');
  // Helper to get the root group element
  const getNodeGroup = (container) => container.firstChild;

  // --- Initial Render & Structure ---
  it('should render a <g> element as the root', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} />
      </svg>
    );
    expect(getNodeGroup(container).tagName).toBe('g');
    expect(getNodeGroup(container)).toHaveAttribute('transform', `translate(${mockProps.x}, ${mockProps.y})`);
  });

  it('should render a <rect> for "action" type nodes', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} type="action" />
      </svg>
    );
    const rect = getMainShape(container);
    expect(rect).toBeInTheDocument();
    expect(rect.tagName).toBe('rect');
    expect(rect).toHaveAttribute('width', String(mockProps.width));
    expect(rect).toHaveAttribute('height', String(mockProps.height));
    expect(rect).toHaveAttribute('fill', '#e0e7ff');
  });

  it('should render a <polygon> for "condition" type nodes', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} type="condition" />
      </svg>
    );
    const polygon = getMainShape(container);
    expect(polygon).toBeInTheDocument();
    expect(polygon.tagName).toBe('polygon');
    const expectedPoints = `${mockProps.width / 2},0 ${mockProps.width},${mockProps.height / 2} ${mockProps.width / 2},${mockProps.height} 0,${mockProps.height / 2}`;
    expect(polygon).toHaveAttribute('points', expectedPoints);
    expect(polygon).toHaveAttribute('fill', '#e0e7ff');
  });

  it('should render the label text centered', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Test Label" />
      </svg>
    );
    const textElement = screen.getByText('Test Label');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveAttribute('text-anchor', 'middle');
    expect(textElement).toHaveAttribute('dominantBaseline', 'middle');
    expect(textElement).toHaveAttribute('x', String(mockProps.width / 2));
    expect(textElement).toHaveAttribute('y', String(mockProps.height / 2));
  });

  it('should apply correct stroke color and width based on isSelected prop', () => {
    const { container, rerender } = render(
      <svg>
        <Node {...mockProps} isSelected={false} />
      </svg>
    );
    let shape = getMainShape(container);
    expect(shape).toHaveAttribute('stroke', '#94a3b8'); // Unselected color
    expect(shape).toHaveAttribute('strokeWidth', '1');

    rerender(
      <svg>
        <Node {...{ ...mockProps, isSelected: true }} />
      </svg>
    );
    shape = getMainShape(container);
    expect(shape).toHaveAttribute('stroke', '#3b82f6'); // Selected color
    expect(shape).toHaveAttribute('strokeWidth', '2');
  });

  it('should change cursor to grabbing when node is selected, otherwise grab', () => {
    const { container, rerender } = render(
      <svg>
        <Node {...mockProps} isSelected={false} />
      </svg>
    );
    let nodeGroup = getNodeGroup(container);
    expect(nodeGroup).toHaveStyle('cursor: grab');

    rerender(
      <svg>
        <Node {...{ ...mockProps, isSelected: true }} />
      </svg>
    );
    nodeGroup = getNodeGroup(container);
    expect(nodeGroup).toHaveStyle('cursor: grabbing');
  });

  // --- Selection Logic ---
  it('should call onSelect when the node is clicked', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} />
      </svg>
    );
    const nodeShape = getMainShape(container);
    fireEvent.click(nodeShape);
    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
    expect(mockProps.onSelect).toHaveBeenCalledWith(mockProps.id, 'node');
  });

  it('should not call onSelect when node is clicked if editing label', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );
    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape); // Enter edit mode
    vi.advanceTimersByTime(50); // For focus
    await waitFor(() => expect(screen.getByDisplayValue(mockProps.label)).toBeInTheDocument());

    fireEvent.click(nodeShape); // Click while editing
    expect(mockProps.onSelect).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  // --- Hover Interactions (Interaction Handles, Delete Button) ---
  it('should show interaction handles and delete button on hover if selected', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    await waitFor(() => {
      // 4 connection handles (blue) + 1 resize handle (red)
      const handles = container.querySelectorAll('rect[fill="#3b82f6"], rect[fill="#ef4444"]');
      expect(handles).toHaveLength(5);
      // Delete button is a group with transform and cursor
      const deleteButton = container.querySelector('g[transform*="translate"][cursor="pointer"]');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  it('should hide interaction handles and delete button on mouse leave', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    await waitFor(() => {
      expect(container.querySelectorAll('rect[fill="#3b82f6"], rect[fill="#ef4444"]')).toHaveLength(5);
      expect(container.querySelector('g[transform*="translate"][cursor="pointer"]')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(nodeGroup);

    await waitFor(() => {
      expect(container.querySelectorAll('rect[fill="#3b82f6"], rect[fill="#ef4444"]')).toHaveLength(0);
      expect(container.querySelector('g[transform*="translate"][cursor="pointer"]')).not.toBeInTheDocument();
    });
  });

  it('should show interaction handles on hover even if not selected, but not delete button', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={false} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    await waitFor(() => {
      expect(container.querySelectorAll('rect[fill="#3b82f6"], rect[fill="#ef4444"]')).toHaveLength(5);
      expect(container.querySelector('g[transform*="translate"][cursor="pointer"]')).not.toBeInTheDocument(); // Delete button should not be there
    });
  });

  // --- Drag (Move) Logic ---
  it('should call onDrag with new coordinates when node is dragged', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} x={100} y={100} isSelected={true} />
      </svg>
    );

    const nodeShape = getMainShape(container);

    // Simulate mouse down on the node
    fireEvent.mouseDown(nodeShape, { clientX: 100, clientY: 100 });
    expect(mockProps.onSelect).toHaveBeenCalledWith(mockProps.id, 'node'); // Should select on drag start

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 150, clientY: 120 });
    expect(mockProps.onDrag).toHaveBeenCalledTimes(1);
    expect(mockProps.onDrag).toHaveBeenCalledWith(mockProps.id, 150, 120); // x + dx, y + dy

    fireEvent.mouseMove(window, { clientX: 160, clientY: 130 });
    expect(mockProps.onDrag).toHaveBeenCalledTimes(2);
    expect(mockProps.onDrag).toHaveBeenCalledWith(mockProps.id, 160, 130);

    // Simulate mouse up
    fireEvent.mouseUp(window);
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));

    // Further mouse moves should not trigger onDrag
    fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
    expect(mockProps.onDrag).toHaveBeenCalledTimes(2);
  });

  it('should stop propagation on mousedown for drag', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} />
      </svg>
    );
    const nodeShape = getMainShape(container);
    const mockEvent = { clientX: 100, clientY: 100, stopPropagation: vi.fn() };
    fireEvent.mouseDown(nodeShape, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });

  // --- Resize Logic ---
  it('should call onResize with new dimensions when resize handle is dragged', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup); // Make handles visible

    let resizeHandle;
    await waitFor(() => {
      resizeHandle = container.querySelector('rect[fill="#ef4444"]'); // Red resize handle
      expect(resizeHandle).toBeInTheDocument();
    });

    // Simulate mouse down on resize handle
    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 50 });

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 120, clientY: 60 }); // dx=20, dy=10
    expect(mockProps.onResize).toHaveBeenCalledTimes(1);
    expect(mockProps.onResize).toHaveBeenCalledWith(mockProps.id, 120, 60); // width + dx, height + dy

    fireEvent.mouseMove(window, { clientX: 130, clientY: 70 }); // dx=30, dy=20
    expect(mockProps.onResize).toHaveBeenCalledTimes(2);
    expect(mockProps.onResize).toHaveBeenCalledWith(mockProps.id, 130, 70);

    // Simulate mouse up
    fireEvent.mouseUp(window);
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));

    // Further mouse moves should not trigger onResize
    fireEvent.mouseMove(window, { clientX: 150, clientY: 90 });
    expect(mockProps.onResize).toHaveBeenCalledTimes(2);
  });

  it('should enforce minimum width and height during resize', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let resizeHandle;
    await waitFor(() => {
      resizeHandle = container.querySelector('rect[fill="#ef4444"]');
      expect(resizeHandle).toBeInTheDocument();
    });

    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 50 });

    // Try to resize to less than min (e.g., 100 - 90 = 10, 50 - 40 = 10)
    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
    expect(mockProps.onResize).toHaveBeenCalledWith(mockProps.id, 20, 20); // Should be clamped to 20, 20

    fireEvent.mouseUp(window);
  });

  it('should stop propagation on mousedown for resize handle', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );
    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);
    let resizeHandle;
    await waitFor(() => {
      resizeHandle = container.querySelector('rect[fill="#ef4444"]');
      expect(resizeHandle).toBeInTheDocument();
    });
    const mockEvent = { clientX: 100, clientY: 100, stopPropagation: vi.fn() };
    fireEvent.mouseDown(resizeHandle, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });

  // --- Connection Handles Logic ---
  it('should call onAnchorDragStart with correct arguments for top handle', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} x={100} y={100} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let topHandle;
    await waitFor(() => {
      // Find the top handle (x=width/2 - 5, y=-5)
      topHandle = container.querySelector('rect[fill="#3b82f6"][y="-5"]');
      expect(topHandle).toBeInTheDocument();
    });

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(topHandle, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledTimes(1);
    // Expected coordinates: node.x + width/2, node.y + 0
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledWith(mockProps.id, 'top', mockProps.x + mockProps.width / 2, mockProps.y);
  });

  it('should call onAnchorDragStart with correct arguments for bottom handle', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} x={100} y={100} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let bottomHandle;
    await waitFor(() => {
      // Find the bottom handle (x=width/2 - 5, y=height - 5)
      bottomHandle = container.querySelector('rect[fill="#3b82f6"][y="45"]');
      expect(bottomHandle).toBeInTheDocument();
    });

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(bottomHandle, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledTimes(1);
    // Expected coordinates: node.x + width/2, node.y + height
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledWith(mockProps.id, 'bottom', mockProps.x + mockProps.width / 2, mockProps.y + mockProps.height);
  });

  it('should call onAnchorDragStart with correct arguments for left handle', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} x={100} y={100} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let leftHandle;
    await waitFor(() => {
      // Find the left handle (x=-5, y=height/2 - 5)
      leftHandle = container.querySelector('rect[fill="#3b82f6"][x="-5"]');
      expect(leftHandle).toBeInTheDocument();
    });

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(leftHandle, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledTimes(1);
    // Expected coordinates: node.x + 0, node.y + height/2
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledWith(mockProps.id, 'left', mockProps.x, mockProps.y + mockProps.height / 2);
  });

  it('should call onAnchorDragStart with correct arguments for right handle', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} x={100} y={100} width={100} height={50} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let rightHandle;
    await waitFor(() => {
      // Find the right handle (x=width - 5, y=height/2 - 5)
      rightHandle = container.querySelector('rect[fill="#3b82f6"][x="95"]');
      expect(rightHandle).toBeInTheDocument();
    });

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(rightHandle, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledTimes(1);
    // Expected coordinates: node.x + width, node.y + height/2
    expect(mockProps.onAnchorDragStart).toHaveBeenCalledWith(mockProps.id, 'right', mockProps.x + mockProps.width, mockProps.y + mockProps.height / 2);
  });

  // --- Label Editing ---
  it('should enter label edit mode on double click', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Initial Label" isSelected={true} />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);

    expect(mockProps.onDeselect).toHaveBeenCalledTimes(1);
    expect(mockProps.onDeselect).toHaveBeenCalledWith(mockProps.id);

    // After double click, the text element should be replaced by an input
    expect(screen.queryByText('Initial Label')).not.toBeInTheDocument();

    // The input should be rendered inside a foreignObject
    const inputElement = screen.getByDisplayValue('Initial Label');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe('INPUT');
    expect(inputElement.closest('foreignObject')).toBeInTheDocument();

    // Advance timers to allow setTimeout for focus to run
    vi.advanceTimersByTime(50);
    await waitFor(() => {
      expect(inputElement).toHaveFocus();
    });

    vi.useRealTimers();
  });

  it('should save label and exit edit mode on Enter key press', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Old Label" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50); // For focus

    const inputElement = screen.getByDisplayValue('Old Label');
    fireEvent.change(inputElement, { target: { value: 'New Label' } });

    const mockEvent = { key: 'Enter', stopPropagation: vi.fn() };
    fireEvent.keyDown(inputElement, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onLabelChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onLabelChange).toHaveBeenCalledWith(mockProps.id, 'New Label');

    // Should exit edit mode, input should be gone, text should be back
    await waitFor(() => {
      expect(screen.queryByDisplayValue('New Label')).not.toBeInTheDocument();
      expect(screen.getByText('New Label')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it('should cancel label edit and restore original label on Escape key press', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Original Label" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50); // For focus

    const inputElement = screen.getByDisplayValue('Original Label');
    fireEvent.change(inputElement, { target: { value: 'Typing something' } });

    const mockEvent = { key: 'Escape', stopPropagation: vi.fn() };
    fireEvent.keyDown(inputElement, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockProps.onLabelChange).not.toHaveBeenCalled(); // Should not save changes

    // Should exit edit mode, input should be gone, original text should be back
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Typing something')).not.toBeInTheDocument();
      expect(screen.getByText('Original Label')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it('should save label and exit edit mode on blur', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Old Label" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50); // For focus

    const inputElement = screen.getByDisplayValue('Old Label');
    fireEvent.change(inputElement, { target: { value: 'Blurred Label' } });
    fireEvent.blur(inputElement);

    expect(mockProps.onLabelChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onLabelChange).toHaveBeenCalledWith(mockProps.id, 'Blurred Label');

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Blurred Label')).not.toBeInTheDocument();
      expect(screen.getByText('Blurred Label')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it('should stop propagation for Delete/Backspace keys in input', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} label="Test Label" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50);

    const inputElement = screen.getByDisplayValue('Test Label');

    const deleteEvent = { key: 'Delete', stopPropagation: vi.fn() };
    fireEvent.keyDown(inputElement, deleteEvent);
    expect(deleteEvent.stopPropagation).toHaveBeenCalledTimes(1);

    const backspaceEvent = { key: 'Backspace', stopPropagation: vi.fn() };
    fireEvent.keyDown(inputElement, backspaceEvent);
    expect(backspaceEvent.stopPropagation).toHaveBeenCalledTimes(1);

    expect(mockProps.onLabelChange).not.toHaveBeenCalled(); // Should not trigger save
    vi.useRealTimers();
  });

  it('should update currentLabel when prop.label changes and not in edit mode', () => {
    const { rerender } = render(
      <svg>
        <Node {...mockProps} label="Initial Label" />
      </svg>
    );
    expect(screen.getByText('Initial Label')).toBeInTheDocument();

    // Rerender with a new label prop
    rerender(
      <svg>
        <Node {...{ ...mockProps, label: 'Updated Label' }} />
      </svg>
    );
    expect(screen.getByText('Updated Label')).toBeInTheDocument();
  });

  it('should NOT update currentLabel when prop.label changes while in edit mode', async () => {
    vi.useFakeTimers();
    const { container, rerender } = render(
      <svg>
        <Node {...mockProps} label="Initial Label" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50);

    const inputElement = screen.getByDisplayValue('Initial Label');
    fireEvent.change(inputElement, { target: { value: 'User Typing' } });

    // Rerender with a new label prop from parent
    rerender(
      <svg>
        <Node {...{ ...mockProps, label: 'Parent Updated Label' }} />
      </svg>
    );

    // The input should still show 'User Typing', not 'Parent Updated Label'
    expect(inputElement).toHaveValue('User Typing');
    expect(screen.queryByText('Parent Updated Label')).not.toBeInTheDocument(); // The text element is hidden

    vi.useRealTimers();
  });

  // --- Delete Logic ---
  it('should display delete button when node is selected and not editing', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup); // Ensure hover state is active

    await waitFor(() => {
      const deleteButton = container.querySelector('g[transform*="translate"][cursor="pointer"]');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  it('should NOT display delete button when node is not selected', () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={false} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup); // Ensure hover state is active

    expect(container.querySelector('g[transform*="translate"][cursor="pointer"]')).not.toBeInTheDocument();
  });

  it('should NOT display delete button when node is in edit mode', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} label="Test" />
      </svg>
    );

    const nodeShape = getMainShape(container);
    fireEvent.doubleClick(nodeShape);
    vi.advanceTimersByTime(50); // For focus

    expect(container.querySelector('g[transform*="translate"][cursor="pointer"]')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let deleteButton;
    await waitFor(() => {
      deleteButton = container.querySelector('g[transform*="translate"][cursor="pointer"]');
      expect(deleteButton).toBeInTheDocument();
    });

    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id, 'node');
  });

  it('should stop propagation on mousedown for delete button', async () => {
    const { container } = render(
      <svg>
        <Node {...mockProps} isSelected={true} />
      </svg>
    );

    const nodeGroup = getNodeGroup(container);
    fireEvent.mouseEnter(nodeGroup);

    let deleteButton;
    await waitFor(() => {
      deleteButton = container.querySelector('g[transform*="translate"][cursor="pointer"]');
      expect(deleteButton).toBeInTheDocument();
    });

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(deleteButton, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });
});