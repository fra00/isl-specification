# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-14
**Implementation**: ./dungeon-use-treasure

---

> **Reference**: @GameSession in `./domain-session.isl.md`
> **Reference**: @VisibilityMap in `./domain-map.isl.md`
> **Reference**: @MapCellTreasure in `./domain-map.isl.md`
> **Reference**: @useVisibilityCalc in `./dungeon-use-visibility-calc.isl.md`
> **Reference**: @TreasureCard in `./domain-ruleset.isl.md`
> **Reference**: @useDungeonSessionManager in `./dungeon-use-session-manager.isl.md`

## Domain Concepts

### 📦 Content/Structure

- This component owns treasure-search flow state while delegating persistent session mutations to the dungeon session boundary.

## Component: useTreasureSearch

### Role: Business Logic

**Signature**:

- `gameSession`: @GameSession
- `visibilityMap`: @VisibilityMap
- `onNotify`: (message: String) -> void
- `onActionDone`: () -> void
- `sessionManager`: @useDungeonSessionManager
- `onTreasureCardDrawn`: (card: @TreasureCard) -> void
- `onWanderingMonster`: (x: Integer, y: Integer) -> void

### ⚡ Capabilities

#### internalState

- **Contract**: Stores local treasure-discovery UI state and helper logic without owning persistent session writes.
- `foundTreasures`: List of {x: Integer, y: Integer, img: String} (Stores discovered treasures).
- `visibilityCalc`: @useVisibilityCalc (Hook instance for visibility calculations).

#### searchTreasure

- **Contract**: Scans the current area for treasures.
- **Trigger**: User clicks "Search Treasure".
- **Flow**:
  - IF `gameSession.monsters` is NOT empty:
    - Trigger `onNotify("Non puoi cercare tesori con mostri vicini!")`
    - RETURN.
  - Find current hero in `gameSession.heroes` (turnOrder == currentTurn).
  - Call `visibilityCalc.calculateVisibleCells(hero.x, hero.y)` to get `visibleCells`.
  - Initialize `treasureFound` as false.
  - Initialize `treasureCollectionFailed` as false.
  - FOR each `cell` in `visibleCells`:
    - Find corresponding `mapCell` in `gameSession.currentMap.grid` at `cell.x`, `cell.y`.
    - IF `mapCell` exists:
      - Check if `mapCell` has `tes` (Treasure property).
      - IF `mapCell.tes` (@MapCellTreasure) have `mon` is NOT 0 OR `ogg` is NOT 0 OR `arma` is NOT 0 OR `trp` is NOT 0:
        - Check if already found: IF (x, y) NOT in `foundTreasures`:
          - Find `currentHero` in `gameSession.heroes` matching `gameSession.currentTurn`.
          - IF `currentHero` is found:
            - Let `didCollectTreasure` = `sessionManager.collectTreasureAtCell(currentHero.heroId, mapCell.x, mapCell.y)`.
            - IF `didCollectTreasure` is true:
              - Set `treasureFound` to true.
              - Add `{x: mapCell.x, y: mapCell.y, img: "tesoro.jpg"}` to `foundTreasures`.
            - ELSE:
              - Set `treasureCollectionFailed` to true.
              - Trigger `onNotify("Errore durante la raccolta del tesoro.")`.
          - BREAK the loop (only one treasure per search action).
  - IF `treasureFound` is true:
    - // Specific notifications are handled inside the loop.
  - ELSE IF `treasureCollectionFailed` is true:
    - // Keep the action flow deterministic without spawning a treasure card fallback on a failed static-treasure persistence.
  - ELSE:
    - IF `gameSession.treasureDeck` is not empty:
      - Call `sessionManager.drawTreasureCard()` -> `drawnCard`.
      - IF `drawnCard` is not null:
        - Trigger `onTreasureCardDrawn(drawnCard)`.
    - ELSE:
      - Trigger `onNotify("Nessuna carta tesoro rimasta.")`.
  - Trigger `onActionDone()`.

#### getFoundTreasures

- **Contract**: Returns the list of visible treasures.
- **Return**: `foundTreasures`.

#### applyTreasureEffect

- **Contract**: Applies the effect of a treasure card to the current hero.
- **Signature**: `(card: @TreasureCard)`
- **Flow**:
  - Find `currentHero` in `gameSession.heroes` matching `gameSession.currentTurn`.
  - IF `currentHero` is found:
    - Call `sessionManager.applyTreasureCardEffect(currentHero.heroId, card, onWanderingMonster)`.
