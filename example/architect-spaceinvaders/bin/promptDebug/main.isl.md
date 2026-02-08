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



**REAL IMPLEMENTATION CONTEXT (Override):**
The following components have already been compiled. You MUST use these exact signatures for imports and usage.
**CRITICAL RULE**: If a symbol (function, constant, or type) is NOT listed in these signatures, you MUST NOT attempt to import it via `import { ... }`, even if it appears in the ISL documentation. It likely exists only as a JSDoc type or internal helper.
**NAMING MISMATCH**: If the ISL refers to a Component (e.g. "fooManager") but the signature only shows a function (e.g. "getFooData"), YOU MUST USE THE FUNCTION provided in the signature. Do NOT invent a new name to satisfy naming conventions.
**IMPORT SYNTAX**: For "type": "default", use `import Name from './path'`. For "type": "named", use `import { Name } from './path'`. Do NOT mix them up.
**IMPORT PATHS**: You MUST use the exact path provided in the 'Component' field below. Do NOT calculate relative paths (no `../`). Copy the path literally.
**TYPES**: Pay attention to the return types in signatures. Use the component/function according to its type constraints (e.g. do not call Components returning JSX.Element as functions).

Component: ./game-logic
Signature:
type GameState = {
  status: 'INITIAL' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_CLEARED' | 'GAME_WON';
  levelNumber: number;
  score: number;
  playerState: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    lives: number;
    isShooting: boolean;
    lastShotTime: number;
  };
  invadersState: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
    isAlive: boolean;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    speed: number;
    points: number;
  }>;
  playerBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  invaderBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  shieldStates: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    health: number;
    isDestroyed: boolean;
  }>;
  lastUpdateTime: number;
  gameConfig: {
    canvasWidth: number;
    canvasHeight: number;
    playerBaseSpeed: number;
    playerBulletBaseSpeed: number;
    playerBulletCooldown: number;
    invaderBaseSpeed: number;
    invaderBulletBaseSpeed: number;
    invaderShotBaseFrequency: number;
    invaderHorizontalSpacing: number;
    invaderVerticalSpacing: number;
    invaderDescentAmount: number;
    initialLives: number;
    maxLevels: number;
    shieldCount: number;
    shieldSegmentHealth: number;
    scorePerInvader: number;
    scorePerUFO: number;
    scorePerLevelClear: number;
  };
  currentLevelConfig: {
    levelNumber: number;
    invaderRows: number;
    invaderCols: number;
    invaderSpeedMultiplier: number;
    invaderBulletSpeedMultiplier: number;
    invaderShotFrequencyMultiplier: number;
    playerBulletSpeedMultiplier: number;
    playerSpeedMultiplier: number;
    initialPlayerLives: number;
    shieldConfiguration: Array<{ x: number; y: number }>;
  };
  playerActionFlags: {
    moveLeft: boolean;
    moveRight: boolean;
    isShooting: boolean;
  };
  invaderDirection: number;
  invaderMovementTimer: number;
  invaderDescentTimer: number;
  invaderShotTimer: number;
  playerShotCooldownTimer: number;
};

export const GameLogic: (gameConfig: {
  canvasWidth?: number;
  canvasHeight?: number;
  playerBaseSpeed?: number;
  playerBulletBaseSpeed?: number;
  playerBulletCooldown?: number;
  invaderBaseSpeed?: number;
  invaderBulletBaseSpeed?: number;
  invaderShotBaseFrequency?: number;
  invaderHorizontalSpacing?: number;
  invaderVerticalSpacing?: number;
  invaderDescentAmount?: number;
  initialLives?: number;
  maxLevels?: number;
  shieldCount?: number;
  shieldSegmentHealth?: number;
  scorePerInvader?: number;
  scorePerUFO?: number;
  scorePerLevelClear?: number;
}) => {
  initializeGame: () => GameState;
  startGame: (initialState: GameState) => GameState;
  processPlayerInput: (currentState: GameState, action: 'MOVE_LEFT' | 'MOVE_RIGHT' | 'SHOOT', isPressed: boolean) => GameState;
  updateGame: (currentState: GameState, currentTime: number) => GameState;
  loadNextLevel: (currentState: GameState) => GameState;
  resetGame: (currentState: GameState) => GameState;
};

Component: ./game-board-presentation
Signature:
type GameState = {
  status: 'INITIAL' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_CLEARED' | 'GAME_WON';
  levelNumber: number;
  score: number;
  playerState: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    lives: number;
    isShooting: boolean;
    lastShotTime: number;
  };
  invadersState: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
    isAlive: boolean;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    speed: number;
    points: number;
  }>;
  playerBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  invaderBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  shieldStates: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    health: number;
    isDestroyed: boolean;
  }>;
  lastUpdateTime: number;
  gameConfig: {
    canvasWidth: number;
    canvasHeight: number;
    playerBaseSpeed: number;
    playerBulletBaseSpeed: number;
    playerBulletCooldown: number;
    invaderBaseSpeed: number;
    invaderBulletBaseSpeed: number;
    invaderShotBaseFrequency: number;
    invaderHorizontalSpacing: number;
    invaderVerticalSpacing: number;
    invaderDescentAmount: number;
    initialLives: number;
    maxLevels: number;
    shieldCount: number;
    shieldSegmentHealth: number;
    scorePerInvader: number;
    scorePerUFO: number;
    scorePerLevelClear: number;
  };
  currentLevelConfig: {
    levelNumber: number;
    invaderRows: number;
    invaderCols: number;
    invaderSpeedMultiplier: number;
    invaderBulletSpeedMultiplier: number;
    invaderShotFrequencyMultiplier: number;
    playerBulletSpeedMultiplier: number;
    playerSpeedMultiplier: number;
    initialPlayerLives: number;
    shieldConfiguration: Array<{ x: number; y: number }>;
  };
  playerActionFlags: {
    moveLeft: boolean;
    moveRight: boolean;
    isShooting: boolean;
  };
  invaderDirection: number;
  invaderMovementTimer: number;
  invaderDescentTimer: number;
  invaderShotTimer: number;
  playerShotCooldownTimer: number;
};

type GameConfig = {
  canvasWidth: number;
  canvasHeight: number;
  playerBaseSpeed: number;
  playerBulletBaseSpeed: number;
  playerBulletCooldown: number;
  invaderBaseSpeed: number;
  invaderBulletBaseSpeed: number;
  invaderShotBaseFrequency: number;
  invaderHorizontalSpacing: number;
  invaderVerticalSpacing: number;
  invaderDescentAmount: number;
  initialLives: number;
  maxLevels: number;
  shieldCount: number;
  shieldSegmentHealth: number;
  scorePerInvader: number;
  scorePerUFO: number;
  scorePerLevelClear: number;
};

export default function GameBoardPresentation(props: {
  gameState: GameState;
  gameConfig: GameConfig;
  onPlayerAction: (action: 'MOVE_LEFT' | 'MOVE_RIGHT' | 'SHOOT', isPressed: boolean) => void;
}): React.Element;

Component: ./hud-presentation
Signature:
type GameState = {
  status: 'INITIAL' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_CLEARED' | 'GAME_WON';
  levelNumber: number;
  score: number;
  playerState: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    lives: number;
    isShooting: boolean;
    lastShotTime: number;
  };
  invadersState: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
    isAlive: boolean;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    speed: number;
    points: number;
  }>;
  playerBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  invaderBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  shieldStates: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    health: number;
    isDestroyed: boolean;
  }>;
  lastUpdateTime: number;
  gameConfig: {
    canvasWidth: number;
    canvasHeight: number;
    playerBaseSpeed: number;
    playerBulletBaseSpeed: number;
    playerBulletCooldown: number;
    invaderBaseSpeed: number;
    invaderBulletBaseSpeed: number;
    invaderShotBaseFrequency: number;
    invaderHorizontalSpacing: number;
    invaderVerticalSpacing: number;
    invaderDescentAmount: number;
    initialLives: number;
    maxLevels: number;
    shieldCount: number;
    shieldSegmentHealth: number;
    scorePerInvader: number;
    scorePerUFO: number;
    scorePerLevelClear: number;
  };
  currentLevelConfig: {
    levelNumber: number;
    invaderRows: number;
    invaderCols: number;
    invaderSpeedMultiplier: number;
    invaderBulletSpeedMultiplier: number;
    invaderShotFrequencyMultiplier: number;
    playerBulletSpeedMultiplier: number;
    playerSpeedMultiplier: number;
    initialPlayerLives: number;
    shieldConfiguration: Array<{ x: number; y: number }>;
  };
  playerActionFlags: {
    moveLeft: boolean;
    moveRight: boolean;
    isShooting: boolean;
  };
  invaderDirection: number;
  invaderMovementTimer: number;
  invaderDescentTimer: number;
  invaderShotTimer: number;
  playerShotCooldownTimer: number;
};

export default function HudPresentation(props: { gameState: GameState }): React.Element;

Component: ./start-game-presentation
Signature:
type GameState = {
  status: 'INITIAL' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_CLEARED' | 'GAME_WON';
  levelNumber: number;
  score: number;
  playerState: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    lives: number;
    isShooting: boolean;
    lastShotTime: number;
  };
  invadersState: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
    isAlive: boolean;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    speed: number;
    points: number;
  }>;
  playerBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  invaderBullets: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    speed: number;
    direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
    owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
    isAlive: boolean;
  }>;
  shieldStates: Array<{
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    health: number;
    isDestroyed: boolean;
  }>;
  lastUpdateTime: number;
  gameConfig: {
    canvasWidth: number;
    canvasHeight: number;
    playerBaseSpeed: number;
    playerBulletBaseSpeed: number;
    playerBulletCooldown: number;
    invaderBaseSpeed: number;
    invaderBulletBaseSpeed: number;
    invaderShotBaseFrequency: number;
    invaderHorizontalSpacing: number;
    invaderVerticalSpacing: number;
    invaderDescentAmount: number;
    initialLives: number;
    maxLevels: number;
    shieldCount: number;
    shieldSegmentHealth: number;
    scorePerInvader: number;
    scorePerUFO: number;
    scorePerLevelClear: number;
  };
  currentLevelConfig: {
    levelNumber: number;
    invaderRows: number;
    invaderCols: number;
    invaderSpeedMultiplier: number;
    invaderBulletSpeedMultiplier: number;
    invaderShotFrequencyMultiplier: number;
    playerBulletSpeedMultiplier: number;
    playerSpeedMultiplier: number;
    initialPlayerLives: number;
    shieldConfiguration: Array<{ x: number; y: number }>;
  };
  playerActionFlags: {
    moveLeft: boolean;
    moveRight: boolean;
    isShooting: boolean;
  };
  invaderDirection: number;
  invaderMovementTimer: number;
  invaderDescentTimer: number;
  invaderShotTimer: number;
  playerShotCooldownTimer: number;
};

export default function StartGamePresentation(props: {
  gameState: GameState;
  onStartGame: (stateToStart: GameState) => void;
  onResetGame: (stateToReset: GameState) => void;
}): React.Element;

Component: ./game-domain
Signature:
export const GameStatusEnum: {
  INITIAL: 'INITIAL';
  PLAYING: 'PLAYING';
  PAUSED: 'PAUSED';
  GAME_OVER: 'GAME_OVER';
  LEVEL_CLEARED: 'LEVEL_CLEARED';
  GAME_WON: 'GAME_WON';
};

export const EntityTypeEnum: {
  PLAYER: 'PLAYER';
  INVADER: 'INVADER';
  PLAYER_BULLET: 'PLAYER_BULLET';
  INVADER_BULLET: 'INVADER_BULLET';
  SHIELD_SEGMENT: 'SHIELD_SEGMENT';
};

export const DirectionEnum: {
  LEFT: 'LEFT';
  RIGHT: 'RIGHT';
  UP: 'UP';
  DOWN: 'DOWN';
};

export const PlayerActionEnum: {
  MOVE_LEFT: 'MOVE_LEFT';
  MOVE_RIGHT: 'MOVE_RIGHT';
  SHOOT: 'SHOOT';
};

export const InvaderTypeEnum: {
  TYPE_A: 'TYPE_A';
  TYPE_B: 'TYPE_B';
  TYPE_C: 'TYPE_C';
  UFO: 'UFO';
};

export const Position: (data?: { x?: number; y?: number }) => { x: number; y: number };

export const Size: (data?: { width?: number; height?: number }) => { width: number; height: number };

export const Velocity: (data?: { dx?: number; dy?: number }) => { dx: number; dy: number };

export const PlayerState: (data?: {
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  speed?: number;
  lives?: number;
  isShooting?: boolean;
  lastShotTime?: number;
}) => {
  position: { x: number; y: number };
  size: { width: number; height: number };
  speed: number;
  lives: number;
  isShooting: boolean;
  lastShotTime: number;
};

export const InvaderState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  type?: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
  isAlive?: boolean;
  direction?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  speed?: number;
  points?: number;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'UFO';
  isAlive: boolean;
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  speed: number;
  points: number;
};

export const BulletState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  speed?: number;
  direction?: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  owner?: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
  isAlive?: boolean;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  speed: number;
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  owner: 'PLAYER' | 'INVADER' | 'PLAYER_BULLET' | 'INVADER_BULLET' | 'SHIELD_SEGMENT';
  isAlive: boolean;
};

export const ShieldSegmentState: (data?: {
  id?: string;
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  health?: number;
  isDestroyed?: boolean;
}) => {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  health: number;
  isDestroyed: boolean;
};

export const LevelConfig: (data?: {
  levelNumber?: number;
  invaderRows?: number;
  invaderCols?: number;
  invaderSpeedMultiplier?: number;
  invaderBulletSpeedMultiplier?: number;
  invaderShotFrequencyMultiplier?: number;
  playerBulletSpeedMultiplier?: number;
  playerSpeedMultiplier?: number;
  initialPlayerLives?: number;
  shieldConfiguration?: Array<{ x?: number; y?: number }>;
}) => {
  levelNumber: number;
  invaderRows: number;
  invaderCols: number;
  invaderSpeedMultiplier: number;
  invaderBulletSpeedMultiplier: number;
  invaderShotFrequencyMultiplier: number;
  playerBulletSpeedMultiplier: number;
  playerSpeedMultiplier: number;
  initialPlayerLives: number;
  shieldConfiguration: Array<{ x: number; y: number }>;
};

export const GameConfig: (data?: {
  canvasWidth?: number;
  canvasHeight?: number;
  playerBaseSpeed?: number;
  playerBulletBaseSpeed?: number;
  playerBulletCooldown?: number;
  invaderBaseSpeed?: number;
  invaderBulletBaseSpeed?: number;
  invaderShotBaseFrequency?: number;
  invaderHorizontalSpacing?: number;
  invaderVerticalSpacing?: number;
  invaderDescentAmount?: number;
  initialLives?: number;
  maxLevels?: number;
  shieldCount?: number;
  shieldSegmentHealth?: number;
  scorePerInvader?: number;
  scorePerUFO?: number;
  scorePerLevelClear?: number;
}) => {
  canvasWidth: number;
  canvasHeight: number;
  playerBaseSpeed: number;
  playerBulletBaseSpeed: number;
  playerBulletCooldown: number;
  invaderBaseSpeed: number;
  invaderBulletBaseSpeed: number;
  invaderShotBaseFrequency: number;
  invaderHorizontalSpacing: number;
  invaderVerticalSpacing: number;
  invaderDescentAmount: number;
  initialLives: number;
  maxLevels: number;
  shieldCount: number;
  shieldSegmentHealth: number;
  scorePerInvader: number;
  scorePerUFO: number;
  scorePerLevelClear: number;
};

export const GameConstants: (data?: {
  PLAYER_WIDTH?: number;
  PLAYER_HEIGHT?: number;
  INVADER_WIDTH?: number;
  INVADER_HEIGHT?: number;
  BULLET_WIDTH?: number;
  BULLET_HEIGHT?: number;
  SHIELD_SEGMENT_WIDTH?: number;
  SHIELD_SEGMENT_HEIGHT?: number;
  PLAYER_START_Y_OFFSET?: number;
  INVADER_START_Y_OFFSET?: number;
  UFO_SPAWN_INTERVAL?: number;
  UFO_SPEED?: number;
  UFO_Y_POSITION?: number;
  INVADER_MIN_X_OFFSET?: number;
  INVADER_MAX_X_OFFSET?: number;
}) => {
  PLAYER_WIDTH: number;
  PLAYER_HEIGHT: number;
  INVADER_WIDTH: number;
  INVADER_HEIGHT: number;
  BULLET_WIDTH: number;
  BULLET_HEIGHT: number;
  SHIELD_SEGMENT_WIDTH: number;
  SHIELD_SEGMENT_HEIGHT: number;
  PLAYER_START_Y_OFFSET: number;
  INVADER_START_Y_OFFSET: number;
  UFO_SPAWN_INTERVAL: number;
  UFO_SPEED: number;
  UFO_Y_POSITION: number;
  INVADER_MIN_X_OFFSET: number;
  INVADER_MAX_X_OFFSET: number;
};

<!-- BUILD CONTEXT FOR: main.isl.md -->
<!-- TARGET IMPLEMENTATION PATH: ./main -->
<!-- Dependencies are included as Interfaces (.ref.md) -->

<!-- START DEPENDENCY INTERFACE: game-logic.ref.md -->
<!-- INTERFACE (REF) FOR: game-logic.isl.md -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./game-logic -->
**Implementation**: ./game-logic

> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: GameLogic
### Role: Business Logic
**Signature**: (gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`)

### 📦 Content/Structure

#### GameState
Represents the complete current state of the game at any given moment. This structure is immutable; capabilities return new `GameState` instances reflecting updates.

- `status`: > **Reference**: `GameStatusEnum` in `./game-domain.isl.md`
- `levelNumber`: `number` (current level, starts at 1)
- `score`: `number` (current player score)
- `playerState`: > **Reference**: `PlayerState` in `./game-domain.isl.md`
- `invadersState`: `Array<` > **Reference**: `InvaderState` in `./game-domain.isl.md` `>` (list of all active invaders)
- `playerBullets`: `Array<` > **Reference**: `BulletState` in `./game-domain.isl.md` `>` (list of all active player bullets)
- `invaderBullets`: `Array<` > **Reference**: `BulletState` in `./game-domain.isl.md` `>` (list of all active invader bullets)
- `shieldStates`: `Array<` > **Reference**: `ShieldSegmentState` in `./game-domain.isl.md` `>` (list of all active shield segments)
- `lastUpdateTime`: `number` (timestamp in milliseconds of the last game state update)
- `gameConfig`: > **Reference**: `GameConfig` in `./game-domain.isl.md` (immutable global configuration for the game)
- `currentLevelConfig`: > **Reference**: `LevelConfig` in `./game-domain.isl.md` (configuration specific to the current level)
- `playerActionFlags`: `Object` (flags indicating continuous player actions)
    - `moveLeft`: `boolean` (true if player is intending to move left)
    - `moveRight`: `boolean` (true if player is intending to move right)
    - `isShooting`: `boolean` (true if player is holding the shoot button)
- `invaderDirection`: `number` (-1 for left, 1 for right, determines horizontal movement)
- `invaderMovementTimer`: `number` (time remaining until the next invader horizontal movement, in milliseconds)
- `invaderDescentTimer`: `number` (time remaining until invaders descend, in milliseconds)
- `invaderShotTimer`: `number` (time remaining until the next invader can shoot, in milliseconds)
- `playerShotCooldownTimer`: `number` (time remaining until the player can shoot again, in milliseconds)

### ⚡ Capabilities

#### initializeGame
- **Contract**: Prepares the initial game state, setting up default values and the first level's configuration.
- **Signature**: `(): GameState`
- **Flow**:
  1. Create a new `GameState` instance.
  2. Set `status` to `INITIAL`.
  3. Set `score` to `0`.
  4. Set `levelNumber` to `1`.
  5. Initialize `playerState` with default position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  6. Initialize `invadersState`, `playerBullets`, `invaderBullets`, `shieldStates` as empty arrays.
  7. Set `lastUpdateTime` to the current timestamp.
  8. Set `gameConfig` to the `gameConfig` provided during component instantiation.
  9. Load `currentLevelConfig` by finding the `LevelConfig` for `levelNumber = 1` from `gameConfig.levelConfigs`.
  10. Initialize `playerActionFlags` with `moveLeft: false`, `moveRight: false`, `isShooting: false`.
  11. Set `invaderDirection` to `1` (initial movement to the right).
  12. Initialize `invaderMovementTimer`, `invaderDescentTimer`, `invaderShotTimer`, `playerShotCooldownTimer` to `0`.
- **Side Effects**: None directly, returns a new `GameState` object.
- **✅ Acceptance Criteria**:
  - The returned `GameState` MUST have `status` set to `INITIAL`.
  - `score` MUST be `0`, and `levelNumber` MUST be `1`.
  - `playerState` MUST be initialized with full lives.
  - Entity arrays (`invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`) MUST be empty.
  - `currentLevelConfig` MUST correspond to level 1.

#### startGame
- **Contract**: Transitions the game from `INITIAL` to `PLAYING` and sets up the first level's entities.
- **Signature**: `(initialState: GameState): GameState`
- **Flow**:
  1. Create a copy of `initialState`.
  2. IF `initialState.status` is NOT `INITIAL`, THEN return the copied state unchanged.
  3. Set `status` to `PLAYING`.
  4. Reset `score` to `0`.
  5. Reset `levelNumber` to `1`.
  6. Reset `playerState` to its initial position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  7. Generate `invadersState` based on `currentLevelConfig` (rows, columns, initial positions).
  8. Generate `shieldStates` based on `gameConfig` (number of shields, segments per shield, positions).
  9. Clear `playerBullets` and `invaderBullets`.
  10. Reset `invaderDirection` to `1`.
  11. Reset `invaderMovementTimer` to `0`.
  12. Reset `invaderDescentTimer` to `0`.
  13. Reset `invaderShotTimer` to `0`.
  14. Reset `playerShotCooldownTimer` to `0`.
  15. Set `lastUpdateTime` to the current timestamp.
  16. Return the updated `GameState`.
- **Side Effects**: Modifies the `GameState` to reflect the start of a new game.
- **✅ Acceptance Criteria**:
  - The returned `GameState.status` MUST be `PLAYING`.
  - Player, invaders, and shields MUST be initialized and positioned correctly.
  - Score and lives MUST be reset to starting values.

#### processPlayerInput
- **Contract**: Updates the player's action flags within the game state based on discrete player input events (key presses/releases).
- **Signature**: `(currentState: GameState, action: ` > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, `isPressed: boolean` `): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. IF `action` is `MOVE_LEFT`:
     THEN set `playerActionFlags.moveLeft` to `isPressed`.
  3. ELSE IF `action` is `MOVE_RIGHT`:
     THEN set `playerActionFlags.moveRight` to `isPressed`.
  4. ELSE IF `action` is `SHOOT`:
     THEN set `playerActionFlags.isShooting` to `isPressed`.
  5. Return the updated `GameState`.
- **Side Effects**: Updates `playerActionFlags` within the `GameState`.
- **✅ Acceptance Criteria**:
  - The corresponding `playerActionFlags` in the returned `GameState` MUST be updated based on the `action` and `isPressed` value.

#### updateGame
- **Contract**: Advances the game state by one frame, handling movement, shooting, collisions, and game progression. This is the core of the game loop.
- **Signature**: `(currentState: GameState, currentTime: number): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. IF `currentState.status` is NOT `PLAYING`, THEN return the copied state unchanged.
  3. Calculate `deltaTime = currentTime - currentState.lastUpdateTime` (in milliseconds).
  4. Update `lastUpdateTime` to `currentTime`.
  5. Decrement `playerShotCooldownTimer` by `deltaTime`.
  6. Decrement `invaderMovementTimer` by `deltaTime`.
  7. Decrement `invaderDescentTimer` by `deltaTime`.
  8. Decrement `invaderShotTimer` by `deltaTime`.

  **Player Movement**:
  1. IF `playerActionFlags.moveLeft` is `true`:
     THEN move `playerState.position.x` left by `playerState.speed * deltaTime / 1000 (px)`.
  2. IF `playerActionFlags.moveRight` is `true`:
     THEN move `playerState.position.x` right by `playerState.speed * deltaTime / 1000 (px)`.
  3. Clamp `playerState.position.x` within `0` and `gameConfig.canvasWidth - playerState.size.width`.

  **Player Shooting**:
  1. IF `playerActionFlags.isShooting` is `true` AND `playerShotCooldownTimer` is `<= 0`:
     THEN create a new player bullet at `playerState.position` (adjusted to be centered and above player) and add it to `playerBullets`.
     THEN set `playerShotCooldownTimer` to `gameConfig.playerBulletCooldown`.

  **Invader Movement**:
  1. IF `invaderMovementTimer` is `<= 0`:
     a. Calculate invader horizontal speed based on `currentLevelConfig.invaderSpeedMultiplier` and `GameConstants.invaderBaseSpeed`.
     b. Move all `invadersState` horizontally by `invaderSpeed * invaderDirection * (GameConstants.invaderMovementInterval / 1000) (px)`.
     c. Reset `invaderMovementTimer` based on `GameConstants.invaderMovementInterval`.
     d. Check if any invader has reached the canvas edge:
        IF an invader hits the left edge (`position.x <= 0`) OR an invader hits the right edge (`position.x + size.width >= gameConfig.canvasWidth`):
           THEN reverse `invaderDirection` (`invaderDirection = -invaderDirection`).
           THEN move all invaders down by `GameConstants.invaderDescentAmount (px)`.
           THEN set `invaderDescentTimer` to `GameConstants.invaderDescentInterval`.
           THEN check for game over if any invader's `position.y + size.height` is `>= GameConstants.playerYPosition`.

  **Invader Shooting**:
  1. IF `invaderShotTimer` is `<= 0`:
     a. Select a random invader from the bottom row of each column (if available).
     b. IF an invader is selected:
        THEN create a new invader bullet at the invader's position (adjusted to be centered and below invader) and add it to `invaderBullets`.
     c. Reset `invaderShotTimer` based on `GameConstants.invaderShotBaseFrequency` multiplied by `currentLevelConfig.invaderShotFrequencyMultiplier`.

  **Bullet Movement**:
  1. Update positions of all `playerBullets` and `invaderBullets` based on their `speed` and `deltaTime`.
  2. Remove bullets that move off-screen (outside `0` to `gameConfig.canvasHeight`).

  **Collision Detection**:
  1. **Player Bullets vs. Invaders**:
     FOR EACH `playerBullet` in `playerBullets`:
       FOR EACH `invader` in `invadersState`:
         IF `playerBullet` collides with `invader` (AABB check):
           THEN remove `playerBullet`.
           THEN remove `invader`.
           THEN increment `score` by `GameConstants.invaderScoreValue`.
           THEN break (bullet can only hit one invader).
  2. **Player Bullets vs. Shields**:
     FOR EACH `playerBullet` in `playerBullets`:
       FOR EACH `shieldSegment` in `shieldStates`:
         IF `playerBullet` collides with `shieldSegment` (AABB check):
           THEN remove `playerBullet`.
           THEN decrement `shieldSegment.health`.
           THEN IF `shieldSegment.health` is `<= 0`, THEN remove `shieldSegment`.
           THEN break.
  3. **Invader Bullets vs. Player**:
     FOR EACH `invaderBullet` in `invaderBullets`:
       IF `invaderBullet` collides with `playerState` (AABB check):
         THEN remove `invaderBullet`.
         THEN decrement `playerState.lives`.
         THEN IF `playerState.lives` is `<= 0`, THEN set `status` to `GAME_OVER`.
         THEN reset `playerState.position` to its initial position.
         THEN clear all `playerBullets` and `invaderBullets`.
         THEN break.
  4. **Invader Bullets vs. Shields**:
     FOR EACH `invaderBullet` in `invaderBullets`:
       FOR EACH `shieldSegment` in `shieldStates`:
         IF `invaderBullet` collides with `shieldSegment` (AABB check):
           THEN remove `invaderBullet`.
           THEN decrement `shieldSegment.health`.
           THEN IF `shieldSegment.health` is `<= 0`, THEN remove `shieldSegment`.
           THEN break.

  **Game State Checks**:
  1. **Level Completion**:
     IF `invadersState` is empty:
       THEN IF `levelNumber` is `< gameConfig.maxLevels`:
         THEN call `loadNextLevel` with the current state to advance to the next level.
       THEN ELSE (`levelNumber` is `gameConfig.maxLevels`):
         THEN set `status` to `GAME_WON`.
  2. **Game Over (Invaders reached bottom)**:
     IF any `invader`'s `position.y + size.height` is `>= GameConstants.playerYPosition`:
       THEN set `status` to `GAME_OVER`.
  3. **Game Over (Player out of lives)**:
     IF `playerState.lives` is `<= 0`:
       THEN set `status` to `GAME_OVER`.

  9. Return the updated `GameState`.
- **Side Effects**: Modifies `GameState` significantly, including entity positions, health, scores, lives, and game status.
- **💡 Implementation Hint**: Collision detection can be optimized using spatial partitioning if performance becomes an issue with many entities.
- **🚨 Constraint**: `deltaTime` MUST be non-negative.
- **✅ Acceptance Criteria**:
  - Player, invader, and bullet positions MUST be updated correctly based on `deltaTime`.
  - Collisions MUST be detected accurately, resulting in appropriate score updates, entity removals, and life deductions.
  - Game status MUST transition to `GAME_OVER` or `GAME_WON` upon respective conditions.
  - `playerShotCooldownTimer` and `invaderShotTimer` MUST correctly regulate shooting frequency.
  - Invaders MUST move horizontally, descend, and reverse direction correctly.
  - Level progression MUST occur when all invaders are destroyed, up to `maxLevels`.

#### loadNextLevel
- **Contract**: Prepares the game for the next level, incrementing the level number, resetting entities, and applying new level configurations.
- **Signature**: `(currentState: GameState): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. Increment `levelNumber` by `1`.
  3. IF `levelNumber` is `> gameConfig.maxLevels`:
     THEN set `status` to `GAME_WON` and return the copied state.
  4. Load `currentLevelConfig` by finding the `LevelConfig` for the new `levelNumber` from `gameConfig.levelConfigs`.
  5. Reset `playerState.position` to its initial position.
  6. Generate new `invadersState` based on the new `currentLevelConfig`.
  7. Regenerate `shieldStates` to full health based on `gameConfig`.
  8. Clear `playerBullets` and `invaderBullets`.
  9. Reset `invaderDirection` to `1`.
  10. Reset `invaderMovementTimer` to `0`.
  11. Reset `invaderDescentTimer` to `0`.
  12. Reset `invaderShotTimer` to `0`.
  13. Reset `playerShotCooldownTimer` to `0`.
  14. Set `lastUpdateTime` to the current timestamp.
  15. Return the updated `GameState`.
- **Side Effects**: Resets game entities and updates `levelNumber` and `currentLevelConfig`.
- **✅ Acceptance Criteria**:
  - `levelNumber` MUST be incremented (unless `maxLevels` is reached).
  - New invaders and fully repaired shields MUST be generated.
  - Bullets MUST be cleared.
  - `currentLevelConfig` MUST reflect the new level's configuration.
  - If `maxLevels` is reached, `status` MUST transition to `GAME_WON`.

#### resetGame
- **Contract**: Resets the entire game state to its initial `INITIAL` status, ready for a new game start.
- **Signature**: `(currentState: GameState): GameState`
- **Flow**:
  1. Create a copy of `currentState`.
  2. Set `status` to `INITIAL`.
  3. Reset `score` to `0`.
  4. Reset `levelNumber` to `1`.
  5. Reset `playerState` to its initial position, `GameConstants.playerLives` lives, and `lastShotTime` to `0`.
  6. Clear `invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`.
  7. Reset `playerActionFlags` to all `false`.
  8. Reset `invaderDirection` to `1`.
  9. Reset `invaderMovementTimer`, `invaderDescentTimer`, `invaderShotTimer`, `playerShotCooldownTimer` to `0`.
  10. Set `lastUpdateTime` to the current timestamp.
  11. Load `currentLevelConfig` for `levelNumber = 1`.
  12. Return the updated `GameState`.
- **Side Effects**: Resets the `GameState` to its default starting values.
- **✅ Acceptance Criteria**:
  - The returned `GameState.status` MUST be `INITIAL`.
  - All dynamic game elements (score, lives, entities) MUST be reset to their default starting values.

### 💡 Global Hints
- The `updateGame` capability is the heart of the game loop and should be called repeatedly with the elapsed time (`deltaTime`) to ensure smooth, frame-rate independent updates.
- Collision detection should consider the `size` and `position` of entities. A simple AABB (Axis-Aligned Bounding Box) collision check is usually sufficient for this type of game.
- Randomness for invader shooting should be introduced to make the game less predictable.
- The `GameConfig` and `GameConstants` from `game-domain.isl.md` provide all necessary numerical parameters for game mechanics.

### 🚨 Global Constraints
- All entity positions and sizes MUST remain within the `gameConfig.canvasWidth` and `gameConfig.canvasHeight` boundaries where appropriate.
- `deltaTime` passed to `updateGame` MUST be non-negative.
- The `levelNumber` MUST NOT exceed `gameConfig.maxLevels`.
- `playerState.lives` MUST NOT be negative.

### ✅ Acceptance Criteria
- The game logic MUST correctly manage the `GameStatusEnum` transitions (`INITIAL` -> `PLAYING` -> `GAME_OVER` / `GAME_WON`).
- Player movement and shooting MUST adhere to defined speeds and cooldowns.
- Invader movement patterns (horizontal, descent, reversal) and shooting frequency MUST be correctly implemented and scale with `LevelConfig`.
- All types of collisions (player bullet-invader, player bullet-shield, invader bullet-player, invader bullet-shield, invader-player/shield) MUST be detected and handled with appropriate consequences (score, damage, entity removal, lives).
- The game MUST progress through at least 10 levels, with increasing difficulty as defined by `LevelConfig` multipliers.
- Scoring and lives MUST be accurately tracked and updated.
- The game MUST correctly identify `GAME_OVER` conditions (player out of lives, invaders reach bottom).
- The game MUST correctly identify `GAME_WON` condition (all levels completed).

### 🧪 Test Scenarios
- **Scenario**: Game Initialization and Start
  - **Given**: `GameLogic` is initialized with a `GameConfig`.
  - **When**: `initializeGame` is called.
  - **Then**: `GameState.status` is `INITIAL`, `score` is `0`, `levelNumber` is `1`.
  - **When**: `startGame` is called with the initial state.
  - **Then**: `GameState.status` is `PLAYING`, player, invaders, and shields are present and correctly positioned.
- **Scenario**: Player Movement and Boundary
  - **Given**: `GameState` with player at `x=100`, `playerState.speed = 100 (px/s)`.
  - **When**: `processPlayerInput(currentState, MOVE_LEFT, true)` is called, then `updateGame(currentState, currentTime + 100 (ms))` is called.
  - **Then**: `playerState.position.x` SHOULD be approximately `90`.
  - **Given**: Player at `x=0`.
  - **When**: `processPlayerInput(currentState, MOVE_LEFT, true)` is called, then `updateGame` is called.
  - **Then**: `playerState.position.x` MUST remain `0`.
- **Scenario**: Player Shooting and Cooldown
  - **Given**: `GameState` with `playerShotCooldownTimer = 0`.
  - **When**: `processPlayerInput(currentState, SHOOT, true)` is called, then `updateGame` is called.
  - **Then**: A new player bullet MUST be added to `playerBullets`.
  - **Then**: `playerShotCooldownTimer` MUST be reset to `gameConfig.playerBulletCooldown`.
  - **When**: `updateGame` is called again immediately (before cooldown expires).
  - **Then**: NO new player bullet MUST be added.
- **Scenario**: Invader Movement and Descent
  - **Given**: `GameState` with invaders moving right, `invaderMovementTimer = 0`.
  - **When**: `updateGame` is called.
  - **Then**: Invaders MUST move right. `invaderMovementTimer` MUST be reset.
  - **Given**: Invaders at the right edge of the canvas, `invaderMovementTimer = 0`.
  - **When**: `updateGame` is called.
  - **Then**: Invaders MUST reverse direction to left.
  - **Then**: Invaders MUST descend by `GameConstants.invaderDescentAmount (px)`.
  - **Then**: `invaderDescentTimer` MUST be set.
- **Scenario**: Player Bullet vs. Invader Collision
  - **Given**: A `playerBullet` and an `invader` are at colliding positions.
  - **When**: `updateGame` is called.
  - **Then**: Both `playerBullet` and `invader` MUST be removed from their respective lists.
  - **Then**: `score` MUST increase by `GameConstants.invaderScoreValue`.
- **Scenario**: Invader Bullet vs. Player Collision
  - **Given**: An `invaderBullet` and `playerState` are at colliding positions, `playerState.lives = 1`.
  - **When**: `updateGame` is called.
  - **Then**: `invaderBullet` MUST be removed.
  - **Then**: `playerState.lives` MUST become `0`.
  - **Then**: `GameState.status` MUST transition to `GAME_OVER`.
  - **Then**: `playerState.position` MUST be reset.
  - **Then**: All bullets (player and invader) MUST be cleared.
- **Scenario**: Level Completion and Progression
  - **Given**: `GameState` with only one invader remaining, `levelNumber = 1`, `maxLevels = 10`.
  - **When**: `playerBullet` collides with the last invader, and `updateGame` is called.
  - **Then**: `invadersState` MUST be empty.
  - **Then**: `levelNumber` MUST increment to `2`.
  - **Then**: New invaders and shields for level 2 MUST be generated.
  - **Then**: `GameState.status` MUST remain `PLAYING`.
- **Scenario**: Game Over (Invaders Reach Bottom)
  - **Given**: `GameState` where an invader's `position.y` is below `GameConstants.playerYPosition`.
  - **When**: `updateGame` is called.
  - **Then**: `GameState.status` MUST transition to `GAME_OVER`.
- **Scenario**: Game Won
  - **Given**: `GameState` with `levelNumber = gameConfig.maxLevels`, and only one invader remaining.
  - **When**: `playerBullet` collides with the last invader, and `updateGame` is called.
  - **Then**: `GameState.status` MUST transition to `GAME_WON`.
- **Scenario**: Reset Game
  - **Given**: A `GameState` in `PLAYING` status with score, lives, and entities.
  - **When**: `resetGame` is called.
  - **Then**: `GameState.status` MUST be `INITIAL`.
  - **Then**: `score` MUST be `0`, `levelNumber` `1`, `playerState.lives` full.
  - **Then**: All entity arrays (`invadersState`, `playerBullets`, `invaderBullets`, `shieldStates`) MUST be empty.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: game-board-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: game-board-presentation.isl.md -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./game-board-presentation -->
**Implementation**: ./game-board-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: GameBoardPresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`, onPlayerAction: (action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean) => void)
### 📐 Appearance
- The game board occupies the main central area of the screen.
- It is a rectangular canvas with dimensions specified by `gameConfig.canvasWidth` and `gameConfig.canvasHeight`.
- The background is a solid dark color (e.g., black) to represent space.
- Player ship: A distinct, recognizable sprite or shape, positioned at `playerState.position`.
- Invader fleet: Multiple invader sprites or shapes, varying by type if applicable, positioned at their respective `invaderState.position`.
- Player bullets: Small, fast-moving projectiles, typically upward-moving, originating from the player.
- Invader bullets: Small, fast-moving projectiles, typically downward-moving, originating from invaders.
- Shields: Segmented barriers, visually indicating their health level (e.g., by color degradation or missing segments).
### 📦 Content
- Contains a single interactive canvas element that serves as the drawing surface for all game entities.
### ⚡ Capabilities
#### renderGameElements
**Contract**: Draws all active game entities (player, invaders, bullets, shields) onto the game board canvas based on the current game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, gameConfig: > **Reference**: `GameConfig` in `./game-domain.isl.md`): void`
- **Flow**:
  1. Clear the entire canvas area to prepare for the new frame.
  2. Draw the player ship at `gameState.playerState.position` with `gameState.playerState.size`.
  3. FOR EACH `invader` in `gameState.invadersState`:
     Draw the invader at `invader.position` with `invader.size`.
  4. FOR EACH `playerBullet` in `gameState.playerBullets`:
     Draw the player bullet at `playerBullet.position` with `playerBullet.size`.
  5. FOR EACH `invaderBullet` in `gameState.invaderBullets`:
     Draw the invader bullet at `invaderBullet.position` with `invaderBullet.size`.
  6. FOR EACH `shieldSegment` in `gameState.shieldStates`:
     Draw the shield segment at `shieldSegment.position` with `shieldSegment.size`. The visual representation of the segment MUST reflect its `shieldSegment.health` (e.g., by changing color or opacity).
- **Side Effects**: Updates the visual content of the game canvas.
- **✅ Acceptance Criteria**:
  - The canvas MUST be cleared before drawing each frame.
  - The player ship, all active invaders, all active player bullets, all active invader bullets, and all active shield segments MUST be rendered at their correct `position` and `size` as specified in the `GameState`.
  - Shield segments MUST visually indicate their remaining `health`.

#### handleKeyboardInput
**Contract**: Captures keyboard events (key presses and releases) and translates them into abstract player actions, then dispatches these actions via the `onPlayerAction` callback.
- **Signature**: `(onPlayerAction: (action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean) => void): void`
- **Trigger**:
  - On Physical Key 'ArrowLeft' or 'A' Press
  - On Physical Key 'ArrowLeft' or 'A' Release
  - On Physical Key 'ArrowRight' or 'D' Press
  - On Physical Key 'ArrowRight' or 'D' Release
  - On Physical Key 'Space' Press
  - On Physical Key 'Space' Release
- **Flow**:
  1. When a relevant key is pressed:
     - IF the key is 'ArrowLeft' or 'A': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_LEFT` in `./game-domain.isl.md` and `isPressed: true`.
     - IF the key is 'ArrowRight' or 'D': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_RIGHT` in `./game-domain.isl.md` and `isPressed: true`.
     - IF the key is 'Space': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.SHOOT` in `./game-domain.isl.md` and `isPressed: true`.
  2. When a relevant key is released:
     - IF the key is 'ArrowLeft' or 'A': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_LEFT` in `./game-domain.isl.md` and `isPressed: false`.
     - IF the key is 'ArrowRight' or 'D': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.MOVE_RIGHT` in `./game-domain.isl.md` and `isPressed: false`.
     - IF the key is 'Space': Dispatch `onPlayerAction` with `action: > **Reference**: `PlayerActionEnum.SHOOT` in `./game-domain.isl.md` and `isPressed: false`.
- **Side Effects**: Triggers the `onPlayerAction` callback provided during component instantiation, which typically updates the game state via `GameLogic.processPlayerInput`.
- **✅ Acceptance Criteria**:
  - Pressing 'ArrowLeft' or 'A' MUST trigger `onPlayerAction` with `MOVE_LEFT` and `true`. Releasing MUST trigger `MOVE_LEFT` and `false`.
  - Pressing 'ArrowRight' or 'D' MUST trigger `onPlayerAction` with `MOVE_RIGHT` and `true`. Releasing MUST trigger `MOVE_RIGHT` and `false`.
  - Pressing 'Space' MUST trigger `onPlayerAction` with `SHOOT` and `true`. Releasing MUST trigger `SHOOT` and `false`.
  - No actions MUST be dispatched for irrelevant key presses.
### 🚨 Global Constraints
- All rendered entities MUST remain within the `gameConfig.canvasWidth` and `gameConfig.canvasHeight` boundaries.
- The presentation layer MUST NOT modify the `GameState` directly; all state changes MUST be initiated through the `onPlayerAction` callback or by receiving an updated `GameState` from its parent.
### ✅ Acceptance Criteria
- The component MUST correctly render all dynamic game elements (player, invaders, bullets, shields) based on the provided `GameState`.
- The component MUST accurately capture and dispatch player input events (move left, move right, shoot) to the `onPlayerAction` callback.
- The rendering MUST be performant enough to maintain a smooth visual experience during gameplay.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: hud-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: hud-presentation.isl.md -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./hud-presentation -->
**Implementation**: ./hud-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: HudPresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`)

### 📐 Appearance
The HUD elements are displayed at the top of the game canvas.
- **Score**: Positioned in the top-left corner.
- **Lives**: Positioned in the top-right corner, typically represented by a number and/or small player ship icons.
- **Level**: Positioned centrally at the top.
- All text elements use a clear, readable font and a contrasting color (e.g., white or green).

### 📦 Content
The `HudPresentation` component contains the following visual elements:
- A text display for the current score.
- A text display for the remaining player lives.
- A text display for the current level number.

### ⚡ Capabilities
#### updateHudDisplay
**Contract**: Renders or updates the Head-Up Display elements based on the provided game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`): Void`
- **Flow**:
  1. Retrieve `score` from `gameState`.
  2. Retrieve `playerState.lives` from `gameState`.
  3. Retrieve `levelNumber` from `gameState`.
  4. Display the `score` value in the designated score area.
  5. Display the `playerState.lives` value (and/or corresponding icons) in the designated lives area.
  6. Display the `levelNumber` value in the designated level area.
- **Side Effects**: Updates the visual representation of the HUD on the screen.
- **✅ Acceptance Criteria**:
  - The displayed score MUST accurately reflect `gameState.score`.
  - The displayed lives count MUST accurately reflect `gameState.playerState.lives`.
  - The displayed level number MUST accurately reflect `gameState.levelNumber`.
  - The HUD elements MUST be visible and clearly readable at their designated positions.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: start-game-presentation.ref.md -->
<!-- INTERFACE (REF) FOR: start-game-presentation.isl.md -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./start-game-presentation -->
**Implementation**: ./start-game-presentation

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: StartGamePresentation
### Role: Presentation
**Signature**: (gameState: > **Reference**: `GameState` in `./game-domain.isl.md`, onStartGame: `(stateToStart: > **Reference**: `GameState` in `./game-domain.isl.md`) => void`, onResetGame: `(stateToReset: > **Reference**: `GameState` in `./game-domain.isl.md`) => void`)

### 📐 Appearance
- **Initial Screen**:
  - Centered title "SPACE INVADERS" (large, prominent font).
  - Centered subtitle "Press Start" (smaller font below title).
  - A button labeled "START GAME" below the subtitle.
- **Game Over Screen**:
  - Centered title "GAME OVER" (large, red font).
  - Centered text "SCORE: [current score]" (below title).
  - A button labeled "PLAY AGAIN" below the score.
- **Game Won Screen**:
  - Centered title "YOU WON!" (large, green font).
  - Centered text "SCORE: [current score]" (below title).
  - A button labeled "PLAY AGAIN" below the score.
- **General**:
  - All text and buttons should be clearly visible against a dark background, typically centered on the game canvas.

### 📦 Content
- Contains a title text element.
- Contains a score display text element (for game over/won screens).
- Contains a button element for starting/restarting the game.

### ⚡ Capabilities
#### render
**Contract**: Displays the appropriate screen (start, game over, or game won) based on the current game state.
- **Signature**: `(gameState: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Flow**:
  1. IF `gameState.status` is `INITIAL` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "SPACE INVADERS" title.
     THEN Display "Press Start" subtitle.
     THEN Display "START GAME" button.
  2. ELSE IF `gameState.status` is `GAME_OVER` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "GAME OVER" title.
     THEN Display "SCORE: " followed by `gameState.score`.
     THEN Display "PLAY AGAIN" button.
  3. ELSE IF `gameState.status` is `GAME_WON` (> **Reference**: `GameStatusEnum` in `./game-domain.isl.md`):
     THEN Display "YOU WON!" title.
     THEN Display "SCORE: " followed by `gameState.score`.
     THEN Display "PLAY AGAIN" button.
  4. ELSE (e.g., `PLAYING`):
     THEN Hide all elements of this presentation component.
- **Side Effects**: Renders or hides UI elements on the screen.
- **✅ Acceptance Criteria**:
  - The correct title and message MUST be displayed for `INITIAL`, `GAME_OVER`, and `GAME_WON` states.
  - The current score MUST be displayed on `GAME_OVER` and `GAME_WON` screens.
  - The appropriate button ("START GAME" or "PLAY AGAIN") MUST be displayed.
  - No elements from this component MUST be visible when the game status is `PLAYING`.

#### handleStartButtonClick
**Contract**: Responds to the user's action to start a new game from the initial screen.
- **Signature**: `(): void`
- **Trigger**: User interaction (e.g., click) on the "START GAME" button.
- **Flow**:
  1. Request `onStartGame` with the current `gameState`.
- **Side Effects**: Triggers a state change in the game logic to begin gameplay.
- **✅ Acceptance Criteria**:
  - `onStartGame` MUST be requested when the "START GAME" button is activated.

#### handleRestartButtonClick
**Contract**: Responds to the user's action to reset the game after a game over or game won state, preparing for a new game.
- **Signature**: `(): void`
- **Trigger**: User interaction (e.g., click) on the "PLAY AGAIN" button.
- **Flow**:
  1. Request `onResetGame` with the current `gameState`.
- **Side Effects**: Triggers a full game reset in the game logic, which will cause the parent component to update the `gameState` to `INITIAL`.
- **✅ Acceptance Criteria**:
  - `onResetGame` MUST be requested when the "PLAY AGAIN" button is activated.
<!-- END DEPENDENCY INTERFACE -->

<!-- START DEPENDENCY INTERFACE: game-domain.ref.md -->
<!-- INTERFACE (REF) FOR: game-domain.isl.md -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
<!-- IMPLEMENTATION PATH: ./game-domain -->
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
<!-- END DEPENDENCY INTERFACE -->

<!-- SOURCE FILE TO IMPLEMENT -->
# Project: Space Invaders Clone

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Concepts/Capabilities in `./game-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./game-board-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./hud-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./start-game-presentation.isl.md`
> **Reference**: Concepts/Capabilities in `./game-domain.isl.md`

## Component: Main
### Role: Presentation
**Signature**: Void

### 📦 Content
This component orchestrates the display and interaction of the following child presentation components:
- `GameBoardPresentation`: Renders the main game area, including the player, invaders, bullets, and shields.
- `HudPresentation`: Displays essential game statistics such as score, remaining lives, and the current level number.
- `StartGamePresentation`: Manages the display of the initial start screen, game over screen, and game won screen, handling user interactions to start or restart the game.

### 💡 Global Hints
- The `gameConfig` object defines the global parameters for the game, including canvas dimensions, level configurations, and shield properties. This configuration is passed to the `GameLogic` component upon initialization.
- The game loop uses `requestAnimationFrame` for smooth, browser-optimized animation, ensuring frame-rate independent updates through `deltaTime`.
- State management is centralized in the `Main` component, which holds the single source of truth (`gameState`) and updates it via `GameLogic` capabilities.

### 🚨 Global Constraints
- The `gameConfig` MUST adhere to the structure and constraints defined in > **Reference**: `GameConfig` in `./game-domain.isl.md`.
- The game loop MUST ensure `deltaTime` is correctly calculated and passed to `GameLogic.updateGame` to maintain frame-rate independent physics.
- All interactions with `GameLogic` MUST be through its defined capabilities, ensuring business logic integrity and separation of concerns.

### ⚡ Capabilities
#### initializeApplication
**Contract**: Sets up the initial game configuration, initializes the game logic, and prepares the application for starting the game loop. This is the primary entry point for the entire application.
- **Signature**: `(): void`
- **Flow**:
  1. Define a `gameConfig` object (type: > **Reference**: `GameConfig` in `./game-domain.isl.md`) with the following properties:
     - `canvasWidth`: 800 (px)
     - `canvasHeight`: 600 (px)
     - `playerBulletCooldown`: 500 (ms)
     - `maxLevels`: 10
     - `levelConfigs`: An array of 10 > **Reference**: `LevelConfig` in `./game-domain.isl.md` objects, each defining `levelNumber`, `invaderRows`, `invaderCols`, `invaderSpeedMultiplier`, and `invaderShotFrequencyMultiplier`.
       - Level 1: `invaderRows: 5`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.0`, `invaderShotFrequencyMultiplier: 1.0`
       - Level 2: `invaderRows: 5`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.1`, `invaderShotFrequencyMultiplier: 0.95`
       - Level 3: `invaderRows: 6`, `invaderCols: 10`, `invaderSpeedMultiplier: 1.2`, `invaderShotFrequencyMultiplier: 0.9`
       - Level 4: `invaderRows: 6`, `invaderCols: 11`, `invaderSpeedMultiplier: 1.3`, `invaderShotFrequencyMultiplier: 0.85`
       - Level 5: `invaderRows: 7`, `invaderCols: 11`, `invaderSpeedMultiplier: 1.4`, `invaderShotFrequencyMultiplier: 0.8`
       - Level 6: `invaderRows: 7`, `invaderCols: 12`, `invaderSpeedMultiplier: 1.5`, `invaderShotFrequencyMultiplier: 0.75`
       - Level 7: `invaderRows: 8`, `invaderCols: 12`, `invaderSpeedMultiplier: 1.6`, `invaderShotFrequencyMultiplier: 0.7`
       - Level 8: `invaderRows: 8`, `invaderCols: 13`, `invaderSpeedMultiplier: 1.7`, `invaderShotFrequencyMultiplier: 0.65`
       - Level 9: `invaderRows: 9`, `invaderCols: 13`, `invaderSpeedMultiplier: 1.8`, `invaderShotFrequencyMultiplier: 0.6`
       - Level 10: `invaderRows: 9`, `invaderCols: 14`, `invaderSpeedMultiplier: 2.0`, `invaderShotFrequencyMultiplier: 0.55`
     - `shieldConfig`: `numShields: 4`, `segmentsPerShield: 10`, `shieldHealth: 3`
  2. Instantiate the `GameLogic` component, passing the defined `gameConfig`.
  3. Obtain the initial `gameState` by requesting `GameLogic.initializeGame()`.
  4. Instantiate `GameBoardPresentation`, passing the initial `gameState`, `gameConfig`, and a callback to `handlePlayerAction`.
  5. Instantiate `HudPresentation`, passing the initial `gameState`.
  6. Instantiate `StartGamePresentation`, passing the initial `gameState`, a callback to `handleStartGameRequest`, and a callback to `handleResetGameRequest`.
  7. Request `GameBoardPresentation.handleKeyboardInput`, passing the `handlePlayerAction` callback.
  8. Initiate the `startGameLoop`.
- **Side Effects**: Initializes all game components, sets up global configuration, and starts the main game loop.
- **✅ Acceptance Criteria**:
  - `GameLogic` MUST be initialized with a valid `GameConfig` instance.
  - The initial `GameState` MUST be obtained from `GameLogic.initializeGame`.
  - All presentation components (`GameBoardPresentation`, `HudPresentation`, `StartGamePresentation`) MUST be instantiated with the correct initial `GameState` and appropriate callbacks.
  - Keyboard input handling MUST be delegated to `GameBoardPresentation` with the `handlePlayerAction` callback.
  - The `startGameLoop` MUST be initiated.

#### startGameLoop
**Contract**: The central game loop responsible for continuously updating the game state and rendering all presentation components. This loop runs continuously while the application is active.
- **Signature**: `(): void`
- **Trigger**: Initiated by `initializeApplication` and recursively called via an animation frame mechanism.
- **Flow**:
  1. Obtain the current timestamp.
  2. Update the `gameState` by requesting `GameLogic.updateGame`, passing the current `gameState` and the current timestamp.
  3. Request `GameBoardPresentation.renderGameElements`, passing the updated `gameState` and `gameConfig`.
  4. Request `HudPresentation.updateHudDisplay`, passing the updated `gameState`.
  5. Request `StartGamePresentation.render`, passing the updated `gameState`.
  6. Schedule the next execution of `startGameLoop` using an animation frame mechanism (e.g., `requestAnimationFrame`).
- **Side Effects**: Continuously updates the game's internal state and refreshes the visual display of all game elements and UI.
- **✅ Acceptance Criteria**:
  - `GameLogic.updateGame` MUST be called in each iteration with the latest `gameState` and `currentTime`.
  - All presentation components (`GameBoardPresentation`, `HudPresentation`, `StartGamePresentation`) MUST be requested to render/update with the latest `gameState` in each iteration.
  - The loop MUST be self-perpetuating via an animation frame mechanism.

#### handlePlayerAction
**Contract**: A callback function provided to `GameBoardPresentation` to process player input events (key presses/releases) and update the game state accordingly.
- **Signature**: `(action: > **Reference**: `PlayerActionEnum` in `./game-domain.isl.md`, isPressed: boolean): void`
- **Trigger**: Dispatched by `GameBoardPresentation.handleKeyboardInput` when a relevant player key is pressed or released.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.processPlayerInput`, passing the current `gameState`, the `action`, and `isPressed` status.
- **Side Effects**: Modifies the `playerActionFlags` within the `gameState` to reflect the player's intended actions.
- **✅ Acceptance Criteria**:
  - `GameLogic.processPlayerInput` MUST be requested with the correct `action` and `isPressed` values.
  - The `gameState` MUST be updated to reflect the player's action flags.

#### handleStartGameRequest
**Contract**: A callback function provided to `StartGamePresentation` to initiate a new game when the user interacts with the "START GAME" button.
- **Signature**: `(stateToStart: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Trigger**: Dispatched by `StartGamePresentation.handleStartButtonClick`.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.startGame`, passing the `stateToStart`.
- **Side Effects**: Transitions the game status to `PLAYING`, resets score and lives, and initializes game entities for the first level.
- **✅ Acceptance Criteria**:
  - `GameLogic.startGame` MUST be requested with the current `gameState`.
  - The `gameState` MUST transition to `PLAYING` status and be populated with initial game entities.

#### handleResetGameRequest
**Contract**: A callback function provided to `StartGamePresentation` to reset the game to its initial state when the user interacts with the "PLAY AGAIN" button (after a Game Over or Game Won state).
- **Signature**: `(stateToReset: > **Reference**: `GameState` in `./game-domain.isl.md`): void`
- **Trigger**: Dispatched by `StartGamePresentation.handleRestartButtonClick`.
- **Flow**:
  1. Update the `gameState` by requesting `GameLogic.resetGame`, passing the `stateToReset`.
- **Side Effects**: Transitions the game status to `INITIAL`, clears all dynamic game entities, and resets score and lives to default values.
- **✅ Acceptance Criteria**:
  - `GameLogic.resetGame` MUST be requested with the current `gameState`.
  - The `gameState` MUST transition to `INITIAL` status, ready for a new game to begin.