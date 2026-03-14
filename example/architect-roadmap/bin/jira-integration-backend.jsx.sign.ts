type JiraEpicData = {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  startDate: string;
  endDate: string;
  components: string[];
};

type JiraStoryData = {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  storyPoints: number;
  assignee: string;
  sprint: string;
  startDate: string;
  endDate: string;
  labels: string[];
};

export const JiraIntegrationBackend: (config: {
  jiraApiBaseUrl: string;
  jiraAuthToken: string;
}) => {
  getJiraEpic: (jiraEpicId: string) => Promise<JiraEpicData | null>;
  getJiraStory: (jiraStoryId: string) => Promise<JiraStoryData | null>;
};