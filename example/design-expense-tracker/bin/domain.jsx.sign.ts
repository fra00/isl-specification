type ExpenseCategoryTypeValues = 'FOOD' | 'TRANSPORT' | 'HOUSING' | 'ENTERTAINMENT' | 'UTILITIES' | 'HEALTH' | 'EDUCATION' | 'OTHER';

export const ExpenseCategoryType: Record<ExpenseCategoryTypeValues, ExpenseCategoryTypeValues>;

export const ExpenseEntity: (data?: {
  id?: string;
  amount?: number;
  description?: string;
  date?: string;
  category?: ExpenseCategoryTypeValues;
}) => {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: ExpenseCategoryTypeValues;
};