# Project: Dungeon React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-mission-summary

---

> **Reference**: @HeroState in `./domain-session.isl.md`
> **Reference**: @Equipment, @Item in `./domain-ruleset.isl.md`

## Component: DungeonMissionSummary

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `heroes`: List of @HeroState (The heroes at the end of the mission).
- `allEquipment`: List of @Equipment (To map IDs to names).
- `allItems`: List of @Item (To map IDs to names).
- `onClose`: () -> void (Callback to finalize mission and exit).

### 🔍 Appearance

- **Overlay**: Fixed full-screen backdrop (bg-black/95), z-index 80.
- **Dialog**: Large centered container, parchment or gothic stone theme.
- **Title**: Large golden text "MISSIONE COMPIUTA".
- **Hero Grid**: Grid displaying columns for each hero.

### 📦 Content

- **Title Section**: Displays "Riepilogo Missione".
- **Hero List**: For each hero who has not died (`currentBody` > 0):
  - **Portrait**: `hero.hero.portrait`.
  - **Name & Class**: `hero.hero.nome` - `hero.hero.classe`.
  - **Gold Section**: Icon and text showing `hero.gold` (Total gold).
  - **Loot Section**:
    - **Items**: List names of `@Item` found in `hero.inventory`.
    - **Equipment**: List names of `@Equipment` found in `hero.equipment`.
- **Actions**:
  - Button "Torna al Villaggio": Large button to trigger `onClose`.

### ⚡ Capabilities

#### handleFinalize

- **Contract**: Triggers the exit process.
- **Trigger**: User clicks the main button.
- **Flow**:
  - Trigger `onClose`.
