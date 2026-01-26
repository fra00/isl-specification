import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TOOLBarMain from '../toolbar.jsx';

// Mock navigator.clipboard for the copy to clipboard functionality
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:http://mockurl/12345');
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
});

// Mock document.createElement('a') and its methods for downloadFile
const mockAnchorClick = vi.fn();
const mockAnchor = {
  download: '',
  href: '',
  click: mockAnchorClick,
  onclick: null, // To capture the cleanup function
};
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

// Mock Image constructor for JPG export
class MockImage {
  constructor() {
    this.src = '';
    this.onload = null;
    this.onerror = null;
  }
  set src(value) {
    // Simulate async loading
    if (value) {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  }
}
Object.defineProperty(window, 'Image', {
  value: MockImage,
  writable: true,
});

// Mock HTMLCanvasElement and its context for JPG export
const mockGetContext = vi.fn(() => ({
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  fillStyle: '',
}));
const mockToDataURL = vi.fn(() => 'data:image/jpeg;base64,mockjpgdata');
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
  writable: true,
});
Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: mockToDataURL,
  writable: true,
});
// Mock getBoundingClientRect for SVG element to provide dimensions for canvas
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: () => ({ width: 100, height: 100, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0 }),
  writable: true,
});

// Mock XMLSerializer for SVG export
const mockSerializeToString = vi.fn(() => '<svg>mock svg content</svg>');
Object.defineProperty(window, 'XMLSerializer', {
  value: vi.fn(() => ({
    serializeToString: mockSerializeToString,
  })),
  writable: true,
});

// Mock FileReader for JSON import
class MockFileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.result = null;
  }
  readAsText(file) {
    // Simulate async file reading
    setTimeout(() => {
      if (file.name === 'valid.json') {
        this.result = JSON.stringify({ nodes: [{ id: 'A', label: 'Node A' }], connections: [] });
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      } else if (file.name === 'invalid.json') {
        this.result = 'invalid json content';
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      } else {
        if (this.onerror) {
          this.onerror(new Error('File read error'));
        }
      }
    }, 0);
  }
}
Object.defineProperty(window, 'FileReader', {
  value: MockFileReader,
  writable: true,
});

describe('TOOLBarMain', () => {
  let mockGetSvgElement;
  let mockOnLoadJson;
  let mockFlowData;

  beforeEach(() => {
    mockGetSvgElement = vi.fn(() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.innerHTML = '<rect width="100" height="100" fill="red"/>';
      return svg;
    });
    mockOnLoadJson = vi.fn();
    mockFlowData = {
      nodes: [
        { id: 'A', label: 'Start' },
        { id: 'B', label: 'Process' },
        { id: 'C', label: 'End' },
      ],
      connections: [
        { sourceNodeId: 'A', targetNodeId: 'B', label: 'Step 1' },
        { sourceNodeId: 'B', targetNodeId: 'C' },
      ],
    };

    // Reset mocks for each test
    vi.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
    mockAnchorClick.mockClear();
    mockGetContext.mockClear();
    mockToDataURL.mockClear();
    mockSerializeToString.mockClear();

    // Mock document.createElement and append/remove child for downloadFile
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockAnchor;
      }
      // For canvas element in JPG export, use real canvas for basic properties
      if (tagName === 'canvas') {
        return document.createElement('canvas');
      }
      // For SVG element cloning in JPG export
      if (tagName === 'svg') {
        return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      }
      return document.createElement(tagName);
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    // Mock window.alert and console.error to prevent them from polluting test output
    vi.spyOn(window, 'alert').mockImplementation(vi.fn());
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <TOOLBarMain
        getSvgElement={mockGetSvgElement}
        flowData={mockFlowData}
        onLoadJson={mockOnLoadJson}
        {...props}
      />
    );
  };

  // --- Test esportaJpg ---
  describe('Export JPG', () => {
    it('should call getSvgElement and trigger JPG download when "Export JPG" is clicked', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Export JPG'));

      expect(mockGetSvgElement).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob)); // For SVG blob
        expect(mockSerializeToString).toHaveBeenCalledWith(expect.any(SVGElement));
        expect(mockGetContext).toHaveBeenCalledWith('2d');
        expect(mockToDataURL).toHaveBeenCalledWith('image/jpeg', 0.9);
        expect(mockAnchor.download).toBe('flowchart.jpg');
        expect(mockAnchor.href).toBe('data:image/jpeg;base64,mockjpgdata');
        expect(mockAnchorClick).toHaveBeenCalledTimes(1);
        expect(mockAppendChild).toHaveBeenCalledWith(mockAnchor);
        expect(mockRemoveChild).toHaveBeenCalledWith(mockAnchor);
        expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1); // For SVG blob URL
      });
    });

    it('should log an error if getSvgElement returns null', () => {
      mockGetSvgElement.mockReturnValue(null);
      renderComponent();
      fireEvent.click(screen.getByText('Export JPG'));

      expect(mockGetSvgElement).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('SVG element not found for export.');
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockAnchorClick).not.toHaveBeenCalled();
    });

    it('should log an error if canvas context cannot be obtained', async () => {
      mockGetContext.mockReturnValue(null);
      renderComponent();
      fireEvent.click(screen.getByText('Export JPG'));

      await waitFor(() => {
        expect(mockGetSvgElement).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Could not get 2D context for canvas.');
        expect(mockToDataURL).not.toHaveBeenCalled();
        expect(mockAnchorClick).not.toHaveBeenCalled();
      });
    });

    it('should revoke object URL even if image loading fails', async () => {
      // Simulate image loading error
      class FailingMockImage extends MockImage {
        set src(value) {
          if (value) {
            setTimeout(() => {
              if (this.onerror) {
                this.onerror(new Error('Image load failed'));
              }
            }, 0);
          }
        }
      }
      Object.defineProperty(window, 'Image', {
        value: FailingMockImage,
        writable: true,
      });

      renderComponent();
      fireEvent.click(screen.getByText('Export JPG'));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error loading SVG for JPG export:', expect.any(Event));
        expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1); // SVG blob URL should still be revoked
      });

      // Restore original MockImage
      Object.defineProperty(window, 'Image', {
        value: MockImage,
        writable: true,
      });
    });
  });

  // --- Test esportaJson ---
  describe('Export JSON', () => {
    it('should trigger JSON download with flowData when "Export JSON" is clicked', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Export JSON'));

      const expectedJson = JSON.stringify(mockFlowData, null, 2);

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
        const blobArg = mockCreateObjectURL.mock.calls[0][0];
        expect(blobArg.type).toBe('application/json');

        // Read the blob content to verify
        const reader = new FileReader();
        reader.onload = (e) => {
          expect(e.target.result).toBe(expectedJson);
        };
        reader.readAsText(blobArg);

        expect(mockAnchor.download).toBe('flowchart.json');
        expect(mockAnchor.href).toMatch(/^blob:/);
        expect(mockAnchorClick).toHaveBeenCalledTimes(1);
        expect(mockAppendChild).toHaveBeenCalledWith(mockAnchor);
        expect(mockRemoveChild).toHaveBeenCalledWith(mockAnchor);
        expect(mockAnchor.onclick).toBeInstanceOf(Function); // Ensure onclick is set for cleanup
      });

      // Manually trigger the onclick handler to simulate cleanup after download
      if (mockAnchor.onclick) {
        mockAnchor.onclick();
      }
      await waitFor(() => {
        expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1); // For the JSON blob URL
      });
    });

    it('should log an error if flowData is null for JSON export', () => {
      renderComponent({ flowData: null });
      fireEvent.click(screen.getByText('Export JSON'));

      expect(console.error).toHaveBeenCalledWith('No flow data available for JSON export.');
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockAnchorClick).not.toHaveBeenCalled();
    });
  });

  // --- Test loadJson ---
  describe('Load JSON', () => {
    // Note: The hidden file input needs an aria-label or data-testid in the component for easy selection.
    // Assuming `aria-label="hidden-file-input"` is added to the input in toolbar.jsx.
    const getHiddenFileInput = () => screen.getByLabelText('hidden-file-input');

    it('should call onLoadJson with parsed data when a valid JSON file is selected', async () => {
      renderComponent();
      const file = new File(
        [JSON.stringify({ nodes: [{ id: 'A', label: 'Node A' }], connections: [] })],
        'valid.json',
        { type: 'application/json' }
      );

      // Simulate clicking the load JSON button to trigger the hidden input click
      fireEvent.click(screen.getByText('Load JSON'));

      // Simulate file selection on the hidden input
      fireEvent.change(getHiddenFileInput(), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnLoadJson).toHaveBeenCalledTimes(1);
        expect(mockOnLoadJson).toHaveBeenCalledWith({
          nodes: [{ id: 'A', label: 'Node A' }],
          connections: [],
        });
      });
    });

    it('should show an alert and log an error for an invalid JSON file', async () => {
      renderComponent();
      const file = new File(['invalid json content'], 'invalid.json', { type: 'application/json' });

      fireEvent.click(screen.getByText('Load JSON')); // Trigger input click
      fireEvent.change(getHiddenFileInput(), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnLoadJson).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Error parsing JSON file:', expect.any(Error));
        expect(window.alert).toHaveBeenCalledWith('Invalid JSON file.');
      });
    });

    it('should reset the file input value after file selection', async () => {
      renderComponent();
      const file = new File(
        [JSON.stringify({ nodes: [{ id: 'A', label: 'Node A' }], connections: [] })],
        'valid.json',
        { type: 'application/json' }
      );

      const input = getHiddenFileInput();
      fireEvent.click(screen.getByText('Load JSON')); // Trigger input click
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  // --- Test esportaMermaid ---
  describe('Export Mermaid', () => {
    it('should open a modal with correct Mermaid code when "Export Mermaid" is clicked', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Export Mermaid'));

      await waitFor(() => {
        expect(screen.getByText('Mermaid Code')).toBeInTheDocument();
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
        expect(textarea.value).toBe(
          'graph TD\n  A[Start]\n  B[Process]\n  C[End]\n  A -->|Step 1| B\n  B --> C'
        );
      });
    });

    it('should handle connections without labels correctly', async () => {
      const flowDataWithoutLabel = {
        nodes: [{ id: 'X', label: 'Node X' }, { id: 'Y', label: 'Node Y' }],
        connections: [{ sourceNodeId: 'X', targetNodeId: 'Y' }],
      };
      renderComponent({ flowData: flowDataWithoutLabel });
      fireEvent.click(screen.getByText('Export Mermaid'));

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea.value).toBe('graph TD\n  X[Node X]\n  Y[Node Y]\n  X --> Y');
      });
    });

    it('should log an error if flowData is null/undefined for Mermaid export', () => {
      renderComponent({ flowData: null });
      fireEvent.click(screen.getByText('Export Mermaid'));

      expect(console.error).toHaveBeenCalledWith('No flow data available for Mermaid export.');
      expect(screen.queryByText('Mermaid Code')).not.toBeInTheDocument();
    });

    it('should log an error if flowData.nodes or flowData.connections are missing', () => {
      renderComponent({ flowData: { nodes: [], connections: undefined } });
      fireEvent.click(screen.getByText('Export Mermaid'));
      expect(console.error).toHaveBeenCalledWith('No flow data available for Mermaid export.');
      expect(screen.queryByText('Mermaid Code')).not.toBeInTheDocument();

      vi.clearAllMocks();
      renderComponent({ flowData: { nodes: undefined, connections: [] } });
      fireEvent.click(screen.getByText('Export Mermaid'));
      expect(console.error).toHaveBeenCalledWith('No flow data available for Mermaid export.');
      expect(screen.queryByText('Mermaid Code')).not.toBeInTheDocument();
    });
  });

  // --- Test Mermaid Modal Interactions ---
  describe('Mermaid Modal Interactions', () => {
    beforeEach(async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Export Mermaid'));
      await waitFor(() => expect(screen.getByText('Mermaid Code')).toBeInTheDocument());
    });

    it('should copy mermaid code to clipboard when "Copy to Clipboard" is clicked', async () => {
      fireEvent.click(screen.getByText('Copy to Clipboard'));

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          'graph TD\n  A[Start]\n  B[Process]\n  C[End]\n  A -->|Step 1| B\n  B --> C'
        );
        expect(window.alert).toHaveBeenCalledWith('Mermaid code copied to clipboard!');
      });
    });

    it('should show an alert if copying to clipboard fails', async () => {
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Failed to copy'));

      fireEvent.click(screen.getByText('Copy to Clipboard'));

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Failed to copy mermaid code: ', expect.any(Error));
        expect(window.alert).toHaveBeenCalledWith('Failed to copy mermaid code.');
      });
    });

    it('should close the modal when "Close" button is clicked', async () => {
      expect(screen.getByText('Mermaid Code')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Close'));

      await waitFor(() => {
        expect(screen.queryByText('Mermaid Code')).not.toBeInTheDocument();
      });
    });
  });
});