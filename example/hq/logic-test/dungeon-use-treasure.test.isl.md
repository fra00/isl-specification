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
    - `currentHero.gold` increases by 50.
    - `onNotify` is triggered with "Hai trovato 50 monete d'oro!".
    - The `MapCell` at `(6, 6)` in `gameSession.currentMap.grid` has its `tes` properties reset to 0.
    - `onUpdateSession` is called with the modified `gameSession`.
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
    - The top card is removed from `gameSession.treasureDeck`.
    - `onTreasureCardDrawn` is triggered with the drawn card.
    - `onUpdateSession` is called with the updated `treasureDeck`.
    - `onActionDone` is triggered.

## Scenario: Apply Wandering Monster Effect
- **Given**: A `TreasureCard` with `azione: "mostro_errante"` is drawn.
- **When**: `applyTreasureEffect(card)` is called.
- **Assert (Expected Outcomes)**:
    - `onWanderingMonster` is triggered with the current hero's `x` and `y` coordinates.
    - `onUpdateSession` is called to persist the session state.

## Scenario: Trap Damage Logic
- **Given**: A `MapCell` contains `MapCellTreasure` with `trp: 2`.
- **When**: The active hero triggers `searchTreasure()` and the cell is processed.
- **Assert (Expected Outcomes)**:
    - `currentHero.currentBody` is decremented by 2.
    - `onNotify` is triggered with "È una trappola! Subisci 2 danni.".
    - The `MapCell` treasure property is reset to 0 to prevent re-triggering.
    - `onUpdateSession` is called.

## Scenario: Flow Continuity and State Release
- **Given**: Any valid search action (Success, Trap, or Card Draw).
- **When**: The `searchTreasure` logic completes its execution path.
- **Assert (Expected Outcomes)**:
    - The flow must always terminate by calling `onActionDone()`.
    - The system must never remain in a "processing" state (no blocking flags left active).
    - `onUpdateSession` must be called if any data (gold, inventory, deck, map) was modified, ensuring the UI/Persistence layer is synchronized.