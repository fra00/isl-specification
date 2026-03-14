import { ProjectEntity, EpicEntity, StoryEntity, ChangelogEntry, ImportMode } from "./domain";
import { IndexedDbService } from "./indexed-db-service";
import { ProjectLogic } from "./project-logic";
import { EpicLogic } from "./epic-logic";
import { StoryLogic } from "./story-logic";
import { ChangelogLogic } from "./changelog-logic";
import { SettingsLogic } from "./settings-logic";
import { generateUUID } from "./id-generation-logic";

export const DataManagementLogic: (
  indexedDbService: ReturnType<typeof IndexedDbService>,
  projectLogic: ReturnType<typeof ProjectLogic>,
  epicLogic: ReturnType<typeof EpicLogic>,
  storyLogic: ReturnType<typeof StoryLogic>,
  changelogLogic: ReturnType<typeof ChangelogLogic>,
  settingsLogic: ReturnType<typeof SettingsLogic>,
  idGenerationLogic: { generateUUID: typeof generateUUID; }
) => {
  exportToJson: () => Promise<string>;
  importFromJson: (fileContent: string, mode: 'REPLACE_ALL' | 'ADD_TO_EXISTING') => Promise<void>;
  exportToExcel: () => Promise<{
    projects: ReturnType<typeof ProjectEntity>[];
    epics: ReturnType<typeof EpicEntity>[];
    stories: ReturnType<typeof StoryEntity>[];
    sprints: { sprint: string; stories: ReturnType<typeof StoryEntity>[] }[];
    changelog: ReturnType<typeof ChangelogEntry>[];
  }>;
};