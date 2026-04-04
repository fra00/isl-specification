# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-magic

---

> **Reference**: @GameSession, @HeroState, @MonsterState in `./domain-session.isl.md`
> **Reference**: @Spell, @Hero, @Monster in `./domain-ruleset.isl.md`
> **Reference**: @useCombatLogic in `./dungeon-use-combat.isl.md`
> **Reference**: @useMapInteraction in `./dungeon-use-map-interaction.isl.md`
> **Reference**: @useFogOfWar in `./dungeon-use-fog-of-war.isl.md`
> **Reference**: @useHeroStats in `./dungeon-use-hero-stats.isl.md`

## Component: useMagicLogic

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `onUpdateSession`: (session: @GameSession) -> void
- `onNotify`: (message: String) -> void
- `onActionDone`: () -> void
- `staticSpells`: List<@Spell>
- `combatLogic`: @useCombatLogic
- `mapInteractionLogic`: @useMapInteraction
- `fogOfWarLogic`: @useFogOfWar
- `heroStatsLogic`: @useHeroStats

### ⚡ Capabilities

#### castSpell

- **Contract**: Executes the effect of a chosen spell.
- **Signature**: `(spellId: Integer, targetHeroId: Integer | null, targetMonsterId: Integer | null, targetX: Integer | null, targetY: Integer | null)`
- **Flow**:
  - Find `currentHero` in `gameSession.heroes` where `turnOrder` == `gameSession.currentTurn`.
  - IF `currentHero` is null, RETURN.
  - Find `spell` in `staticSpells` matching `spellId`.
  - IF spell is null: onActionDone(); RETURN.

  - **Apply Spell Effect**:
    - Initialize `wasCastSuccessful` to false.
    - Let `targetCoord` = null.
    - IF `targetMonsterId` is NOT null:
      - Let `m` = Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
      - IF `m` is found: SET `targetCoord` to {x: `m.x`, y: `m.y`}.
    - ELSE IF `targetHeroId` is NOT null:
      - Let `h` = Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
      - IF `h` is found: SET `targetCoord` to {x: `h.x`, y: `h.y`}.
    - ELSE IF `targetX` is NOT null AND `targetY` is NOT null:
      - SET `targetCoord` to {x: `targetX`, y: `targetY`}.

    - Let `hasLOS` = true.
    - IF `spell.effetto` != "Genio" AND `spell.targetType` != "Self" AND `targetCoord` is NOT null:
      - SET `hasLOS` to `fogOfWarLogic.visibilityCalc.hasLineOfSight(currentHero.x, currentHero.y, targetCoord.x, targetCoord.y)`.

    - IF `hasLOS` is true:
      - SWITCH `spell.effetto`:
      - CASE "Palla di Fuoco":
        - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
        - IF `targetMonster` is found:
          - Let `damage` = 2.
          - Update `targetMonster.currentBody` by subtracting `damage`.
          - Trigger `onNotify(targetMonster.monster.nome + " subisce " + damage + " danni!")`.
          - IF `targetMonster.currentBody` <= 0:
            - Remove `targetMonster` from `gameSession.monsters`.
          - ELSE:
            - IF `targetMonster.activeStatus` contains "Sleep":
              - Remove "Sleep" from `targetMonster.activeStatus`.
              - Trigger `onNotify(targetMonster.monster.nome + " si è svegliato!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Frecce di Fuoco":
        - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
        - IF `targetMonster` is found:
          - Let `damage` = 1.
          - Update `targetMonster.currentBody` by subtracting `damage`.
          - Trigger `onNotify(targetMonster.monster.nome + " subisce " + damage + " danni!")`.
          - IF `targetMonster.currentBody` <= 0:
            - Remove `targetMonster` from `gameSession.monsters`.
          - ELSE:
            - IF `targetMonster.activeStatus` contains "Sleep":
              - Remove "Sleep" from `targetMonster.activeStatus`.
              - Trigger `onNotify(targetMonster.monster.nome + " si è svegliato!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Coraggio":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - Add "Courage" to `targetHero.activeStatus` (if not already present).
          - Trigger `onNotify(targetHero.hero.classe + " si sente più coraggioso!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Acqua Guaritrice":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - Let `healAmount` = `spell.valore` (e.g., 4).
          - Add `healAmount` to `targetHero.currentBody`.
          - Clamp `targetHero.currentBody` to max `targetHero.hero.corpo`.
          - Trigger `onNotify(targetHero.hero.classe + " recupera " + healAmount + " Punti Corpo!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Nebbia Caliginosa":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - Add "FoggyMist" to `targetHero.activeStatus`.
          - Trigger `onNotify(targetHero.hero.classe + " può attraversare i mostri!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Sonno":
        - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
        - IF `targetMonster` is found:
          - **Immunity Check**:
            - IF `targetMonster.monster.nonmorto` is true:
              - Trigger `onNotify("I non-morti non possono dormire!")`.
              - Trigger `onActionDone()`.
              - RETURN.
          - **Mental Resistance Test**:
            - Roll a standard 6-sided die for each point of `targetMonster.currentMind`.
            - IF any die result is 6:
              - Trigger `onNotify(targetMonster.monster.nome + " ha resistito all'incantesimo Sonno!")`.
            - ELSE:
              - Add "Sleep" to `targetMonster.activeStatus`.
              - Trigger `onNotify(targetMonster.monster.nome + " cade in un sonno profondo!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Genio":
        - IF `targetMonsterId` is NOT null:
          - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
          - IF `targetMonster` is found:
            - Let `genieAttackDice` = 5.
            - Let `monsterDefenseDice` = `targetMonster.monster.difesa`.
            - IF `targetMonster.activeStatus` contains "Tempest":
              - Set `monsterDefenseDice` to 0.
              - Remove "Tempest" from `targetMonster.activeStatus`.
              - Trigger `onNotify(targetMonster.monster.nome + " è travolto dalla tempesta e non può difendersi!")`.

            - Let `combatResult` = `combatLogic.resolveCombat(genieAttackDice, monsterDefenseDice, false)`.
            - Apply `combatResult.damageDealt` to `targetMonster.currentBody`.
            - Set `gameSession.lastAttack` to {hero: currentHero, monster: targetMonster, combatResult: combatResult}.
            - Trigger `onNotify("Il Genio attacca " + targetMonster.monster.nome + "!")`.
            - IF `targetMonster.currentBody` <= 0:
              - Remove `targetMonster` from `gameSession.monsters`.
            - ELSE:
              - IF `targetMonster.activeStatus` contains "Sleep":
                - Remove "Sleep" from `targetMonster.activeStatus`.
                - Trigger `onNotify(targetMonster.monster.nome + " si è svegliato!")`.
            - Set `wasCastSuccessful` to true.

        - ELSE IF `targetX` is NOT null AND `targetY` is NOT null:
          - Let `doorCheck` = `mapInteractionLogic.isFrontOfDoor(targetX, targetY)`.
          - IF `doorCheck.found` is true:
            - Call `mapInteractionLogic.openPassage(doorCheck.passageCell.x, doorCheck.passageCell.y, doorCheck.destination.x, doorCheck.destination.y)`.
            - Trigger `onNotify("Il Genio apre la porta!")`.
            - Set `wasCastSuccessful` to true.
          - ELSE:
            - Trigger `onNotify("Il Genio non trova alcuna porta da aprire qui.")`.

      - CASE "Tempesta":
        - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
        - IF `targetMonster` is found:
          - Add "Tempest" to `targetMonster.activeStatus`.
          - Trigger `onNotify(targetMonster.monster.nome + " è bloccato dalla tempesta!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Passaggio Invisibile":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - Add "InvisiblePassage" to `targetHero.activeStatus`.
          - Trigger `onNotify(targetHero.hero.classe + " può attraversare i muri!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Pelle di Pietra":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - // Effetto: Aumenta la difesa di 1 dado. Dura finché non subisce danno.
          - Add "RockSkin" to `targetHero.activeStatus`.
          - Trigger `onNotify(targetHero.hero.classe + " ha la pelle dura come roccia! (+1 dado difesa)")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Passapareti":
        - Find `targetHero` in `gameSession.heroes` matching `targetHeroId`.
        - IF `targetHero` is found:
          - // Effetto: Permette di attraversare le pareti durante il movimento.
          - Add "WallPass" to `targetHero.activeStatus`.
          - Trigger `onNotify(targetHero.hero.classe + " può passare attraverso i muri!")`.
          - Set `wasCastSuccessful` to true.
      - CASE "Intralcio":
        - Find `targetMonster` in `gameSession.monsters` matching `targetMonsterId`.
        - IF `targetMonster` is found:
          - // Effetto: Riduce il movimento del mostro a 1 sola casella nel suo prossimo turno.
          - IF `targetMonster.activeStatus` does NOT contain "Entangled":
            - Add "Entangled" to `targetMonster.activeStatus`.
          - Trigger `onNotify(targetMonster.monster.nome + " è intralciato!")`.
          - Set `wasCastSuccessful` to true.

  - **Consumption**:
    - IF `wasCastSuccessful` is true:
      - Remove `spellId` from `currentHero.availableSpells`.
      - Trigger `onNotify(currentHero.hero.classe + " lancia " + spell.nome + "!")`.
      - Trigger `onUpdateSession` with updated `gameSession`.
      - Trigger `onActionDone()`.
    - IF wasCastSuccessful is false:
      - Trigger onNotify('Bersaglio non valido.')
      - Trigger onActionDone()

#### removeExpiredEffects

- **Contract**: Removes temporary spell effects from entities.
- **Signature**: `(heroId: Integer | null, monsterId: Integer | null, effect: String)`
- **Flow**:
  - IF `heroId` is NOT null:
    - Find `hero` in `gameSession.heroes` matching `heroId`.
    - IF `hero.activeStatus` contains `effect`:
      - Remove `effect` from `hero.activeStatus`.
      - Trigger `onUpdateSession`.
  - IF `monsterId` is NOT null:
    - Find `monster` in `gameSession.monsters` matching `monsterId`.
    - IF `monster.activeStatus` contains `effect`:
      - Remove `effect` from `monster.activeStatus`.
      - Trigger `onUpdateSession`.
