<!-- LOGIC TEST SCENARIOS FOR: dungeon.isl.md -->

## Scenario: Movement Through Fog of War
- **Given**: A hero is at (5, 5). A monster is at (5, 7). The cell (5, 6) is currently under `fog: true` in `boardVisibilityMap`.
- **When**: The hero attempts to move to (5, 7) via `handleBoardClick`.
- **Assert (Expected Outcomes)**:
  - `hooksPathfinding.calculatePath` must return an empty path because the path crosses a fogged cell (or the destination is fogged).
  - `isMoving` remains `false`.
  - The hero does not move.
  - `onNotify` is triggered with "Percorso non valido" or similar.

## Scenario: Deterministic Trap Trigger and Turn End
- **Given**: A hero has `movementPoints: 3`. The hero moves to a cell containing a Trap (tipo: 2).
- **When**: The hero enters the trap cell during `movementEffect`.
- **Assert (Expected Outcomes)**:
  - `trapsLogic.registerTriggeredTrap` is called for the cell.
  - `currentHero.currentBody` is decremented.
  - `turnPhase.hasMoved` and `turnPhase.hasPerformedAction` are set to `true`.
  - `activePath` is cleared immediately.
  - The hero stops moving, ensuring no further movement points are consumed.

## Scenario: Combat Resolution - Gargoyle Defense
- **Given**: A hero attacks a "Gargoyle" monster.
- **When**: `handleMonsterClick` is triggered.
- **Assert (Expected Outcomes)**:
  - `combatLogic.resolveCombat` is called with `defenseDice` = `monster.monster.difesa` + 2.
  - The `CombatResultModal` displays the correct damage calculation.
  - If `newBody` <= 0, the monster is removed from `gameSession.monsters`.

## Scenario: Spell Targeting - Genie vs Line of Sight
- **Given**: `targetingSpell` is "Genio". A monster is behind a wall (Line of Sight is blocked).
- **When**: The user clicks the monster.
- **Assert (Expected Outcomes)**:
  - `hooksMagicLogic.castSpell` is called successfully (Genie ignores LOS).
  - `combatResult` is generated with 5 attack dice.
  - `targetingSpell` is reset to `null`.

## Scenario: Inventory Integrity - Two-Handed Weapon Conflict
- **Given**: Hero has a "Shield" (ID 11) equipped.
- **When**: User calls `hooksInventoryLogic.toggleEquipItem` for a "Great Axe" (ID 20, `noogg: 11`).
- **Assert (Expected Outcomes)**:
  - The "Shield" (ID 11) is removed from `hero.equipped`.
  - The "Great Axe" (ID 20) is added to `hero.equipped`.
  - `onNotify` is triggered confirming the removal of the Shield.

## Scenario: Deterministic Completion - Monster Turn
- **Given**: `gameSession.currentTurn` > `gameSession.heroes.length`.
- **When**: `Dungeon` component triggers `hooksMonsterAI.runMonsterTurn()`.
- **Assert (Expected Outcomes)**:
  - `isMonsterTurnInProgress` is set to `true` at start and `false` at completion.
  - `gameSession.currentTurn` is reset to 1.
  - All `turnPhase` flags are reset to `false`.
  - The system never hangs; even if no heroes are visible, the loop completes and returns control to the hero phase.

## Scenario: Treasure Search - Wandering Monster
- **Given**: A hero searches for treasure in a room with no treasures.
- **When**: `hooksTreasure.searchTreasure` is called and the deck contains a "Mostro Errante" card.
- **Assert (Expected Outcomes)**:
  - `drawnTreasureCard` is set to the "Mostro Errante" card.
  - `onTreasureCardDrawn` is triggered.
  - Upon `closeTreasureCardModal`, `hooksTreasure.applyTreasureEffect` triggers `handleWanderingMonster`.
  - A new monster is spawned adjacent to the hero and `performInstantAttack` is executed.

## Scenario: Spell Selection - Wizard/Elf Logic
- **Given**: `isSpellSelectionRequired` is `true`.
- **When**: The Wizard selects 3 elements.
- **Assert (Expected Outcomes)**:
  - `currentHeroPicking` automatically transitions to the Elf.
  - The UI updates to "Turno dell'Elfo".
  - The 4th element is automatically assigned to the Elf upon selection.
  - `onConfirmSelection` is triggered with the complete map of spells.