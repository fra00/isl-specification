# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-combat-result-modal

---

> **Reference**: @CombatResult, @CombatDiceResult in `./dungeon-use-combat.isl.md`
> **Reference**: @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @Hero, @Monster in `./domain-ruleset.isl.md`

## Component: CombatResultModal

### Role: Presentation

**Signature**:

- `isOpen`: Boolean (Controls visibility).
- `onClose`: () -> void (Callback to close the modal).
- `combatResult`: @CombatResult (The result of the combat containing dice rolls and damage).
- `attacker`: @HeroState | @MonsterState (The attacking entity).
- `defender`: @HeroState | @MonsterState (The defending entity).

### 🔍 Appearance

- **Overlay**: Fixed full-screen container with semi-transparent backdrop (bg-black/80), z-index 50.
- **Dialog**: Centered container, width 800px, height 500px, relative, overflow hidden, rounded-xl, shadow-2xl.
- **Background Layout**:
  - **Left Panel (Attacker)**:
    - Background Color: Red gradient (e.g., `bg-gradient-to-br from-red-900 to-red-700`).
    - Shape: Clip-path polygon creating a diagonal split (e.g., `polygon(0 0, 60% 0, 40% 100%, 0% 100%)`).
    - Z-Index: 1.
  - **Right Panel (Defender)**:
    - Background Color: Blue gradient (e.g., `bg-gradient-to-bl from-blue-900 to-blue-700`).
    - Shape: Fills the container (visible part is what's not covered by Left Panel).
    - Z-Index: 0.
- **Attacker Portrait (Left)**
  - z-index: 2
  - pnly gor barbarian use margin negative to move the image more to the center of the screen because of the diagonal split
- **Defender Portrait (Right)**
- **Center Info**:
  - **VS Text**:
    - Centered horizontally and vertically (top 20%), Font size 4rem, Bold, Italic, Color White/Gold, Text Shadow.
  - **Dice Container**:
    - Position: Centered horizontally, below "VS" text.
    - Layout: Flex column or grid.
  - **Result Text**:
    - Positioned bottom center, large font, appears after dice animation.
  - **Close Button**:
    - Bottom center (below Result Text),
    - Button style (e.g., bg-yellow-600 text-black px-6 py-2 rounded hover:bg-yellow-500),
  - z-index: 3

### 📦 Content

- **Attacker Portrait (Left)**:
  - **Source**:
    - IF `attacker` has `hero`: `/img/eroi/` + `@Hero.portrait`.)
    - IF `attacker` has `monster`: `/img/mostri/` + `@Monster.immalarge`.
  - **Style**: Large image, positioned left-center, object-contain/cover, fade into background.
- **Defender Portrait (Right)**:
  - **Source**:
    - IF `defender` has `hero`: `/img/eroi/` + `@Hero.portrait`.
    - IF `defender` has `monster`: `/img/mostri/` + `@Monster.immalarge`.
  - **Style**: Large image, positioned right-center, object-contain/cover, fade into background.
- **Center Info**:
  - **VS Text**:
    - Text: "VS".
  - **Dice Container**:
    - **Attacker Dice Row**:
      - Label: "Attacker".
      - Content: List of dice images based on `combatResult.attackerDice`.
        - IF `SKULL`: `/img/altro/teschio.jpg`.
        - IF `WHITE_SHIELD` : `/img/altro/scudo.jpg`.
        - IF `BLACK_SHIELD`: `/img/altro/scudo-nero.png`.
      - **Animation**: Each die slides in from the **Left** towards the center with a staggered delay (e.g., 0.1s per die).
    - **Defender Dice Row**:
      - Label: "Defender".
      - Content: List of dice images based on `combatResult.defenderDice`.
        - IF `SKULL`: `/img/altro/teschio.jpg`.
        - IF `WHITE_SHIELD` : `/img/altro/scudo.jpg`.
        - IF `BLACK_SHIELD`: `/img/altro/scudo-nero.png`.
      - **Animation**: Each die slides in from the **Right** towards the center with a staggered delay (e.g., 0.1s per die).
  - **Result Text**:
    - Content: "Damage Dealt: " + `combatResult.damageDealt`.
  - **Close Button**:
    - Text: "OK".
    - Action: onClick triggers `onClose`.

### ⚡ Capabilities

#### internalState

- `animationActive`: Boolean (True when modal opens to trigger CSS animations).

#### useEffect

- **Trigger**: `isOpen` changes.
- **Flow**:
  - IF `isOpen` is true:
    - Set `animationActive` to true.
  - ELSE:
    - Set `animationActive` to false.
