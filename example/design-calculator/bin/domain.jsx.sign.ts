export const OperationType: {
  ADD: 'ADD';
  SUBTRACT: 'SUBTRACT';
  MULTIPLY: 'MULTIPLY';
  DIVIDE: 'DIVIDE';
};

export const CalculatorStateEntity: (data?: {
  currentOperand?: string;
  previousOperand?: string;
  operator?: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE | null;
  displayValue?: string;
  waitingForNewOperand?: boolean;
  isError?: boolean;
}) => {
  currentOperand: string;
  previousOperand: string;
  operator: typeof OperationType.ADD | typeof OperationType.SUBTRACT | typeof OperationType.MULTIPLY | typeof OperationType.DIVIDE | null;
  displayValue: string;
  waitingForNewOperand: boolean;
  isError: boolean;
};