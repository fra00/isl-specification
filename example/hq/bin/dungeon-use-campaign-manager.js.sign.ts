export function useCampaignManager(config?: any): {
  saveCampaign: (heroes: any[], nextMissionIndex: number) => void;
  loadCampaign: () => { heroes: any[]; nextMissionIndex: number; timestamp: number } | null;
  hasSavedCampaign: () => boolean;
  resetCampaign: () => void;
};