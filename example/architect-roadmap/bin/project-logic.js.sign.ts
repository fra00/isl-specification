import { IndexedDbService } from "./indexed-db-service";
import { ChangelogLogic } from "./changelog-logic";
import { calculateProjectProgress } from "./progress-calculation-logic";
import { EpicLogic } from "./epic-logic";
import { generateUUID } from "./id-generation-logic";

export const ProjectLogic: (
  indexedDbService: ReturnType<typeof IndexedDbService>,
  changelogLogic: ReturnType<typeof ChangelogLogic>,
  progressCalculationLogic: { calculateProjectProgress: typeof calculateProjectProgress },
  epicLogic: ReturnType<typeof EpicLogic>,
  idGenerationLogic: { generateUUID: typeof generateUUID }
) => {
  createProject: (data: Omit<{
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
  }, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<{
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
  }>;
  getProject: (id: string) => Promise<{
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
  } | undefined>;
  getAllProjects: () => Promise<{
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
  }[]>;
  updateProject: (id: string, data: Partial<Omit<{
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
  }, 'id' | 'progress' | 'createdAt' | 'updatedAt'>>) => Promise<{
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
  }>;
  deleteProject: (id: string) => Promise<void>;
};