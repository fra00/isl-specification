import React, { useRef, useState, useCallback } from 'react';

/**
 * @typedef {object} Node
 * @property {string} id - The unique identifier of the node.
 * @property {string} label - The display label of the node.
 * // Add other node properties if known, e.g., x, y, type
 */

/**
 * @typedef {object} Connection
 * @property {string} sourceNodeId - The ID of the source node.
 * @property {string} targetNodeId - The ID of the target node.
 * @property {string} [label] - The label for the connection (optional).
 * // Add other connection properties if known
 */

/**
 * @typedef {object} FlowData
 * @property {Node[]} nodes - An array of node objects.
 * @property {Connection[]} connections - An array of connection objects.
 */

/**
 * @typedef {object} TOOLBarMainProps
 * @property {() => SVGElement | null} getSvgElement - A function that returns the SVG DOM element to be exported as an image.
 * @property {FlowData} flowData - The data representing the flow chart, including nodes and connections.
 * @property {(data: FlowData) => void} onLoadJson - Callback function triggered when a JSON file is loaded, providing the parsed data.
 */

/**
 * TOOLBarMain component provides a toolbar with actions to perform with a generated graph.
 * @param {TOOLBarMainProps} props
 * @returns {JSX.Element}
 */
export default function TOOLBarMain({ getSvgElement, flowData, onLoadJson }) {
  const fileInputRef = useRef(null);
  const [showMermaidModal, setShowMermaidModal] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');

  /**
   * Helper function to trigger a file download.
   * @param {string} filename - The name of the file to download.
   * @param {string} contentOrUrl - The content of the file (for Blob) or a data URL.
   * @param {string} mimeType - The MIME type of the file.
   * @param {boolean} isDataUrl - True if contentOrUrl is a data URL, false if it's raw content.
   */
  const downloadFile = useCallback((filename, contentOrUrl, mimeType, isDataUrl = false) => {
    const a = document.createElement('a');
    a.download = filename;

    if (isDataUrl) {
      a.href = contentOrUrl;
    } else {
      const blob = new Blob([contentOrUrl], { type: mimeType });
      const url = URL.createObjectURL(blob);
      a.href = url;
      // Clean up the object URL after download is initiated
      a.onclick = () => {
        requestAnimationFrame(() => URL.revokeObjectURL(url));
      };
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  /**
   * Exports the SVG content into a JPG image.
   * Pre-condition: SVG rasterized.
   */
  const esportaJpg = useCallback(() => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      console.error('SVG element not found for export.');
      return;
    }

    // Clone the SVG to avoid modifying the original and ensure correct styling
    const clonedSvgElement = svgElement.cloneNode(true);

    // Serialize SVG to string
    const svgString = new XMLSerializer().serializeToString(clonedSvgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Set canvas dimensions to match SVG's rendered size
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width;
      canvas.height = svgRect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill background with white for JPG, as SVG can have transparent background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
        downloadFile('flowchart.jpg', jpgUrl, 'image/jpeg', true); // Pass true for isDataUrl
      } else {
        console.error('Could not get 2D context for canvas.');
      }
      URL.revokeObjectURL(svgUrl); // Clean up the SVG object URL
    };
    img.onerror = (error) => {
      console.error('Error loading SVG for JPG export:', error);
      URL.revokeObjectURL(svgUrl); // Clean up on error too
    };
    img.src = svgUrl;
  }, [getSvgElement, downloadFile]);

  /**
   * Exports the flow in JSON format.
   */
  const esportaJson = useCallback(() => {
    if (!flowData) {
      console.error('No flow data available for JSON export.');
      return;
    }
    const jsonString = JSON.stringify(flowData, null, 2);
    downloadFile('flowchart.json', jsonString, 'application/json', false); // Pass false for isDataUrl
  }, [flowData, downloadFile]);

  /**
   * Handles the file selection for loading JSON.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the file input.
   */
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const parsedData = JSON.parse(content);
            onLoadJson(parsedData);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onLoadJson]);

  /**
   * Triggers the hidden file input to open the file dialog.
   */
  const loadJson = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Exports the flow in Mermaid format and displays it in a modal.
   */
  const esportaMermaid = useCallback(() => {
    if (!flowData || !flowData.nodes || !flowData.connections) {
      console.error('No flow data available for Mermaid export.');
      return;
    }

    const { nodes, connections } = flowData;
    const mermaidLines = ['graph TD'];

    // Map node IDs to their labels for easy lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node.label]));

    // Add nodes
    nodes.forEach(node => {
      mermaidLines.push(`  ${node.id}[${node.label}]`);
    });

    // Add connections
    connections.forEach(conn => {
      let connectionString = `  ${conn.sourceNodeId}`;
      if (conn.label) {
        connectionString += ` -->|${conn.label}| `;
      } else {
        connectionString += ` --> `;
      }
      connectionString += `${conn.targetNodeId}`;
      mermaidLines.push(connectionString);
    });

    setMermaidCode(mermaidLines.join('\n'));
    setShowMermaidModal(true);
  }, [flowData]);

  /**
   * Copies the mermaid code to the clipboard.
   */
  const copyMermaidToClipboard = useCallback(() => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      alert('Mermaid code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy mermaid code: ', err);
      alert('Failed to copy mermaid code.');
    });
  }, [mermaidCode]);

  return (
    <div className="flex space-x-2 p-2 bg-gray-100 border-b border-gray-300">
      <button
        onClick={esportaJpg}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Export JPG
      </button>
      <button
        onClick={esportaJson}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Export JSON
      </button>
      <button
        onClick={loadJson}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        Load JSON
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <button
        onClick={esportaMermaid}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Export Mermaid
      </button>

      {showMermaidModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-lg font-bold mb-4">Mermaid Code</h3>
            <textarea
              className="w-full h-64 p-2 border border-gray-300 rounded font-mono text-sm resize-none"
              readOnly
              value={mermaidCode}
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={copyMermaidToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowMermaidModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}