# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.2
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

### 🚨 Constraints

- If `status` is `LOCKED`, `handleInteraction` MUST NOT call `onSelect`.
- If `mission` is null/undefined, interaction MUST be ignored safely without side effects.
- For selectable statuses (`AVAILABLE`, `COMPLETED`), `handleInteraction` MUST emit exactly one `onSelect(index)` per user action.

### 🚨 Global Constraints

- Visual status semantics (`LOCKED`, `AVAILABLE`, `COMPLETED`) MUST remain consistent across icon, styling, and action affordance.
- `MissionCard` MUST remain a pure presentation component and MUST NOT decide campaign progression rules.
- Equivalent props (`mission`, `index`, `status`) MUST produce equivalent rendering and interaction outcomes.

### ✅ Acceptance Criteria

- [ ] `handleInteraction` satisfies local constraints for locked, selectable, and null-mission cases.
- [ ] Component-level status semantics are coherent in both visuals and interaction behavior.
- [ ] Role boundary remains Presentation-only with no domain progression logic leakage.

### 🧪 Test Scenarios

1. **Capability Constraint - Locked Mission**:
   - Target: `handleInteraction`
   - Input: `status = LOCKED`, valid `mission`, valid `index`
   - Expected: no `onSelect` invocation

2. **Capability Constraint - Selectable Mission**:
   - Target: `handleInteraction`
   - Input: `status = AVAILABLE` (or `COMPLETED`), valid `mission`, valid `index`
   - Expected: one `onSelect(index)` invocation

3. **Global Constraint - Status Semantics Consistency**:
   - Target: `MissionCard` as component
   - Input: same props rendered repeatedly
   - Expected: same status visuals and same interaction behavior across renders
