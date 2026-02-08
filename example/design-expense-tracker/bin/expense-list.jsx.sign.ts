export default function ExpenseList(props: {
  expenses?: {
    id: string;
    amount: number;
    description: string;
    date: string;
    category: 'FOOD' | 'TRANSPORT' | 'HOUSING' | 'ENTERTAINMENT' | 'UTILITIES' | 'HEALTH' | 'EDUCATION' | 'OTHER';
  }[];
  total?: number;
}): React.Element;