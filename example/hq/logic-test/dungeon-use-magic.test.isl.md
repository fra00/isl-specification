<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-magic.isl.md -->

## Scenario: Cast Spell - Successful Damage (Palla di Fuoco)
- **Given**: A `GameSession` with a Hero (turn 1) and a Monster (ID: 101, Body: 2). The Hero has "Palla di Fuoco" in `availableSpells`.
- **When**: `castSpell` is called with `spellId` (Palla di Fuoco) and `targetMonsterId` (101).
- **Assert (Expected Outcomes)**:
    - `targetMonster.currentBody` is reduced by 2 (Result: 0).
    - Monster 101 is removed from `gameSession.monsters`.
    - "Palla di Fuoco" is removed from `currentHero.availableSpells`.
    - `onNotify` is triggered with damage message.
    - `onActionDone` is called.

## Scenario: Cast Spell - Mental Resistance (Sonno)
- **Given**: A `GameSession` with a Monster (ID: 202, Mind: 3).
- **When**: `castSpell` is called with `spellId` (Sonno) and `targetMonsterId` (202).
- **Assert (Expected Outcomes)**:
    - If die roll (1d6) results in 6, `targetMonster.activeStatus` does NOT contain "Sleep".
    - `onNotify` confirms resistance.
    - Spell is still consumed from `currentHero.availableSpells` (Rule: Spell is spent regardless of success/resistance).
    - `onActionDone` is called.

## Scenario: Cast Spell - Genie Door Interaction
- **Given**: A `GameSession` where `mapInteractionLogic.isFrontOfDoor` returns a valid door at (5,5).
- **When**: `castSpell` is called with `spellId` (Genie) and `targetX`=5, `targetY`=5.
- **Assert (Expected Outcomes)**:
    - `mapInteractionLogic.openPassage` is triggered for the door at (5,5).
    - `gameSession.openedDoors` contains "5,5".
    - `fogOfWarLogic.revealFromPoint` is executed for the destination.
    - `onNotify` confirms door opening.
    - `onActionDone` is called.

## Scenario: Cast Spell - Undead Immunity (Sonno)
- **Given**: A `GameSession` with a Monster (ID: 303, `nonmorto`: true).
- **When**: `castSpell` is called with `spellId` (Sonno) and `targetMonsterId` (303).
- **Assert (Expected Outcomes)**:
    - `targetMonster.activeStatus` does NOT contain "Sleep".
    - `onNotify` reports "I non-morti non possono dormire!".
    - Spell is NOT removed from `availableSpells` (Logic implies failed cast due to invalid target type).
    - `onActionDone` is NOT called.

## Scenario: Cast Spell - Healing Clamp
- **Given**: A Hero with `currentBody` = 5 and `hero.corpo` (max) = 6.
- **When**: `castSpell` is called with `spellId` (Acqua Guaritrice, value: 4) and `targetHeroId`.
- **Assert (Expected Outcomes)**:
    - `targetHero.currentBody` is set to 6 (clamped to max), not 9.
    - `onNotify` confirms healing.
    - Spell is removed from `availableSpells`.
    - `onActionDone` is called.

## Scenario: Deterministic Completion - Spell Consumption
- **Given**: A Hero with 1 spell in `availableSpells`.
- **When**: `castSpell` is triggered and completes (regardless of whether the target was hit or missed, provided the target was valid).
- **Assert (Expected Outcomes)**:
    - `availableSpells` list size is decremented.
    - `onUpdateSession` is called with the new state.
    - `onActionDone` is guaranteed to be called, ensuring the UI/Flow state resets from "casting" to "idle".
    - System never hangs in a "processing" state if the spell logic encounters an invalid target.