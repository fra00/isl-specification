# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-spell-cast-modal

---

> **Reference**: @HeroState in `./domain-session.isl.md`
> **Reference**: @Spell in `./domain-ruleset.isl.md`

## Component: DungeonSpellCastModal

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `hero`: @HeroState (The hero whose spells are displayed).
- `allSpells`: List of @Spell (Reference data for spell details).
- `onCastSpell`: (spellId: Integer) -> void (Callback when a spell is selected).
- `onClose`: () -> void (Callback to close the modal).

### 🔍 Appearance

- **Overlay**: Fixed full-screen backdrop (bg-black/85), z-index 65.
- **Dialog**: Centered container, width 90%, max-width 1000px, dark theme.
- **Grid**: Responsive grid showing spell cards.

### 📦 Content

- **Header**: Title "Lancia Incantesimo" and the hero's class name.
- **Spell Cards**: For each `spellId` in `hero.availableSpells`:
  - **Card Face**:
    - Image: `/img/cinc/` + `spell.immagine`.
    - Name: `spell.nome`.
    - Description: `spell.descrizione`.
    - Action: Button "Lancia".

### ⚡ Capabilities

#### handleCast

- **Signature**: `(spellId: Integer)`
- **Flow**:
  - Trigger `onCastSpell(spellId)`.

#### handleClose

- **Contract**: Triggers the close callback.
- **Trigger**: User clicks close or backdrop.
- **Flow**:
  - Trigger `onClose`.
