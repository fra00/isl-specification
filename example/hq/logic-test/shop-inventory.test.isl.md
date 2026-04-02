<!-- LOGIC TEST SCENARIOS FOR: shop-inventory.isl.md -->

## Scenario: Selection of Valid Equipment
- **Given**: `items` contains a list of `Equipment` objects; `selectedItemId` is currently null.
- **When**: User clicks on an `Equipment` item with a valid `id` present in the `items` list.
- **Assert (Expected Outcomes)**:
    - `onSelect` is triggered with the correct `id`.
    - The UI reflects the selection (highlighting the item).
    - The Preview component updates to display the image path: `/img/equip/` + `selectedItem.immagine`.

## Scenario: Attempting Purchase of Incompatible or Unaffordable Item
- **Given**: `selectedItemId` is set to an item where `canBuy` is `false` and `buyReason` is "Insufficient Gold" or "Incompatible Class".
- **When**: User clicks the "Acquista" button.
- **Assert (Expected Outcomes)**:
    - The `onBuy` callback is **not** triggered.
    - The "Acquista" button remains in a disabled state.
    - The UI displays the `buyReason` string as a tooltip or helper text.

## Scenario: Deterministic Flow on Successful Purchase
- **Given**: `selectedItemId` is set to an item where `canBuy` is `true`.
- **When**: User clicks the "Acquista" button.
- **Assert (Expected Outcomes)**:
    - `onBuy` is triggered.
    - The system must ensure the state transition is atomic (the purchase logic must complete or fail gracefully).
    - The component must reset or update the `canBuy` status based on the new inventory/gold state returned by the parent.
    - The flow must never remain in a "processing" state; the UI must re-enable interaction immediately after the parent confirms the transaction.

## Scenario: Handling Empty or Null Item List
- **Given**: `items` is an empty list `[]`.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The list container renders as empty (no items displayed).
    - `selectedItemId` is effectively ignored or reset to null.
    - The "Acquista" button is disabled by default as no selection is possible.
    - No runtime errors occur during the iteration of `items`.

## Scenario: Adversarial Input - Invalid Selection
- **Given**: `items` contains IDs `[1, 2, 3]`.
- **When**: `handleInteraction` is triggered with an `id` of `99` (non-existent).
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback is **not** triggered.
    - The component state remains unchanged (no invalid item is selected).
    - The system maintains structural integrity by validating the existence of the item before updating the selection state.

## Scenario: Guaranteed Flow Continuity (Navigation)
- **Given**: The shop is open and the user is interacting with the list.
- **When**: User clicks "Entra nel dungeon" or "Esci".
- **Assert (Expected Outcomes)**:
    - The respective callback (`onEnterDungeon` or `onExit`) is triggered.
    - The flow ensures that any pending UI state (like hover effects or tooltips) is cleared.
    - The system transitions out of the Shop component, ensuring no "zombie" listeners or blocking flags remain active in the parent state.