import React, { useState, useRef, useCallback } from 'react';

/**
 * @typedef {object} Node
 * @property {string} id - Unique identifier for the node.
 * @property {string} label - Display label for the node.
 */

/**
 * @typedef {object} Connection
 * @property {string} sourceNodeId - The ID of the source node for the connection.
 * @property {string} targetNodeId - The ID of the target node for the connection.
 * @property {string} [label] - Optional label for the connection.
 */

/**
 * @typedef {object} FlowData
 * @property {Node[]} nodes - An array of node objects in the flowchart.
 * @property {Connection[]} connections - An array of connection objects in the flowchart.
 */

/**
 * @typedef {object} TOOLBarMainProps
 * @property {() => SVGElement | null} getSvgElement - A function that, when called, returns the main SVG DOM element of the flowchart.
 * @property {FlowData} flowData - The current data structure representing the flowchart, including nodes and connections.
 * @property {(data: FlowData) => void} onLoadJson - A callback function invoked when a JSON file is successfully loaded, passing the parsed FlowData.
 */

/**
 * TOOLBarMain is a presentation component that provides a toolbar with actions
 * to interact with a flowchart, such as exporting to different formats (JPG, JSON, Mermaid)
 * and loading flowchart data from a JSON file.
 *
 * @param {TOOLBarMainProps} props - The properties for the TOOLBarMain component.
 */
export default function TOOLBarMain({ getSvgElement, flowData, onLoadJson }) {
  const fileInputRef = useRef(null);
  const [showMermaidModal, setShowMermaidModal] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');

  /**
   * Capability: esporta jpg
   * Exports the SVG content of the flowchart into a JPG image.
   * The SVG is first drawn onto a canvas to rasterize it before converting to JPG.
   */
  const handleExportJpg = useCallback(() => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      console.warn('No SVG element found to export.');
      alert('No flowchart to export. Please create one first.');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Get SVG dimensions
    const svgBBox = svgElement.getBoundingClientRect();
    canvas.width = svgBBox.width;
    canvas.height = svgBBox.height;

    // Serialize SVG to string and create an image from it
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url); // Clean up the object URL

      // Convert canvas to JPG data URL
      const jpgUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality

      // Trigger download
      const link = document.createElement('a');
      link.href = jpgUrl;
      link.download = 'flowchart.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.onerror = (error) => {
      console.error('Error loading SVG into image for JPG export:', error);
      alert('Failed to export JPG. Check console for details.');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [getSvgElement]);

  /**
   * Capability: esporta json
   * Exports the current flowchart data in JSON format.
   */
  const handleExportJson = useCallback(() => {
    if (!flowData || !flowData.nodes || flowData.nodes.length === 0) {
      alert('No flowchart data to export.');
      return;
    }
    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [flowData]);

  /**
   * Capability: load json
   * Triggers the hidden file input to allow the user to select a JSON file.
   */
  const handleLoadJsonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handles the file selection from the hidden input, reads the JSON content,
   * and calls the `onLoadJson` prop with the parsed data.
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
   * Capability: esporta mermaid
   * Generates Mermaid syntax from the flowchart data and displays it in a modal.
   * Includes connection labels if present.
   */
  const handleExportMermaid = useCallback(() => {
    if (!flowData || !flowData.nodes || flowData.nodes.length === 0) {
      alert('No flowchart data to export.');
      return;
    }

    let mermaid = 'graph TD\n'; // Assuming a Top-Down Directed Graph

    // Add node definitions
    flowData.nodes.forEach(node => {
      mermaid += `  ${node.id}[${node.label}]\n`;
    });

    // Add connections
    flowData.connections.forEach(conn => {
      const labelPart = conn.label ? `|${conn.label}|` : '';
      mermaid += `  ${conn.sourceNodeId} --${labelPart}--> ${conn.targetNodeId}\n`;
    });

    setMermaidCode(mermaid);
    setShowMermaidModal(true);
  }, [flowData]);

  /**
   * Copies the generated Mermaid code to the clipboard.
   */
  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      alert('Mermaid code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy Mermaid code: ', err);
      alert('Failed to copy Mermaid code.');
    });
  }, [mermaidCode]);

  return (
    <div className="flex space-x-2 p-2 bg-gray-100 border-b border-gray-300">
      <button
        onClick={handleExportJpg}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Export JPG
      </button>
      <button
        onClick={handleExportJson}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Export JSON
      </button>
      <button
        onClick={handleLoadJsonClick}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        Load JSON
      </button>
      {/* Hidden file input for loading JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
        aria-label="Load JSON file"
      />
      <button
        onClick={handleExportMermaid}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Export Mermaid
      </button>

      {/* Mermaid Code Modal */}
      {showMermaidModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Mermaid Code</h3>
            <textarea
              className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono text-sm resize-none bg-gray-50 text-gray-700"
              readOnly
              value={mermaidCode}
              aria-label="Mermaid code output"
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowMermaidModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
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