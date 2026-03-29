export function useMapInteraction(config: {
  gameSession: any;
  foundPassages?: { x: number; y: number }[];
  onUpdateSession: (session: any) => void;
  onNotify: (message: string) => void;
  fogOfWarLogic: any;
}): {
  isFrontOfDoor: (x: number, y: number) => { 
    found: boolean; 
    destination: { x: number; y: number } | null; 
    passageCell: { x: number; y: number } | null;
  };
  openPassage: (passageX: number, passageY: number, destinationX: number, destinationY: number) => void;
};