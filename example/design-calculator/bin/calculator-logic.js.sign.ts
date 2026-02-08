type OperationTypeEnum = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';

type CalculatorState = {
  currentOperand: string;
  previousOperand: string;
  operator: OperationTypeEnum | null;
  displayValue: string;
  waitingForNewOperand: boolean;
  isError: boolean;
};

export function initializeState(): CalculatorState;
export function _executeCalculation(operand1Str: string, operand2Str: string, operator: OperationTypeEnum): number | Error;
export function processDigit(state: CalculatorState, digit: string): CalculatorState;
export function processDecimal(state: CalculatorState): CalculatorState;
export function processOperator(state: CalculatorState, newOperator: OperationTypeEnum): CalculatorState;
export function processEquals(state: CalculatorState): CalculatorState;
export function clear(state: CalculatorState): CalculatorState;
export function toggleSign(state: CalculatorState): CalculatorState;