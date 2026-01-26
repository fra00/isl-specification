import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

/**
 * @typedef {object} ModalRef
 * @property {(content: React.ReactNode) => void} open - Displays the modal window with specified content.
 * @property {() => void} close - Hides the modal window.
 */

/**
 * Modal window to display information.
 * This component is controlled imperatively via a ref, exposing `open` and `close` methods.
 *
 * @param {object} props - The Modal component does not consume any direct props.
 * @param {React.Ref<ModalRef>} ref - A ref object used to expose the `open` and `close` methods.
 */
const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  /**
   * Displays the modal window with the specified content.
   * @param {React.ReactNode} content - The ReactNode to be rendered inside the modal.
   */
  const openModal = useCallback((content) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  /**
   * Hides the modal window and clears its content.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null); // Clear content when closing
  }, []);

  // Expose open and close methods via the ref
  useImperativeHandle(ref, () => ({
    open: openModal,
    close: closeModal,
  }));

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        {modalContent}
      </div>
    </div>
  );
});

export default Modal;