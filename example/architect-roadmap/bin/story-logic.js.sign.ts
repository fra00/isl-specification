import { StoryEntity } from "./domain";
import { IndexedDbService } from "./indexed-db-service";
import { ChangelogLogic } from "./changelog-logic";
import { generateUUID, generateStoryId } from "./id-generation-logic";
import { deriveStatus } from "./progress-calculation-logic";

export const StoryLogic: (
  indexedDbService: ReturnType<typeof IndexedDbService>,
  changelogLogic: ReturnType<typeof ChangelogLogic>,
  idGenerationLogic: { generateUUID: typeof generateUUID; generateStoryId: typeof generateStoryId; },
  progressCalculationLogic: { deriveStatus: typeof deriveStatus; }
) => {
  createStory: (
    epicId: string,
    data: Omit<ReturnType<typeof StoryEntity>, 'id' | 'epicId' | 'code' | 'progress' | 'isBlocked' | 'createdAt' | 'updatedAt'>
  ) => Promise<ReturnType<typeof StoryEntity>>;
  getStory: (id: string) => Promise<ReturnType<typeof StoryEntity> | undefined>;
  getStoriesByEpic: (epicId: string) => Promise<ReturnType<typeof StoryEntity>[]>;
  updateStory: (
    id: string,
    data: Partial<Omit<ReturnType<typeof StoryEntity>, 'id' | 'epicId' | 'code' | 'progress' | 'createdAt' | 'updatedAt'>>
  ) => Promise<ReturnType<typeof StoryEntity>>;
  deleteStory: (id: string) => Promise<void>;
  getStoriesByProject: (projectId: string) => Promise<ReturnType<typeof StoryEntity>[]>;
  updateStoryProgress: (id: string, progress: number) => Promise<ReturnType<typeof StoryEntity>>;
};