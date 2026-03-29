<!-- LOGIC TEST SCENARIOS FOR: shop-inventory.isl.md -->

## Scenario: Item Selection State Synchronization
- **Given**: The `ShopInventory` component is rendered with a list of `Equipment` items. `selectedItemId` is currently `null` or a different ID.
- **When**: The user clicks on an item card in the list.
- **Assert (Expected Outcomes)**:
    - The `onSelect` callback is triggered with the correct `id` of the clicked item.
    - The component reflects the selection (e.g., visual highlight) only after the parent state updates `selectedItemId`.
    - The Preview area updates to display the image path `/img/equip/` + `selectedItem.immagine`.

## Scenario: Purchase Action Guarding
- **Given**: An item is selected where `canBuy` is `false` (e.g., insufficient gold or `nopsg` / `solopsg` conflict).
- **When**: The user attempts to click the "Acquista" button.
- **Assert (Expected Outcomes)**:
    - The `onBuy` callback is **not** triggered.
    - The button remains in a disabled state.
    - The UI displays the `buyReason` string as a tooltip or helper text to inform the user of the restriction.

## Scenario: Deterministic Purchase Flow
- **Given**: An item is selected where `canBuy` is `true`.
- **When**: The user clicks the "Acquista" button.
- **Assert (Expected Outcomes)**:
    - The `onBuy` callback is triggered exactly once.
    - The system must handle the asynchronous nature of the transaction: the component must remain responsive and not enter a "dead-end" state if the parent takes time to process the gold deduction.
    - Upon successful purchase, the component state must refresh to reflect updated availability (e.g., if the item is now sold out or removed from the list).

## Scenario: Navigation Flow Integrity
- **Given**: The shop interface is active.
- **When**: The user clicks "Entra nel dungeon" or "Esci".
- **Assert (Expected Outcomes)**:
    - The respective callback (`onEnterDungeon` or `onExit`) is triggered.
    - The component must ensure that any pending purchase state is cleared or finalized before navigation occurs.
    - The flow must guarantee that the application transitions to the next game phase (Dungeon or Main Menu) without leaving the shop component in a "processing" or "loading" state.

## Scenario: Edge Case - Empty Inventory
- **Given**: The `items` list provided to the component is empty.
- **When**: The component renders.
- **Assert (Expected Outcomes)**:
    - The list area displays an empty state message.
    - The "Acquista" button is disabled by default.
    - The Preview area is empty or shows a placeholder.
    - No runtime errors occur when attempting to access `selectedItem` properties.

## Scenario: Adversarial Input - Invalid Selection
- **Given**: The component is active.
- **When**: A user attempts to trigger `onSelect` with an `id` that does not exist in the current `items` list.
- **Assert (Expected Outcomes)**:
    - The component logic must safely ignore the invalid selection.
    - The `selectedItemId` should not be updated to an invalid reference.
    - The UI must maintain the previous valid state or reset to a neutral state rather than crashing.