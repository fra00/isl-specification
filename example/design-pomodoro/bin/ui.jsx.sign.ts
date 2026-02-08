export default function TimerDisplay(props: {
  remainingTime?: number;
  currentMode?: 'Work' | 'ShortBreak' | 'LongBreak';
  currentState?: 'Idle' | 'Running' | 'Paused' | 'Completed';
}): React.Element;

export function ControlButtons(props: {
  currentState?: 'Idle' | 'Running' | 'Paused' | 'Completed';
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onSelectMode?: (mode: 'Work' | 'ShortBreak' | 'LongBreak') => void;
}): React.Element;