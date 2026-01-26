import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

/**
 * @typedef {object} ModalRef
 * @property {(content: React.ReactNode) => void} open - Displays modal window with specified content.
 * @property {() => void} close - Hides modal window.
 */

/**
 * Modal window to display information.
 *
 * This component is a presentation-only modal that exposes imperative `open` and `close` methods
 * via a ref. It manages its own visibility and content state.
 *
 * @param {object} props - The component does not accept any direct props.
 * @param {React.Ref<ModalRef>} ref - A ref object to access the `open` and `close` methods imperatively.
 * @returns {JSX.Element|null} The modal UI when open, or null when closed.
 */
const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  /**
   * Displays the modal window with the provided content.
   * This function is exposed via the component's ref.
   * @param {React.ReactNode} newContent - The React node to be displayed inside the modal.
   */
  const open = useCallback((newContent) => {
    setContent(newContent);
    setIsOpen(true);
  }, []);

  /**
   * Hides the modal window.
   * This function is exposed via the component's ref.
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setContent(null); // Clear content when closing
  }, []);

  // Expose the open and close capabilities via the ref
  useImperativeHandle(ref, () => ({
    open,
    close,
  }), [open, close]); // Dependencies for useImperativeHandle

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={close} // Close modal when clicking on the overlay
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-w-[90vw] max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {content}
      </div>
    </div>
  );
});

export default Modal;