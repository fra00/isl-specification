import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../sidebar.jsx';

describe('Sidebar Component', () => {
  // Mock the DataTransfer object for drag events
  const mockDataTransfer = {
    setData: vi.fn(),
    effectAllowed: '',
  };

  // Helper to create a mock DragEvent
  const createMockDragEvent = () => ({
    dataTransfer: mockDataTransfer,
    preventDefault: vi.fn(), // Prevent default behavior if needed, though not strictly required for dragstart setData/effectAllowed
  });

  beforeEach(() => {
    // Reset mocks before each test
    mockDataTransfer.setData.mockClear();
    mockDataTransfer.effectAllowed = '';
  });

  // Test Case 1: Component Renders Correctly with all expected elements
  it('should render the "Tools" heading and both Action and Condition tools', () => {
    render(<Sidebar />);

    // Check for the main heading
    expect(screen.getByRole('heading', { name: /Tools/i })).toBeInTheDocument();

    // Check for Action tool
    const actionTool = screen.getByText('Action');
    expect(actionTool).toBeInTheDocument();
    // Check its parent draggable container
    expect(actionTool.closest('div[draggable="true"]')).toBeInTheDocument();

    // Check for Condition tool
    const conditionTool = screen.getByText('Condition');
    expect(conditionTool).toBeInTheDocument();
    // Check its parent draggable container
    expect(conditionTool.closest('div[draggable="true"]')).toBeInTheDocument();
  });

  // Test Case 2: Draggable attribute constraint
  it('should ensure all tool elements have draggable="true"', () => {
    render(<Sidebar />);

    const draggableElements = screen.getAllByRole('generic', { name: /Action|Condition/i })
      .map(el => el.closest('div[draggable="true"]'))
      .filter(Boolean); // Filter out nulls if text is not directly in draggable div

    expect(draggableElements.length).toBe(2); // Expect 2 draggable tools
    draggableElements.forEach(element => {
      expect(element).toHaveAttribute('draggable', 'true');
    });
  });

  // Test Case 3: handleDragStart functionality for Action tool
  it('should set correct data and effectAllowed when Action tool drag starts', () => {
    render(<Sidebar />);
    const actionToolContainer = screen.getByText('Action').closest('div[draggable="true"]');
    const mockEvent = createMockDragEvent();

    fireEvent.dragStart(actionToolContainer, mockEvent);

    // Contract: Sets data in dataTransfer
    expect(mockDataTransfer.setData).toHaveBeenCalledTimes(1);
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify({ type: 'Action' })
    );

    // Contract: Sets effectAllowed to 'copy'
    expect(mockDataTransfer.effectAllowed).toBe('copy');
  });

  // Test Case 4: handleDragStart functionality for Condition tool
  it('should set correct data and effectAllowed when Condition tool drag starts', () => {
    render(<Sidebar />);
    const conditionToolContainer = screen.getByText('Condition').closest('div[draggable="true"]');
    const mockEvent = createMockDragEvent();

    fireEvent.dragStart(conditionToolContainer, mockEvent);

    // Contract: Sets data in dataTransfer
    expect(mockDataTransfer.setData).toHaveBeenCalledTimes(1);
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify({ type: 'Condition' })
    );

    // Contract: Sets effectAllowed to 'copy'
    expect(mockDataTransfer.effectAllowed).toBe('copy');
  });

  // Test Case 5: Appearance - Main Sidebar layout and background
  it('should have the correct width, height, and background color classes for the sidebar', () => {
    render(<Sidebar />);
    const sidebarElement = screen.getByRole('complementary'); // Assuming main div acts as a complementary region

    // Check for specified CSS classes
    expect(sidebarElement).toHaveClass('w-[30%]');
    expect(sidebarElement).toHaveClass('h-full');
    expect(sidebarElement).toHaveClass('bg-gray-100'); // ISL: #f3f4f6, Tailwind: gray-100
  });

  // Test Case 6: Appearance - TOOLs height
  it('should ensure TOOLs have the specified height (h-20 for 80px)', () => {
    render(<Sidebar />);
    const actionToolContainer = screen.getByText('Action').closest('div[draggable="true"]');
    const conditionToolContainer = screen.getByText('Condition').closest('div[draggable="true"]');

    expect(actionToolContainer).toHaveClass('h-20');
    expect(conditionToolContainer).toHaveClass('h-20');
  });

  // Test Case 7: Constraint - The TOOLs Button MUST NOT be rotate
  it('should ensure the draggable tool containers themselves are not rotated', () => {
    render(<Sidebar />);
    const actionToolContainer = screen.getByText('Action').closest('div[draggable="true"]');
    const conditionToolContainer = screen.getByText('Condition').closest('div[draggable="true"]');

    // Check that the draggable container does not have rotation classes
    expect(actionToolContainer).not.toHaveClass(/rotate-\d+/);
    expect(conditionToolContainer).not.toHaveClass(/rotate-\d+/);

    // Verify that the inner shape for Condition *does* have rotation (as per implementation,
    // but the draggable container itself should not)
    const conditionShape = screen.getByText('Condition').closest('.transform.rotate-45');
    expect(conditionShape).toBeInTheDocument();
    expect(conditionShape).toHaveClass('rotate-45');
  });
});