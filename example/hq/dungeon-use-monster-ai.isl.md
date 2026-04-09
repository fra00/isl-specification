# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-monster-ai

---

> **Reference**: @GameSession, @MonsterState, @HeroState in `./domain-session.isl.md`
> **Reference**: @usePathfinding in `./dungeon-use-pathfinding.isl.md`
> **Reference**: @useCombatLogic in `./dungeon-use-combat.isl.md`
> **Reference**: @useHeroStats in `./dungeon-use-hero-stats.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component owns monster-turn orchestration while delegating all persistent `@GameSession` mutations to the dungeon session boundary.

## Component: useMonsterAI

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap
- `onNotify`: (message: String) -> void
- `pathfinding`: @usePathfinding
- `combatLogic`: @useCombatLogic
- `heroStatsLogic`: @useHeroStats
- `sessionManager`: @useDungeonSessionManager

### ⚡ Capabilities

#### internal State

- **Contract**: Tracks whether the master phase is currently executing so monster turns cannot overlap.
- `isMonsterTurnInProgress`: Boolean (Default: false)

#### runMonsterTurn

- **Contract**: Orchestrates the actions of all monsters currently on the board.
- **Trigger**: Called by `Dungeon` when `currentTurn` exceeds the number of heroes.
- **Flow**:
  - IF `isMonsterTurnInProgress` is true, RETURN.
  - SET `isMonsterTurnInProgress` to true.
  - Trigger `onNotify("Turno del Master: i mostri si muovono...")`.
  - FOR EACH `monster` IN `gameSession.monsters`:
    - Wait 800ms (for visual clarity).
    - **Turn Skipping Status Checks**:
      - IF `monster.activeStatus` contains "Sleep":
        - Trigger `onNotify(monster.monster.nome + " sta dormendo e salta il turno.")`.
        - CONTINUE to next monster.
      - IF `monster.activeStatus` contains "Tempest":
        - Call `sessionManager.updateMonsterState(monster.id, null, null, ["Tempest"])`.
        - Trigger `onNotify(monster.monster.nome + " è bloccato dalla tempesta e salta il turno!")`.
        - CONTINUE to next monster.
      - **Targeting**: Find the nearest `hero` in `gameSession.heroes` that is NOT under fog (revealed area) using `findNearestHero`.
      - IF no visible hero is found, CONTINUE to next monster.
      - **Surround Strategy**:
        - Let `heroArea` = `valo` of the cell at `hero.x`, `hero.y` in `visibilityMap`.
        - Identify all adjacent cells to `hero` (Up, Down, Left, Right).
        - Filter for cells that:
          - Are walkable (no walls/obstacles) AND NOT occupied by other entities.
          - Have the same `valo` as `heroArea` (Room Logic) OR are part of a revealed corridor (`valo` == "1").
        - IF `monster` is already adjacent to `hero`:
          - Set `navigationTarget` to current `monster` position.
        - ELSE IF there are available adjacent cells:
          - Select `navigationTarget` as the unoccupied adjacent cell with the shortest valid path from `monster`.
        - ELSE:
          - Set `navigationTarget` to `hero` position (fallback to approach as close as possible).
    - **Movement**:
      - IF `navigationTarget` is NOT current position:
        - Calculate `path` to `navigationTarget` using `pathfinding.calculatePath` (maxDepth: 100, ignoreEntities: false).
      - ELSE: Let `path` be an empty list.
      - IF path length > 0:
        - Filter path to keep only cells where `fog` is false in `visibilityMap.data`.
        - Let `movPoints` = `monster.monster.movimento`.
        - IF `monster.activeStatus` contains "Entangled":
          - Set `movPoints` to 1.
          - Trigger `onNotify(monster.monster.nome + " è intralciato e si muove a fatica.")`.
        - Let `reachablePath` = first N cells of filtered path (where N is `movPoints`).
        - Initialize `statusesToRemove` as an empty list.
        - IF `monster.activeStatus` contains "Entangled":
          - Add "Entangled" to `statusesToRemove`.
        - Initialize `targetCell` to null.
        - **Occupancy Check**: Iterate `reachablePath` from end to start:
          - Check if cell (x, y) is occupied by any hero or ANY OTHER monster (excluding current `monster`) in `gameSession`.
          - IF NOT occupied:
            - Set `targetCell` to this cell.
            - BREAK loop.
        - IF `targetCell` is NOT null AND `targetCell` is NOT current position:
          - Call `sessionManager.updateMonsterState(monster.id, targetCell.x, targetCell.y, statusesToRemove)`.
        - ELSE IF `monster.activeStatus` contains "Entangled":
          - Call `sessionManager.updateMonsterState(monster.id, null, null, ["Entangled"])`.
        - Wait 400ms (allow movement animation).
    - **Combat**:
      - Check if `hero` is now adjacent (dist <= 1).
      - IF adjacent:
        - Let `heroStats` = `heroStatsLogic.calculateStats(hero)`.
        - Let `combatResult` = `combatLogic.resolveCombat(monster.monster.attacco, heroStats.difesa, true)`.
        - IF `combatResult.damageDealt` > 0 AND `hero.activeStatus` contains "RockSkin":
          - Trigger `onNotify("La pelle di pietra di " + hero.hero.classe + " si frantuma!")`.
        - Trigger `onNotify(monster.monster.nome + " attacca " + hero.hero.classe + "!")`.
        - Call `sessionManager.resolveMonsterAttack(monster.id, hero.heroId, combatResult)`.
        - IF `hero.currentBody` - `combatResult.damageDealt` <= 0:
          - Trigger `onNotify(hero.hero.classe + " è caduto in battaglia!")`.
  - **End Phase**:
    - SET `isMonsterTurnInProgress` to false.
    - Call `sessionManager.startNextHeroRound()`.
    - Trigger `onNotify("Nuovo Turno! Tocca agli eroi.")`.

#### performInstantAttack

- **Contract**: Forces a monster to attack a hero immediately.
- **Signature**: `(monster: @MonsterState, hero: @HeroState)`
- **Flow**:
  - Trigger `onNotify("Il Mostro Errante (" + monster.monster.nome + ") attacca immediatamente!")`.
  - Let `heroStats` = `heroStatsLogic.calculateStats(hero)`.
  - Let `combatResult` = `combatLogic.resolveCombat(monster.monster.attacco, heroStats.difesa, true)`.
  - IF `combatResult.damageDealt` > 0 AND `hero.activeStatus` contains "RockSkin":
    - Trigger `onNotify("La pelle di pietra di " + hero.hero.classe + " si frantuma!")`.
  - Call `sessionManager.resolveMonsterAttack(monster.id, hero.heroId, combatResult)`.
  - IF `hero.currentBody` - `combatResult.damageDealt` <= 0:
    - Trigger `onNotify(hero.hero.classe + " è caduto sotto i colpi del Mostro Errante!")`.
  - Wait 1000ms (to let the player see the result).

#### findNearestHero

- **Contract**: Logic to determine which hero a monster should focus on.
- **Signature**: `(monster: @MonsterState) -> @HeroState`
- **Flow**:
  - Filter `gameSession.heroes` to find those whose (x, y) coordinates have `fog == false` in `visibilityMap`.
  - IF filtered list is empty, return NULL.
  - Calculate Manhattan distance from `monster` to each filtered hero.
  - Return the hero with the minimum distance.

### 🚨 Constraints

- Monsters MUST NOT move through walls or furniture.
- Monsters MUST NOT end their movement on a cell occupied by another entity.
- Monsters MUST NOT move into cells covered by fog (unrevealed areas).
- Monsters MUST NOT open closed doors.
- The master phase should provide enough delay between actions so the player can see what is happening.

### ✅ Acceptance Criteria

- When the last hero ends their turn, the "Master Phase" begins automatically.
- Monsters move toward the nearest hero.
- Monsters attack if they are adjacent to a hero.
- Heroes defend using their total defense (base + equipment) and roll for white shields.
- Turn returns to Hero 1 after all monsters have acted.
