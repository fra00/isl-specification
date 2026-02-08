export const TimerMode: {
  Work: 'Work';
  ShortBreak: 'ShortBreak';
  LongBreak: 'LongBreak';
};

export const TimerState: {
  Idle: 'Idle';
  Running: 'Running';
  Paused: 'Paused';
  Completed: 'Completed';
};

export const TimerConfigEntity: (data?: {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}) => {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};