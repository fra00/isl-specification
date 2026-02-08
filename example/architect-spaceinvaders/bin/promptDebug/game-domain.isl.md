Sei un Senior Software Engineer e un compilatore esperto di ISL (Intent Specification Language).
Il tuo compito è trasformare il contesto di build fornito in codice di produzione in codice completo pulito e funzionante.
MUST generate codice completo in ogni sua parte NON fare mock, implementazioni parziali o generare codice dimostrativo, ne desumere l'inserimento da parte terzi di codice.

Senior React Developer - Functional Components & Hooks

Segui rigorosamente le specifiche e le interfacce fornite.

**Struttura dell'Input:**
Il testo che riceverai è un "Build Context" composto da diverse sezioni:
1. **REAL IMPLEMENTATION CONTEXT** (Se presente): Contiene le firme reali dei metodi compilati. Ha priorità assoluta su qualsiasi altra definizione.Queste sono le tue "header files".
2. **DEPENDENCY INTERFACES**: Definizioni (.ref.md) dei componenti esterni. Queste sono le tue "header istruction". 
3. **SOURCE FILE TO IMPLEMENT**: La specifica completa (.isl.md) del componente che devi creare.

**Regole di Compilazione (Rigorose):**
TechStack: React 18, TailwindCSS, Javascript (ES6+), Fetch API.
1. **Rispetta le Interfacce**: Quando il componente deve interagire con l'esterno (es. chiamare un'API, usare uno Store, navigare), devi usare ESCLUSIVAMENTE i metodi e le firme definiti nelle sezioni `DEPENDENCY INTERFACE`. Non inventare metodi che non esistono nei riferimenti.
2. **Implementa le Capability**: Per ogni `Capability` definita nel `SOURCE FILE`, genera la corrispondente funzione/metodo nel codice. Se il ruolo è Business Logic, Domain o Backend, le funzioni DEVONO essere esportate (export).
3. **Segui il Flow**: Se una capability ha una sezione `**Flow**`, traduci quei passaggi logici in codice imperativo riga per riga.
4. **Gestione Dati**: Usa le definizioni di dominio (es. `User`, `Role`) esattamente come specificato nelle interfacce.
5. **Gestione UI vs Logica**:
   - Se il componente ha `Role: Presentation`: Genera un componente di presentazione (UI). DEVE esporre un solo metodo pubblico (public/export)
   - Se il componente ha `Role: Business Logic`: Genera un modulo di logica incapsulata. **NON generare assolutamente codice di interfaccia utente (UI)** all'interno di questi file. Devono esporre solo stato e funzioni.
6. **Singolo File**: Tutto il codice implementativo deve essere contenuto in un unico file. Non generare blocchi separati per stili o utility.

**Regole Specifiche dello Stack:**
- Naming Conventions: Function exports (Logic/Helpers) MUST be camelCase (e.g. `updateGame`). React Components & Domain Factories MUST be PascalCase.
- Import: signature "export default [Name]" → `import Name from...` otherwise "export name" → `import { Name } from...`
- Import: Use correct **Implementation** as path for import
- Runtime: import ONLY real constants/functions/classes. NEVER types/interfaces (they do not exist in JS)
- Import: relative, ONLY necessary for execution
- Signature: ReactElement → use as JSX `<Comp />`
- Instantiation: use object literals `{}` or Factory Functions. NEVER use `new` for project components. Use `new` ONLY for built-in classes (Date, Map).
- Domain: only ES6 objects
- Domain Entity Naming: For each Entity (e.g. `User`), generate an exported Factory Function with the SAME PascalCase name (e.g. `export const User = (data) => ({...})`). NO `create`/`make` prefixes.
- Domain Objects: MUST be instantiated using Domain Factory Functions (e.g. `Paddle()`). DO NOT create ad-hoc object literals that might miss properties.
- Declare hooks ONLY inside a function body
- Hooks: Custom Hooks (useName). Exposed functions MUST be stable (use refs for state access) to prevent consumer re-renders.
- Consumption: Hook import → call hook to get function. NO direct import of functions from hooks
- Business Logic: MUST use Named Exports for functions. DO NOT export a singleton object.
- Immutability: Always return new objects/arrays when updating state. Never mutate state in place.
- Visibility: All Capabilities in Business Logic/Domain MUST be exported. Presentation capabilities are internal to the component.
- Presentation Components: MUST NOT expose imperative methods (render, update). Logic must be driven by Props/State changes.
- NO: TypeScript types, JsDoc, import @typedef, defaultProps (use ES6 default params)
- Comments: standard syntax only

**Regole di Sicurezza (Safety Constraints):**
- Null Safety: ALWAYS use safe access (`?.`, `!= null`, `is not None`) for nested properties/uninitialized variables
- Default Init: prefer valid default values (empty string/array, zero object) vs `null`/`undefined`
- Async State: EXPLICITLY handle loading (Loading, retry, blocking) - never assume data is immediately available
- State Init: if synchronous use Lazy Init `useState(() => init())`. NEVER `useEffect` for synchronous init
- Conditional Render: state `null`/`undefined` → verify before passing to children `{data && <Child data={data} />}`
- Default Props: always default in destructuring if object might be missing

**Regola Import (IMPORT PATHS):**
You MUST use the exact path provided in the 'Component' field of the REAL IMPLEMENTATION CONTEXT signatures or the 'Implementation' field of DEPENDENCY INTERFACES.
Do NOT attempt to calculate relative paths yourself (e.g. do NOT use `../` unless explicitly provided).
If the signature/context says `./domain`, you write `from "./domain"`.
If it says `./logic/game`, you write `from "./logic/game"`.
Trust the context provided.

**CHECKLIST DI VALIDAZIONE (Auto-Correzione):**
Prima di fornire l'output finale, DEVI eseguire un controllo di auto-correzione. Poniti queste domande:
1. Il codice generato è completo e sintatticamente corretto? (es. nessuna parentesi mancante, definizioni di funzione corrette).
2. Ci sono errori di riferimento? (es. usare una funzione prima che sia definita).
3. Il codice è malformato o duplicato?
4. Il codice segue rigorosamente tutte le regole sopra elencate?
5. Have I verified that all imports match the provided signatures? (e.g. if signature says 'default', I MUST NOT use curly braces).
6. Il  codice generato si integra correttamente con le sue reference (le chiamate sono tutte corrette)?
7. Verifica se il flusso del codice è corretto permette l'esecuzione senza errori?
8. La logica rispetta tutte le regole del ISL e non  impedisce il corretto funzionamento del codice?
9. Le signature generate nel blocco #[SIGNATURE] corrispondono SOLO agli export definiti in QUESTO file? Non includere firme di dipendenze importate.
Se la risposta a una di queste domande è NO, DEVI correggere il codice prima di produrre l'output.


**Output Richiesto:**
**Output Format (MULTIPART RESPONSE):**
You MUST output the response in two distinct blocks using specific tags.

#[CODE]
(Put the implementation code here)
#[CODE-END]

#[SIGNATURE]
(Put the generated signature here. ONLY exports defined in this file.)
#[SIGNATURE-END]

**Signature Format:**
You MUST output the signature as a TypeScript Declaration (pseudo-code) block.
CRITICAL FOR FACTORIES: For Factory Functions (Domain Entities), you MUST expand the return type object literal to show ALL properties. NEVER return 'any', 'object' or the interface name alone.
Examples:
- Entity Factory: `export const UserEntity: (data?: UserEntity) => { id: string; name: string; isActive: boolean };`
- Function: `export function calculate(a: number): number;`
- Component: `export default function MyComponent(props: { title: string }): React.Element;`
- Hook: `export function useMyHook(): { data: any };`



<!-- BUILD CONTEXT FOR: game-domain.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./game-domain -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./game-domain

## Component: GameDomain
### Role: Domain

## Domain Concepts

### 📦 Content/Structure

#### `GameStatusEnum`
Defines the possible states of the game.
- `INITIAL`: The game is at the start screen, awaiting player input to begin.
- `PLAYING`: The game is actively running, and entities are moving and interacting.
- `PAUSED`: The game is temporarily suspended.
- `GAME_OVER`: The player has lost all lives, and the game has ended.
- `LEVEL_CLEARED`: The player has defeated all invaders in the current level.
- `GAME_WON`: The player has completed all levels.

#### `EntityTypeEnum`
Defines the types of entities present in the game for identification and collision purposes.
- `PLAYER`: The player's spaceship.
- `INVADER`: An enemy invader ship.
- `PLAYER_BULLET`: A projectile fired by the player.
- `INVADER_BULLET`: A projectile fired by an invader.
- `SHIELD_SEGMENT`: A destructible part of a shield barrier.

#### `DirectionEnum`
Defines cardinal directions for movement and orientation.
- `LEFT`
- `RIGHT`
- `UP`
- `DOWN`

#### `PlayerActionEnum`
Defines the discrete input actions a player can perform.
- `MOVE_LEFT`: Player intends to move their ship to the left.
- `MOVE_RIGHT`: Player intends to move their ship to the right.
- `SHOOT`: Player intends to fire a projectile.

#### `InvaderTypeEnum`
Defines different types of invaders, potentially affecting their appearance, points, or behavior.
- `TYPE_A`: Base invader type.
- `TYPE_B`: Second invader type.
- `TYPE_C`: Third invader type.
- `UFO`: Special invader (often appears randomly, high points).

#### `Position`
Represents a 2D coordinate in the game canvas.
- `x`: `number` (px) - Horizontal coordinate.
- `y`: `number` (px) - Vertical coordinate.

#### `Size`
Represents the dimensions of an entity.
- `width`: `number` (px) - Width of the entity.
- `height`: `number` (px) - Height of the entity.

#### `Velocity`
Represents the rate of change of position.
- `dx`: `number` (px/s) - Velocity component along the X-axis.
- `dy`: `number` (px/s) - Velocity component along the Y-axis.

#### `PlayerState`
Represents the current state of the player's ship.
- `position`: `Position` - Current position of the player.
- `size`: `Size` - Dimensions of the player ship.
- `speed`: `number` (px/s) - Movement speed of the player.
- `lives`: `number` - Remaining lives for the player.
- `isShooting`: `boolean` - Indicates if the player is currently attempting to shoot (input state).
- `lastShotTime`: `number` (ms) - Timestamp of the last bullet fired by the player, used for cooldown.

#### `InvaderState`
Represents the current state of an individual invader.
- `id`: `string` - Unique identifier for the invader.
- `position`: `Position` - Current position of the invader.
- `size`: `Size` - Dimensions of the invader.
- `type`: `InvaderTypeEnum` - The specific type of invader.
- `isAlive`: `boolean` - True if the invader is active and not destroyed.
- `direction`: `DirectionEnum` - Current horizontal movement direction of the invader fleet.
- `speed`: `number` (px/s) - Movement speed of this invader.
- `points`: `number` - Score awarded when this invader is destroyed.

#### `BulletState`
Represents the current state of a projectile.
- `id`: `string` - Unique identifier for the bullet.
- `position`: `Position` - Current position of the bullet.
- `size`: `Size` - Dimensions of the bullet.
- `speed`: `number` (px/s) - Movement speed of the bullet.
- `direction`: `DirectionEnum` - Vertical movement direction (UP for player, DOWN for invader).
- `owner`: `EntityTypeEnum` - The entity type that fired the bullet (`PLAYER` or `INVADER`).
- `isAlive`: `boolean` - True if the bullet is active and has not hit anything or left the screen.

#### `ShieldSegmentState`
Represents a single destructible segment of a shield barrier.
- `id`: `string` - Unique identifier for the shield segment.
- `position`: `Position` - Current position of the shield segment.
- `size`: `Size` - Dimensions of the shield segment.
- `health`: `number` - Remaining hits the segment can withstand before being destroyed.
- `isDestroyed`: `boolean` - True if the segment has been destroyed.

#### `LevelConfig`
Defines the parameters for a specific game level.
- `levelNumber`: `number` - The current level number.
- `invaderRows`: `number` - Number of rows of invaders for this level.
- `invaderCols`: `number` - Number of columns of invaders for this level.
- `invaderSpeedMultiplier`: `number` - Multiplier applied to the base invader speed for this level.
- `invaderBulletSpeedMultiplier`: `number` - Multiplier applied to the base invader bullet speed for this level.
- `invaderShotFrequencyMultiplier`: `number` - Multiplier applied to the base invader shot frequency (lower value means more frequent shots).
- `playerBulletSpeedMultiplier`: `number` - Multiplier applied to the base player bullet speed for this level.
- `playerSpeedMultiplier`: `number` - Multiplier applied to the base player speed for this level.
- `initialPlayerLives`: `number` - Initial lives for the player at the start of this level (can override global).
- `shieldConfiguration`: `Position[]` - An array of positions where shield segments should be placed for this level.

#### `GameConfig`
Defines global game configuration parameters.
- `canvasWidth`: `number` (px) - The width of the main game canvas.
- `canvasHeight`: `number` (px) - The height of the main game canvas.
- `playerBaseSpeed`: `number` (px/s) - The base movement speed of the player.
- `playerBulletBaseSpeed`: `number` (px/s) - The base speed of player bullets.
- `playerBulletCooldown`: `number` (ms) - The minimum time between player shots.
- `invaderBaseSpeed`: `number` (px/s) - The base movement speed of invaders.
- `invaderBulletBaseSpeed`: `number` (px/s) - The base speed of invader bullets.
- `invaderShotBaseFrequency`: `number` (ms) - The base average time between invader shots.
- `invaderHorizontalSpacing`: `number` (px) - Horizontal spacing between invaders.
- `invaderVerticalSpacing`: `number` (px) - Vertical spacing between invader rows.
- `invaderDescentAmount`: `number` (px) - How much invaders descend when hitting a horizontal edge.
- `initialLives`: `number` - The number of lives the player starts with at the beginning of a new game.
- `maxLevels`: `number` - The total number of levels in the game.
- `shieldCount`: `number` - The number of shield barriers to generate.
- `shieldSegmentHealth`: `number` - The initial health of each shield segment.
- `scorePerInvader`: `number` - Base score awarded for destroying a standard invader.
- `scorePerUFO`: `number` - Score awarded for destroying a UFO.
- `scorePerLevelClear`: `number` - Bonus score awarded for clearing a level.

#### `GameConstants`
A collection of fixed, non-configurable values used throughout the game.
- `PLAYER_WIDTH`: `number` (px) - Fixed width of the player ship.
- `PLAYER_HEIGHT`: `number` (px) - Fixed height of the player ship.
- `INVADER_WIDTH`: `number` (px) - Fixed width of an invader.
- `INVADER_HEIGHT`: `number` (px) - Fixed height of an invader.
- `BULLET_WIDTH`: `number` (px) - Fixed width of a bullet.
- `BULLET_HEIGHT`: `number` (px) - Fixed height of a bullet.
- `SHIELD_SEGMENT_WIDTH`: `number` (px) - Fixed width of a shield segment.
- `SHIELD_SEGMENT_HEIGHT`: `number` (px) - Fixed height of a shield segment.
- `PLAYER_START_Y_OFFSET`: `number` (px) - Distance from the bottom of the canvas where the player starts.
- `INVADER_START_Y_OFFSET`: `number` (px) - Distance from the top of the canvas where the invader fleet starts.
- `UFO_SPAWN_INTERVAL`: `number` (ms) - Average time between UFO spawns.
- `UFO_SPEED`: `number` (px/s) - Speed of the UFO.
- `UFO_Y_POSITION`: `number` (px) - Fixed Y-position for UFOs.
- `INVADER_MIN_X_OFFSET`: `number` (px) - Minimum horizontal offset for invader fleet movement.
- `INVADER_MAX_X_OFFSET`: `number` (px) - Maximum horizontal offset for invader fleet movement.

### 💡 Global Hints
- All coordinate systems assume (0,0) is the top-left corner of the game canvas.
- `id` fields for entities like `InvaderState` and `BulletState` are crucial for efficient updates and rendering in presentation layers.
- Multipliers in `LevelConfig` allow for progressive difficulty scaling across levels.
- `PlayerActionEnum` provides a clear, semantic way to represent player input, decoupling it from specific key presses.

### 🚨 Global Constraints
- All `Position` and `Size` values MUST be non-negative.
- `speed` values MUST be non-negative.
- `health` values for `ShieldSegmentState` MUST be non-negative.
- `lastShotTime` MUST be a valid timestamp (milliseconds since epoch).
- `levelNumber` MUST be a positive integer.
- `invaderRows` and `invaderCols` MUST be positive integers.
- All multiplier values MUST be positive.
- `playerBulletCooldown` and `invaderShotBaseFrequency` MUST be non-negative.
- `maxLevels` MUST be at least 10, as per the original requirements.

### ✅ Acceptance Criteria
- The `GameStatusEnum` accurately represents all major game states.
- All game entities (`Player`, `Invader`, `Bullet`, `Shield Segment`) have their essential properties defined in corresponding data structures.
- `PlayerActionEnum` correctly enumerates all fundamental player input intentions.
- `LevelConfig` provides sufficient parameters to customize level difficulty and layout.
- `GameConfig` and `GameConstants` encapsulate all global and fixed numerical parameters with appropriate units.
- All defined types are clear, unambiguous, and directly support the game's core mechanics.

### 🧪 Test Scenarios
- **Scenario**: Verify `GameStatusEnum` transitions.
  - **Given**: A game is in `INITIAL` state.
  - **When**: Player starts the game.
  - **Then**: Game status transitions to `PLAYING`.
  - **When**: Player loses all lives.
  - **Then**: Game status transitions to `GAME_OVER`.
- **Scenario**: Verify `PlayerState` properties.
  - **Given**: A `PlayerState` instance.
  - **Then**: It MUST contain `position`, `size`, `speed`, `lives`, `isShooting`, and `lastShotTime` with correct types and units.
- **Scenario**: Verify `LevelConfig` scaling.
  - **Given**: `LevelConfig` for `levelNumber = 1` and `levelNumber = 5`.
  - **Then**: `invaderSpeedMultiplier` for `levelNumber = 5` SHOULD be greater than or equal to `levelNumber = 1`.
  - **Then**: `invaderShotFrequencyMultiplier` for `levelNumber = 5` SHOULD be less than or equal to `levelNumber = 1` (indicating more frequent shots).
- **Scenario**: Validate `GameConfig` constraints.
  - **Given**: A `GameConfig` instance.
  - **Then**: `maxLevels` MUST be `>= 10`.
  - **Then**: `playerBulletCooldown` MUST be `>= 0 (ms)`.
  - **Then**: `canvasWidth` and `canvasHeight` MUST be positive `(px)`.
- **Scenario**: Verify `PlayerActionEnum` values.
  - **Given**: The `PlayerActionEnum` definition.
  - **Then**: It MUST include `MOVE_LEFT`, `MOVE_RIGHT`, and `SHOOT` as distinct actions.