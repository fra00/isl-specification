export default function KanbanBoardView(props: {
  board: {
    id: string;
    columns: Array<{
      id: string;
      title: string;
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        dueDate: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
      }>;
    }>;
  };
  onAddColumn: (title: string) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string, taskDetails: { title: string; description: string; dueDate: string; priority: "LOW" | "MEDIUM" | "HIGH"; }) => void;
  onUpdateTask: (columnId: string, taskId: string, updatedDetails: { title?: string; description?: string; dueDate?: string; priority?: "LOW" | "MEDIUM" | "HIGH"; }) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onMoveTask: (currentColumnId: string, taskId: string, direction: 'left' | 'right') => void;
}): React.Element;