import React from 'react';
import { GameStatus } from './domain';

export default function ScoreBoardComponent(props: {
  moves: number;
  timerSeconds: number;
  gameStatus: typeof GameStatus[keyof typeof GameStatus];
  onResetGame: () => void;
}): React.Element;