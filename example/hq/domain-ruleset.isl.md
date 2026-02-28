# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./game-domain-ruleset

---

## Component: GameDomainRuleset

### Role: Domain

## Domain Concepts

### 📦 Content/Structure

#### `Hero`

Represents a playable hero character definition.

- `id`: Unique identifier (Integer).
- `classe`: Name of the hero class (String).
- `attacco`: Attack value (Integer).
- `difesa`: Defense value (Integer).
- `movimento`: Movement value (Integer).
- `mente`: Mind points (Integer).
- `corpo`: Body points (Integer).
- `miniature`: Image filename for the hero miniature (String).
- `miniatureDeath`: Image filename for the dead hero miniature (String).
- `portrait`: Image filename for the hero portrait (String).

#### `Monster`

Represents a monster definition.

- `id`: Unique identifier (Integer).
- `nome`: Name of the monster (String).
- `movimento`: Movement value (Integer).
- `attacco`: Attack value (Integer).
- `difesa`: Defense value (Integer).
- `corpo`: Body points (Integer).
- `mente`: Mind points (Integer).
- `immagine`: Image filename (String).
- `immalarge`: Large image filename (String).
- `nonmorto`: Indicates if the monster is undead (Boolean).

#### `Equipment`

Represents an equipment item definition.

- `id`: Unique identifier (Integer).
- `nome`: Name of the equipment (String).
- `dadatt`: Attack dice count (Integer).
- `daddif`: Defense dice count (Integer).
- `daddifex`: Extra defense dice (Integer).
- `numdadicontr`: Number of counter dice (Integer).
- `doppioatt`: Allows double attack (Boolean).
- `mosdoppio`: Double movement value (Integer).
- `puntimente`: Mind points bonus (Integer).
- `doppiamag`: Allows double magic usage (Boolean).
- `movim`: Movement modifier (Integer).
- `noogg`: Incompatible equipment ID (e.g. 11 for Shield) (Integer).
- `diago`: Allows diagonal attacks (Boolean).
- `tiro`: Allows ranged attacks (Boolean).
- `tirounavo`: Single use thrown weapon (Boolean).
- `disinnesc`: Allows disarming traps (Boolean).
- `nopsg`: Forbidden for specific character class (@Hero) (Boolean).
- `nopsgid`: ID of the forbidden character class (@Hero) (Integer).
- `solopsg`: Exclusive to specific character class (@Hero) (Boolean).
- `solopsgid`: ID of the exclusive character class (@Hero) (Integer).
- `prezzo`: Cost in gold (Integer).
- `immagine`: Image filename (String).

#### `Item`

Represents a consumable item or special object definition.

- `id`: Unique identifier (Integer).
- `nome`: Name of the item (String).
- `hp`: Health points modifier (Integer).
- `mp`: Mind points modifier (Integer).
- `movimento`: Movement modifier (Integer).
- `attacco`: Attack modifier (Integer).
- `difesa`: Defense modifier (Integer).
- `natt`: Number of attacks modifier (Integer).
- `acqua`: Indicates if the item is holy water (Boolean).
- `danni`: Damage value (Integer).

#### `TreasureCard`

Represents a treasure card definition.

- `id`: Unique identifier (Integer).
- `effetto`: Effect script or code (String).
- `azione`: Action type identifier (String).
- `valore`: Value associated with the action (Integer).
- `immagine`: Image filename (String).
