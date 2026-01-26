import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainPage from '../main-page.jsx';

// Mock the MainContent component as it's an external dependency
// This ensures we are unit testing MainPage in isolation and not implicitly testing MainContent.
vi.mock('../main-content', () => ({
  default: vi.fn(() => <div data-testid="mock-main-content" />),
}));

// Import the mocked component to assert its calls
import MainContent from '../main-content';

describe('MainPage', () => {
  /**
   * Test Case: Verify that the MainPage component renders the MainContent component.
   *
   * Rationale:
   * The MainPage component's primary role, as per the ISL and implementation, is to act as a container
   * for the MainContent. This test ensures that the MainContent component is correctly included
   * within the MainPage's render tree. Since MainPage has no props, state, or complex logic,
   * verifying its structural composition is the most relevant unit test.
   */
  it('should render the MainContent component', () => {
    render(<MainPage />);

    // Assert that the mocked MainContent component was rendered
    // We can check for its presence using the data-testid we added in the mock.
    expect(screen.getByTestId('mock-main-content')).toBeInTheDocument();

    // Alternatively, we can assert that the mock function for MainContent was called.
    expect(MainContent).toHaveBeenCalledTimes(1);
  });

  /**
   * Test Case: Verify the structural integrity of the MainPage component.
   *
   * Rationale:
   * Although UI rendering tests are generally avoided for complex UI elements, for a simple
   * wrapper component like MainPage, verifying its root element and basic structure
   * ensures that the component is rendering as expected and provides the intended layout
   * for its children. This test checks for the presence of the main container div.
   */
  it('should render a full-width and full-height flex container', () => {
    const { container } = render(<MainPage />);

    // Check if the root element is a div with the expected Tailwind classes
    const rootDiv = container.firstChild;
    expect(rootDiv).toBeInTheDocument();
    expect(rootDiv).toHaveClass('w-full');
    expect(rootDiv).toHaveClass('h-full');
    expect(rootDiv).toHaveClass('flex');
    expect(rootDiv).toHaveClass('flex-col');
  });
});