import { EpicEntity, StoryEntity, Priority, RiskLevel } from "./domain";
import { EpicLogic } from "./epic-logic";
import { StoryLogic } from "./story-logic";
import { useNotification } from "./ui-components";

export default function BacklogPresentation(props: {
  epics?: ReturnType<typeof EpicEntity>[];
  stories?: ReturnType<typeof StoryEntity>[];
  epicLogic: ReturnType<typeof EpicLogic>;
  storyLogic: ReturnType<typeof StoryLogic>;
  notificationService: ReturnType<typeof useNotification>;
}): React.Element;