<!-- LOGIC TEST SCENARIOS FOR: domain-ruleset.isl.md -->

# GameDomainRuleset.test.isl.md

## Scenario: Equipment Class Restriction Enforcement
- **Given**: A `Hero` with `id: 1` (Barbarian) and an `Equipment` item with `nopsg: true` and `nopsgid: 1`.
- **When**: The system attempts to equip the item to the `Hero`.
- **Assert (Expected Outcomes)**: 
    - The operation must be rejected.
    - The `Hero` equipment state must remain unchanged.
    - The system must return a validation error indicating class incompatibility.

## Scenario: Equipment Mutual Exclusivity (Incompatibility)
- **Given**: A `Hero` currently equipped with `Equipment` (ID: 11, Shield).
- **When**: The system attempts to equip a new `Equipment` item where `noogg: 11`.
- **Assert (Expected Outcomes)**:
    - The system must trigger a conflict resolution logic.
    - The new item must not be equipped unless the existing item (ID: 11) is unequipped first.
    - The state must remain atomic (either both items are swapped or the action fails entirely).

## Scenario: Item Consumption Logic (Self vs Target)
- **Given**: An `Item` with `targetType: "Monster"` and a `Hero` attempting to use it on a `Monster` entity.
- **When**: The `Item` is consumed.
- **Assert (Expected Outcomes)**:
    - The `Item` must be removed from the `Hero` inventory.
    - The `Monster` entity must receive the modifier defined in `hp` or `danni`.
    - If `targetType` was "Self", the `Hero` stats must be updated instead.

## Scenario: Treasure Card Action Determinism
- **Given**: A `TreasureCard` with `azione: "trappola_e_fine"`.
- **When**: The card is drawn by a `Hero`.
- **Assert (Expected Outcomes)**:
    - The `Hero` must receive the damage/effect defined in `valore`.
    - The `Hero` turn must be flagged as "ended" immediately.
    - The system must transition to the next turn phase, ensuring no "dead-end" state where the player is stuck in a turn-active status.

## Scenario: Spell Target Validation
- **Given**: A `Spell` with `targetType: "Point"` and a coordinate selection input.
- **When**: The spell is cast at a coordinate occupied by a wall or out-of-bounds.
- **Assert (Expected Outcomes)**:
    - The system must validate the target coordinate against the map grid.
    - The spell effect must not trigger.
    - The `Hero` must retain the spell (or the action must be cancelled) without consuming the magic resource if the target is invalid.

## Scenario: Monster Undead Status Integrity
- **Given**: A `Monster` with `nonmorto: true` and an `Item` with `acqua: true` (Holy Water).
- **When**: The `Item` is used against the `Monster`.
- **Assert (Expected Outcomes)**:
    - The system must apply the specific "Holy Water" damage multiplier or effect defined for undead monsters.
    - The `Monster` body points must be decremented correctly.
    - The system must verify that non-undead monsters do not receive the "Holy Water" bonus damage.

## Scenario: Guaranteed Completion of Multi-Step Effects
- **Given**: A `Spell` or `TreasureCard` that triggers a multi-step process (e.g., "Add Gold" followed by "Update UI").
- **When**: The effect is triggered.
- **Assert (Expected Outcomes)**:
    - The flow must ensure that the `Hero` gold count is updated before the UI sync signal is sent.
    - If the gold update fails, the UI must not reflect the change (Transaction atomicity).
    - The system must reset any "isProcessing" flags regardless of whether the effect succeeded or failed, preventing a permanent lock on the game state.