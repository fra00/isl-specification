export default function GameBoardComponent(props: {
  cards: { id: string; value: string; state: 'Covered' | 'Flipped' | 'Solved' }[];
  gridSize: number[];
  onCardFlip: (cardId: string) => void;
}): React.Element;