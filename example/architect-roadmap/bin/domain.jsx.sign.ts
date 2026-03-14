export const ProjectStatus: { PLANNING: 'PLANNING'; ACTIVE: 'ACTIVE'; COMPLETED: 'COMPLETED'; PAUSED: 'PAUSED'; };
export const EpicStatus: { NOT_STARTED: 'NOT_STARTED'; IN_PROGRESS: 'IN_PROGRESS'; COMPLETED: 'COMPLETED'; BLOCKED: 'BLOCKED'; };
export const StoryStatus: { NOT_STARTED: 'NOT_STARTED'; IN_PROGRESS: 'IN_PROGRESS'; COMPLETED: 'COMPLETED'; BLOCKED: 'BLOCKED'; };
export const Priority: { LOW: 'LOW'; MEDIUM: 'MEDIUM'; HIGH: 'HIGH'; CRITICAL: 'CRITICAL'; };
export const RiskLevel: { LOW: 'LOW'; MEDIUM: 'MEDIUM'; HIGH: 'HIGH'; };
export const StoryPoints: { ONE: 1; TWO: 2; THREE: 3; FIVE: 5; EIGHT: 8; THIRTEEN: 13; TWENTY_ONE: 21; };
export const ChangelogEntityType: { PROJECT: 'PROJECT'; EPIC: 'EPIC'; STORY: 'STORY'; TEAM_MEMBER: 'TEAM_MEMBER'; CATEGORY: 'CATEGORY'; };
export const ImportMode: { REPLACE_ALL: 'REPLACE_ALL'; ADD_TO_EXISTING: 'ADD_TO_EXISTING'; };

export const ProjectEntity: (data?: {
  id?: string;
  name?: string;
  description?: string;
  owner?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}) => {
  id: string;
  name: string;
  description: string;
  owner: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export const EpicEntity: (data?: {
  id?: string;
  projectId?: string;
  code?: string;
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  quarter?: string;
  year?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  category?: string;
  owner?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  jiraRef?: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}) => {
  id: string;
  projectId: string;
  code: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  quarter: string;
  year: number;
  plannedStartDate: string;
  plannedEndDate: string;
  category: string;
  owner: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  jiraRef: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export const StoryEntity: (data?: {
  id?: string;
  epicId?: string;
  code?: string;
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  storyPoints?: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  assignee?: string;
  sprint?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  jiraRef?: string;
  notes?: string;
  externalLinks?: string[];
  progress?: number;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}) => {
  id: string;
  epicId: string;
  code: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  storyPoints: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  assignee: string;
  sprint: string;
  plannedStartDate: string;
  plannedEndDate: string;
  jiraRef: string;
  notes: string;
  externalLinks: string[];
  progress: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export const ChangelogEntry: (data?: {
  id?: string;
  entityType?: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
  entityId?: string;
  entityCode?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp?: string;
}) => {
  id: string;
  entityType: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
  entityId: string;
  entityCode: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
};

export const TeamMember: (data?: {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}) => {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const Category: (data?: {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}) => {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const ExportedData: (data?: {
  version?: string;
  timestamp?: string;
  projects?: any[]; // Array of ProjectEntity
  epics?: any[];    // Array of EpicEntity
  stories?: any[];  // Array of StoryEntity
  changelog?: any[]; // Array of ChangelogEntry
  teamMembers?: any[]; // Array of TeamMember
  categories?: any[]; // Array of Category
}) => {
  version: string;
  timestamp: string;
  projects: any[];
  epics: any[];
  stories: any[];
  changelog: any[];
  teamMembers: any[];
  categories: any[];
};