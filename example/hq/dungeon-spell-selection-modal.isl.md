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
- **Card Backs**: Large images of element backs (`/img/cinc/Fuoco00_Dorso.jpg`, etc.).

### 📦 Content

- **Title**: "Selezione Incantesimi".
- **Instruction**: Displays whose turn it is to pick (Wizard first, then Elf).
- **Element Grid**:
  - Shows the 4 element backs (Source: `/img/cinc/` + `[Element]00_Dorso.jpg`).
  - Elements already picked are greyed out or hidden.

### ⚡ Capabilities

#### internalState

- `pickedElements`: List of String ("Fuoco", "Acqua", etc.).
- `currentHeroPicking`: @HeroState (Wizard or Elf).

#### initialize

- **Flow**:
  - Identify hero in `heroes` where `hero.hero.classe` == "Mago".
  - IF Wizard is found:
    - Set `currentHeroPicking` to Wizard.
  - ELSE:
    - Identify hero in `heroes` where `hero.hero.classe` == "Elfo".
    - IF Elf is found:
      - Set `currentHeroPicking` to Elf.
    - ELSE:
      - Set `currentHeroPicking` to null.
  - Set `pickedElements` to empty.

#### selectElement

- **Signature**: `(elemento: String)`
- **Flow**:
  - IF `currentHeroPicking` is null RETURN.
  - IF `pickedElements` contains `elemento` RETURN.
  - Add `elemento` to `pickedElements`.
    - BRANCH:
      - IF `currentHeroPicking.hero.classe` == "Mago" AND `pickedElements.length` == 3:
      - // Auto-assign remaining element to Elf if present
        - Let `elf` = Find hero in `heroes` where `hero.hero.classe` == "Elfo".
      - IF `elf` is found:
        - Let `allElements` = ["Fuoco", "Acqua", "Terra", "Aria"].
        - Let `remaining` = Find element in `allElements` NOT IN `pickedElements`.
        - Add `remaining` to `pickedElements`.
      - // Finalize selection
      - Let `wizardId` = `currentHeroPicking.heroId`.
      - Let `wizardSpells` = Filter `allSpells` where `spell.elemento` is in the first 3 `pickedElements` -> map to `id`.
      - Let `selectionMap` = New Map.
      - Add `wizardId -> wizardSpells` to `selectionMap`.
      - IF `elf` is found:
        - Let `elfSpells` = Filter `allSpells` where `spell.elemento` is the 4th `pickedElements` -> map to `id`.
        - Add `elf.heroId -> elfSpells` to `selectionMap`.
      - Trigger `onConfirmSelection(selectionMap)`.
      - IF `currentHeroPicking.hero.classe` == "Elfo" AND `pickedElements.length` == 1:
        - Let `elfId` = `currentHeroPicking.heroId`.
        - Let `elfSpells` = Filter `allSpells` where `spell.elemento` == `elemento` -> map to `id`.
        - Let `selectionMap` = New Map.
        - Add `elfId -> elfSpells` to `selectionMap`.
        - Trigger `onConfirmSelection(selectionMap)`.

**💡 Implementation Hint**: The Wizard picks 3 elements, leaving exactly one for the Elf automatically.
