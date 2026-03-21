export function useTraps(config?: any): {
    triggeredTraps: Array<{ x: number; y: number; tipo: number }>;
    checkTrapActivation: (trap: { tipo: number; rccadex: number; rccadey: number }, x: number, y: number) => boolean;
    registerTriggeredTrap: (x: number, y: number, tipo: number) => void;
    getTriggeredTraps: () => Array<{ x: number; y: number; tipo: number }>;
};