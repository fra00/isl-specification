# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-combat

---

> **Reference**: @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @Hero, @Monster in `./domain-ruleset.isl.md`

## Component: useCombatLogic

### Role: Business Logic

**Signature**: ()

### Domain Concepts

#### `CombatDiceResult`

Enum representing the face of a combat die.

- `SKULL`: Represents a hit (3/6 chance).
- `WHITE_SHIELD`: Represents a hero block (2/6 chance).
- `BLACK_SHIELD`: Represents a monster block (1/6 chance).

#### `CombatResult`

Structure containing the details of a combat interaction.

- `attackerDice`: List of rolled faces (@CombatDiceResult).
- `defenderDice`: List of rolled faces (@CombatDiceResult).
- `skulls`: Total skulls rolled by attacker (Integer).
- `shields`: Total effective shields rolled by defender (Integer).
- `damageDealt`: Final damage to be applied (Integer).

### ⚡ Capabilities

#### resolveCombat

- **Contract**: Simulates dice rolls and calculates damage for an attack between any two entities (Hero or Monster).
- **Signature**: `(attacker: @HeroState | @MonsterState, defender: @HeroState | @MonsterState) -> @CombatResult`
- **Flow**:
  - **1. Determine Dice Counts**:
    - `attackDiceCount` = 0.
    - IF `attacker` is Hero (has `hero` property):
      - `attackDiceCount` = `attacker.hero.attacco`.
      - Add bonuses from `attacker.equipment` (e.g., weapons).
    - ELSE IF `attacker` is Monster (has `monster` property):
      - `attackDiceCount` = `attacker.monster.attacco`.
    - `defenseDiceCount` = 0.
    - IF `defender` is Hero (has `hero` property):
      - `defenseDiceCount` = `defender.hero.difesa`.
      - Add bonuses from `defender.equipment` (e.g., armor).
    - ELSE IF `defender` is Monster (has `monster` property):
      - `defenseDiceCount` = `defender.monster.difesa`.

  - **2. Roll Attack**:
    - Initialize `attackerDice` list.
    - Repeat `attackDiceCount` times:
      - Generate random integer 1-6.
      - IF 1,2,3: Add `SKULL`.
      - IF 4,5: Add `WHITE_SHIELD`.
      - IF 6: Add `BLACK_SHIELD`.
    - `skulls` = Count of `SKULL` in `attackerDice`.

  - **3. Roll Defense**:
    - Initialize `defenderDice` list.
    - Repeat `defenseDiceCount` times:
      - Generate random integer 1-6.
      - IF 1,2,3: Add `SKULL`.
      - IF 4,5: Add `WHITE_SHIELD`.
      - IF 6: Add `BLACK_SHIELD`.
    - `shields` = 0.
    - IF `defender` is Hero: `shields` = Count of `WHITE_SHIELD` in `defenderDice`.
    - IF `defender` is Monster: `shields` = Count of `BLACK_SHIELD` in `defenderDice`.

  - **4. Calculate Outcome**:
    - `damageDealt` = Max(0, `skulls` - `shields`).

  - **5. Return**:
    - Create and return `@CombatResult` with `attackerDice`, `defenderDice`, `skulls`, `shields`, `damageDealt`.

- **Return**: `{ resolveCombat }`
