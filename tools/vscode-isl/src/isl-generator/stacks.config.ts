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

const UNIVERSAL_SAFETY = [
  "Null Safety: ALWAYS use safe access (`?.`, `!= null`, `is not None`) for nested properties/uninitialized variables",
  "Default Init: prefer valid default values (empty string/array, zero object) vs `null`/`undefined`",
  "Async State: EXPLICITLY handle loading (Loading, retry, blocking) - never assume data is immediately available",
];

// Export alias for backward compatibility if needed, though internal usage is preferred
export const UNIVERSAL_SAFETY_CONSTRAINTS = UNIVERSAL_SAFETY;

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
      "Naming Conventions: Function exports (Logic/Helpers) MUST be camelCase (e.g. `updateGame`). React Components & Domain Factories MUST be PascalCase.",
      'Import: signature "export default [Name]" → `import Name from...` otherwise "export name" → `import { Name } from...`',
      "Import: Use correct **Implementation** as path for import",
      "Runtime: import ONLY real constants/functions/classes. NEVER types/interfaces (they do not exist in JS)",
      "Import: relative, ONLY necessary for execution",
      "Signature: ReactElement → use as JSX `<Comp />`",
      "Instantiation: use object literals `{}` or Factory Functions. NEVER use `new` for project components. Use `new` ONLY for built-in classes (Date, Map).",
      "Domain: only ES6 objects",
      "Domain Entity Naming: For each Entity (e.g. `User`), generate an exported Factory Function with the SAME PascalCase name (e.g. `export const User = (data) => ({...})`). NO `create`/`make` prefixes.",
      "Domain Objects: MUST be instantiated using Domain Factory Functions (e.g. `Paddle()`). DO NOT create ad-hoc object literals that might miss properties.",
      "Declare hooks ONLY inside a function body",
      "Hooks: Custom Hooks (useName). Exposed functions MUST be stable (use refs for state access) to prevent consumer re-renders.",
      "Consumption: Hook import → call hook to get function. NO direct import of functions from hooks",
      "Business Logic: MUST use Named Exports for functions. DO NOT export a singleton object.",
      "Immutability: Always return new objects/arrays when updating state. Never mutate state in place.",
      "Visibility: All Capabilities in Business Logic/Domain MUST be exported. Presentation capabilities are internal to the component.",
      "Presentation Components: MUST NOT expose imperative methods (render, update). Logic must be driven by Props/State changes.",
      "NO: TypeScript types, JsDoc, import @typedef, defaultProps (use ES6 default params)",
      "Comments: standard syntax only",
    ],
    safetyConstraints: [
      ...UNIVERSAL_SAFETY,
      "State Init: if synchronous use Lazy Init `useState(() => init())`. NEVER `useEffect` for synchronous init",
      "Conditional Render: state `null`/`undefined` → verify before passing to children `{data && <Child data={data} />}`",
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
      ...UNIVERSAL_SAFETY,
      "Models: default values in Pydantic to avoid missing fields",
    ],
    signatureFormat: `You MUST output the signature as Python Type Hints (Stub file style).
Examples:
- Function: \`def calculate(a: int) -> int: ...\`
- Class: \`class MyModel(BaseModel): ...\`
- Variable: \`MAX_VALUE: int = ...\``,
  },
};

export function getStackConfig(id: string): StackConfig {
  return STACKS[id] || STACKS["react-js"];
}
