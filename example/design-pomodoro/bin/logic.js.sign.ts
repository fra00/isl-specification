import { TimerMode, TimerState, TimerConfigEntity } from "./domain";

export const PomodoroEngine: (
  initialConfig?: {
    workDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
  }
) => {
  initialize: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  selectMode: (mode: typeof TimerMode[keyof typeof TimerMode]) => void;
  getCurrentMode: () => typeof TimerMode[keyof typeof TimerMode];
  getCurrentState: () => typeof TimerState[keyof typeof TimerState];
  getRemainingTime: () => number;
  getConfig: () => {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  };
};