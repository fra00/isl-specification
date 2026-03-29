<!-- LOGIC TEST SCENARIOS FOR: dungeon-use-treasure.isl.md -->

## Scenario: Search Treasure Blocked by Proximity
- **Given**: `gameSession.monsters` is not empty (contains at least one `MonsterState`).
- **When**: The active hero triggers `searchTreasure`.
- **Assert (Expected Outcomes)**:
    - `onNotify` is called with the message: "Non puoi cercare tesori con mostri vicini!".
    - No changes are made to `gameSession.currentMap.grid` or `gameSession.heroes`.
    - `onActionDone` is NOT triggered (or flow terminates before state mutation).

## Scenario: Successful Treasure Discovery on Map Cell
- **Given**: `gameSession.monsters` is empty. The active hero is at `(x, y)`. `mapCell` at `(x, y)` has `tes.mon = 50`.
- **When**: The active hero triggers `searchTreasure`.
- **Assert (Expected Outcomes)**:
    - `currentHero.gold` is increased by 50.
    - `onNotify` is called with "Hai trovato 50 monete d'oro!".
    - The `mapCell.tes` properties at `(x, y)` are reset to 0.
    - `onUpdateSession` is called with the modified `gameSession`.
    - `onActionDone` is triggered.

## Scenario: Treasure Search with Trap Trigger
- **Given**: `mapCell` at `(x, y)` has `tes.trp = 2`. Hero has `currentBody = 5`.
- **When**: The active hero triggers `searchTreasure` and the cell is visible.
- **Assert (Expected Outcomes)**:
    - `currentHero.currentBody` is updated to 3 (5 - 2).
    - `onNotify` is called with "È una trappola! Subisci 2 danni.".
    - `mapCell.tes` is cleared to prevent re-triggering.
    - `onUpdateSession` is called.

## Scenario: Treasure Search Empty Map, Draw from Deck
- **Given**: No treasures found in `visibleCells`. `gameSession.treasureDeck` contains at least one `TreasureCard`.
- **When**: The active hero triggers `searchTreasure`.
- **Assert (Expected Outcomes)**:
    - `onTreasureCardDrawn` is called with the top card from the deck.
    - The drawn card is removed from `gameSession.treasureDeck`.
    - `onUpdateSession` is called with the updated deck.
    - `onActionDone` is triggered.

## Scenario: Treasure Search Exhausted Deck
- **Given**: No treasures found in `visibleCells`. `gameSession.treasureDeck` is empty.
- **When**: The active hero triggers `searchTreasure`.
- **Assert (Expected Outcomes)**:
    - `onNotify` is called with "Nessuna carta tesoro rimasta.".
    - `onUpdateSession` is NOT called (or called with no state changes).
    - `onActionDone` is triggered.

## Scenario: Apply Wandering Monster Card
- **Given**: A `TreasureCard` with `azione = "mostro_errante"` is drawn.
- **When**: `applyTreasureEffect` is called with this card.
- **Assert (Expected Outcomes)**:
    - `onWanderingMonster` is triggered with the current hero's `(x, y)` coordinates.
    - `onUpdateSession` is called to persist the session state.
    - The flow completes deterministically without blocking.

## Scenario: Deterministic Completion of Treasure Search
- **Given**: A complex state where a search could potentially trigger multiple notifications or state updates.
- **When**: `searchTreasure` is executed.
- **Assert (Expected Outcomes)**:
    - The flow must guarantee that `onActionDone()` is called regardless of whether a treasure was found on the map, drawn from the deck, or if the deck was empty.
    - The system must never remain in a "processing" state; all paths lead to a valid `onUpdateSession` or `onActionDone` call.