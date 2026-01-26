import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Connection from '../connection.jsx';

// Mock the global setTimeout and clearTimeout to control the click timer logic
vi.useFakeTimers();

describe('Connection', () => {
  const defaultProps = {
    id: 'conn-1',
    startX: 0,
    startY: 0,
    endX: 100,
    endY: 100,
    isSelected: false,
    label: 'Test Label',
    onSelect: vi.fn(),
    onLabelChange: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    // Reset mocks and timers before each test
    vi.clearAllMocks();
    vi.runOnlyPendingTimers(); // Clear any lingering timers from previous tests
    vi.clearAllTimers();
  });

  afterEach(() => {
    // Restore real timers after all tests in this describe block
    vi.useRealTimers();
  });

  // --- Appearance & Render Line Contract ---

  it('should render the connection path with default (unselected) styles and arrowhead', () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path'); // Query the path element directly
    expect(svgPath).toBeInTheDocument();
    expect(svgPath).toHaveAttribute('d'); // Check if path data exists
    expect(svgPath).toHaveAttribute('marker-end', `url(#arrowhead-${defaultProps.id})`);
    expect(svgPath).toHaveClass('stroke-gray-400');
    expect(svgPath).toHaveClass('stroke-[2px]');
    expect(svgPath).toHaveClass('fill-none');
  });

  it('should apply selected styles when isSelected is true', () => {
    render(<Connection {...defaultProps} isSelected={true} />);
    const svgPath = document.querySelector('path');
    expect(svgPath).toHaveClass('stroke-blue-500');
    expect(svgPath).toHaveClass('stroke-[4px]');
  });

  it('should render the label text when provided and not in edit mode', () => {
    render(<Connection {...defaultProps} />);
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
  });

  it('should not render the label text when label prop is empty or undefined', () => {
    const { rerender } = render(<Connection {...defaultProps} label="" />);
    expect(screen.queryByText(defaultProps.label)).not.toBeInTheDocument();
    rerender(<Connection {...defaultProps} label={undefined} />);
    expect(screen.queryByText(defaultProps.label)).not.toBeInTheDocument();
  });

  it('should not render the delete button when not selected', () => {
    render(<Connection {...defaultProps} isSelected={false} />);
    expect(screen.queryByText('X')).not.toBeInTheDocument();
  });

  it('should render the delete button when selected', () => {
    render(<Connection {...defaultProps} isSelected={true} />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  // --- Capabilities: Select Connection ---

  it('should call onSelect after a single click delay (250ms)', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');
    fireEvent.click(svgPath);

    expect(defaultProps.onSelect).not.toHaveBeenCalled(); // Not called immediately
    vi.advanceTimersByTime(250); // Advance past the double-click threshold

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultProps.id, 'connection');
    });
  });

  it('should not call onSelect on double click, but enter edit mode', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');

    fireEvent.click(svgPath); // First click
    fireEvent.click(svgPath); // Second click (within the 250ms window)

    vi.advanceTimersByTime(250); // Advance past the double-click threshold

    await waitFor(() => {
      expect(defaultProps.onSelect).not.toHaveBeenCalled();
      expect(screen.getByRole('textbox')).toBeInTheDocument(); // Input field should appear
    });
  });

  // --- Capabilities: Edit Label ---

  it('should enter edit mode on double click of the connection path', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');

    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click
    vi.advanceTimersByTime(250); // Ensure timer clears

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue(defaultProps.label);
    });
    expect(screen.queryByText(defaultProps.label)).not.toBeInTheDocument(); // Original label should be hidden
  });

  it('should enter edit mode on double click of the label text', async () => {
    render(<Connection {...defaultProps} />);
    const labelText = screen.getByText(defaultProps.label);

    fireEvent.doubleClick(labelText); // Directly double click the label

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue(defaultProps.label);
    });
    expect(screen.queryByText(defaultProps.label)).not.toBeInTheDocument();
  });

  it('should call onLabelChange and exit edit mode on blur', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');
    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click to enter edit mode
    vi.advanceTimersByTime(250);

    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    const newLabel = 'New Label Text';
    fireEvent.change(input, { target: { value: newLabel } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(defaultProps.onLabelChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onLabelChange).toHaveBeenCalledWith(defaultProps.id, newLabel);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // Input field should be gone
      expect(screen.getByText(newLabel)).toBeInTheDocument(); // New label text should be displayed
    });
  });

  it('should call onLabelChange and exit edit mode on Enter key press', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');
    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click to enter edit mode
    vi.advanceTimersByTime(250);

    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    const newLabel = 'Another Label';
    fireEvent.change(input, { target: { value: newLabel } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(defaultProps.onLabelChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onLabelChange).toHaveBeenCalledWith(defaultProps.id, newLabel);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText(newLabel)).toBeInTheDocument();
    });
  });

  it('should cancel editing and revert label on Escape key press', async () => {
    const initialLabel = 'Original Label';
    render(<Connection {...defaultProps} label={initialLabel} />);
    const svgPath = document.querySelector('path');
    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click to enter edit mode
    vi.advanceTimersByTime(250);

    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'Temporary Change' } });
    expect(input).toHaveValue('Temporary Change'); // Verify input value changed

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(defaultProps.onLabelChange).not.toHaveBeenCalled(); // Should not save changes
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText(initialLabel)).toBeInTheDocument(); // Original label should be displayed
    });
  });

  it('should focus and select input text when entering edit mode', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');

    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click
    vi.advanceTimersByTime(250);

    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    expect(input).toHaveFocus();
    // Testing text selection directly in JSDOM is difficult.
    // We rely on the `input.select()` call in the `useEffect` and the focus check.
  });

  it('should stop propagation on input mousedown events to prevent canvas interaction', async () => {
    render(<Connection {...defaultProps} />);
    const svgPath = document.querySelector('path');
    fireEvent.click(svgPath);
    fireEvent.click(svgPath); // Double click to enter edit mode
    vi.advanceTimersByTime(250);

    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    const mockStopPropagation = vi.fn();
    fireEvent.mouseDown(input, { stopPropagation: mockStopPropagation });
    expect(mockStopPropagation).toHaveBeenCalledTimes(1);
  });

  // --- Capabilities: Delete Connection ---

  it('should call onDelete when the delete button is clicked', async () => {
    render(<Connection {...defaultProps} isSelected={true} />);
    const deleteButton = screen.getByText('X');

    fireEvent.mouseDown(deleteButton); // Use mouseDown as per implementation hint

    await waitFor(() => {
      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
      expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.id, 'connection');
    });
  });

  it('should stop propagation on delete button mousedown to prevent canvas deselect', async () => {
    render(<Connection {...defaultProps} isSelected={true} />);
    const deleteButton = screen.getByText('X');

    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.mouseDown(deleteButton, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).not.toHaveBeenCalled(); // Ensure onSelect is not triggered by this click
  });

  it('should call onDelete when Delete key is pressed and connection is selected', () => {
    render(<Connection {...defaultProps} isSelected={true} />);

    fireEvent.keyDown(document, { key: 'Delete', code: 'Delete' });

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.id, 'connection');
  });

  it('should not call onDelete when Delete key is pressed and connection is not selected', () => {
    render(<Connection {...defaultProps} isSelected={false} />);

    fireEvent.keyDown(document, { key: 'Delete', code: 'Delete' });

    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });

  // --- Edge Cases / Prop Updates ---

  it('should update the displayed label when the label prop changes externally (not editing)', async () => {
    const { rerender } = render(<Connection {...defaultProps} label="Initial Label" />);
    expect(screen.getByText('Initial Label')).toBeInTheDocument();

    rerender(<Connection {...defaultProps} label="Updated Label" />);
    expect(screen.queryByText('Initial Label')).not.toBeInTheDocument();
    expect(screen.getByText('Updated Label')).toBeInTheDocument();
  });

  it('should revert to the latest label prop if editing is cancelled after an external prop change', async () => {
    const { rerender } = render(<Connection {...defaultProps} label="Original Label" />);
    const svgPath = document.querySelector('path');

    // Enter edit mode
    fireEvent.click(svgPath);
    fireEvent.click(svgPath);
    vi.advanceTimersByTime(250);
    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    // Change input value
    fireEvent.change(input, { target: { value: 'User Edited Label' } });
    expect(input).toHaveValue('User Edited Label');

    // External prop change while editing
    rerender(<Connection {...defaultProps} label="New Prop Label" />);

    // Press Escape to cancel
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(defaultProps.onLabelChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      // Should revert to the 'New Prop Label' because the useEffect updates currentLabel
      expect(screen.getByText('New Prop Label')).toBeInTheDocument();
    });
  });

  it('should save the user-edited label even if the prop changes externally while editing', async () => {
    const { rerender } = render(<Connection {...defaultProps} label="Original Label" />);
    const svgPath = document.querySelector('path');

    // Enter edit mode
    fireEvent.click(svgPath);
    fireEvent.click(svgPath);
    vi.advanceTimersByTime(250);
    let input;
    await waitFor(() => {
      input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    // Change input value
    fireEvent.change(input, { target: { value: 'User Edited Label' } });
    expect(input).toHaveValue('User Edited Label');

    // External prop change while editing (this updates the internal `currentLabel` via useEffect)
    rerender(<Connection {...defaultProps} label="New Prop Label" />);

    // Press Enter to save
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(defaultProps.onLabelChange).toHaveBeenCalledTimes(1);
      // The component's internal state `currentLabel` (which was 'User Edited Label') is what's saved.
      // The `useEffect` for `label` prop updates `currentLabel`, but `handleInputKeyDown` uses the *current* `currentLabel` state.
      // This test confirms the user's input takes precedence when saving.
      expect(defaultProps.onLabelChange).toHaveBeenCalledWith(defaultProps.id, 'User Edited Label');
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('User Edited Label')).toBeInTheDocument();
    });
  });
});