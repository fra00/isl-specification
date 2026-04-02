<!-- LOGIC TEST SCENARIOS FOR: domain-ruleset.isl.md -->

# GameDomainRuleset.test.isl.md

## Scenario: Equipment Incompatibility Constraint
- **Given**: A `Hero` (Barbarian, ID: 1) and an `Equipment` item (Shield, ID: 11) where `noogg` is set to 11 (self-incompatible) or a specific restriction exists.
- **When**: The system attempts to equip the item to the `Hero`.
- **Assert (Expected Outcomes)**: 
    - The system must validate `nopsg` and `solopsg` flags against the `Hero` ID.
    - If `nopsg` is true and `nopsgid` matches the `Hero` ID, the action must be rejected.
    - If `solopsg` is true and `solopsgid` does not match the `Hero` ID, the action must be rejected.
    - The state of the `Hero` equipment slot must remain unchanged.

## Scenario: Item Consumption and State Integrity
- **Given**: An `Item` with `targetType` = "Self" and `hp` = 2.
- **When**: The `Hero` consumes the item.
- **Assert (Expected Outcomes)**:
    - The `Hero.corpo` value must be incremented by the `Item.hp` value.
    - The system must ensure `Hero.corpo` does not exceed the maximum allowed base value (Domain Integrity).
    - The `Item` must be removed from the `Hero` inventory (Deterministic Completion).

## Scenario: Spell Target Validation
- **Given**: A `Spell` with `targetType` = "Monster".
- **When**: The player attempts to cast the spell on a `Hero` or a `Point` on the map.
- **Assert (Expected Outcomes)**:
    - The logic must verify that the target entity matches the `Spell.targetType`.
    - If the target is invalid, the spell casting flow must abort, returning the system to the "Idle" or "Waiting for Input" state.
    - No `Spell` effects (e.g., `valore`) shall be applied to the invalid target.

## Scenario: Treasure Card Action Resolution
- **Given**: A `TreasureCard` with `azione` = "mostro_errante" and `valore` = 5 (Monster ID).
- **When**: The card is drawn by the player.
- **Assert (Expected Outcomes)**:
    - The system must trigger the spawn logic for the `Monster` defined by `valore`.
    - The flow must ensure the `Monster` is placed in a valid adjacent tile.
    - If no valid tile exists, the system must handle the failure gracefully (e.g., discard card or notify player) without hanging the game loop (Deterministic Completion).

## Scenario: Monster Attribute Bounds
- **Given**: A `Monster` definition.
- **When**: The `Monster` is initialized in the game engine.
- **Assert (Expected Outcomes)**:
    - `corpo` and `mente` must be greater than 0.
    - `movimento`, `attacco`, and `difesa` must be non-negative integers.
    - If any attribute is null or out of bounds, the `Monster` initialization must fail, preventing the entity from entering the game state.

## Scenario: Equipment Modifier Application
- **Given**: A `Hero` with base `attacco` = 2 and an `Equipment` with `dadatt` = 1.
- **When**: The equipment is equipped.
- **Assert (Expected Outcomes)**:
    - The effective `attacco` value must be calculated as `Hero.attacco + Equipment.dadatt`.
    - If the `Equipment` has `diago` = true, the `Hero` attack range logic must be updated to allow diagonal targeting.
    - The system must guarantee that removing the equipment reverts the `Hero` stats to their original base values.