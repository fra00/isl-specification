# Project: Task Management App

Simple task tracking application with drag-and-drop kanban board.

---

## Domain Concepts

### Task

**Identity**: UUID
**Properties**:

- title: short description of task
- status: enum (todo, in-progress, done)
- priority: enum (low, medium, high)
- assignee: reference to User
  **Relationships**:
- Belongs to one Project (N:1)
- Assigned to zero or one User (N:0..1)

### User

**Identity**: UUID
**Properties**:

- email: unique, authentication identifier
- displayName: user's chosen name
  **Relationships**:
- Assigned to many Tasks (1:N)

---

## Component: TaskCard

Displays a single task in the kanban board with drag capability.

### Role: Presentation

### 📐 Appearance

- Card layout: white background, rounded corners (8px)
- Border: 1px solid #e5e7eb (gray-200)
- Padding: 16px
- Shadow on hover: 0 4px 6px rgba(0,0,0,0.1)
- Dragging state: opacity 0.5, cursor grabbing
- Priority indicator:
  - Low: blue dot
  - Medium: yellow dot
  - High: red dot

### 📦 Content

- Priority indicator (colored dot, top-left)
- Task title (bold, 16px)
- Assignee avatar (if assigned, bottom-right)
- Status badge (hidden, inferred from column)

---

### ⚡ Capabilities

#### dragStart

**Signature:**

- **input**: NONE (user-initiated)
- **output**: NONE (side effect only)

**Contract**: Initiate drag operation to move task between columns

**Trigger**: MouseDown on card + MouseMove (drag gesture)

**Flow**:

1. Capture card initial position
2. Create ghost element (semi-transparent copy)
3. Hide original card (opacity 0.5)
4. Ghost element follows cursor
5. On MouseUp:
   IF dropped on valid column THEN
   a. Update task.status
   b. Move card to new column
   ELSE
   a. Animate card back to original position

**Side Effect**:

- Task.status updated in application state
- Parent KanbanBoard re-renders affected columns
- Cursor changes to 'grabbing'

**Cleanup**:

- Remove ghost element
- Restore card opacity to 1.0
- Cursor restored to default

**💡 Implementation Hint**:

```javascript
// Use HTML5 Drag and Drop API
card.addEventListener("dragstart", (e) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", task.id);
});
```

**🚨 Constraint**:

- MUST NOT allow drag if user lacks edit permission
- Drag operation MUST complete in < 100ms (perceived instant)
- MUST prevent text selection during drag

**✅ Acceptance Criteria**:

- [ ] Card is draggable with mouse
- [ ] Card is draggable with touch (mobile)
- [ ] Ghost element appears during drag
- [ ] Original card shows reduced opacity during drag
- [ ] Drop updates task status correctly

---

#### editTitle

**Signature:**

- **input**: NONE (trigger shows inline editor)
- **output**: NONE (updates task.title)

**Contract**: Allow inline editing of task title

**Trigger**: DoubleClick on task title text

**Flow**:

1. Replace title text with input field
2. Input field pre-filled with current title
3. Input field focused automatically
4. User edits text
5. On Enter key: save changes
6. On Escape key: discard changes
7. On blur (click outside): save changes

**🚨 Constraint**:

- Title MUST NOT be empty (min 1 character)
- Title MUST NOT exceed 200 characters
- MUST disable drag during edit mode

**✅ Acceptance Criteria**:

- [ ] DoubleClick enters edit mode
- [ ] Enter saves changes
- [ ] Escape cancels changes
- [ ] Click outside saves changes
- [ ] Empty title rejected with error message

---

## 🚨 Global Constraints

- Component MUST be keyboard accessible (Tab navigation)
- Component MUST work on touch devices (mobile)
