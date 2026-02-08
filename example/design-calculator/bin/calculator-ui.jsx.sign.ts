import React from 'react';
import { OperationType } from './domain';

export function CalculatorDisplay(props: { value: string }): React.Element;

export function CalculatorButton(props: { label: string; type: 'digit' | 'operator' | 'action'; onClick: () => void }): React.Element;

export function CalculatorKeypad(props: {
  onDigit: (digit: string) => void;
  onOperator: (op: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE) => void;
  onEquals: () => void;
  onClear: () => void;
  onDecimal: () => void;
  onToggleSign: () => void;
}): React.Element;

export default function CalculatorApp(props: {
  displayValue: string;
  onDigit: (digit: string) => void;
  onOperator: (op: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE) => void;
  onEquals: () => void;
  onClear: () => void;
  onDecimal: () => void;
  onToggleSign: () => void;
}): React.Element;