import { IndexedDbService } from "./indexed-db-service";
import { ChangelogLogic } from "./changelog-logic";
import { generateUUID, generateEpicId } from "./id-generation-logic";
import { calculateEpicProgress, deriveStatus } from "./progress-calculation-logic";
import { StoryLogic } from "./story-logic";

export const EpicLogic: (
  indexedDbService: ReturnType<typeof IndexedDbService>,
  changelogLogic: ReturnType<typeof ChangelogLogic>,
  idGenerationLogic: { generateUUID: typeof generateUUID; generateEpicId: typeof generateEpicId; },
  progressCalculationLogic: { calculateEpicProgress: typeof calculateEpicProgress; deriveStatus: typeof deriveStatus; },
  storyLogic: ReturnType<typeof StoryLogic>
) => {
  createEpic: (
    projectId: string,
    data: Omit<{
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
    }, 'id' | 'projectId' | 'code' | 'createdAt' | 'updatedAt'>
  ) => Promise<{
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
  }>;
  getEpic: (id: string) => Promise<{
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
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  } | undefined>;
  getEpicsByProject: (projectId: string) => Promise<{
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
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  }[]>;
  updateEpic: (
    id: string,
    data: Partial<Omit<{
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
    }, 'id' | 'projectId' | 'code' | 'createdAt' | 'updatedAt'>>
  ) => Promise<{
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
  }>;
  deleteEpic: (id: string) => Promise<void>;
};