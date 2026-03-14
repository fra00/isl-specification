export interface StackConfig {
  id: string;
  techStack: string[];
  extensions: {
    default: string;
    [role: string]: string;
  };
  promptPersona: string;
  constraints: string[];
  safetyConstraints: string[];
  signatureFormat: string;
}

// GUARDRAILS: Universal rules applicable to ANY programming language to prevent common runtime errors.
const UNIVERSAL_GUARDRAILS = [
  "Null Safety: ALWAYS use safe access (`?.`, `!= null`, `is not None`) for nested properties/uninitialized variables",
  "Default Init: prefer valid default values (empty string/array, zero object) vs `null`/`undefined`",
  "Async State: EXPLICITLY handle loading (Loading, retry, blocking) - never assume data is immediately available",
];

// Export alias for backward compatibility if needed, though internal usage is preferred
export const UNIVERSAL_SAFETY_CONSTRAINTS = UNIVERSAL_GUARDRAILS;

const PYTHON_SAFETY = [
  "Null Safety: ALWAYS use safe access (`is not None`) for nested properties/uninitialized variables",
  "Default Init: prefer valid default values (empty string/list, zero) vs `None`",
  "Error Handling: Use try/except blocks for external operations (I/O, API calls)",
];

export const STACKS: Record<string, StackConfig> = {
  "react-js": {
    id: "react-js",
    techStack: ["React 18", "TailwindCSS", "Javascript (ES6+)", "Fetch API"],
    extensions: {
      default: ".jsx",
      Presentation: ".jsx",
      "Business Logic": ".js",
      Domain: ".js",
      Model: ".js",
    },
    promptPersona: "Senior React Developer - Functional Components & Hooks",
    constraints: [
      "NO: TypeScript types, JsDoc, import @typedef, defaultProps (use ES6 default params)",
      "React Hook Rules: Hooks (functions starting with `use`) MUST be called at the top level. NEVER call hooks inside loops, conditions, or nested functions (including callbacks of `useMemo`, `useEffect`).",
      "React Stability: Functions passed as props to child components or used in `useEffect` dependencies MUST be wrapped in `useCallback` to ensure referential stability.",
      "Custom Hooks Signature: Custom Hooks MUST always accept a single configuration object as an argument. Example: `useMyHook({ param1, param2 })`. NEVER use positional arguments.",
      "Naming Conventions: Function exports (Logic/Helpers) MUST be camelCase (e.g. `updateGame`). React Components & Domain Factories MUST be PascalCase.",
      'Import: signature "export default [Name]" → `import Name from...` otherwise "export name" → `import { Name } from...`',
      "Import: Use correct **Implementation** as path for import, using relative paths",
      'Import: the start root MUST be "./ (e.g. \`from "./domain"\`). NEVER use absolute imports or paths starting with src/ or similar.',
      "Import: relative, ONLY necessary for execution",
      "Runtime: import ONLY real constants/functions/classes. NEVER types/interfaces (they do not exist in JS)",
      "Signature: ReactElement → use as JSX `<Comp />`",
      "Instantiation: use object literals `{}` or Factory Functions. NEVER use `new` for project components. Use `new` ONLY for built-in classes (Date, Map).",
      "Domain: only ES6 objects",
      "Domain Entity Naming: For each Entity (e.g. `User`), generate an exported Factory Function with the SAME PascalCase name (e.g. `export const User = (data) => ({...})`). NO `create`/`make` prefixes.",
      "Domain Objects: MUST be instantiated using Domain Factory Functions (e.g. `Paddle()`). DO NOT create ad-hoc object literals that might miss properties.",
      "Hooks: Custom Hooks (useName). Exposed functions MUST be stable (use refs for state access) to prevent consumer re-renders.",
      "Consumption: Hook import → call hook to get function. NO direct import of functions from hooks",
      'Avoid "React has detected a change in the order of Hooks called by [Component]. This will lead to bugs and errors if not fixed." ',
      "Business Logic: MUST use Named Exports for functions. DO NOT export a singleton object.",
      "Immutability: Always return new objects/arrays when updating state. Never mutate state in place.",
      "Visibility: All Capabilities in Business Logic/Domain MUST be exported. Presentation capabilities are internal to the component.",
      "Presentation Components: MUST NOT expose imperative methods (render, update). Logic must be driven by Props/State changes.",
      "Comments: standard syntax only",
    ],
    safetyConstraints: [
      ...UNIVERSAL_GUARDRAILS,
      "State Init: if synchronous use Lazy Init `useState(() => init())`. NEVER `useEffect` for synchronous init",
      "Conditional Render: state `null`/`undefined` → verify before passing to children (object or nested properties) `{data && <Child data={data} />}`",
      "Default Props: always default in destructuring if object might be missing",
    ],
    signatureFormat: `You MUST output the signature as a TypeScript Declaration (pseudo-code) block.
CRITICAL FOR FACTORIES: For Factory Functions (Domain Entities), you MUST expand the return type object literal to show ALL properties. NEVER return 'any', 'object' or the interface name alone.
Examples:
- Entity Factory: \`export const UserEntity: (data?: UserEntity) => { id: string; name: string; isActive: boolean };\`
- Function: \`export function calculate(a: number): number;\`
- Component: \`export default function MyComponent(props: { title: string }): React.Element;\`
- Hook: \`export function useMyHook(): { data: any };\``,
  },
  "python-fastapi": {
    id: "python-fastapi",
    techStack: ["Python 3.10", "FastAPI", "Pydantic"],
    extensions: { default: ".py" },
    promptPersona: "Senior Python Backend Developer - FastAPI & Pydantic",
    constraints: [
      "Export: standard Python classes/functions",
      "Type Hints: Python 3.10+",
      "Models: Pydantic for domain",
      "Import: absolute or standard relative",
    ],
    safetyConstraints: [
      ...UNIVERSAL_GUARDRAILS,
      "Models: default values in Pydantic to avoid missing fields",
    ],
    signatureFormat: `You MUST output the signature as Python Type Hints (Stub file style).
Examples:
- Function: \`def calculate(a: int) -> int: ...\`
- Class: \`class MyModel(BaseModel): ...\`
- Variable: \`MAX_VALUE: int = ...\``,
  },
  python: {
    id: "python",
    techStack: ["Python 3.10"],
    extensions: {
      default: ".py",
      Presentation: ".py",
      "Business Logic": ".py",
      Domain: ".py",
      Model: ".py",
      Backend: ".py",
    },
    promptPersona: "Senior Python Developer",
    constraints: [
      "Export: standard Python classes/functions",
      "Type Hints: Python 3.10+",
      "Import: absolute or standard relative",
      "Domain: use dataclasses for data structures",
      "Style: Follow PEP 8 guidelines",
    ],
    safetyConstraints: [...PYTHON_SAFETY, ...UNIVERSAL_GUARDRAILS],
    signatureFormat: `You MUST output the signature as Python Type Hints (Stub file style).
Examples:
- Function: \`def calculate(a: int) -> int: ...\`
- Class: \`class MyClass: ...\`
- Variable: \`MAX_VALUE: int = ...\``,
  },
};

export function getStackConfig(id: string): StackConfig {
  return STACKS[id] || STACKS["react-js"];
}
