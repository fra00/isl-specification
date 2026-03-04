# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-notification

---

## Component: DungeonNotification

### Role: Presentation

**Signature**:

- `message`: String (The message to display. If null or empty, component is hidden).
- `duration`: Integer (Duration in ms, default 3000).
- `onClose`: () -> void (Callback to clear the message).

### 🔍 Appearance

- **Position**: Fixed, centered at the top of the screen (top-20).
- **Style**:
  - Background: Semi-transparent black (`bg-black/80`).
  - Border: Gold/Yellow border (`border-yellow-500`).
  - Text: White, bold, large.
  - Padding: p-4.
  - Rounded corners.
  - Z-Index: 100 (Always on top).
- **Animation**: Fade in/out (optional).

### 📦 Content

- Display `message`.

### ⚡ Capabilities

#### autoClose

- **Contract**: Automatically closes the notification after `duration`.
- **Trigger**: When `message` changes and is not null.
- **Flow**:
  - Set a timeout for `duration` ms.
  - On timeout, trigger `onClose`.
  - Cleanup timeout on unmount or if message changes.
