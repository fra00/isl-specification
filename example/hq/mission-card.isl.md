# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./mission-card

---

> **Reference**: Mission in `./domain-map.isl.md`

## Component: MissionCard

### Role: Presentation

**Signature**:

- `mission`: Mission (The mission data object).
- `index`: Integer (The index of the mission in the list).
- `status`: String (One of: 'LOCKED', 'AVAILABLE', 'COMPLETED').
- `onSelect`: (index: Integer) -> void (Callback triggered on selection).

### 🔍 Appearance

- **Container**: Card with shadow, rounded corners, and border.
- **Styling by Status**:
  - **COMPLETED**: Green theme (border, text).
  - **AVAILABLE**: Yellow/Gold theme (highlighted border).
  - **LOCKED**: Gray theme, reduced opacity, cursor not-allowed.

### 📦 Content

- **Icon**: Status icon (Checkmark for Completed, Play for Available, Lock for Locked).
- **Title**: Displays `mission.titolo`.
- **Subtitle**: Displays "Mission " + (`mission.ordine` or `index` + 1).
- **Button**: Action button with label based on status ("Replay", "Start", "Locked").

### ⚡ Capabilities

#### handleInteraction

- **Contract**: Validates click and triggers selection.
- **Trigger**: User clicks the card or the action button.
- **Flow**:
  - IF mission IS NULL THEN RETURN.
  - IF `status` is 'LOCKED':
    - Do nothing (or prevent default).
  - ELSE:
    - Trigger `onSelect(index)`.
