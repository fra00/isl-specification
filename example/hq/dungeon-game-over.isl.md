# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-game-over

---

## Component: DungeonGameOver

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `onExit`: () -> void (Callback to return to the main menu).

### 🔍 Appearance

- **Overlay**: Fixed full-screen backdrop (bg-black), z-index 90.
- **Layout**: Centered flex container.
- **Typography**: 
  - "GAME OVER" in large, blood-red gothic font.
  - Dramatic animation (fade in and scale).

### 📦 Content

- **Title**: "Tutti gli eroi sono caduti..."
- **Message**: "Zargon ha trionfato. Il mondo precipita nell'oscurità."
- **Actions**:
  - Button "Torna al Menu": Triggers `onExit`.

### ⚡ Capabilities

#### handleExit

- **Trigger**: User clicks the exit button.
- **Flow**:
  - Trigger `onExit`.