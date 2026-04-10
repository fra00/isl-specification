<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-magic.isl.md -->

## Scenario: Cast Spell - Successful Damage Application

- **Given**: A `GameSession` with a hero (ID: 1) whose turn it is, and a monster (ID: 101, Body: 2) in range. The hero has the "Palla di Fuoco" spell (ID: 50) in `availableSpells`.
- **When**: `castSpell(50, null, 101, null, null)` is triggered.
- **Assert (Expected Outcomes)**:
  - `targetMonster.currentBody` is reduced by 2 (Result: 0).
  - Monster 101 is removed from `gameSession.monsters`.
  - Spell ID 50 is removed from `currentHero.availableSpells`.
  - `onNotify` is called with success message.
  - `onUpdateSession` and `onActionDone` are triggered.

## Scenario: Cast Spell - Mental Resistance (Sonno)

- **Given**: A monster (ID: 102) with 2 Mind points. Hero casts "Sonno" (ID: 51).
- **When**: `castSpell(51, null, 102, null, null)` is triggered, and the random roll for Mind resistance results in a 6.
- **Assert (Expected Outcomes)**:
  - `targetMonster.activeStatus` does NOT contain "Sleep".
  - `onNotify` reports that the monster resisted the spell.
  - Spell ID 51 is removed from `currentHero.availableSpells` (Spell consumed regardless of resistance).
  - `onActionDone` is triggered.

## Scenario: Cast Spell - Invalid Target (Acqua Guaritrice)

- **Given**: Hero attempts to cast "Acqua Guaritrice" (ID: 52) on a monster (ID: 103).
- **When**: `castSpell(52, null, 103, null, null)` is triggered.
- **Assert (Expected Outcomes)**:
  - `wasCastSuccessful` remains false.
  - `onNotify` reports "Bersaglio non valido".
  - Spell ID 52 remains in `currentHero.availableSpells`.
  - `onActionDone` is triggered to prevent logical dead-end.

## Scenario: Cast Spell - Hero Target Selected From Board Token

- **Given**: The active hero starts targeting `Coraggio` or `Pelle di Pietra`, and another hero is present on a visible board cell.
- **When**: The user clicks directly on the target hero token on the board.
- **Assert (Expected Outcomes)**:
  - The targeting flow resolves the clicked hero's `heroId` from the board coordinates.
  - `castSpell(spellId, targetHeroId, null, targetX, targetY)` is triggered with the clicked hero as target.
  - The spell effect is applied to that hero, the spell is consumed, and targeting mode ends.
  - No extra click on the empty underlying cell is required.

## Scenario: Cast Spell - Genie Door Opening

- **Given**: A hero is adjacent to a closed door at (5, 5). Hero casts "Genie" (ID: 53).
- **When**: `castSpell(53, null, null, 5, 5)` is triggered.
- **Assert (Expected Outcomes)**:
  - `mapInteractionLogic.isFrontOfDoor(5, 5)` returns valid passage.
  - `mapInteractionLogic.openPassage` is called.
  - `gameSession.openedDoors` contains "5,5".
  - Spell ID 53 is removed from `currentHero.availableSpells`.
  - `onActionDone` is triggered.

## Scenario: Cast Spell - Deterministic Cleanup (Expired Effects)

- **Given**: A hero has "RockSkin" in `activeStatus`.
- **When**: `removeExpiredEffects(heroId: 1, null, "RockSkin")` is called.
- **Assert (Expected Outcomes)**:
  - "RockSkin" is removed from `hero.activeStatus`.
  - `onUpdateSession` is triggered to persist the state change.
  - System state remains consistent; no orphaned status effects remain.

## Scenario: Cast Spell - Undead Immunity (Sonno)

- **Given**: A monster with `nonmorto: true`. Hero attempts to cast "Sonno".
- **When**: `castSpell` logic executes the immunity check.
- **Assert (Expected Outcomes)**:
  - `onNotify` reports "I non-morti non possono dormire!".
  - Spell is NOT removed from `availableSpells` (or logic handles as failed cast).
  - `onActionDone` is triggered to release the turn flow.

## Scenario: Cast Spell - Deterministic Completion (Failure Handling)

- **Given**: `castSpell` is invoked with a non-existent `spellId`.
- **When**: The lookup for `spell` returns null.
- **Assert (Expected Outcomes)**:
  - The function returns immediately without modifying `gameSession`.
  - `onActionDone` is triggered to ensure the UI/Flow does not hang in a "processing" state.
  - System state remains unchanged.
