import { ProjectLogic } from "./project-logic";
import { useNotification } from "./ui-components";

export default function DashboardPresentation(props: {
  projectLogic: ReturnType<typeof ProjectLogic>;
  notificationService: ReturnType<typeof useNotification>;
  onNavigateToProjectDetail?: (id: string) => void;
}): React.Element;