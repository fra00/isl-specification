# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./domain-session

---

> **Reference**: @MapDefinition in `./domain-map.isl.md`
> **Reference**: @Hero, @Monster, @Item, @Equipment in `./domain-ruleset.isl.md`

## Component: GameDomainSession

### Role: Domain

## Domain Concepts

### 📦 Content/Structure

#### `HeroState`

Represents the dynamic state of a hero (@Hero) during a campaign (persistence).

- `heroId`: Reference to the static @Hero definition (Integer).
- `turnOrder`: Turn number (Integer).
- `currentBody`: Current Body Points (Integer).
- `currentMind`: Current Mind Points (Integer).
- `gold`: Accumulated gold (Integer) default: 500.
- `inventory`: List of IDs of possessed items (@Item) (List of Integer).
- `equipment`: List of IDs of owned equipment (@Equipment) (List of Integer).
- `x`: Current X position on the map grid (Integer).
- `y`: Current Y position on the map grid (Integer).
- `hero`: Instance of hero definition (@Hero)

#### `MonsterState`

Represents the dynamic state of a monster (@Monster) during a session.

- `id`: Unique instance identifier (Integer).
- `monster`: Instance of monster definition (@Monster)
- `x`: Current X position on the map grid (Integer).
- `y`: Current Y position on the map grid (Integer).
- `currentBody`: Current Body Points (Integer).
- `currentMind`: Current Mind Points (Integer).

#### `GameSession`

Represents the current active session state.

- `campaignName`: Name of the active campaign (String).
- `currentMap`: structure of the current map (@MapDefinition).
- `currentMissionIndex`: Index of the current mission (Integer).
- `heroes`: List of participating heroes (List of @HeroState).
- `monsters`: List of active monsters (List of @MonsterState).
- `spawnedLocations`: List of coordinates "x,y" where monsters have already spawned (List of String).
- `currentTurn` :Num of the current turn (Integer) default: 1.
- `isHeroOrderConfirmed`: Flag indicating if the turn order has been selected (Boolean) default: false.
- `lastAttack`: Object containing details of the last attack for potential UI display (Object with hero, monster, combatResult).

#### `TurnPhase`

Object representing the possible activity of a hero's turn.

- `HasMoved`: Turn started, waiting for movement roll or action.
- `HasPerformedAction`: The hero have searched for secret passage, trap , treasure or have attacked.
- `IsTurnFinished`: The hero have ended the turn, waiting for next hero turn or monster turn in future.
