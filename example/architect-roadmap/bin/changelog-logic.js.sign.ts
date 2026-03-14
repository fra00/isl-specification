import { IndexedDbService } from "./indexed-db-service";
import { ChangelogEntry, ChangelogEntityType } from "./domain";

type ChangelogFilters = {
  entityType?: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
  entityId?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
};

export const ChangelogLogic: (indexedDbService: ReturnType<typeof IndexedDbService>) => {
  recordChange: (entityType: ChangelogEntityType, entityId: string, entityCode: string, field: string, oldValue: string, newValue: string) => Promise<void>;
  recordDeletion: (entityType: ChangelogEntityType, entityId: string, entityCode: string) => Promise<void>;
  getChangelog: (filters?: ChangelogFilters) => Promise<ReturnType<typeof ChangelogEntry>[]>;
};