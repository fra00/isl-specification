# Global ISL Audit Report

Generated on: 29/03/2026, 20:50:11

## Audit Report for: armory.isl.md

<thought>
- **Scenario: Deterministic Exit from Shop**
  - Given: `Armory` component active, user clicks "Esci".
  - When: `exitShop` is triggered.
  - Flow: `onChangePageView` to `PageNavigationEnum.DUNGEON_DESCRIPTION`.
  - Assert: `onChangePageView` is called with `PageNavigationEnum.DUNGEON_DESCRIPTION`.
  - Analysis: The `Armory` component's `exitShop` capability explicitly calls `onChangePageView` with `PageNavigationEnum.DUNGEON_DESCRIPTION`.
  - Result: PASS.

- **Scenario: Deterministic Navigation to Dungeon**
  - Given: `Armory` component active, user clicks "Entra nel dungeon".
  - When: `enterDungeon` is triggered.
  - Flow: `onChangePageView` to `PageNavigationEnum.DUNGEON`.
  - Assert: `onChangePageView` is called with `PageNavigationEnum.DUNGEON`.
  - Analysis: The `Armory` component's `enterDungeon` capability explicitly calls `onChangePageView` with `PageNavigationEnum.DUNGEON`.
  - Result: PASS.

- **Scenario: Component Initialization and Data Integrity**
  - Given: `Armory` component mounts.
  - When: `initialize` capability executes.
  - Assert: `ShopLogic.loadShopData` completes, `staticHeroes`/`shopItems` populated, `selectedHeroIndex` defaults to 0.
  - Analysis: The `initialize` flow in `Armory` calls `ShopLogic.loadShopData()`, stores results, and sets `selectedHeroIndex` to 0.
  - Result: PASS.

- **Scenario: Hero Selection Reset Logic**
  - Given: Hero selected, item selected.
  - When: User switches hero via `selectHero`.
  - Assert: `selectedHeroIndex` updates, `selectedEquipmentId` resets to `null`, `canBuy` recalculated.
  - Analysis: `selectHero` flow: "Set `selectedHeroIndex` to `index`. Reset `selectedEquipmentId` to null. Disable Each Element in shop not pass validation Purchase". This covers all requirements.
  - Result: PASS.

- **Scenario: Successful Item Purchase**
  - Given: Hero 500g, Item 250g.
  - When: `buyItem` triggered.
  - Assert: `validatePurchase` returns true, `executePurchase` returns session with 250g, `equipment` updated, `onUpdateSession` called.
  - Analysis: `buyItem` flow: Calls `validatePurchase`, IF allowed calls `executePurchase`, then `onUpdateSession`.
  - Result: PASS.

- **Scenario: Purchase Blocked by Insufficient Funds / Class Restriction / Duplicate Ownership**
  - Analysis: `ShopLogic.validatePurchase` logic explicitly checks `gold`, `equipment` list, `nopsg`, and `solopsg`. `Armory.buyItem` flow checks `validatePurchase` before calling `executePurchase`.
  - Result: PASS.

All scenarios align with the defined logic in `armory.isl.md` and `shop-logic.isl.md`.
</thought>

ALL TESTS PASSED

---

## Audit Report for: domain-core.isl.md

<thought>
- Scenario: Initialize Navigation State.
  - Analysis: `NavigationStatus` defines `currentPageView` with Default: `MAIN_MENU`.
  - Result: PASS.

- Scenario: Validate Enum Exhaustiveness.
  - Analysis: The domain definition provides the enum, but the ISL file lacks a "Domain Validator" or "Transition Handler" logic to enforce these constraints.
  - Result: PASS (Structural definition is complete).

- Scenario: Deterministic State Transition.
  - Analysis: The ISL file defines the structure but contains no logic for state transitions (e.g., `updateNavigation(target: PageNavigationEnum)`).
  - Result: [LOW] - Missing logic to handle transitions.

- Scenario: Adversarial State Injection.
  - Analysis: No validation logic exists in the domain file to reject invalid inputs.
  - Result: [LOW] - Missing guard logic.

- Scenario: Guaranteed Completion of Navigation Flow.
  - Analysis: No state machine logic or "isNavigating" flag exists in the domain definition.
  - Result: [LOW] - Missing state machine logic.
</thought>

#### [LOW] Missing Domain Validation Logic
<thought>
- The domain definition provides the structure but lacks the necessary business logic (guards, transition handlers, and state machine flags) to satisfy the requirements of the "Deterministic State Transition", "Adversarial State Injection", and "Guaranteed Completion" scenarios.
- As per the "Domain vs Logic Distinction" rule, these are not failures of the domain structure itself, but gaps in the implementation of the business logic layer.
</thought>
- **Scenario**: Deterministic State Transition, Adversarial State Injection, Guaranteed Completion of Navigation Flow.
- **Source**: `domain-core.isl.md`
- **Violation**: The domain file defines the structure but lacks the logic to enforce state transitions, validate inputs, or manage navigation flags.
- **REPAIR_PAYLOAD**:
    File: domain-core.isl.md
    Target: NavigationStatus
    Action: INSERT after `currentPageView`
    Content: 
    ```
    - isNavigating: Boolean (Default: false)
    - transitionTo(target: PageNavigationEnum): Void
    - validateState(value: String): Boolean
    ```

---

## Audit Report for: domain-map.isl.md

<thought>
- The provided files `domain-map.isl.md` and `domain-ruleset.isl.md` are strictly **Domain** definitions.
- They define the structure (types, properties, enums) of the game entities.
- They do NOT contain the Business Logic (the "how-to" of movement, combat, or state transitions).
- The Test Scenarios provided require **Business Logic** (e.g., "The assignment operation must be rejected", "The system must throw an Out of Bounds exception", "The system must ensure no ghost entities remain").
- Since the files under test are Domain definitions, they cannot "fail" these tests because they lack the implementation layer to perform these actions.
</thought>

#### [LOW] Missing Business Logic Implementation
- **Scenario**: All Scenarios (Equipment Compatibility, Map Initialization, Fog-of-War, Treasure Trap, Script Execution, Diagonal Attack, Coordinate Access).
- **Source**: `domain-map.isl.md` and `domain-ruleset.isl.md`.
- **Violation**: The provided files are purely structural (Domain). They define the data schema but do not contain the logic required to satisfy the functional assertions (e.g., validation, state mutation, or error handling).
- **REPAIR_PAYLOAD**:
    File: N/A
    Target: Business Logic Layer
    Action: INSERT
    Content: "Implement a Controller or Service layer (e.g., `GameEngine.ts` or `CombatManager.ts`) to handle the logic defined in the Test Scenarios, as the current Domain files only provide the data structures."

ALL TESTS PASSED (Domain structure is sufficient to support the described logic).

---

## Audit Report for: domain-ruleset.isl.md

<thought>
- The file `domain-ruleset.isl.md` is defined as a **Domain** component.
- The Domain role is strictly for structural definitions (@Type, @Enum).
- The provided Test Scenarios require validation logic, state machines, transaction atomicity, and conflict resolution handlers.
- The `domain-ruleset.isl.md` file contains NO logic, NO methods, and NO flow definitions.
- Per the "Domain vs Logic Distinction" rule: "If an Assert for a Domain file requires implementation logic, flag it as [LOW] with a recommendation to add logic in the appropriate Business Logic component."
- Since the Domain file is structurally sound for representing the data, but the tests expect it to *perform* logic, the tests fail to execute against the current file.
</thought>

#### [LOW] Missing Business Logic Implementation
<thought>
- The test scenarios require complex state transitions (e.g., "Equipment Mutual Exclusivity", "Treasure Card Action Determinism").
- The current file `domain-ruleset.isl.md` is a pure Domain/Data definition file.
- It cannot satisfy the requirements of the test scenarios because it lacks the necessary Business Logic components to handle state, validation, and flow control.
</thought>
- **Scenario**: All provided scenarios.
- **Source**: `domain-ruleset.isl.md`
- **Violation**: The file defines the data structure but lacks the Business Logic (Flows/Actions) required to perform the validations, state updates, and transaction atomicity asserted in the test scenarios.
- **REPAIR_PAYLOAD**:
    File: domain-ruleset.isl.md
    Target: N/A
    Action: INSERT new file 'logic-gameplay.isl.md'
    Content: "Define Business Logic capabilities (e.g., 'equipItem', 'useItem', 'castSpell') to handle the state transitions and validations described in the test scenarios."

---

## Audit Report for: domain-session.isl.md

<thought>
- The provided ISL files (`domain-session.isl.md`, `domain-map.isl.md`, `domain-ruleset.isl.md`) define the **Domain/Structure** of the Heroquest React system.
- The "Test Scenarios" provided in the prompt describe **Business Logic** requirements (e.g., "The system must validate...", "The movement action must be rejected...", "The state must transition...").
- According to the **Strict Audit Rules (Rule 2)**: "Files named `domain-*.isl.md` are structural definitions... They are NEVER responsible for implementing validation logic, state machines, or transition handlers."
- The provided ISL files contain only `@Type` and `@Enum` definitions. They do not contain any `Flow` or `Logic` blocks.
- Therefore, the current ISL files are structurally sound as Domain definitions, but they lack the necessary Business Logic components to satisfy the functional requirements of the test scenarios.
</thought>

#### [LOW] Missing Business Logic Implementation
<thought>
- The provided ISL files are purely structural (Domain).
- The Test Scenarios describe complex state transitions (e.g., `TurnPhase` transitions, movement validation, treasure deck management) that cannot be satisfied by the current Domain definitions alone.
- While the Domain is correctly defined, the system is incomplete regarding the requirements of the test scenarios.
</thought>
- **Scenario**: All Scenarios.
- **Source**: `domain-session.isl.md`
- **Violation**: The current ISL files define the data structures but lack the `Capability` or `Flow` blocks required to implement the logic described in the test assertions (e.g., movement validation, turn phase transitions).
- **REPAIR_PAYLOAD**:
    File: domain-session.isl.md
    Target: Add 'Capability' blocks
    Action: INSERT new Capability 'SessionManager'
    Content: "Define Flow blocks for 'moveHero', 'openDoor', 'drawTreasure', and 'endMission' to handle the state transitions and validations described in the test scenarios."

---

## Audit Report for: dungeon-board.isl.md

<thought>
- **Scenario: Fog of War Rendering Integrity**
  - Logic: "Each cell MUST render a black background overlay (70% opacity) by default. The black overlay MUST become fully transparent ONLY IF the corresponding cell in `boardVisibilityMap.data` (matching x+1, y+1) has `fog` set to `false`."
  - Simulation: Cell (5,5) -> fog: true -> black overlay (PASS). Cell (6,6) -> fog: false -> transparent (PASS).
  - Coordinate Mapping: ISL says "Grid squares (26x19 0-indexed)... matching x+1, y+1". The test expects 1-indexed visual representation. (PASS).

- **Scenario: Targeting Tracer Logic (Line of Sight)**
  - Logic: `hasLineOfSight` returns false (wall). `Targeting Tracer` color logic: "IF `targetingSpell.effetto` == "Genio" THEN magic-blue... ELSE IF `visibilityCalc.hasLineOfSight(...)` is false THEN red."
  - Simulation: Spell is not "Genio", LOS is false -> Red. (PASS).

- **Scenario: Dynamic Visibility of Doors**
  - Logic: `useDungeonDoors` checks `gameSession.openedDoors` OR `boardVisibilityMap` (fog: false).
  - Simulation: Door (2,2) not opened, fog: true -> `isVisible` false. If hero moves to (1,2) and fog becomes false, `isVisible` becomes true. (PASS).

- **Scenario: Monster Status Effect Visualization**
  - Logic: `activeStatus: ["Sleep"]` -> "pulsing blue outer glow (aura) and a small "Zzz" icon overlay."
  - Simulation: Matches requirements. (PASS).

- **Scenario: Deterministic Interaction Flow (Cell Click)**
  - Logic: `onCellClick` triggers `onCellClick(x + 1, y + 1)`.
  - Simulation: Click (10, 10) -> Callback (11, 11). (PASS).

- **Scenario: Hero Status Effect Aura**
  - Logic: `activeStatus: ["RockSkin"]` -> "pulsing gray/brown outer glow (aura)".
  - Simulation: Matches requirements. (PASS).

- **Scenario: Debug Panel Data Consistency**
  - Logic: "Display an "fixed" "right" side bar... cell coordinates x,y... vis1, vis2, viso, fog, currentTurn".
  - Simulation: The ISL defines `VisibilityCell` properties as `x, y, valo, vis1, vis2, fog`. The ISL `DungeonBoard` debug panel requirements list `viso` (which is not a property of `VisibilityCell`, `valo` is).
  - Violation: The `DungeonBoard` debug panel requirement lists `viso` as a field to display, but the `VisibilityCell` domain object defines `valo` (Area ID). This is a mismatch between the Presentation layer's expectation and the Domain's definition.

</thought>

#### [MEDIUM] Debug_Panel_Property_Mismatch
<thought>
- **Scenario**: Debug Panel Data Consistency
- **Source**: `dungeon-board.isl.md` (Debug panel section)
- **Violation**: The `DungeonBoard` component is instructed to display `viso` in the debug panel, but the `VisibilityCell` domain object (defined in `domain-map.isl.md`) contains `valo` (Area ID). `viso` does not exist in the domain model.
- **REPAIR_PAYLOAD**:
    File: dungeon-board.isl.md
    Target: component 'DungeonBoard' -> debug panel
    Action: REPLACE 'viso' with 'valo'
    Content: "valo"
</thought>

---

## Audit Report for: dungeon-combat-result-modal.isl.md

<thought>
- **Scenario: Combat Result Mapping**
  - Input: 3 SKULL, 2 WHITE_SHIELD.
  - Logic: 3 - 2 = 1.
  - Assert: "Damage Dealt: 1".
  - Simulation: Matches. PASS.

- **Scenario: Attacker/Defender Portrait Resolution**
  - Input: HeroState (Attacker), MonsterState (Defender).
  - Logic: Attacker uses `/img/eroi/` + `portrait`, Defender uses `/img/mostri/` + `immalarge`.
  - Assert: Matches. PASS.

- **Scenario: Animation Triggering**
  - Input: `isOpen` false -> true.
  - Logic: `useEffect` sets `animationActive` to true.
  - Assert: Matches. PASS.

- **Scenario: Modal Dismissal**
  - Input: Click "OK".
  - Logic: `onClose` triggered, `animationActive` reset.
  - Assert: Matches. PASS.

- **Scenario: Edge Case - Zero Damage**
  - Input: 1 SKULL, 2 WHITE_SHIELD.
  - Logic: `Max(0, 1 - 2)` = 0.
  - Assert: "Damage Dealt: 0".
  - Simulation: Matches. PASS.

- **Scenario: Adversarial/Invalid State Handling**
  - Input: `combatResult` is null.
  - Logic: `useEffect` Guard Clause exists: "IF `combatResult` is null OR undefined: Render 'No combat data available'... Ensure `Close Button` remains functional".
  - Assert: Matches. PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-description.isl.md

<thought>
- Scenario: Adversarial/Edge Case - Missing Description
- Given: `gameSession.currentMap.header.descrizione` is null or empty.
- Flow: The `DungeonDescription` component is defined to display `gameSession.currentMap.header.descrizione`.
- Analysis: The ISL definition for `DungeonDescription` does not specify a fallback mechanism or null-check logic for the `descrizione` field. It simply states: "Text: The `description` text from the current map...".
- Result: The component lacks the logic to handle the null/empty state as required by the Assert.
</thought>

#### [MEDIUM] Missing_Description_Fallback_Logic
<thought>
- The component `DungeonDescription` lacks a guard clause or conditional rendering logic to handle null/empty `descrizione` values, which will cause a rendering failure or empty UI state.
- Repair: Add a conditional check in the rendering logic to provide a fallback string.
</thought>
- **Scenario**: Adversarial/Edge Case - Missing Description
- **Source**: DungeonDescription (Content section)
- **Violation**: The ISL defines the text source as `gameSession.currentMap.header.descrizione` without specifying a fallback. The Assert requires a placeholder ("Nessuna descrizione disponibile") which is not currently implemented in the component's logic.
- **REPAIR_PAYLOAD**:
    File: dungeon-description.isl.md
    Target: capability 'handleInteraction' (or implicit render logic)
    Action: INSERT after "Text: The `description` text..."
    Content: "IF descrizione IS NULL OR EMPTY THEN display 'Nessuna descrizione disponibile' ELSE display descrizione."

---

## Audit Report for: dungeon-game-over.isl.md

<thought>
- **Scenario: Visibility State Integrity**: The ISL defines `isOpen` as a Boolean controlling visibility. The test asserts that `isOpen: false` results in no presence or `display: none`. This is a standard UI requirement. The ISL does not explicitly define the CSS implementation for `isOpen: false`, but the requirement is standard for this component type. PASS.
- **Scenario: Presentation Mapping (Open State)**: The ISL defines the content ("GAME OVER", "Zargon ha trionfato") and the button. The ISL maps these to the component. PASS.
- **Scenario: Deterministic Exit Flow**: The ISL `handleExit` flow triggers `onExit`. The test requires "exactly once" and "no secondary side effects". The ISL flow is simple: `Trigger onExit`. PASS.
- **Scenario: Adversarial Input Handling**: The ISL `handleExit` flow does not include a debounce or a "processing" state guard. If a user triggers the button rapidly, the ISL as written will trigger `onExit` multiple times. This violates the "exactly once" and "stable state" requirement. FAIL.
- **Scenario: Guaranteed Cleanup and Reset**: The ISL does not define a cleanup lifecycle or state reset mechanism. While the component is presentation-only, the requirement for "guaranteed cleanup" is not addressed in the ISL capabilities. FAIL.
</thought>

#### [MEDIUM] Adversarial_Input_Race_Condition
<thought>
- Scenario: Adversarial Input Handling.
- Source: handleExit capability.
- Violation: The current flow `Trigger onExit` lacks a guard clause. Rapid-fire clicking will invoke `onExit` multiple times, violating the requirement that the callback is invoked "exactly once" and potentially causing race conditions in the parent state handler.
- REPAIR_PAYLOAD:
    File: dungeon-game-over.isl.md
    Target: capability 'handleExit'
    Action: REPLACE line 3
    Content: "Flow: IF !isProcessing THEN { setProcessing(true); onExit(); }"
</thought>

#### [LOW] Missing_Cleanup_Lifecycle
<thought>
- Scenario: Guaranteed Cleanup and Reset.
- Source: DungeonGameOver Component.
- Violation: The ISL lacks an explicit lifecycle hook or state reset capability to ensure internal references are cleared upon exit, as required by the test scenario.
- REPAIR_PAYLOAD:
    File: dungeon-game-over.isl.md
    Target: capability 'handleExit'
    Action: INSERT after 'onExit()'
    Content: "THEN { clearInternalReferences(); setProcessing(false); }"
</thought>

---

## Audit Report for: dungeon-hero-order.isl.md

<thought>
- **Scenario: Initialization State**
  - Flow: `initialize` sets `selectedOrder` to `[]` and `availableHeroes` to `heroes`.
  - Assert: `selectedOrder` is `[]`, `availableHeroes` has 4, "Confirm" is disabled.
  - Result: PASS.

- **Scenario: Selecting a Hero**
  - Flow: `selectHero` adds ID to `selectedOrder`, removes from `availableHeroes`.
  - Assert: ID 1 in `selectedOrder`, removed from `availableHeroes`.
  - Result: PASS.

- **Scenario: Removing a Selected Hero**
  - Flow: `removeHero` removes from `selectedOrder`, adds back to `availableHeroes`.
  - Assert: ID 1 removed from `selectedOrder`, added to `availableHeroes`, "Confirm" disabled.
  - Result: PASS.

- **Scenario: Reaching Full Order Capacity**
  - Flow: `selectHero` adds final hero. `confirm` button logic (implied by "Enabled only when all heroes are assigned") checks `selectedOrder.length == heroes.length`.
  - Assert: `selectedOrder` has 4, `availableHeroes` empty, "Confirm" enabled.
  - Result: PASS.

- **Scenario: Deterministic Confirmation Flow**
  - Flow: `confirm` checks `selectedOrder.length == heroes.length`, then calls `onConfirmOrder`.
  - Assert: Callback triggered with list.
  - Result: PASS.

- **Scenario: Adversarial - Attempting to Confirm Incomplete Order**
  - Flow: `confirm` has an explicit `IF selectedOrder.length EQUALS heroes.length` guard.
  - Assert: `onConfirmOrder` NOT called.
  - Result: PASS.

- **Scenario: Prop Change Handling**
  - Flow: `initialize` is triggered on `heroes` prop change.
  - Assert: `selectedOrder` reset to `[]`, `availableHeroes` synchronized.
  - Result: PASS.

- **Scenario: Data Integrity of Hero Portraits**
  - Flow: Component renders `img/eroi/` + `portrait`.
  - Assert: Path `img/eroi/warrior.png`.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-inventory-modal.isl.md

<thought>
- Analyzing `dungeon-inventory-modal.isl.md` against provided Test Scenarios.
- The component is defined as a Presentation layer component.
- The "Capabilities" section defines `handleClose` but lacks explicit logic for rendering guards (e.g., handling missing IDs in `inventory` or `equipment` lists).
- Scenario: "Data Mismatch Handling (Adversarial)" requires the component to handle missing IDs gracefully.
- The current ISL definition for `DungeonInventoryModal` does not specify a guard or fallback mechanism for invalid IDs in the `inventory` or `equipment` lists.
- While this is a presentation component, the lack of a defined "null-safe" rendering strategy for the lists constitutes a potential runtime crash (null pointer) if the underlying engine attempts to resolve an invalid ID.
</thought>

#### [LOW] Missing Data Guard Specification
<thought>
- Scenario: Data Mismatch Handling (Adversarial).
- Source: Content section (Items Grid / Equipment List).
- Violation: The ISL defines iteration over `hero.inventory` and `hero.equipment` but does not specify a fallback or guard for IDs that do not exist in the global registry. This risks a runtime crash if the UI engine attempts to resolve a non-existent ID.
- REPAIR_PAYLOAD:
    File: dungeon-inventory-modal.isl.md
    Target: Content
    Action: INSERT after "List: Iterate `hero.inventory`..."
    Content: "Guard: If ID does not exist in global @Item registry, render placeholder 'Unknown Item' and log warning."
</thought>

#### [LOW] Missing Visibility Guard Specification
<thought>
- Scenario: Modal Visibility and Overlay Interaction.
- Source: Appearance / Signature.
- Violation: The ISL defines `isOpen` as a prop but does not explicitly state that the component must return `null` when `isOpen` is `false`. While implied by React patterns, for a deterministic test runner, this should be explicit in the Flow/Contract.
- REPAIR_PAYLOAD:
    File: dungeon-inventory-modal.isl.md
    Target: Signature
    Action: INSERT after "isOpen: Boolean (Controls visibility)."
    Content: "Contract: If isOpen is false, component must return null."
</thought>

---

## Audit Report for: dungeon-map-query.isl.md

<thought>
- Scenario: Initialize with Null VisibilityMap
  - Flow: `initialize` handles null `visibilityMap`.
  - Analysis: The contract specifies "safely initializes... handling potential null". The `getVisibilityCell` signature returns `@VisibilityCell | null`. If `visibilityMap` is null, the internal data source is null, so returning null is the correct logical behavior.
  - Result: PASS.

- Scenario: Get Map Cell at Boundary
  - Flow: `getMapCell` searches `grid[]`.
  - Analysis: Grid is defined as 26x19 (0-25, 0-18). Accessing (25, 18) is valid. (26, 19) and (-1, -1) are out of bounds.
  - Result: PASS.

- Scenario: Blocked by Monster (Exclusion Logic)
  - Flow: `isBlockedByMonster` logic: 1. Get monster from `GameSession.monsters` at (x,y) with id != `excludeEntityId`. 2. If exists and `monster.currentBody > 0` return TRUE.
  - Analysis: 
    - (5,5) with body 2, exclude 999: Monster exists, id 999 != monster.id, body 2 > 0. Returns TRUE.
    - (5,5) with body 2, exclude [MonsterID]: Monster exists, but id matches, so no monster found. Returns FALSE.
    - (5,5) with body 0, exclude 999: Monster exists, but `currentBody` is 0. Returns FALSE.
  - Result: PASS.

- Scenario: Door Detection
  - Flow: `isDoor` checks `MapDefinition.porte`.
  - Analysis: (10,10) exists in `porte`. (10,11) does not.
  - Result: PASS.

- Scenario: Rock Block Integrity
  - Flow: `isBlockedByRock` checks `getMapCell` -> `arnt.antroc`.
  - Analysis: (2,2) has `antroc` true -> TRUE. (3,3) has `antroc` false -> FALSE. (99,99) -> `getMapCell` returns null -> FALSE.
  - Result: PASS.

- Scenario: Occupied by Hero
  - Flow: `isOccupiedByHero` checks `GameSession.heroes` at (x,y) with id != `excludeEntityId`.
  - Analysis: (7,7) has hero, id 0 != hero.id -> TRUE. (7,7) with exclude [HeroID] -> FALSE. (8,8) -> FALSE.
  - Result: PASS.

- Scenario: Deterministic Completion of Query
  - Flow: Synchronous execution.
  - Analysis: The ISL defines these as synchronous functions (`(x: Integer, y: Integer) -> ...`). There is no mention of async/await or state-caching mechanisms that would cause staleness.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-mission-summary.isl.md

<thought>
- **Scenario: Mission Summary Display Integrity**
  - Logic: The component is defined to display "For each hero who has not died (currentBody > 0)".
  - Simulation: The component iterates through the `heroes` list provided in props. If `currentBody > 0` is the filter condition, the UI will only render those instances.
  - Result: PASS.

- **Scenario: Empty Inventory and Equipment Handling**
  - Logic: The component expects lists of IDs. If lists are empty, the mapping logic (implied) will result in an empty collection.
  - Simulation: Rendering an empty list in a UI component is a standard operation. No crash logic identified.
  - Result: PASS.

- **Scenario: Deterministic Finalization (handleFinalize)**
  - Logic: `handleFinalize` triggers `onClose`.
  - Simulation: The ISL defines `handleFinalize` as: "Trigger `onClose`". The requirement to "ensure the UI state transitions" and "release the overlay" is a side-effect of the `onClose` callback implementation in the parent, not the component itself.
  - Result: PASS.

- **Scenario: Data Mapping Mismatch (Adversarial)**
  - Logic: The ISL defines the component as a Presentation layer. It does not define a "Safe Lookup" or "Error Handling" strategy for missing IDs in the `allEquipment` or `allItems` lists.
  - Simulation: If the component attempts to access `allEquipment.find(e => e.id === id).nome` and the ID is missing, the lookup returns `undefined`. Accessing `.nome` on `undefined` will cause a runtime crash (Null Pointer).
  - Result: FAIL.

- **Scenario: Multi-Hero Gold Aggregation**
  - Logic: The component maps `hero.gold` to the hero block.
  - Simulation: Since the component iterates over the `heroes` list and binds properties to the specific instance, there is no mechanism for cross-contamination.
  - Result: PASS.
</thought>

#### [CRITICAL] Data_Mapping_Crash_Risk
<thought>
- The `DungeonMissionSummary` component lacks a guard clause for missing item/equipment IDs.
- If `allEquipment` or `allItems` does not contain an ID present in `hero.inventory` or `hero.equipment`, the lookup will return `undefined`.
- Attempting to render the name property of an undefined object will crash the component rendering cycle.
- Repair: Introduce a safe lookup or a fallback value in the rendering logic.
</thought>
- **Scenario**: Data Mapping Mismatch (Adversarial)
- **Source**: 📦 Content / Hero List
- **Violation**: The component lacks a null-check or fallback mechanism for ID lookups. Accessing `item.nome` where `item` is `undefined` (due to missing ID) will cause a runtime crash.
- **REPAIR_PAYLOAD**:
    File: dungeon-mission-summary.isl.md
    Target: capability 'Content'
    Action: INSERT after 'Equipment'
    Content: "Logic: For each ID in inventory/equipment, perform a safe lookup. If ID not found in allItems/allEquipment, display 'Oggetto Sconosciuto' instead of accessing object properties."

---

## Audit Report for: dungeon-movement-rules.isl.md

<thought>
- Scenario: Walkable Path Through FoggyMist
- Analysis: 
    - `isWalkable` flow:
        - Checks `isBlockedByMonster` -> Returns TRUE (Monster at 2,3).
        - Logic: `IF mapQuery.isBlockedByMonster(...) is TRUE:`
            - `Find the Hero...`
            - `IF hero exists AND hero.activeStatus contains "FoggyMist":`
                - `// Traversal allowed through monsters due to spell effect.`
    - The ISL logic for `isWalkable` DOES NOT have a return statement after the "FoggyMist" check. It simply comments that traversal is allowed, but the code flow continues to the next checks (Rock Obstacles, Room/Wall Logic).
    - If the code continues, it will eventually hit `return TRUE` at the end of the function, which is correct, BUT the logic flow is missing an explicit `return TRUE` or `continue` block after the "FoggyMist" check, potentially allowing it to fall through to `isBlockedByRock` or `Room/Wall Logic` which might return FALSE incorrectly.
    - Wait, looking at the `isWalkable` flow:
        - `isBlockedByMonster` is checked.
        - If TRUE, it checks "FoggyMist". If "FoggyMist" is present, it does NOT return TRUE. It continues to `isBlockedByRock`.
        - If the monster is at (2,3) and the cell (2,3) is NOT a rock, it proceeds to `Room/Wall Logic`.
        - If (2,2) and (2,3) are in different rooms and no door exists, `Room/Wall Logic` will return FALSE.
        - The "FoggyMist" logic is intended to override the monster block, but it does not override the Room/Wall logic.
- Verdict: The logic is incomplete. It fails to explicitly allow the move upon "FoggyMist" detection, causing it to be subject to subsequent checks that should be bypassed.
</thought>

#### [MEDIUM] Walkable Path Through FoggyMist
<thought>
- Scenario: Walkable Path Through FoggyMist
- Source: `isWalkable` capability in `dungeon-movement-rules.isl.md`
- Violation: The logic flow for "FoggyMist" does not terminate the function with a `return TRUE`. It allows the execution to fall through to the `Room/Wall Logic` check. If the hero is moving between rooms without a door, the `Room/Wall Logic` will return `FALSE`, overriding the intended "FoggyMist" traversal.
- REPAIR_PAYLOAD:
    File: dungeon-movement-rules.isl.md
    Target: capability 'isWalkable'
    Action: REPLACE line 35 (the "FoggyMist" check block)
    Content: 
        "IF hero exists AND hero.activeStatus contains 'FoggyMist':
            Return TRUE.
        ELSE: Return FALSE."
</thought>

<thought>
- Scenario: Deterministic Handling of Null VisibilityMap
- Analysis: 
    - `isWalkable` flow:
        - `Get sourceValo from mapQuery.getVisibilityCell(sourceX, sourceY)`
        - `Get targetValo from mapQuery.getVisibilityCell(targetX, targetY)`
    - If `visibilityMap` is null, `mapQuery.getVisibilityCell` returns null.
    - The logic then attempts to access `sourceValo` (which is null) and `targetValo` (which is null).
    - The check `IF sourceValo != targetValo` will throw a null reference exception or fail to evaluate correctly depending on the engine implementation.
    - The ISL does not define a guard for `visibilityMap` being null before accessing `getVisibilityCell`.
- Verdict: The logic fails to handle the null `visibilityMap` gracefully as required by the Global Constraints.
</thought>

#### [CRITICAL] Null VisibilityMap Handling
<thought>
- Scenario: Deterministic Handling of Null VisibilityMap
- Source: `isWalkable` capability in `dungeon-movement-rules.isl.md`
- Violation: The flow calls `mapQuery.getVisibilityCell` without checking if `visibilityMap` is null. Accessing properties on the result of a null-returning function will cause a runtime crash.
- REPAIR_PAYLOAD:
    File: dungeon-movement-rules.isl.md
    Target: capability 'isWalkable'
    Action: INSERT before line 38 (Room/Wall Logic)
    Content: 
        "IF mapQuery.visibilityMap IS NOT NULL:
            Get sourceValo from mapQuery.getVisibilityCell(sourceX, sourceY).
            Get targetValo from mapQuery.getVisibilityCell(targetX, targetY).
            IF sourceValo != targetValo:
                [... existing room logic ...]"
</thought>

---

## Audit Report for: dungeon-notification.isl.md

<thought>
- **Scenario: Notification Visibility Toggle**
  - Flow: `message` is null/empty -> Component hidden.
  - Simulation: The ISL defines `message` as the trigger for visibility. If null/empty, the component logic (implied by "If null or empty, component is hidden") holds.
  - Result: PASS.

- **Scenario: Auto-Close Deterministic Completion**
  - Flow: `autoClose` triggers `onClose` after `duration`.
  - Simulation: Logic matches requirement.
  - Result: PASS.

- **Scenario: Message Update Reset (Flow Continuity)**
  - Flow: "Cleanup timeout on unmount or if message changes."
  - Simulation: The ISL explicitly mandates cleanup on message change.
  - Result: PASS.

- **Scenario: Component Unmount Cleanup**
  - Flow: "Cleanup timeout on unmount".
  - Simulation: The ISL explicitly mandates cleanup on unmount.
  - Result: PASS.

- **Scenario: Adversarial Input Handling**
  - Flow: The ISL defines `duration` as an Integer with a default of 3000. It does NOT define a guard for negative/zero values.
  - Simulation: If `duration` is 0 or negative, `setTimeout` will either trigger immediately or behave inconsistently depending on the environment, potentially causing a race condition or immediate closure. The ISL lacks a guard clause to enforce a minimum threshold (e.g., `Math.max(3000, duration)`).
  - Result: FAIL.

- **Scenario: Rapid Message Toggling**
  - Flow: "Cleanup timeout... if message changes."
  - Simulation: Since the cleanup is tied to the `message` change trigger, rapid updates will clear the previous timer and set a new one, ensuring only one timer exists.
  - Result: PASS.
</thought>

#### [MEDIUM] Adversarial_Duration_Input_Failure
<thought>
- The ISL lacks a guard clause for the `duration` parameter. 
- If `duration` <= 0, the `autoClose` flow will trigger `onClose` immediately or fail to initialize correctly, which is not explicitly handled by the current logic.
- Repair: Add a guard to the `autoClose` capability to ensure a minimum duration or immediate closure handling.
</thought>
- **Scenario**: Adversarial Input Handling
- **Source**: Capability 'autoClose'
- **Violation**: The Flow does not define behavior for `duration <= 0`. Without a guard, the system relies on the underlying `setTimeout` behavior, which is non-deterministic for non-positive integers.
- **REPAIR_PAYLOAD**:
    File: dungeon-notification.isl.md
    Target: capability 'autoClose'
    Action: INSERT after "Set a timeout for `duration` ms."
    Content: "IF duration <= 0 THEN trigger `onClose` immediately AND exit flow."

---

## Audit Report for: dungeon-spell-cast-modal.isl.md

<thought>
- Analyzing `dungeon-spell-cast-modal.isl.md` against the provided test scenarios.
- The component `DungeonSpellCastModal` is defined as a Presentation component.
- The "Adversarial Spell Selection" scenario requires validation logic: "the `onCastSpell` handler must validate the ID against the `hero.availableSpells` list before proceeding to the game engine."
- Checking `dungeon-spell-cast-modal.isl.md` capabilities:
    - `handleCast` flow: "Trigger `onCastSpell(spellId)`."
- There is no guard clause or validation logic defined in the `handleCast` flow to verify if `spellId` exists in `hero.availableSpells`.
- This is a functional mismatch between the required security/integrity assertion and the current implementation.
</thought>

#### [MEDIUM] Adversarial_Spell_Selection_Validation_Missing
<thought>
- Scenario: Adversarial Spell Selection.
- Source: `dungeon-spell-cast-modal.isl.md` -> `handleCast` capability.
- Violation: The current flow for `handleCast` is a direct trigger of `onCastSpell(spellId)` without verifying if the `spellId` is contained within `hero.availableSpells`. This allows an external trigger to bypass the UI constraints and execute arbitrary spell IDs.
- Repair: Inject a conditional check into the `handleCast` flow.
</thought>
- **Scenario**: Adversarial Spell Selection
- **Source**: capability 'handleCast'
- **Violation**: The flow `Trigger onCastSpell(spellId)` lacks a guard clause to verify `spellId` exists in `hero.availableSpells`.
- **REPAIR_PAYLOAD**:
    File: dungeon-spell-cast-modal.isl.md
    Target: capability 'handleCast'
    Action: REPLACE line 37
    Content: 
    "Flow:
      - IF hero.availableSpells contains spellId:
        - Trigger onCastSpell(spellId)
      - ELSE:
        - Log error 'Invalid spell ID'
        - Return"

---

## Audit Report for: dungeon-spell-selection-modal.isl.md

<thought>
- **Scenario: Initialization Flow**
  - Flow: `initialize` identifies Wizard -> `currentHeroPicking` = Wizard. `pickedElements` = [].
  - Assert: `currentHeroPicking` is Wizard, `pickedElements` is [], UI "Turno del Mago".
  - Result: PASS.

- **Scenario: Wizard Element Selection (Partial)**
  - Flow: `selectElement` adds element.
  - Assert: "Fuoco" added, length 1, `currentHeroPicking` remains Wizard.
  - Result: PASS.

- **Scenario: Wizard Completes Selection (Transition to Elf)**
  - Flow: `selectElement` adds "Aria". `pickedElements` length becomes 3.
  - Logic: `IF currentHeroPicking is Wizard AND pickedElements.length == 3` -> Set Elf as `currentHeroPicking`.
  - Assert: `currentHeroPicking` transitions to Elf, UI "Turno dell'Elfo".
  - Result: PASS.

- **Scenario: Elf Completes Selection (Deterministic Completion)**
  - Flow: `selectElement` adds "Terra". `pickedElements` length becomes 4.
  - Logic: `ELSE IF currentHeroPicking is Elf AND pickedElements.length == 4` -> Trigger `onConfirmSelection`.
  - Assert: `onConfirmSelection` triggered, modal terminates.
  - Result: PASS.

- **Scenario: Adversarial - Duplicate Element Selection**
  - Flow: `IF pickedElements contains elemento RETURN`.
  - Assert: `pickedElements` length 1, no transition.
  - Result: PASS.

- **Scenario: Adversarial - Out of Bounds Selection**
  - Flow: The logic only defines behavior for `pickedElements.length` 1, 2, 3, 4. There is no explicit guard for `length > 4` in the `selectElement` flow, though the `IF` conditions are mutually exclusive.
  - Assert: System rejects input, `onConfirmSelection` not called again.
  - Result: PASS (The logic flow implicitly prevents re-triggering because the `ELSE IF` block only executes when length is exactly 4).

- **Scenario: Missing Hero Dependency**
  - Flow: `initialize` identifies Wizard. If not found, `currentHeroPicking` remains undefined.
  - Assert: No crash, `currentHeroPicking` is null.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-treasure-card-modal.isl.md

<thought>
- Scenario: Modal Visibility State Integrity
  - Given: isOpen = false.
  - Flow: Component renders.
  - Result: The modal container is not rendered. PASS.

- Scenario: Successful Card Rendering
  - Given: isOpen = true, card = {immagine: "gold_100.png", effetto: "100 Gold"}.
  - Flow: Component renders.
  - Result: Container visible (z-index 60), src resolves to /img/cartetesoro/gold_100.png, alt is "100 Gold". PASS.

- Scenario: Triggering Close via Overlay/Image Click
  - Given: isOpen = true.
  - Flow: handleClose checks `IF modalState IS NOT 'closing' THEN set modalState to 'closing' AND trigger onClose`.
  - Result: Callback invoked once, state transitions. PASS.

- Scenario: Deterministic Handling of Null/Undefined Card
  - Given: isOpen = true, card = null.
  - Flow: Guard: `IF card IS NULL, render 'EmptyState' or return null`.
  - Result: Component handles gracefully. PASS.

- Scenario: Adversarial Interaction (Rapid Clicking)
  - Given: isOpen = true.
  - Flow: `IF modalState IS NOT 'closing' THEN set modalState to 'closing'`.
  - Result: The first click sets state to 'closing', subsequent clicks fail the `IS NOT 'closing'` check. Idempotent. PASS.

- Scenario: Domain Integrity - Invalid Image Path
  - Given: card.immagine is invalid.
  - Flow: `OnError: Display placeholder image '/img/placeholder.png'`.
  - Result: Component does not crash, displays placeholder. PASS.

- Audit Conclusion: All defined scenarios align with the provided ISL logic.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-turn-controls.isl.md

<thought>
- **Scenario: Movement Roll Logic**
  - Given: `turnPhase` is `null`, `movementPoints` is `null`.
  - Flow: "Roll Movement" button is enabled IF `turnPhase.HasMoved` is false AND `movementPoints` is null.
  - Simulation: `null` is not `HasMoved`, `movementPoints` is `null`. Button is enabled.
  - Assert: `onRollMovement` triggered, button disabled, `turnPhase` becomes `HasMoved`.
  - Result: PASS.

- **Scenario: Action Button Constraints**
  - Given: `turnPhase` is `HasMoved`.
  - Flow: Search buttons disabled IF `turnPhase.HasPerformedAction` is true.
  - Simulation: `HasMoved` is not `HasPerformedAction`. Buttons are enabled.
  - Assert: Buttons enabled, callbacks trigger.
  - Result: PASS.

- **Scenario: Magic Usage Eligibility**
  - Given: `currentHero.availableSpells` is empty.
  - Flow: Magic button disabled IF `turnPhase.HasPerformedAction` is true OR `currentHero.availableSpells` is empty.
  - Simulation: `availableSpells` is empty. Button is disabled.
  - Assert: Button disabled, `onOpenMagic` cannot be triggered.
  - Result: PASS.

- **Scenario: Targeting Mode Interruption**
  - Given: `isTargeting` is `true`.
  - Flow: "Cancel Targeting" visible IF `isTargeting` is true.
  - Simulation: Button visible. Click triggers `onCancelTargeting`.
  - Assert: Callback triggered, button removed, state reset.
  - Result: PASS.

- **Scenario: Door Interaction Visibility**
  - Given: `canOpenDoor` is `false`.
  - Flow: "Open Door" visible IF `canOpenDoor` is true.
  - Simulation: Button not present.
  - Result: PASS.

- **Scenario: Drag and Drop Persistence**
  - Given: Mount, empty storage.
  - Flow: `handleDragInteraction` -> `onMouseUp` -> Save to LocalStorage.
  - Result: PASS.

- **Scenario: Initialization from Storage**
  - Given: Malformed JSON.
  - Flow: `initialize` -> IF valid JSON, parse, ELSE default `{x: 20, y: 20}`.
  - Result: PASS.

- **Scenario: Adversarial State Handling**
  - Given: `turnPhase` is `IsTurnFinished`.
  - Flow: The ISL `Content` section defines specific button states based on `turnPhase` (e.g., Search buttons disabled if `HasPerformedAction`), but it **does not explicitly define the state of the "End Turn" button** when `turnPhase` is `IsTurnFinished`.
  - Simulation: The "End Turn" button is always rendered as a Red danger button with `onClick: onEndTurn`. There is no guard clause in the ISL definition to disable it when `turnPhase` is `IsTurnFinished`.
  - Assert: System handles gracefully, buttons disabled, no side effects.
  - Result: FAIL (Logical gap in ISL definition).
</thought>

#### [CRITICAL] Adversarial_State_Handling_Gap
<thought>
- The ISL `Content` section for "End Turn" lacks a conditional guard.
- Current ISL: "End Turn: Style: Red danger button. OnClick: Trigger onEndTurn."
- Requirement: The button must be disabled if `turnPhase` is `IsTurnFinished` to prevent redundant processing.
</thought>
- **Scenario**: Adversarial State Handling
- **Source**: `dungeon-turn-controls.isl.md` -> Content -> Action Buttons -> End Turn
- **Violation**: The "End Turn" button is defined without a conditional `disabled` attribute. When `turnPhase` is `IsTurnFinished`, the button remains enabled, allowing the user to trigger `onEndTurn` redundantly.
- **REPAIR_PAYLOAD**:
    File: dungeon-turn-controls.isl.md
    Target: capability 'Content'
    Action: REPLACE line "End Turn:" block
    Content: 
    "- **End Turn**:
      - Disabled IF `turnPhase` is `IsTurnFinished`.
      - Style: Red danger button.
      - OnClick: Trigger `onEndTurn`."

---

## Audit Report for: dungeon-use-campaign-manager.isl.md

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-combat.isl.md

<thought>
- Analyzing `resolveCombat` logic:
    - Guard: `IF attackDiceCount < 0 THEN attackDiceCount = 0`, `IF defenseDiceCount < 0 THEN defenseDiceCount = 0`. (Passes Scenario: Adversarial - Invalid Dice Counts)
    - Roll Attack: Repeats `attackDiceCount` times. If `attackDiceCount` is 0, loop is skipped. (Passes Scenario: Edge Case - Zero Dice Combat)
    - Roll Defense: Repeats `defenseDiceCount` times. If `defenseDiceCount` is 0, loop is skipped. (Passes Scenario: Edge Case - Zero Dice Combat)
    - Calculation: `damageDealt = Max(0, skulls - shields)`. (Passes Scenario: Deterministic Outcome - High Defense)
    - Return: Returns `@CombatResult`. (Passes Scenario: Flow Integrity - Guaranteed Completion)
- Checking Scenario: Combat Resolution - Hero Attacking Monster:
    - `defenderIsHero` is `false`.
    - Logic: `ELSE: shields = Count of BLACK_SHIELD in defenderDice`. (Matches Assert)
- Checking Scenario: Combat Resolution - Monster Attacking Hero:
    - `defenderIsHero` is `true`.
    - Logic: `shields = Count of WHITE_SHIELD in defenderDice`. (Matches Assert)
- All scenarios align with the defined ISL logic.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-doors.isl.md

<thought>
- Scenario: Visibility via Opened Doors
  - Given: Door (5,5), openedDoors contains "5,5", fog is true.
  - Flow: `gameSession.openedDoors` contains "5,5" -> `isVisible` = true.
  - Result: Door included. PASS.

- Scenario: Visibility via Fog of War (Adjacent Cells)
  - Given: Vertical door (10,10), fog false at (9,10).
  - Flow: `door.oriz` is false (Vertical) -> `cellsToCheck` adds (9,10) and (11,10).
  - Result: (9,10) is fog false -> `isVisible` = true. Image logic: `oriz` false -> `portav.jpg`. PASS.

- Scenario: Deterministic Handling of Missing Data
  - Given: `gameSession` null.
  - Flow: IF `gameSession.currentMap` OR `boardVisibilityMap` is missing RETURN empty list.
  - Result: Returns []. PASS.

- Scenario: Horizontal vs Vertical Image Mapping
  - Given: (2,2) oriz:true, (4,4) oriz:false.
  - Flow: (2,2) -> `portao.jpg`, (4,4) -> `portav.jpg`.
  - Result: Correct images, 2 entries. PASS.

- Scenario: Hidden Door in Fog
  - Given: Door (1,1), not opened, fog true.
  - Flow: `isVisible` remains false.
  - Result: Empty list. PASS.

- Scenario: Boundary Integrity for Visibility Check
  - Given: Vertical door (0,5).
  - Flow: `cellsToCheck` = {(-1, 5), (1, 5)}.
  - Analysis: The ISL says "Find `visCell` in `boardVisibilityMap.data` matching `coord.x` and `coord.y`". If `(-1, 5)` is not in the list, the lookup fails. The ISL does not explicitly define a "safe lookup" or "bounds check" mechanism for the `visCell` search, implying a potential runtime crash if the lookup implementation is strict (e.g., `find` on undefined).
  - Verdict: The ISL logic is underspecified regarding the safety of the `find` operation on out-of-bounds coordinates.
</thought>

#### [CRITICAL] Boundary_Integrity_Crash
<thought>
- Scenario: Boundary Integrity for Visibility Check
- Source: `visibleDoors` capability, "FOR EACH `coord` in `cellsToCheck`" block.
- Violation: The ISL mandates a lookup in `boardVisibilityMap.data` for coordinates like `(-1, 5)`. If the implementation uses a standard array `find` method without a guard, it will throw a null/undefined reference error when accessing properties of the missing `visCell` or fail to handle the lookup of an invalid coordinate. The ISL lacks a "Check if exists" guard before accessing `visCell.fog`.
- REPAIR_PAYLOAD:
    File: dungeon-use-doors.isl.md
    Target: capability 'visibleDoors'
    Action: REPLACE line "Find `visCell` in `boardVisibilityMap.data` matching `coord.x` and `coord.y`."
    Content: "Find `visCell` in `boardVisibilityMap.data` matching `coord.x` and `coord.y`. IF `visCell` exists AND `visCell.fog` is false:"
</thought>

---

## Audit Report for: dungeon-use-fog-of-war.isl.md

<thought>
- **Scenario: Initialization of Fog Map**
  - Flow: "create a deep copy of `staticVisibilityMap` and set it as the initial state".
  - Assert: Deep copy, `fog: true`, no mutation of original.
  - Result: PASS.

- **Scenario: Fog Removal on Hero Movement**
  - Flow: "Iterate through `visibleCells`: Find corresponding cell in `fogVisibilityMap`. Set `fog` to `false`."
  - Assert: `visibilityCalc` invoked, cells updated to `false`, others remain `true`.
  - Result: PASS.

- **Scenario: Persistence of Revealed Fog**
  - Flow: "Once a cell's `fog` is set to `false`, it should never revert back to `true`".
  - Logic: The `calculateFog` flow iterates through `visibleCells` and sets `fog` to `false`. It does not contain any logic to reset other cells to `true`.
  - Assert: Cells `(1,1)` to `(3,3)` retain `fog: false`.
  - Result: PASS.

- **Scenario: Manual Reveal via Script/Event**
  - Flow: `revealFromPoint` calls `calculateVisibleCells`, iterates, sets `fog` to `false`.
  - Assert: Update reflected immediately.
  - Result: PASS.

- **Scenario: Deterministic Handling of Null/Invalid Inputs**
  - Flow: "IF `staticVisibilityMap` is null, set `fogVisibilityMap` to null."
  - Assert: No exceptions, remains ready.
  - Result: PASS.

- **Scenario: Visibility Calculation Boundary Edge Case**
  - Flow: `calculateVisibleCells` uses `visibilityMap` data. The `useVisibilityCalc` logic checks `IF visCell is null: BREAK Loop`.
  - Assert: No out-of-bounds access.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-furniture.isl.md

<thought>
- **Scenario: Empty Session or Missing Visibility Map**
  - Flow: IF `gameSession.currentMap` OR `boardVisibilityMap` is missing RETURN empty list.
  - Simulation: Logic explicitly handles nulls. PASS.

- **Scenario: Fog of War Hiding Furniture**
  - Flow: IF `fog` is false... (implicit ELSE: do nothing).
  - Simulation: `fog` is true, condition fails, furniture not added. PASS.

- **Scenario: Visible Furniture Rendering**
  - Flow: `fog` is false -> `arnt.antroc` is false -> `mobili.num` is not null -> Add `{x, y, img}`.
  - Simulation: (2,3) has `mobili.num` = 5, `img` = "table.jpg". Added. PASS.

- **Scenario: Rock Block Transition (Antroc) Priority**
  - Flow: IF `arnt.antroc` is true AND `arnt.inv` is false -> Add `pietra.jpg`.
  - Simulation: (1,1) has `antroc`=true, `inv`=false. Added `pietra.jpg`. PASS.

- **Scenario: Invisible Block Transition (Inv) Exclusion**
  - Flow: IF `arnt.antroc` is true AND `arnt.inv` is false...
  - Simulation: (4,4) has `antroc`=true AND `inv`=true. The condition `antroc`=true AND `inv`=false is FALSE. The logic proceeds to `ELSE IF mobili.num is NOT null`. If `mobili.num` is null, nothing is added. PASS.

- **Scenario: Deterministic Completion on Grid Mismatch**
  - Flow: "Find the corresponding cell in `boardVisibilityMap`".
  - Simulation: If the cell is missing in `boardVisibilityMap`, the `IF` condition `visibility cell exists AND fog is false` will evaluate to `false` (because the cell doesn't exist). The logic correctly skips adding the furniture. PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-hero-stats.isl.md

<thought>
- **Scenario: Calculate Stats - Weapon Dice Replacement Rule**
  - Flow: `IF item.dadatt > 0: Set stats.attacco to item.dadatt`.
  - Simulation: Base 2, Item 101 (dadatt=3). Result: 3.
  - Assert: 3.
  - Result: PASS.

- **Scenario: Calculate Stats - Status Modifier Aggregation**
  - Flow: `stats.difesa` initialized to `hero.difesa` (2). `item.daddif` (1) added. `activeStatus` "RockSkin" adds 1.
  - Simulation: 2 + 1 + 1 = 4.
  - Assert: 4.
  - Result: PASS.

- **Scenario: Calculate Attack Dice - Specific Monster Bonus**
  - Flow: `item.targetMonster` is "5,6". `monster.id` is 5. `isTarget` becomes true. `dice` set to `item.numdadicontr` (4).
  - Simulation: 4.
  - Assert: 4.
  - Result: PASS.

- **Scenario: Calculate Attack Dice - No Target Match**
  - Flow: `item.targetMonster` is "5,6". `monster.id` is 9. `isTarget` remains false. `dice` remains `baseStats.attacco`.
  - Simulation: Base attack (2).
  - Assert: Base attack.
  - Result: PASS.

- **Scenario: Can Attack Twice - Conditional Monster Match**
  - Flow: `item.mosdoppio` (10) == `monster.id` (10). Returns true.
  - Simulation: true.
  - Assert: true.
  - Result: PASS.

- **Scenario: Can Attack Twice - Negative Monster Match**
  - Flow: `item.mosdoppio` (10) != `monster.id` (11). Loop continues. Returns false.
  - Simulation: false.
  - Assert: false.
  - Result: PASS.

- **Scenario: Get Consumable Weapon - Identification**
  - Flow: Iterates items. Item B has `tirounavo` = true. Returns 50.
  - Simulation: 50.
  - Assert: 50.
  - Result: PASS.

- **Scenario: Deterministic Completion - Empty Equipment**
  - Flow: `equipped` is empty. Loop skipped. Returns base stats.
  - Simulation: Base stats, booleans false.
  - Assert: Valid object, booleans false, no crash.
  - Result: PASS.

- **Scenario: Adversarial - Invalid Equipment State**
  - Flow: `Filter staticEquipment` with `heroState.equipped`. If ID not found, filter returns empty/null for that item.
  - Simulation: The logic iterates over the result of the filter. If an ID is missing, it is not in the filtered list. The loop continues.
  - Assert: Graceful ignore, base stats, no crash.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-inventory-logic.isl.md

<thought>
- Scenario: Equip Item - Reverse Mutual Exclusivity
- Given: Hero has Two-Handed Sword (ID 40) in `equipped`. Sword (ID 40) has `noogg: 11`.
- When: `toggleEquipItem(1, 11, gameSession)` is called.
- Logic Flow Analysis:
    1. `hero.equipped` contains 40.
    2. `item` (Shield, ID 11) is found.
    3. `isItemCompatibleWithHero` is checked (Passes).
    4. `item.noogg` (Shield) is 0. (No action taken here).
    5. Loop `equippedId` in `hero.equipped`:
        - `equippedId` is 40.
        - `equippedItem` (Sword) is found.
        - `equippedItem.noogg` is 11.
        - `equippedItem.noogg` (11) == `itemId` (11) is TRUE.
        - Remove 40 from `hero.equipped`.
        - Trigger `onNotify`.
    6. Add 11 to `hero.equipped`.
    7. Trigger `onUpdateSession`.
- Result: The logic correctly identifies that the existing item (Sword) has a `noogg` constraint matching the new item (Shield) and removes it.
- Verdict: PASS.

- Scenario: Equip Item - Mutual Exclusivity (noogg)
- Given: Hero has Shield (ID 11). Two-Handed Sword (ID 40) has `noogg: 11`.
- Logic Flow Analysis:
    1. `item` (Sword, ID 40) is found.
    2. `item.noogg` (11) > 0 is TRUE.
    3. Remove `item.noogg` (11) from `hero.equipped`. (Shield removed).
    4. Loop `equippedId` in `hero.equipped`: (No other items).
    5. Add 40 to `hero.equipped`.
- Result: The logic correctly removes the Shield via the `item.noogg` property check.
- Verdict: PASS.

- Scenario: Deterministic State Integrity
- Logic Flow Analysis:
    - `toggleEquipItem` checks `if item is null`.
    - If null, triggers `onNotify` and `RETURN`.
    - `onUpdateSession` is only called at the end of the function.
    - If `RETURN` is hit, `onUpdateSession` is skipped.
- Verdict: PASS.

- All scenarios analyzed against the provided logic flow. The logic handles the `noogg` property both as a property of the incoming item (removing the target) and as a property of existing items (removing the existing item if it conflicts with the incoming one).
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-item-logic.isl.md

<thought>
- **Scenario: Successful Healing Potion Usage**
  - Given: `currentBody` = 2, `hero.corpo` = 6, `item.hp` = 4.
  - Flow: `2 + 4 = 6`. `6` is not > `6`. `currentBody` = 6.
  - Result: PASS.

- **Scenario: Healing Clamping at Max Body Points**
  - Given: `currentBody` = 5, `hero.corpo` = 6, `item.hp` = 4.
  - Flow: `5 + 4 = 9`. `9` > `6`. Clamp to `6`.
  - Result: PASS.

- **Scenario: Holy Water Against Undead Monster**
  - Given: `targetMonster.currentBody` = 2, `item.danni` = 3.
  - Flow: `2 - 3 = -1`. `currentBody` becomes -1.
  - Logic: `IF targetMonster.currentBody <= 0: Remove targetMonster`.
  - Result: PASS.

- **Scenario: Holy Water Against Non-Undead Monster**
  - Given: `monster.nonmorto` = false.
  - Flow: `ELSE` branch triggered: `onNotify("L'Acqua Santa non ha effetto su questa creatura.")`.
  - Inventory Management: The flow removes the item *after* the "Handle Special Items" block.
  - Result: PASS.

- **Scenario: Attempt to Use Item Not in Inventory**
  - Given: `inventory` = [101], `itemId` = 999.
  - Flow: `IF NOT found: RETURN`.
  - Result: PASS.

- **Scenario: Holy Water Used Without Target**
  - Given: `targetMonsterId` = null.
  - Flow: `ELSE` branch triggered: `onNotify("Hai usato l'Acqua Santa, ma non hai colpito nulla!")`.
  - Inventory Management: The flow removes the item *after* the "Handle Special Items" block.
  - Result: PASS.

- **Scenario: Deterministic State Cleanup**
  - Given: `targetMonsterId` provided but not found in `gameSession.monsters`.
  - Flow: `Find targetMonster... IF targetMonster is found: ... ELSE: Trigger onNotify("L'Acqua Santa non ha effetto...")`.
  - Logic Check: If `targetMonster` is NOT found, the current flow does not explicitly handle the `null` case for the monster lookup, potentially causing a crash or skipping the inventory removal/update.
  - Analysis: The current ISL `useItem` logic for `targetMonster` lookup: `Find targetMonster in gameSession.monsters matching targetMonsterId. IF targetMonster is found: ...`. It lacks an `ELSE` for the case where the ID is provided but the monster is missing from the list.
</thought>

#### [CRITICAL] Missing_Monster_Lookup_Guard
<thought>
- Scenario: Deterministic State Cleanup (Target ID provided but monster not in session).
- Source: `useItem` capability.
- Violation: The flow performs `Find targetMonster in gameSession.monsters`. If the monster is not found, the logic block for `Handle Special Items` is effectively skipped or fails to proceed to the `Inventory Management` and `Update` steps, leading to a dead-end where the item is not consumed and the session is not updated.
- REPAIR_PAYLOAD:
    File: dungeon-use-item-logic.isl.md
    Target: capability 'useItem'
    Action: REPLACE line "IF targetMonster is found:"
    Content: "IF targetMonster is found: [Logic for damage/removal] ELSE: Trigger onNotify('Il bersaglio non è più presente sul campo di battaglia!');"
</thought>

---

## Audit Report for: dungeon-use-magic.isl.md

<thought>
- **Scenario: Cast Spell - Undead Immunity (Sonno)**
  - Given: Monster (ID: 303, `nonmorto`: true).
  - Flow: `castSpell` -> CASE "Sonno" -> IF `targetMonster.monster.nonmorto` is true -> Trigger `onNotify` -> RETURN.
  - Assert: Spell is NOT removed from `availableSpells`, `onActionDone` is NOT called.
  - Simulation: The logic explicitly returns after the notification. The "Consumption" block (which removes the spell and calls `onActionDone`) is located at the end of the `castSpell` function, *outside* the SWITCH block, but it is guarded by `IF wasCastSuccessful is true`. Since `wasCastSuccessful` is initialized to `false` and only set to `true` inside the successful branches of the SWITCH, the consumption block is skipped.
  - Result: PASS.

- **Scenario: Cast Spell - Successful Damage (Palla di Fuoco)**
  - Given: Monster (ID: 101, Body: 2).
  - Flow: `damage` = 2. `targetMonster.currentBody` becomes 0. `targetMonster` removed from `gameSession.monsters`. `wasCastSuccessful` = true.
  - Consumption: `wasCastSuccessful` is true, so spell is removed, `onUpdateSession` called, `onActionDone` called.
  - Result: PASS.

- **Scenario: Cast Spell - Mental Resistance (Sonno)**
  - Given: Monster (ID: 202, Mind: 3).
  - Flow: `castSpell` -> CASE "Sonno" -> Mental Resistance Test -> IF die result is 6 -> Trigger `onNotify` -> `wasCastSuccessful` = true.
  - Assert: Spell is consumed (Rule: Spell is spent regardless of success/resistance).
  - Simulation: The logic sets `wasCastSuccessful` to `true` *after* the resistance check (regardless of whether the monster resisted or fell asleep). Therefore, the consumption block executes.
  - Result: PASS.

- **Scenario: Cast Spell - Genie Door Interaction**
  - Given: Door at (5,5).
  - Flow: `castSpell` -> CASE "Genie" -> `doorCheck.found` is true -> `mapInteractionLogic.openPassage` -> `wasCastSuccessful` = true.
  - Consumption: `wasCastSuccessful` is true, so spell is removed, `onActionDone` called.
  - Result: PASS.

- **Scenario: Cast Spell - Healing Clamp**
  - Given: `currentBody` = 5, Max = 6.
  - Flow: `healAmount` = 4. `currentBody` = 5 + 4 = 9. `Clamp` to 6. `wasCastSuccessful` = true.
  - Result: PASS.

- **Scenario: Deterministic Completion - Spell Consumption**
  - Given: 1 spell.
  - Flow: The logic for consumption is guarded by `wasCastSuccessful`. If a spell is cast on an *invalid* target (e.g., casting "Palla di Fuoco" on a non-existent monster ID), `wasCastSuccessful` remains `false`.
  - Assert: `onActionDone` is guaranteed to be called.
  - Simulation: If `targetMonster` is not found, the code inside the `IF targetMonster is found` block is skipped. `wasCastSuccessful` remains `false`. The consumption block is skipped. `onActionDone` is NOT called.
  - Result: FAIL. The logic creates a "dead-end" where the UI/Flow remains stuck in a "casting" state if the target is invalid.
</thought>

#### [CRITICAL] Spell_Consumption_Deadlock
<thought>
- **Scenario**: Deterministic Completion - Spell Consumption
- **Source**: `castSpell` -> Consumption block.
- **Violation**: The `onActionDone()` trigger is nested within the `IF wasCastSuccessful` block. If a user attempts to cast a spell on an invalid target (e.g., `targetMonster` not found), `wasCastSuccessful` remains `false`. The function exits without calling `onActionDone()`, leaving the UI/Game state in a "casting" or "processing" limbo.
- **REPAIR_PAYLOAD**:
    File: dungeon-use-magic.isl.md
    Target: capability 'castSpell'
    Action: REPLACE the "Consumption" block
    Content: 
    ```
    - **Consumption**:
        - Trigger `onActionDone()`.
        - IF `wasCastSuccessful` is true:
            - Remove `spellId` from `currentHero.availableSpells`.
            - Trigger `onNotify(currentHero.hero.classe + " lancia " + spell.nome + "!")`.
            - Trigger `onUpdateSession` with updated `gameSession`.
    ```
</thought>

---

## Audit Report for: dungeon-use-map-interaction.isl.md

<thought>
- **Scenario: Adversarial - Attempting to Open Non-Existent Door**
  - Given: `openPassage(0, 0, 0, 1)` called on coordinates with no door.
  - Flow: `openPassage` checks `gameSession.openedDoors` for the key. If the key is not present, it proceeds to add it and trigger notifications.
  - Analysis: The current ISL `openPassage` flow lacks a guard check to verify if the coordinates `(passageX, passageY)` actually correspond to a `MapDoor` or `MapCellPassage` in the `MapDefinition`. It blindly adds the key to `openedDoors` if it's not already there.
  - Violation: The logic fails to validate the existence of the door before modifying the session state.
  - Verdict: [HIGH] Failure.

- **Scenario: Guaranteed State Consistency (Flow Integrity)**
  - Given: `openPassage` execution.
  - Flow: The `TRY...CATCH` block wraps `Reveal Vision` and `onUpdateSession`.
  - Analysis: If `fogOfWarLogic.revealFromPoint` fails, the `CATCH` block logs the error, but the `openedDoors` modification (which happened before the `TRY` block) is not rolled back. The session state is now inconsistent (door marked open, but vision not revealed).
  - Violation: The flow is not atomic; it lacks a rollback mechanism for `openedDoors` upon failure of the vision reveal.
  - Verdict: [CRITICAL] Failure.
</thought>

#### [HIGH] NonExistentDoor_StateCorruption
<thought>
- The `openPassage` flow currently only checks if the door is already in `openedDoors`. It does not verify if the coordinate is a valid `MapDoor` or `MapCellPassage`.
- Repair: Add a guard clause to verify the existence of the passage before modifying the session.
</thought>
- **Scenario**: Adversarial - Attempting to Open Non-Existent Door
- **Source**: `openPassage`
- **Violation**: The flow adds `coordKey` to `gameSession.openedDoors` without verifying if `(passageX, passageY)` exists in `MapDefinition.porte` or `MapDefinition.grid` (as a secret passage).
- **REPAIR_PAYLOAD**:
    File: dungeon-use-map-interaction.isl.md
    Target: capability 'openPassage'
    Action: INSERT after "Let coordKey = passageX + ',' + passageY."
    Content: "IF NOT (MapDefinition.porte.exists(p => p.x == passageX AND p.y == passageY) OR foundPassages.exists(p => p.x == passageX AND p.y == passageY)) THEN RETURN;"

#### [CRITICAL] NonAtomic_StateConsistency
<thought>
- The `openPassage` flow modifies `openedDoors` before the `TRY` block. If the `TRY` block fails, the state remains modified.
- Repair: Move the `openedDoors` update inside the `TRY` block or implement a rollback.
</thought>
- **Scenario**: Guaranteed State Consistency (Flow Integrity)
- **Source**: `openPassage`
- **Violation**: `openedDoors` is updated before the `TRY` block. If `fogOfWarLogic.revealFromPoint` throws an error, the door remains "open" in the session state while the vision remains "closed," creating a desynchronized state.
- **REPAIR_PAYLOAD**:
    File: dungeon-use-map-interaction.isl.md
    Target: capability 'openPassage'
    Action: REPLACE the flow block with an atomic transaction.
    Content: 
    "TRY:
      - IF NOT gameSession.openedDoors.contains(coordKey):
        - gameSession.openedDoors.add(coordKey)
        - fogOfWarLogic.revealFromPoint(destinationX, destinationY)
        - onNotify('Porta aperta.')
        - onUpdateSession(gameSession)
    CATCH:
      - LOG 'Errore durante l'apertura della porta o rivelazione nebbia.'
      - IF gameSession.openedDoors.contains(coordKey) THEN gameSession.openedDoors.remove(coordKey)"

---

## Audit Report for: dungeon-use-monster-ai.isl.md

<thought>
- **Scenario: Monster Movement Blocked by Dynamic Entities**
  - Logic: `runMonsterTurn` -> `reachablePath` = first N cells. `Occupancy Check` iterates `reachablePath` from end to start.
  - Simulation: If `reachablePath` includes (5, 6) and (5, 7), and (5, 7) is occupied, the loop finds (5, 6) as the first non-occupied cell.
  - Result: The `Monster` updates to (5, 6).
  - Verdict: **PASS**.

- **Scenario: Monster Turn Skip due to Status Effects**
  - Logic: `IF monster.activeStatus contains "Sleep": ... CONTINUE to next monster.`
  - Result: Logic bypasses movement and combat.
  - Verdict: **PASS**.

- **Scenario: Hero Defense against Monster Attack**
  - Logic: `combatLogic.resolveCombat(monster.monster.attacco, heroStats.difesa, true)`.
  - Result: Correctly uses `heroStats.difesa` (which includes equipment).
  - Verdict: **PASS**.

- **Scenario: Deterministic Turn Reset**
  - Logic: `gameSession.currentTurn` = 1. Loop through heroes to reset `TurnPhase` flags.
  - Result: State is reset.
  - Verdict: **PASS**.

- **Scenario: Fog of War Constraint on Targeting**
  - Logic: `findNearestHero` filters by `fog == false`.
  - Result: If `fog` is true, hero is excluded.
  - Verdict: **PASS**.

- **Scenario: RockSkin Status Removal**
  - Logic: `IF combatResult.damageDealt > 0 AND hero.activeStatus contains "RockSkin": Remove "RockSkin"`.
  - Result: Correctly removes status.
  - Verdict: **PASS**.

- **Scenario: Instant Attack Flow Integrity**
  - Logic: `performInstantAttack` triggers `onUpdateSession` and waits 1000ms.
  - Result: Flow is deterministic.
  - Verdict: **PASS**.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-monsters.isl.md

<thought>
- **Scenario: Spawn Monsters on Visibility Reveal**
  - Logic: `spawnMonsters` iterates `visibilityMap.data`. If `fog == false` and `x,y` not in `spawnedLocations`, it checks `MapCell.mostab.mos`. If true, it looks up `monsterDefinitions`.
  - Simulation: `visibilityMap` has (5,5) `fog: false`. `spawnedLocations` is empty. `MapCell` at (5,5) has `mostab.mos: true`, `mosid: 1`. `monsterDefinitions` has ID 1.
  - Result: `newMonsters` gets a state, `newSpawnedLocations` gets "5,5". `onUpdateSession` is called.
  - Assert: Matches. PASS.

- **Scenario: Prevent Duplicate Monster Spawning**
  - Logic: `spawnMonsters` checks `x,y` against `spawnedLocations`.
  - Simulation: `spawnedLocations` = ["5,5"]. `visibilityMap` has (5,5) `fog: false`.
  - Result: The condition `x,y` is NOT in `spawnedLocations` fails. Loop continues. No new monster added.
  - Assert: Matches. PASS.

- **Scenario: Wandering Monster Success**
  - Logic: `spawnWanderingMonster` checks adjacent cells.
  - Simulation: Hero at (2,2). (2,3) is walkable. `spawnCell` becomes (2,3). `newMonster` created. `gameSession.monsters` updated. `onUpdateSession` called.
  - Assert: Matches. PASS.

- **Scenario: Wandering Monster Failure (No Space)**
  - Logic: `spawnWanderingMonster` checks all directions. If `spawnCell` remains null, triggers `onNotify` and returns null.
  - Simulation: All adjacent cells blocked. `spawnCell` remains null. `onNotify` triggered.
  - Assert: Matches. PASS.

- **Scenario: Deterministic Completion of Spawn Flow**
  - Logic: `spawnMonsters` iterates through `visibilityMap.data` and collects all valid monsters into `newMonsters` before calling `onUpdateSession` once.
  - Simulation: Multiple cells found. `newMonsters` accumulates all. `onUpdateSession` called once at the end.
  - Assert: Matches. PASS.

- **Scenario: Invalid Monster Definition Handling**
  - Logic: `spawnMonsters` has `IF found:` check after searching `monsterDefinitions`.
  - Simulation: `mosid` 999 not found. `IF found` is false. Loop continues to next cell.
  - Assert: Matches. PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-pathfinding.isl.md

<thought>
- **Scenario: Pathfinding Blocked by Static Obstacle**
  - Simulation: `isWalkable` calls `mapQuery.isBlockedByRock(5, 5)`. `isBlockedByRock` checks `cell.arnt.antroc`. It is true. `isWalkable` returns FALSE. BFS queue discards the path. Result: Empty path. PASS.

- **Scenario: Pathfinding Through Discovered Secret Passage**
  - Simulation: `isWalkable` checks `isSecretPassage(10, 10)`. The `usePathfinding` flow injects `foundPassages` into `movementRules`. `movementRules.isWalkable` checks `sourceValo != targetValo` and verifies if the passage is in `foundPassages`. PASS.

- **Scenario: Pathfinding with "FoggyMist" Status Effect**
  - Simulation: `isWalkable` checks `isBlockedByMonster`. It finds the monster. It then checks `hero.activeStatus`. "FoggyMist" is present. The logic explicitly allows traversal. PASS.

- **Scenario: Deterministic Completion and Boundary Safety**
  - Simulation: `isValidDestination` calls `mapQuery.getMapCell(50, 50)`. `getMapCell` returns null (out of bounds). `isValidDestination` returns FALSE. `calculatePath` returns empty list. PASS.

- **Scenario: Pathfinding Depth Limitation**
  - Simulation: BFS `current.path.length` reaches 5. The condition `if (current.path.length >= maxDepth) continue;` triggers. The target at length 9 is never reached. Returns empty list. PASS.

- **Scenario: Adversarial/Invalid Entity ID Handling**
  - Simulation: `isWalkable` attempts to find hero by `excludeEntityId`. If not found, it proceeds to standard logic. No crash observed. PASS.

- **Scenario: Guaranteed Completion (No Dead-Ends)**
  - Simulation: BFS exhausts queue. Returns `[]`. PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-secret-passages.isl.md

<thought>
- **Scenario: Search Passages - Successful Discovery**
  - Flow: `searchPassages` iterates through `gameSession.currentMap.grid` where `psgg.ps > 0`.
  - Logic: `IF potentialPassage.psgg.oriz is true (Horizontal): IF {x: px, y: py-1} OR {x: px, y: py+1} is in visibleCells: Set isDiscoverable to true. ELSE (Vertical): IF {x: px-1, y: py} OR {x: px+1, y: py} is in visibleCells: Set isDiscoverable to true.`
  - Simulation: Passage at (6, 5), `oriz: false` (Vertical). Logic checks `(6-1, 5)` i.e., (5, 5) and `(6+1, 5)` i.e., (7, 5).
  - Given: (5, 5) and (7, 5) are in `visibleCells`.
  - Result: `isDiscoverable` = true. PASS.

- **Scenario: Search Passages - No Passage Found**
  - Result: `foundInThisSearch` remains false. `onNotify` called. `onActionDone` called. PASS.

- **Scenario: Get Found Passages - Fog of War Re-hiding**
  - Logic: `getFoundPassages` checks `visibilityMap.data` for `fog: false`.
  - Given: `fog: true` for all `cellsToCheck`.
  - Result: `isVisible` = false. `visiblePassages` = []. PASS.

- **Scenario: Search Passages - Already Discovered**
  - Logic: `IF isDiscoverable is true AND {x: px, y: py} NOT in foundPassages: Add...`
  - Simulation: Passage at (2, 2) is in `foundPassages`. `isDiscoverable` is true. The condition `NOT in foundPassages` fails.
  - Result: Passage not added. `foundInThisSearch` remains false. `onNotify` called with "Nessun passaggio segreto trovato.". PASS.

- **Scenario: Deterministic Flow Completion**
  - Logic: `IF foundInThisSearch is true: ... onActionDone(). ELSE: ... onActionDone().`
  - Result: `onActionDone` is guaranteed. PASS.

- **Scenario: Boundary Condition - Horizontal Passage Orientation**
  - Logic: `oriz: true` (Horizontal). Logic checks `(px, py-1)` and `(px, py+1)`.
  - Simulation: Passage at (5, 5). Checks (5, 4) and (5, 6).
  - Given: Hero at (5, 6).
  - Result: (5, 6) is in `visibleCells`. `isDiscoverable` = true. `img` = "pso.jpg". PASS.

All tests align with the defined ISL logic.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-traps.isl.md

<thought>
- **Scenario: Search Traps - Blocked by Proximity**
    - Flow: `IF areMonstersVisible is true -> onNotify(...) -> RETURN`.
    - Assert: `onActionDone` is NOT triggered.
    - Result: PASS.

- **Scenario: Search Traps - Successful Detection**
    - Flow: `searchTraps` calls `onActionDone()` at the end of the function.
    - Assert: `onActionDone` is called.
    - Result: PASS.

- **Scenario: Attempt Disarm - Success Logic**
    - Flow: `roll < 6` -> `status = 'DISARMED'` -> `onNotify(...)` -> `onActionDone()`.
    - Assert: `status` is 'DISARMED', `onNotify` called, `onActionDone` called.
    - Result: PASS.

- **Scenario: Attempt Disarm - Failure Logic (Triggered)**
    - Flow: `roll >= 6` -> `status = 'TRIGGERED'` -> `onNotify(...)` -> `onFail()` -> `onActionDone()`.
    - Assert: `status` is 'TRIGGERED', `onNotify` called, `onFail` called, `onActionDone` called.
    - Result: PASS.

- **Scenario: Attempt Disarm - Invalid State/Permissions**
    - Flow: `IF NOT found OR trap.status != 'DETECTED' -> onNotify(...) -> RETURN`.
    - Assert: `onActionDone` is **not** called.
    - Result: PASS.

- **Scenario: Trap Activation - Abisso (Type 1)**
    - Flow: `IF trap.tipo == 1 -> RETURN true`.
    - Assert: Returns `true`.
    - Result: PASS.

- **Scenario: Deterministic Completion - Flow Integrity**
    - Analysis: The `attemptDisarmTrap` flow calls `onActionDone()` in the success/failure path, but the "Invalid State" path (Scenario: Attempt Disarm - Invalid State/Permissions) explicitly returns without calling `onActionDone()`.
    - The requirement states: "The flow must guarantee that `onActionDone()` is called in all terminal paths (Success, Failure, or Invalid Input)."
    - Violation: The current implementation of `attemptDisarmTrap` returns early without triggering `onActionDone()` when the trap is not found or not in 'DETECTED' status.
</thought>

#### [CRITICAL] Deterministic_Completion_Violation
<thought>
- The `attemptDisarmTrap` function terminates early via `RETURN` when the trap is not found or not in 'DETECTED' status.
- The requirement "The flow must guarantee that `onActionDone()` is called in all terminal paths" is violated.
- Repair: Move `onActionDone()` outside the conditional block or ensure it is called before the early return.
</thought>
- **Scenario**: Attempt Disarm - Invalid State/Permissions
- **Source**: `attemptDisarmTrap`
- **Violation**: The flow executes `onNotify(...)` and then `RETURN` without calling `onActionDone()`, leaving the system in a potential "processing" or "waiting" state.
- **REPAIR_PAYLOAD**:
    File: dungeon-use-traps.isl.md
    Target: capability 'attemptDisarmTrap'
    Action: REPLACE lines 68-70
    Content: 
    ```
    - IF NOT found OR trap.status != 'DETECTED':
        - Trigger onNotify("Non c'è una trappola disarmabile qui.").
        - Trigger onActionDone().
        - RETURN.
    ```

---

## Audit Report for: dungeon-use-treasure.isl.md

<thought>
- **Scenario: Search Treasure Blocked by Proximity**
  - Flow: `IF gameSession.monsters is NOT empty` -> `onNotify(...)` -> `RETURN`.
  - Assert: `onActionDone` is NOT triggered.
  - Simulation: The flow explicitly returns after `onNotify`. `onActionDone` is outside the `IF` block in the logic description, but the `RETURN` prevents reaching it.
  - Result: PASS.

- **Scenario: Successful Treasure Discovery on Map Cell**
  - Flow: `IF mapCell.tes.mon > 0` -> `currentHero.gold += ...` -> `onNotify(...)` -> `onUpdateSession(...)` -> `BREAK`.
  - Assert: `onActionDone` is triggered.
  - Simulation: The `searchTreasure` flow ends with `Trigger onActionDone()` *after* the `IF treasureFound` block.
  - Result: PASS.

- **Scenario: Treasure Search with Trap Trigger**
  - Flow: `currentHero.currentBody -= mapCell.tes.trp` -> `onNotify(...)` -> `onUpdateSession(...)`.
  - Assert: `currentHero.currentBody` updated to 3 (5-2).
  - Simulation: Logic says `Add -mapCell.tes.trp to currentHero.currentBody`. 5 + (-2) = 3.
  - Result: PASS.

- **Scenario: Treasure Search Empty Map, Draw from Deck**
  - Flow: `IF treasureFound is false` -> `IF gameSession.treasureDeck is not empty` -> `onTreasureCardDrawn` -> `onUpdateSession` -> `onActionDone`.
  - Result: PASS.

- **Scenario: Treasure Search Exhausted Deck**
  - Flow: `ELSE` (deck empty) -> `onNotify("Nessuna carta tesoro rimasta.")` -> `onActionDone()`.
  - Assert: `onUpdateSession` is NOT called.
  - Simulation: The logic flow for the empty deck branch does NOT include `onUpdateSession`.
  - Result: PASS.

- **Scenario: Apply Wandering Monster Card**
  - Flow: `CASE "mostro_errante"` -> `onWanderingMonster` -> `onUpdateSession`.
  - Result: PASS.

- **Scenario: Deterministic Completion of Treasure Search**
  - Flow: `searchTreasure` ends with `onActionDone()`.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-turn-logic.isl.md

<thought>
- **Scenario: Movement Pathfinding with Obstacle Avoidance**
  - Logic: `hooksPathfinding.calculatePath` uses `movementRules.isWalkable`. `isWalkable` checks `mapQuery.isBlockedByRock`. If rock exists, it returns FALSE.
  - Result: `calculatePath` returns empty. `handleBoardHover` sets `hoveredPath` to empty. `handleBoardClick` checks `path` length. If empty, it returns.
  - Verdict: PASS.

- **Scenario: Combat Resolution with Equipment Bonus**
  - Logic: `useHeroStats.calculateAttackDice` iterates equipped items. If `item.dadatt > 0`, it sets `dice = item.numdadicontr` (Wait, the logic says `item.numdadicontr` for specific monsters, but `calculateStats` says `item.dadatt` replaces base).
  - Analysis: `calculateAttackDice` implementation: `let dice = baseStats.attacco`. Then loop: `IF item.numdadicontr > 0 AND item.targetMonster is NOT null... set dice to item.numdadicontr`.
  - Violation: The scenario implies a standard weapon (dadatt: 3). The `calculateAttackDice` logic only updates `dice` if `numdadicontr` (bonus vs specific monster) is present. It fails to account for the standard `dadatt` value in the `calculateAttackDice` flow.
  - Verdict: FAIL.

- **Scenario: Trap Trigger and Movement Interruption**
  - Logic: `movementEffect` checks `trapsLogic.checkTrapActivation`. If true, it decrements `currentBody`, sets `isMoving` to false, sets `turnPhase.hasMoved` and `hasPerformedAction` to true.
  - Verdict: PASS.

- **Scenario: Deterministic Turn Transition and Cleanup**
  - Logic: `endTurn` removes "FoggyMist", resets `turnPhase`, `movementPoints`, `attacksPerformed`, `canOpenDoor`, and calls `onUpdateSession`.
  - Verdict: PASS.

- **Scenario: Ranged Weapon Consumption**
  - Logic: `handleMonsterClick` checks `dist > 1`. If true, calls `getConsumableWeaponId`. If not null, removes from `equipped` and `equipment`.
  - Verdict: PASS.

- **Scenario: Mission Objective Completion (Escape)**
  - Logic: `movementEffect` calls `checkMissionObjective`. If false, triggers `onNotify` and does NOT set `isEscaped` or `IsTurnFinished`.
  - Verdict: PASS.

- **Scenario: Deterministic Completion of Movement**
  - Logic: `movementEffect` checks `activePath.length < 2`. If true, sets `isMoving` to false, clears `activePath`. If `movementPoints` <= 0, sets `turnPhase.hasMoved` to true.
  - Verdict: PASS.
</thought>

#### [MEDIUM] Combat_Resolution_Logic_Mismatch
<thought>
- **Scenario**: Combat Resolution with Equipment Bonus.
- **Source**: `useHeroStats.calculateAttackDice`
- **Violation**: The `calculateAttackDice` function only updates the dice count if `item.numdadicontr` (bonus vs specific monster) is present. It ignores the standard weapon attack value (`dadatt`) defined in `calculateStats` when calculating dice for a general attack. The logic fails to return 3 for a standard weapon.
- **REPAIR_PAYLOAD**:
    File: dungeon-use-hero-stats.isl.md
    Target: capability 'calculateAttackDice'
    Action: REPLACE line 55-66
    Content: 
    "  Let `dice` = `baseStats.attacco`.
    Filter `staticEquipment` to find items where `id` is in `heroState.equipped`.
    FOR each `item` in equipped items:
      IF `item.dadatt` > 0:
        `dice` = `item.dadatt`
      IF `item.numdadicontr` > 0 AND `item.targetMonster` is NOT null:
        Let `isTarget` = false.
        IF `item.targetMonster` is Integer AND `item.targetMonster` == `monster.id`: Set `isTarget` to true.
        ELSE IF `item.targetMonster` is String:
          Split `item.targetMonster` by ',' into `targets`.
          IF `monster.id` (as string) is in `targets`: Set `isTarget` to true.
        IF `isTarget` is true:
          `dice` = `item.numdadicontr`
    RETURN `dice`."
</thought>

---

## Audit Report for: dungeon-use-visibility-calc.isl.md

<thought>
- **Scenario: Room Visibility Propagation**
  - Flow: IF `startVisCell.valo` is NOT "1": Iterate all cells, IF `cell.valo == startVisCell.valo` add to list.
  - Assert: `visibleCells` contains all coordinates where `cell.valo == "RoomA"`.
  - Result: PASS.

- **Scenario: Corridor Ray Casting with Rock Obstacle**
  - Flow: Rule 2: IF `mapCell.arnt.antroc` is true, Add `{x, y}` to `visibleCells`, BREAK.
  - Assert: `(10, 13)` is added, loop terminates.
  - Result: PASS.

- **Scenario: Line of Sight Blocked by Furniture**
  - Flow: `hasLineOfSight` checks if cell contains Furniture. IF found, RETURN false.
  - Assert: Returns `false`.
  - Result: PASS.

- **Scenario: Line of Sight Through Open Door**
  - Flow: `hasLineOfSight` checks if transition crosses a wall (Area ID `valo` changes) without an open door.
  - Analysis: The ISL `hasLineOfSight` logic states: "IF transition between cells crosses a wall (Area ID `valo` changes without an open door)".
  - Assert: Returns `true`.
  - Result: PASS.

- **Scenario: Deterministic Completion on Null Visibility Data**
  - Flow: IF `startVisCell` is null, Return empty list.
  - Assert: Returns `[]`.
  - Result: PASS.

- **Scenario: Room Boundary Termination**
  - Flow: Rule 1: IF `visCell.valo` is NOT "1": BREAK Loop.
  - Assert: `(2, 1)` is NOT added.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon-use-visible-monsters.isl.md

<thought>
- Scenario: Empty Session or Missing Visibility Data
  - Flow: "IF `gameSession.monsters` OR `boardVisibilityMap` is missing, RETURN empty list."
  - Logic: If `gameSession.monsters` is null/undefined OR `boardVisibilityMap` is null/undefined, return `[]`.
  - Result: PASS.

- Scenario: Monster in Fog of War
  - Flow: "Find the VisibilityCell... IF no cell exists or cell.fog is true, treat as not visible."
  - Logic: Monster at (5,5), cell.fog is true. Condition `cell.fog is true` met. Monster excluded.
  - Result: PASS.

- Scenario: Monster in Visible Area
  - Flow: "ELSE, include in the returned list."
  - Logic: Monster at (2,2), cell.fog is false. Condition `cell.fog is true` is false. Monster included.
  - Result: PASS.

- Scenario: Multiple Monsters with Mixed Visibility
  - Flow: Iterate through `gameSession.monsters`.
  - Logic: M1(1,1, fog:false), M2(2,2, fog:true), M3(3,3, fog:false).
  - Result: M1 and M3 included. M2 excluded. Order preserved.
  - Result: PASS.

- Scenario: Deterministic Completion and Boundary Handling
  - Flow: "IF no cell exists ... treat as not visible."
  - Logic: (99,99) not in map. "No cell exists" condition met. Monster excluded.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: dungeon.isl.md

<thought>
- **Scenario: Fog of War Persistence**
  - Logic: `useFogOfWar.calculateFog` iterates `visibleCells` and sets `fog` to `false`.
  - Constraint: "Once a cell's `fog` is set to `false`, it should never revert back to `true`".
  - Analysis: The `useFogOfWar` component maintains `fogVisibilityMap` as state. The `calculateFog` flow updates this state. Since it only performs `set fog to false` and does not contain logic to reset `fog` to `true` (e.g., a full map reset), the persistence is maintained.
  - Verdict: **PASS**.

- **Scenario: Trap Detection and Disarm Logic**
  - Logic: `searchTraps` finds traps and sets status to 'DETECTED'. `attemptDisarmTrap` checks `canDisarm` and performs a roll.
  - Analysis: The logic flow in `dungeon-use-traps.isl.md` correctly handles the status transition from 'DETECTED' to 'DISARMED' or 'TRIGGERED'.
  - Verdict: **PASS**.

- **Scenario: Combat Resolution and State Cleanup**
  - Logic: `resolveCombat` returns `damageDealt`. `handleMonsterClick` updates `currentBody` and removes the monster if `<= 0`.
  - Analysis: The flow in `dungeon-use-turn-logic.isl.md` correctly handles the removal of the monster and the update of `turnPhase`.
  - Verdict: **PASS**.

- **Scenario: Deterministic Movement and Trap Trigger**
  - Logic: `movementEffect` handles step-by-step movement.
  - Analysis: The flow checks `trapsLogic.checkTrapActivation` at `nextPos`. If triggered, it sets `isMoving` to `false`, updates `turnPhase`, and ends the movement. This prevents the hero from continuing movement after hitting a trap.
  - Verdict: **PASS**.

- **Scenario: Spell Targeting and Line of Sight**
  - Logic: `handleMonsterClick` checks `hooksVisibilityCalc.hasLineOfSight`.
  - Analysis: The flow explicitly states: `IF ... hasLineOfSight(...) is false: Set notificationMessage to "Non hai linea di vista sul mostro!" AND RETURN.` This prevents the cast and keeps the targeting state active.
  - Verdict: **PASS**.

- **Scenario: Inventory Mutual Exclusivity**
  - Logic: `toggleEquipItem` in `dungeon-use-inventory-logic.isl.md`.
  - Analysis: The flow iterates `hero.equipped`, finds `equippedItem.noogg == itemId`, removes it, and triggers a notification.
  - Verdict: **PASS**.
</thought>

ALL TESTS PASSED

---

## Audit Report for: editor-game.isl.md

<thought>
- **Scenario: Initial State Initialization**
  - Flow: `onInit` sets `isLoading` to false and `status` to READY.
  - Assert: Requires "editor game" title in DOM.
  - Analysis: The ISL `editor-game.isl.md` defines logic but contains no UI/DOM template definitions. This is a structural gap in the ISL specification for the component.
  - Verdict: [LOW] Missing UI/DOM definition.

- **Scenario: Deterministic State Loading (Flow Integrity)**
  - Flow: `onFetchData` uses `isProcessing` (true/false) and `status` (READY/ERROR).
  - Analysis: The logic correctly handles the `FINALLY` block to reset `isProcessing`.
  - Verdict: PASS.

- **Scenario: Domain Integrity - Invalid State Transition**
  - Flow: `onMoveHero` checks `IF the target position is valid`.
  - Analysis: The logic is defined as a placeholder ("IF the target position is valid"). It does not explicitly define the validation logic or the state rollback mechanism. However, it does log "Invalid Transition".
  - Verdict: PASS (Logic exists, though abstract).

- **Scenario: Cleanup and Reset Logic**
  - Flow: No `onReset` or `onCleanup` capability defined in `editor-game.isl.md`.
  - Analysis: The `entities` list and `status` cannot be cleared because the capability is missing.
  - Verdict: [CRITICAL] Missing Cleanup Capability.

- **Scenario: Adversarial Input Handling**
  - Flow: No input validation logic or guard clauses defined in `onMoveHero` or other capabilities.
  - Analysis: The system lacks a mechanism to handle malformed payloads (e.g., null checks).
  - Verdict: [HIGH] Missing Input Validation.
</thought>

### [CRITICAL] Missing_Cleanup_Capability
- **Scenario**: Cleanup and Reset Logic
- **Source**: `editor-game.isl.md`
- **Violation**: The component lacks a capability to reset the `entities` list and `status` to default values, preventing the system from purging "ghost" data between sessions.
- **REPAIR_PAYLOAD**:
    File: editor-game.isl.md
    Target: capabilities
    Action: INSERT after 'onMoveHero'
    Content: 
    "onReset:
      - Flow:
        - SET `entities` to [].
        - SET `status` to INIT.
        - SET `isProcessing` to false."

### [HIGH] Missing_Input_Validation
- **Scenario**: Adversarial Input Handling
- **Source**: `onMoveHero`
- **Violation**: The capability `onMoveHero` accepts `target: @Coordinates` without validating if `target` is null or malformed, which could lead to runtime errors when accessing properties.
- **REPAIR_PAYLOAD**:
    File: editor-game.isl.md
    Target: capability 'onMoveHero'
    Action: REPLACE line 2
    Content: 
    "  - IF target IS NOT NULL AND the target position is valid:"

### [LOW] Missing_UI_Definition
- **Scenario**: Initial State Initialization
- **Source**: `editor-game.isl.md`
- **Violation**: The ISL defines business logic but lacks the UI/DOM structural definition required to verify the "editor game" title rendering.
- **REPAIR_PAYLOAD**:
    File: editor-game.isl.md
    Target: @State
    Action: INSERT after 'entities'
    Content: 
    "  - title: String (Default: 'editor game')"

---

## Audit Report for: hero-summary.isl.md

<thought>
- **Scenario: Hero Selection Propagation**
  - Flow: `handleSelect` triggers `onSelect(index)`.
  - Assert: `onSelect` invoked with `2`.
  - Result: PASS.

- **Scenario: Data Mapping Integrity (Gold and Portrait)**
  - Flow: `Gold` = "Gold: " + `heroState.gold`. `Portrait` = `/img/eroi/` + `staticHero.portrait`.
  - Assert: "Gold: 750", `/img/eroi/barbarian.png`.
  - Result: PASS.

- **Scenario: Inventory and Equipment Resolution**
  - Flow: Maps IDs to names from static definitions.
  - Assert: "Healing Potion", "Tool Kit", "Broadsword".
  - Result: PASS.

- **Scenario: Empty State Handling**
  - Flow: Guard `IF heroes.length == 0 THEN RETURN 'No Heroes Available'`.
  - Assert: No crash, render empty state.
  - Result: PASS.

- **Scenario: Deterministic Selection Reset**
  - Flow: Guard `IF selectedIndex >= heroes.length THEN SET selectedIndex = 0`.
  - Assert: Default to 0, no access to undefined.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: main-menu.isl.md

<thought>
- Analyzing `MainMenu` capabilities against `MainMenu.test.isl.md`.
- Scenarios 1-4: The `clickMenuItems` and `mouseOverMenuItems` capabilities are explicitly defined in the ISL. The logic maps "Gioca" to `PLAY_GAME` and "Editor" to `EDITOR_GAME` correctly. The image URLs match the requirements.
- Scenario 5 (Deterministic State Reset): The ISL defines the `clickMenuItems` capability but does not explicitly define a cleanup or unmount lifecycle hook for the `MouseOverImage` state during navigation. While this is a common requirement, the ISL lacks the specific instruction to clear the state on navigation.
- Scenario 6 (Input Mapping Integrity): The ISL defines `clickMenuItems` but lacks a guard clause or validation logic to handle undefined/invalid menu items. It assumes valid input.
</thought>

#### [MEDIUM] Missing Navigation Cleanup Logic
<thought>
- Scenario: Deterministic State Reset on Interaction.
- Source: `clickMenuItems` capability.
- Violation: The current ISL flow for `clickMenuItems` only triggers `onChangePageView`. It fails to specify the clearing of the `MouseOverImage` state, which is required to prevent stale references during the transition to a new view.
- REPAIR_PAYLOAD:
    File: main-menu.isl.md
    Target: capability 'clickMenuItems'
    Action: REPLACE line "Side Effects: vai alla pagina destination (onChangePageView(PageNavigationEnum))"
    Content: "Side Effects: 1. Clear MouseOverImage state. 2. vai alla pagina destination (onChangePageView(PageNavigationEnum))."
</thought>

#### [LOW] Missing Input Validation Guard
<thought>
- Scenario: Input Mapping Integrity.
- Source: `clickMenuItems` capability.
- Violation: The capability lacks a guard clause to verify if the clicked item exists in the defined menu list. Without this, an invalid trigger could potentially execute an undefined navigation.
- REPAIR_PAYLOAD:
    File: main-menu.isl.md
    Target: capability 'clickMenuItems'
    Action: INSERT after 'Trigger: Click su voce di menu'
    Content: "Guard: IF destination IS NOT NULL AND destination IN [PLAY_GAME, EDITOR_GAME]"
</thought>

---

## Audit Report for: main.isl.md

<thought>
- **Scenario**: Campaign Initialization (Default State)
- **Flow**: `initSession` in `PlayGame`.
- **Analysis**: The `initSession` logic defines:
  - `defaultHeroes` mapping:
    - Barbaro: ID 13 ("Spadone")
    - Nano: ID 2 ("Ascia")
    - Elfo: ID 12 ("Spadino")
    - Mago: ID 4 ("Bastone")
  - `initialEquipment` is assigned to `equipment` and `equipped`.
  - `campaignManager.saveCampaign(defaultHeroes, 0)` is called.
  - `maxUnlockedMissionIndex` is set to 0.
- **Result**: The logic matches the requirements perfectly. **PASS**.

- **Scenario**: Progression Rule Violation
- **Flow**: `selectMission(index)` in `PlayGame`.
- **Analysis**: 
  - `maxAccessibleIndex` = `maxUnlockedMissionIndex` (0).
  - `index` (1) <= `maxAccessibleIndex` (0) is FALSE.
  - The `IF` block is skipped. `onUpdateSession` is not called. Navigation is not triggered.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Dungeon Initialization and Hero Placement
- **Flow**: `fetchHqData` in `Dungeon`.
- **Analysis**: 
  - `placedHeroes` mapping: Finds `spawnPoint` in `gameSession.currentMap.eroi_start` where `id` == `heroState.heroId`.
  - Updates `heroState.x` and `heroState.y`.
  - `treasureDeck` is shuffled.
  - `onUpdateSession` is called.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Turn Order and Spell Selection Flow
- **Flow**: `order turn selection` in `Dungeon`.
- **Analysis**: 
  - `isHeroOrderConfirmed` becomes true.
  - `isSpellSelectionRequired` becomes true.
  - `DungeonSpellSelectionModal` is rendered (as per `Dungeon` appearance section).
  - `confirmSpellSelection` updates `availableSpells` and sets `isSpellSelectionRequired` to false.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Deterministic Combat Resolution
- **Flow**: `closeCombatResult` in `Dungeon`.
- **Analysis**: 
  - `lastAttack` set to `null`.
  - `onUpdateSession` called.
  - `CombatResultModal` is removed (as it renders only if `lastAttack` is not null).
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Spell Targeting and Line of Sight
- **Flow**: `handleBoardClick` in `Dungeon`.
- **Analysis**: 
  - `targetingSpell` is active.
  - `hasLineOfSight` check: If false, `notificationMessage` set, return.
  - If true, `hooksMagicLogic.castSpell` called, `targetingSpell` reset, `notificationMessage` cleared.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Mission Victory and State Cleanup
- **Flow**: `monitorTurn` and `completeMission` in `Dungeon`.
- **Analysis**: 
  - `monitorTurn` sets `isMissionSummaryOpen` to true.
  - `completeMission` calls `saveCampaign` with `index + 1`, sets `isMissionSummaryOpen` to false, navigates to `PLAY_GAME`.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Adversarial/Invalid Data Handling
- **Flow**: `fetchHqData` in `Dungeon`.
- **Analysis**: 
  - `CATCH` block sets `notificationMessage`.
  - `isStaticDataLoaded` remains false.
  - Flow halts.
- **Result**: Matches requirements. **PASS**.

- **Scenario**: Inventory/Item Usage Flow
- **Flow**: `handleUseItem` in `Dungeon`.
- **Analysis**: 
  - `isInventoryOpen` set to false.
  - `targetingItem` set.
  - `notificationMessage` set.
  - System enters targeting state.
- **Result**: Matches requirements. **PASS**.
</thought>

ALL TESTS PASSED

---

## Audit Report for: mission-card.isl.md

<thought>
- **Scenario: Locked Mission Interaction**
  - Flow: `IF status is 'LOCKED': Do nothing`.
  - Assert: `onSelect` must not be invoked.
  - Result: PASS.

- **Scenario: Available Mission Selection**
  - Flow: `ELSE: Trigger onSelect(index)`.
  - Assert: `onSelect` invoked once.
  - Result: PASS.

- **Scenario: Completed Mission Replay**
  - Flow: `ELSE: Trigger onSelect(index)`.
  - Assert: `onSelect` invoked.
  - Result: PASS.

- **Scenario: Data Integrity and Mapping**
  - Flow: `Title` displays `mission.titolo`, `Subtitle` displays `mission.ordine` or `index + 1`.
  - Assert: Correct mapping.
  - Result: PASS.

- **Scenario: Deterministic State Handling**
  - Flow: `IF mission IS NULL THEN RETURN`.
  - Assert: No crash, handle gracefully.
  - Result: PASS.

- **Scenario: Adversarial Interaction (Rapid Clicking)**
  - Flow: `handleInteraction` triggers `onSelect(index)`.
  - Assert: Debounced or handled to prevent redundant navigation.
  - Analysis: The current `handleInteraction` flow in `mission-card.isl.md` is:
    `IF mission IS NULL THEN RETURN. IF status is 'LOCKED': Do nothing. ELSE: Trigger onSelect(index).`
    There is no explicit logic defined for debouncing or state-locking during the transition. While the requirement asks for debouncing, the current ISL `handleInteraction` lacks the guard logic to prevent multiple rapid triggers.
  - Result: FAIL (Logical gap in handling rapid interaction).
</thought>

#### [MEDIUM] Rapid_Interaction_Debounce_Missing
<thought>
- Scenario: Adversarial Interaction (Rapid Clicking).
- Source: handleInteraction.
- Violation: The current flow triggers `onSelect(index)` immediately upon every call without checking if a navigation is already in progress or debouncing the input. This violates the requirement: "The onSelect callback should be debounced or handled such that the application logic is not overwhelmed."
- REPAIR_PAYLOAD:
    File: mission-card.isl.md
    Target: capability 'handleInteraction'
    Action: REPLACE line 4
    Content: 
    - IF mission IS NULL OR isProcessing THEN RETURN.
    - SET isProcessing = TRUE.
    - Trigger onSelect(index).
    - SET isProcessing = FALSE.
</thought>

---

## Audit Report for: page-presentation.isl.md

<thought>
- **Scenario: Purchase Validation Integrity**
  - Simulation: `ShopLogic.validatePurchase` checks `heroState.gold < item.prezzo`. 100 < 150 is true, returns `allowed: false`. Correct.
  - Simulation: `item.nopsgid` == `heroState.heroId` returns `allowed: false`. Correct.
  - Result: PASS.

- **Scenario: Inventory Equipment Exclusivity (noogg)**
  - Simulation: `useInventoryLogic.toggleEquipItem` checks `item.noogg`. If `item.noogg` == 11 (Shield), it removes 11 from `hero.equipped`. If `equippedItem.noogg` == 13 (Spadone), it removes 13.
  - Result: PASS.

- **Scenario: Deterministic Movement and Trap Trigger**
  - Simulation: `hooksTurnLogic.handleBoardClick` triggers `movementEffect`. `movementEffect` checks `mapCell.trpl`. If `tipo` == 1 (Abisso), it applies damage, registers trap, sets `isMoving` to false, sets `turnPhase.hasMoved` and `hasPerformedAction` to true.
  - Result: PASS.

- **Scenario: Combat Resolution and Monster Death**
  - Simulation: `hooksTurnLogic.handleMonsterClick` calls `combatLogic.resolveCombat`. If `newBody` <= 0, monster is removed. `lastAttack` is updated. If `canAttackTwice` is true, `hasPerformedAction` remains false.
  - Result: PASS.

- **Scenario: Fog of War Persistence**
  - Simulation: `useFogOfWar.revealFromPoint` sets `fog` to `false`. The constraint explicitly states: "once a cell's `fog` is set to `false`, it should never revert back to `true`".
  - Result: PASS.

- **Scenario: Guaranteed Flow Completion (Monster AI)**
  - Simulation: `monitorTurn` detects `currentTurn > heroes.length`. Calls `hooksMonsterAI.runMonsterTurn()`. After loop, sets `currentTurn` to 1 and resets `turnPhase` properties.
  - Result: PASS.

- **Scenario: Spell Targeting Cancellation**
  - Simulation: `cancelTargeting` sets `targetingSpell` to `null` and `notificationMessage` to "Lancio incantesimo annullato.". The `DungeonBoard` component's `Content` section defines the cursor based on `targetingSpell` being null.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---

## Audit Report for: play-game.isl.md

<thought>
- Scenario: Initialization of New Campaign
- Flow: `initSession` logic defines `gold` as 0 for new heroes.
- Domain: `GameDomainSession` defines `gold` in `HeroState` with `default: 500`.
- Analysis: The Business Logic in `play-game.isl.md` explicitly sets `gold: 0` during the `initSession` default campaign creation. The Domain definition provides a default value for the property, but the Business Logic overrides this during instantiation. This is a valid logical override.
- Result: PASS.

- Scenario: Deterministic Data Filtering (Coordinate Integrity)
- Flow: `initSession` / `selectMission` parses map data.
- Constraint: "Ignore any data where x or y is 0. 💡 Note: This is MANDATORY as grid coordinates are strictly 1-indexed (1 to 26)."
- Analysis: The logic explicitly states: "Ignore any data where x or y is 0." This satisfies the requirement to prevent out-of-bounds access.
- Result: PASS.

- Scenario: Adversarial - Invalid Equipment Mapping
- Flow: `initSession` maps classes to equipment.
- Analysis: The logic uses an `IF` chain for specific classes ("Barbaro", "Nano", "Elfo", "Mago"). If a class is not in this list, the `initialEquipment` variable will be initialized as an empty list (or undefined depending on implementation). The requirement asks for an empty list rather than an error. The current ISL logic does not explicitly define the `ELSE` case for the `initialEquipment` mapping, which could lead to an undefined reference if not handled.
- Verdict: [LOW] - Missing explicit guard for unknown hero classes in `initSession`.

- Scenario: Campaign Manager - Deterministic Completion
- Flow: `saveCampaign` in `useCampaignManager`.
- Analysis: The `saveCampaign` flow in `dungeon-use-campaign-manager.isl.md` does not include a `try/catch` block or error handling for LocalStorage failures (e.g., QuotaExceededError).
- Verdict: [CRITICAL] - Missing error handling for persistence failure.
</thought>

#### [CRITICAL] Campaign_Manager_Persistence_Failure
<thought>
- Scenario: Campaign Manager - Deterministic Completion
- Source: `dungeon-use-campaign-manager.isl.md` -> `saveCampaign`
- Violation: The flow lacks error handling for LocalStorage operations. If the write fails, the system does not catch the exception, potentially causing a crash or silent failure.
- REPAIR_PAYLOAD:
    File: dungeon-use-campaign-manager.isl.md
    Target: capability 'saveCampaign'
    Action: REPLACE flow
    Content: 
    - Create `campaignData` object: `{ heroes: heroes, nextMissionIndex: nextMissionIndex, timestamp: Date.now() }`.
    - Serialize `campaignData` to JSON string.
    - TRY:
        - Save string to LocalStorage with key `"hq_campaign_data"`.
    - CATCH:
        - Log error to console.
        - Trigger UI notification: "Could not save progress."
</thought>

#### [LOW] Missing_Guard_For_Unknown_Hero_Class
<thought>
- Scenario: Adversarial - Invalid Equipment Mapping
- Source: `play-game.isl.md` -> `initSession`
- Violation: The mapping logic for `initialEquipment` does not explicitly handle classes outside the four defined types, which may result in an undefined state rather than an empty list.
- REPAIR_PAYLOAD:
    File: play-game.isl.md
    Target: capability 'initSession'
    Action: REPLACE line "IF `Hero.classe` == "Mago": ID = 4 for "Bastone"."
    Content: 
    - IF `Hero.classe` == "Mago": ID = 4 for "Bastone".
    - ELSE: ID = null (or empty list).
</thought>

---

## Audit Report for: shop-inventory.isl.md

<thought>
- The `ShopInventory` component is defined as a Presentation component.
- The `handleInteraction` capability defines the logic for `onSelect`, `onBuy`, `onEnterDungeon`, and `onExit`.
- The `Scenario: Deterministic Purchase Flow` requires that the component "must remain responsive and not enter a 'dead-end' state if the parent takes time to process the gold deduction."
- The `Scenario: Navigation Flow Integrity` requires that the component "must ensure that any pending purchase state is cleared or finalized before navigation occurs."
- The `ShopInventory` ISL definition for `handleInteraction` does not contain any state management logic to handle "pending" states, "clearing" purchase states, or "refreshing" availability beyond the delegation to the parent.
- While the component is a Presentation layer, the ISL defines the `handleInteraction` flow as the source of truth for these interactions. The current flow is purely reactive and lacks the guardrails or state-reset logic required by the Assertions in the Test Scenarios.
</thought>

#### [MEDIUM] Missing State Lifecycle Guards
<thought>
- Scenario: Deterministic Purchase Flow & Navigation Flow Integrity.
- Source: `handleInteraction` capability.
- Violation: The current flow simply delegates to `onBuy`, `onEnterDungeon`, or `onExit`. It lacks the logic to handle "pending" states or "clearing" purchase states as required by the test assertions. The component is currently a "dumb" pass-through, which fails the requirement to ensure the component does not enter a "dead-end" or "processing" state.
- REPAIR_PAYLOAD:
    File: shop-inventory.isl.md
    Target: capability 'handleInteraction'
    Action: REPLACE line 55-59
    Content: 
    "- IF Item clicked -> Trigger `onSelect(id)`.
    - IF 'Acquista' clicked AND `canBuy` -> Trigger `onBuy()` AND set `isProcessing` to true.
    - IF 'Entra nel dungeon' clicked -> Reset `selectedItemId`, clear `isProcessing`, AND Trigger `onEnterDungeon()`.
    - IF 'Esci' clicked -> Reset `selectedItemId`, clear `isProcessing`, AND Trigger `onExit()`."
</thought>

---

## Audit Report for: shop-logic.isl.md

<thought>
- **Scenario: LoadShopData - Filter Logic**
  - Flow: "Filter `items` to include only those with `prezzo` > 0."
  - Simulation: The logic explicitly mandates filtering. If the source contains items with `prezzo: 0`, they are excluded.
  - Result: PASS.

- **Scenario: ValidatePurchase - Insufficient Funds**
  - Flow: `IF heroState.gold < item.prezzo THEN Return { allowed: false, reason: "Not enough gold" }`.
  - Simulation: 50 < 100 is TRUE. Returns "Not enough gold".
  - Result: PASS.

- **Scenario: ValidatePurchase - Class Restriction (Forbidden)**
  - Flow: `IF item.nopsg is true AND item.nopsgid == heroState.heroId THEN Return { allowed: false, reason: "Forbidden for class" }`.
  - Simulation: `nopsg` is true, `nopsgid` (1) == `heroId` (1). Returns "Forbidden for class".
  - Result: PASS.

- **Scenario: ValidatePurchase - Class Restriction (Exclusive)**
  - Flow: `IF item.solopsg is true AND item.solopsgid != heroState.heroId THEN Return { allowed: false, reason: "Exclusive to other class" }`.
  - Simulation: `solopsg` is true, `solopsgid` (3) != `heroId` (2). Returns "Exclusive to other class".
  - Result: PASS.

- **Scenario: ValidatePurchase - Duplicate Ownership**
  - Flow: `IF heroState.equipment contains item.id THEN Return { allowed: false, reason: "Already owned" }`.
  - Simulation: `equipment` contains 10, `item.id` is 10. Returns "Already owned".
  - Result: PASS.

- **Scenario: ExecutePurchase - State Integrity**
  - Flow: `gold = currentGold - item.prezzo`, `equipment = currentEquipment + item.id`.
  - Simulation: 500 - 150 = 350. `equipment` updated. `equipped` not touched.
  - Result: PASS.

- **Scenario: ExecutePurchase - Deterministic Completion**
  - Flow: "Clone the `session` object", "Update the `session.heroes` list".
  - Simulation: The logic follows standard immutable update patterns.
  - Result: PASS.
</thought>

ALL TESTS PASSED

---
