import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react'; // Required for JSX in tests

import Modal from '../modal.jsx';

describe('Modal Component', () => {
  // Helper function to render the Modal and get its imperative ref methods
  const setup = () => {
    const ref = React.createRef();
    render(<Modal ref={ref} />);
    return { modalRef: ref.current };
  };

  // Test Case 1: Initial state - Modal should not be rendered
  it('should not render the modal initially', () => {
    setup();
    // Check for the absence of the main modal container (overlay)
    expect(screen.queryByText(/Test Content/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    // The main overlay div has specific classes, we can check for its absence
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument(); // Add data-testid to overlay for easier selection if needed, otherwise rely on content/button.
    // For now, checking for content and close button absence is sufficient.
  });

  // Test Case 2: `open` capability - Modal displays with content
  it('should open the modal and display the specified content when open is called', async () => {
    const { modalRef } = setup();
    const testContent = <div><h1>Hello</h1><p>This is a test modal.</p></div>;

    modalRef.open(testContent);

    // Wait for the modal to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('This is a test modal.')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    // Verify appearance-related elements (presence, not style)
    // The main modal container has `fixed inset-0 bg-black bg-opacity-50`
    // The inner modal box has `bg-white rounded-lg shadow-lg p-6 w-[400px]`
    // We can't directly query by CSS classes in testing-library without a custom matcher,
    // but we can infer their presence by the content they contain.
    // A more robust check would be to add `data-testid` attributes to the overlay and modal box.
    // For this test, the presence of content and close button implies the modal structure is rendered.
  });

  // Test Case 3: `close` capability - Modal hides and clears content
  it('should close the modal and clear its content when close is called', async () => {
    const { modalRef } = setup();
    const testContent = <p>Content to be cleared</p>;

    // First, open the modal
    modalRef.open(testContent);
    await waitFor(() => {
      expect(screen.getByText('Content to be cleared')).toBeInTheDocument();
    });

    // Then, close the modal
    modalRef.close();

    // Wait for the modal to disappear
    await waitFor(() => {
      expect(screen.queryByText('Content to be cleared')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  // Test Case 4: Close button interaction
  it('should close the modal when the internal close button is clicked', async () => {
    const { modalRef } = setup();
    const testContent = <p>Click to close me!</p>;

    // Open the modal
    modalRef.open(testContent);
    await waitFor(() => {
      expect(screen.getByText('Click to close me!')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    // Click the close button
    fireEvent.click(screen.getByLabelText('Close modal'));

    // Wait for the modal to disappear
    await waitFor(() => {
      expect(screen.queryByText('Click to close me!')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  // Test Case 5: Updating content when modal is already open
  it('should update the modal content when open is called again with new content', async () => {
    const { modalRef } = setup();

    // Open with initial content
    modalRef.open(<p>Initial Content</p>);
    await waitFor(() => {
      expect(screen.getByText('Initial Content')).toBeInTheDocument();
    });

    // Open with new content
    modalRef.open(<span>Updated Content Here</span>);
    await waitFor(() => {
      expect(screen.queryByText('Initial Content')).not.toBeInTheDocument(); // Old content should be gone
      expect(screen.getByText('Updated Content Here')).toBeInTheDocument(); // New content should be present
    });
  });

  // Test Case 6: Calling close on an already closed modal should not cause errors
  it('should not throw an error when close is called on an already closed modal', () => {
    const { modalRef } = setup();

    // Ensure modal is closed initially
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();

    // Call close multiple times
    expect(() => modalRef.close()).not.toThrow();
    expect(() => modalRef.close()).not.toThrow();

    // Verify it remains closed
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  // Test Case 7: Rendering complex ReactNode content
  it('should render complex ReactNode content correctly', async () => {
    const { modalRef } = setup();
    const complexContent = (
      <div>
        <h2>Complex Title</h2>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <button>Action</button>
      </div>
    );

    modalRef.open(complexContent);

    await waitFor(() => {
      expect(screen.getByText('Complex Title')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });
});