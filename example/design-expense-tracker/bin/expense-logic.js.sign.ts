import { ExpenseCategoryTypeValues } from "./domain";

export function addExpense(input: {
  amount: number;
  description: string;
  date: string;
  category: ExpenseCategoryTypeValues;
}): {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: ExpenseCategoryTypeValues;
};

export function getExpenses(): Array<{
  id: string;
  amount: number;
  description: string;
  date: string;
  category: ExpenseCategoryTypeValues;
}>;

export function getTotalExpenses(): number;