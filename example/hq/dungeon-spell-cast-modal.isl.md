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
- **Spell Card**:
  - **Layout**: Stack verticale con immagine in alto, seguita da titolo e descrizione.
  - **Typography**:
    - **Name**: Titolo in grassetto (oro/bianco).
    - **Description**: Blocco di testo dedicato sotto il nome, con stile corsivo o colore tenue, che spiega chiaramente l'effetto dell'incantesimo.
  - **Target Info**: Piccola etichetta o icona che indica il tipo di bersaglio (es. "Su se stessi", "Su un mostro").

### 📦 Content

- **Header**: Title "Lancia Incantesimo" and the hero's class name.
- **Spell Grid**:
  - IF `hero.availableSpells.length` == 0:
    - Display: "Non hai più incantesimi disponibili per questa missione."
  - ELSE:
    - For each `spellId` in `hero.availableSpells`:
      - Let `spell` = Find in `allSpells` where `id` == `spellId`.
      - Guard: IF `spell` is null, skip rendering.
      - **Card Face**:
        - Image: `/img/cinc/` + `spell.immagine`.
        - Name: `spell.nome`.
        - Description: `spell.descrizione`.
        - Target Info: Display text based on `spell.targetType` (e.g., "Bersaglio: Mostro" or "Bersaglio: Personaggio").
        - Action: Button "Lancia" -> Trigger `handleCast(spell.id)`.

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
