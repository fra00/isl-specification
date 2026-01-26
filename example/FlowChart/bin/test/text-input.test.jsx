import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInput from '../text-input.jsx';

describe('TextInput', () => {
  // Test 1: Initial rendering and default appearance
  it('should render with default appearance, placeholder, and initial state', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveValue('');

    // Appearance checks based on ISL and implementation
    expect(inputElement).toHaveClass('rounded-md'); // Rounded corners (4px)
    expect(inputElement).toHaveClass('p-2');       // Padding 8px
    expect(inputElement).toHaveClass('border');     // Base border
    expect(inputElement).toHaveClass('border-gray-300'); // Default light gray border (#d1d5db)
    expect(inputElement).toHaveClass('placeholder-gray-600'); // Placeholder text dark gray (#6b7280)
  });

  // Capability: input text
  // Contract: Allows user to enter text.
  // Side Effects: Typed text appears in input box.
  it('should update the input value when text is typed', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');
    const typedText = 'Hello Flow Chart';

    fireEvent.change(inputElement, { target: { value: typedText } });

    expect(inputElement).toHaveValue(typedText);
  });

  // Capability: validate
  // Contract: Validates entered text based on specific rules.
  // Trigger: `onBlur` event.
  // Side Effects: Green border for valid, red border for invalid.
  it('should show a green border when valid text is entered and input is blurred', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    // Type valid text (non-empty)
    fireEvent.change(inputElement, { target: { value: 'Valid entry' } });
    fireEvent.blur(inputElement); // Trigger validation

    // Expect green border class (#10b981)
    expect(inputElement).toHaveClass('border-green-600');
    expect(inputElement).not.toHaveClass('border-red-500');
    expect(inputElement).not.toHaveClass('border-gray-300');
  });

  it('should show a red border when invalid (empty) text is entered and input is blurred', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    // Type invalid text (empty string)
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.blur(inputElement); // Trigger validation

    // Expect red border class (#ef4444)
    expect(inputElement).toHaveClass('border-red-500');
    expect(inputElement).not.toHaveClass('border-green-600');
    expect(inputElement).not.toHaveClass('border-gray-300');
  });

  it('should show a red border when invalid (whitespace only) text is entered and input is blurred', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    // Type invalid text (whitespace only)
    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.blur(inputElement); // Trigger validation

    // Expect red border class (#ef4444)
    expect(inputElement).toHaveClass('border-red-500');
    expect(inputElement).not.toHaveClass('border-green-600');
    expect(inputElement).not.toHaveClass('border-gray-300');
  });

  // State transition test: Typing after an invalid state should optimistically reset validation
  it('should reset validation state (to valid) and update border when user starts typing after an invalid state', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    // 1. Make input invalid: type empty, then blur
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass('border-red-500'); // Input is now invalid (red border)

    // 2. Start typing valid text: 'a'
    fireEvent.change(inputElement, { target: { value: 'a' } });

    // The component's `handleInputChange` logic should set `isValid` to true
    // if it was previously invalid and touched. Since it's touched and now valid,
    // the border should become green immediately upon typing.
    expect(inputElement).toHaveClass('border-green-600');
    expect(inputElement).not.toHaveClass('border-red-500');
    expect(inputElement).not.toHaveClass('border-gray-300');
  });

  // Comprehensive scenario: Invalid -> Valid -> Invalid cycle
  it('should correctly update border color through a cycle of invalid, valid, then invalid input', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    // Initial state: default gray border
    expect(inputElement).toHaveClass('border-gray-300');

    // 1. Type invalid text, blur -> Red border
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass('border-red-500');

    // 2. Type valid text, blur -> Green border
    fireEvent.change(inputElement, { target: { value: 'Some content' } });
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass('border-green-600');

    // 3. Type invalid text again, blur -> Red border
    fireEvent.change(inputElement, { target: { value: '  ' } });
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveClass('border-red-500');
  });

  // Test for focus styles (implementation detail, not explicitly in ISL appearance but good to cover)
  it('should apply focus styles when the input is focused', () => {
    render(<TextInput />);
    const inputElement = screen.getByPlaceholderText('Enter text...');

    fireEvent.focus(inputElement);

    // Check for Tailwind focus classes
    expect(inputElement).toHaveClass('focus:outline-none');
    expect(inputElement).toHaveClass('focus:ring-2');
    expect(inputElement).toHaveClass('focus:ring-blue-500');
    expect(inputElement).toHaveClass('focus:border-transparent');
  });
});