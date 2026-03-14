export default function ReportsPresentation(props: {
  seriesData: { name: string; data: { date: string; progress: number }[] }[];
  summaryData: {
    quarter: string;
    year: number;
    epicSummaries: { status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'; count: number }[];
    totalEpics: number;
  }[];
  changelogEntries: {
    id: string;
    entityType: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
    entityId: string;
    entityCode: string;
    field: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
  }[];
  currentChangelogFilters: {
    entityType?: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
    entityId?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  };
  onApplyChangelogFilters: (newFilters: {
    entityType?: 'PROJECT' | 'EPIC' | 'STORY' | 'TEAM_MEMBER' | 'CATEGORY';
    entityId?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onClearChangelogFilters: () => void;
}): React.Element;