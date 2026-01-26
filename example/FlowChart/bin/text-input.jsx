import React, { useState } from 'react';

export default function TextInput() {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true); // Assume valid initially
  const [isTouched, setIsTouched] = useState(false); // To control when validation styling applies

  /**
   * Capability: validate
   * Contract: Validates entered text based on specific rules.
   *
   * @param {string} text - The text to validate.
   * @returns {boolean} - True if the text is valid, false otherwise.
   */
  const validate = (text) => {
    // As per ISL, specific validation rules are not provided.
    // Implementing a basic 'not empty' rule for demonstration.
    // In a more complex scenario, this logic might be passed via props
    // or integrated with a business logic hook.
    return text.trim() !== '';
  };

  /**
   * Capability: input text
   * Contract: Allows user to enter text.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   * @returns {void}
   * @SideEffects Typed text appears in input box.
   */
  const handleInputChange = (event) => {
    setValue(event.target.value);
    // Optimistically reset validation state if user starts typing after an invalid state,
    // to avoid showing a red border while potentially typing valid text.
    if (!isValid && isTouched) {
      setIsValid(true);
    }
  };

  /**
   * Trigger for the 'validate' capability.
   * Contract: Validates entered text based on specific rules.
   * Trigger: `onBlur` event (when input loses focus).
   *
   * @returns {void}
   * @SideEffects If text is valid, shows a green border. If text is invalid, shows a red border.
   */
  const handleInputBlur = () => {
    setIsTouched(true); // Mark input as touched to enable validation styling
    const currentIsValid = validate(value);
    setIsValid(currentIsValid);
  };

  // Determine border color based on validation state and touch status
  let borderColorClass = 'border-gray-300'; // Default light gray border (#d1d5db)
  if (isTouched) {
    if (isValid) {
      borderColorClass = 'border-green-600'; // Green border (#10b981)
    } else {
      borderColorClass = 'border-red-500';   // Red border (#ef4444)
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      className={`
        rounded-md            /* Rounded corners (4px) */
        p-2                   /* Padding 8px */
        border                /* Base border */
        ${borderColorClass}   /* Dynamic border color based on validation */
        placeholder-gray-600  /* Placeholder text dark gray (#6b7280) */
        focus:outline-none    /* Remove default focus outline */
        focus:ring-2          /* Add a ring on focus */
        focus:ring-blue-500   /* Blue ring color on focus */
        focus:border-transparent /* Transparent border when ring is active */
      `}
      placeholder="Enter text..."
    />
  );
}