# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-spell-selection-modal

---

> **Reference**: @Spell in `./domain-ruleset.isl.md`
> **Reference**: @HeroState in `./domain-session.isl.md`

## Component: DungeonSpellSelectionModal

### Role: Presentation

**Signature**:

- `heroes`: List of @HeroState (The heroes in the mission).
- `allSpells`: List of @Spell (The full list of 12 spells).
- `onConfirmSelection`: (selection: Map<heroId, List<spellId>>) -> void

### 🔍 Appearance

- **Overlay**: Fixed full-screen backdrop (bg-black/90), z-index 70.
- **Layout**: Columnar layout showing the elements available.
- **Card Backs**: Large images of element backs (`img/cinc/Fuoco00_Dorso.jpg`, etc.).

### 📦 Content

- **Title**: "Selezione Incantesimi".
- **Instruction**: Displays whose turn it is to pick (Wizard first, then Elf).
- **Element Grid**:
  - Shows the 4 element backs.
  - Elements already picked are greyed out or hidden.

### ⚡ Capabilities

#### internalState

- `pickedElements`: List of String ("Fuoco", "Acqua", etc.).
- `currentHeroPicking`: @HeroState (Wizard or Elf).

#### initialize

- **Flow**:
  - Identify Wizard in `heroes` -> Set as `currentHeroPicking`.
  - Set `pickedElements` to empty.

#### selectElement

- **Signature**: `(elemento: String)`
- **Flow**:
  - IF `pickedElements` contains `elemento` RETURN.
  - Add `elemento` to `pickedElements`.
    - IF `currentHeroPicking` is Wizard AND `pickedElements.length` == 3:
      - Find Elf in `heroes` -> Set as `currentHeroPicking`.
      - Update UI instruction to "Turno dell'Elfo".
    - ELSE IF `currentHeroPicking` is Elf AND `pickedElements.length` == 4:
      - Let `wizardId` = Wizard's heroId. Let `elfId` = Elf's heroId.
      - Let `wizardSpells` = Filter `allSpells` where `elemento` is in the first 3 `pickedElements` -> map to `id`.
      - Let `elfSpells` = Filter `allSpells` where `elemento` is the 4th `pickedElements` -> map to `id`.
      - Create result map: `{ wizardId: wizardSpells, elfId: elfSpells }`.
      - Trigger `onConfirmSelection`.

**💡 Implementation Hint**: The Wizard picks 3 elements, leaving exactly one for the Elf automatically.
