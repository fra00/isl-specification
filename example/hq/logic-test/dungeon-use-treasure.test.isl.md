<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-treasure.isl.md -->

## Scenario: Search Treasure Blocked by Proximity

- **Given**: `gameSession.monsters` contains at least one `MonsterState` instance.
- **When**: The active hero triggers `searchTreasure()`.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with the message: "Non puoi cercare tesori con mostri vicini!".
  - No changes are made to `gameSession.currentMap.grid` or `gameSession.heroes`.
  - `onActionDone` is NOT triggered (or flow terminates early).

## Scenario: Successful Treasure Discovery in Map Cell

- **Given**: `gameSession.monsters` is empty. The active hero is at `(x: 5, y: 5)`. A `MapCell` at `(6, 6)` is visible and contains `MapCellTreasure` with `mon: 50`.
- **When**: The active hero triggers `searchTreasure()`.
- **Assert (Expected Outcomes)**:
  - `sessionManager.collectTreasureAtCell(currentHero.heroId, 6, 6)` is called.
  - The emitted session increases `currentHero.gold` by 50.
  - The emitted session resets the `tes` payload for cell `(6, 6)`.
  - `onActionDone` is triggered.

## Scenario: Treasure Deck Exhaustion

- **Given**: `gameSession.monsters` is empty. No `MapCell` in the visible area contains treasure. `gameSession.treasureDeck` is empty.
- **When**: The active hero triggers `searchTreasure()`.
- **Assert (Expected Outcomes)**:
  - `onNotify` is triggered with "Nessuna carta tesoro rimasta.".
  - `onUpdateSession` is NOT called (no state change).
  - `onActionDone` is triggered.

## Scenario: Deterministic Treasure Card Draw

- **Given**: `gameSession.monsters` is empty. No `MapCell` in the visible area contains treasure. `gameSession.treasureDeck` contains at least one `TreasureCard`.
- **When**: The active hero triggers `searchTreasure()`.
- **Assert (Expected Outcomes)**:
  - `sessionManager.drawTreasureCard()` is called.
  - The top card is removed from `gameSession.treasureDeck` by the boundary.
  - `onTreasureCardDrawn` is triggered with the drawn card.
  - `onActionDone` is triggered.

## Scenario: Apply Wandering Monster Effect

- **Given**: A `TreasureCard` with `azione: "mostro_errante"` is drawn.
- **When**: `applyTreasureEffect(card)` is called.
- **Assert (Expected Outcomes)**:
  - `sessionManager.applyTreasureCardEffect(currentHero.heroId, card, onWanderingMonster)` is called.
  - `onWanderingMonster` is triggered with the current hero's `x` and `y` coordinates.

## Scenario: Trap Damage Logic

- **Given**: A `MapCell` contains `MapCellTreasure` with `trp: 2`.
- **When**: The active hero triggers `searchTreasure()` and the cell is processed.
- **Assert (Expected Outcomes)**:
  - `sessionManager.collectTreasureAtCell(currentHero.heroId, treasureX, treasureY)` is called.
  - The boundary decrements `currentHero.currentBody` by 2.
  - The `MapCell` treasure property is reset to 0 to prevent re-triggering.

## Scenario: Flow Continuity and State Release

- **Given**: Any valid search action (Success, Trap, or Card Draw).
- **When**: The `searchTreasure` logic completes its execution path.
- **Assert (Expected Outcomes)**:
  - The flow must always terminate by calling `onActionDone()`.
  - The system must never remain in a "processing" state (no blocking flags left active).
  - Session persistence is delegated only through `sessionManager` when gold, inventory, deck, or map data changes.
