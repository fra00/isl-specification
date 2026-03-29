export function useTraps(config: {
  gameSession: any;
  visibilityMap: any;
  areMonstersVisible: boolean;
  onNotify: (message: string) => void;
  onActionDone: () => void;
}): {
  checkTrapActivation: (trap: any, x: number, y: number) => boolean;
  isTrapVisible: (x: number, y: number) => boolean;
  registerTriggeredTrap: (x: number, y: number, tipo: number) => void;
  attemptDisarmTrap: (x: number, y: number, canDisarm: boolean, onFail: () => void) => void;
  getTriggeredTraps: () => { x: number; y: number; tipo: number; status: string }[];
  searchTraps: () => void;
};