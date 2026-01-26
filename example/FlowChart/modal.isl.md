# Project: Flow Chart Modal

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./modal.jsx

---

## Component: Modal

Modal window to display information

### Role: Presentation

### 🔍 Appearance

- Overlay: semi-transparent background (#000000, opacity 0.5)
- Modale box: centered, white background (#ffffff), rounded corners (8px), light shadow
- Dimensions: width 400px, height variable based on content

### ⚡ Capabilities

#### open

**Contract**: Displays modal window with specified content.
**Signature**:
  - **Input**:
    - content: ReactNode
  - **Output**: NONE (State update)
**Trigger**: Function call `openModal(content)`
**Side Effects**:

- Shows overlay and modal box.
- Inserts `content` inside modal box.

#### close

**Contract**: Hides modal window.
**Signature**:
  - **Input**: NONE
  - **Output**: NONE (State update)
**Trigger**: Function call `closeModal()`
**Side Effects**:

- Hides overlay and modal box.
