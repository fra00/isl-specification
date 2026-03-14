import { TeamMember, Category, ProjectEntity, EpicEntity, StoryEntity } from "./domain";
import { IndexedDbService } from "./indexed-db-service";

export const SettingsLogic: (indexedDbService: ReturnType<typeof IndexedDbService>) => {
  addTeamMember: (name: string) => Promise<{ id: string; name: string; createdAt: string; updatedAt: string }>;
  getTeamMembers: () => Promise<{ id: string; name: string; createdAt: string; updatedAt: string }[]>;
  updateTeamMember: (id: string, name: string) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<{ id: string; name: string; createdAt: string; updatedAt: string }>;
  getCategories: () => Promise<{ id: string; name: string; createdAt: string; updatedAt: string }[]>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  resetDatabase: () => Promise<void>;
};