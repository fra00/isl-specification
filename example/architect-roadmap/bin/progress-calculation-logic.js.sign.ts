export const calculateStoryProgress: (story: { progress?: number | null }) => number;
export const deriveStatus: (progress: number, isBlocked: boolean) => 'BLOCKED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export const calculateEpicProgress: (stories?: { progress?: number | null }[] | null) => number;
export const calculateProjectProgress: (epics?: { stories?: { progress?: number | null }[] | null }[] | null) => number;
export const deriveProjectStatus: (progress: number, currentStatus: 'PAUSED' | 'ACTIVE' | 'PLANNING' | 'COMPLETED') => 'PAUSED' | 'ACTIVE' | 'PLANNING' | 'COMPLETED';