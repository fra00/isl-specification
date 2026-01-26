import React, { useState, useCallback } from 'react';

/**
 * @typedef {object} TextInputProps
 * No props are currently defined for this component in the ISL specification.
 */

/**
 * TextInput component for text entry with validation.
 *
 * @param {TextInputProps} props - The properties for the component.
 * @returns {JSX.Element} A React input component.
 */
export default function TextInput() {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true); // Assume valid initially
  const [borderColorClass, setBorderColorClass] = useState('border-gray-300');

  /**
   * Capability: input text
   * Handles changes to the input field, updating the internal state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   * @returns {void}
   */
  const handleChange = useCallback((event) => {
    setValue(event.target.value);
    // Reset validation state on typing to remove immediate error feedback
    if (!isValid) {
      setIsValid(true);
      setBorderColorClass('border-gray-300');
    }
  }, [isValid]);

  /**
   * Capability: validate
   * Validates the entered text based on specific rules (e.g., not empty).
   * Updates border color based on validation result.
   *
   * @param {string} inputValue - The current value of the input field.
   * @returns {boolean} True if the value is valid, false otherwise.
   */
  const validate = useCallback((inputValue) => {
    // Example validation rule: text must not be empty
    const currentIsValid = inputValue.trim().length > 0;
    setIsValid(currentIsValid);
    setBorderColorClass(currentIsValid ? 'border-green-500' : 'border-red-500');
    return currentIsValid;
  }, []);

  /**
   * Handles the blur event, triggering validation.
   *
   * @returns {void}
   */
  const handleBlur = useCallback(() => {
    validate(value);
  }, [value, validate]);

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`
        rounded-md
        border
        ${borderColorClass}
        p-2
        placeholder-gray-600
        focus:outline-none
        focus:ring-1
        focus:ring-blue-500
        transition-colors
        duration-200
      `}
      placeholder="Enter text..."
    />
  );
}