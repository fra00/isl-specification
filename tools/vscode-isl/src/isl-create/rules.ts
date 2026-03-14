/**
 * ISL Canonical Rules & Structure Definition
 * Extracted from: Intent Specification Language (ISL) LLM First.md
 */

export const ISL_RULES = `
## Canonical Rules (NORMATIVE)

### Rule 1: Semantic Markers
Sections with emoji are **NORMATIVE** (must implement exactly):
- ⚡ Capabilities/Methods
- 🚨 Constraints
- ✅ Acceptance Criteria
- 🧪 Test Scenarios

Sections without normative emoji are **INFORMATIVE** (guidance only):
- 📐 Appearance/Interface
- 📦 Content/Structure
- 💡 Implementation Hints

### Rule 4: ISL Boundary (Critical)
ISL defines **intent and behavior**, NOT implementation.
**MUST**:
- Define observable behavior
- Describe what system does
- Express logic as intent/rules/outcomes
- Remain implementation-agnostic
**MUST NOT**:
- Describe step-by-step algorithms
- Be written as pseudocode
- Act as Technical Design Document
- Contain low-level control flow tied to syntax

**Flow Syntax Constraints**:
Flows MUST describe intent/operations using natural language, NOT implementation code or pseudocode.
⛔ FORBIDDEN:
- The word "Call" or "Invoke" targeting a specific method (e.g., "Call renderScore", "Invoke GameCanvas.render").
- Pseudocode syntax (e.g., "execute(param)", "object.method()").
✅ REQUIRED:
- Use descriptive verbs describing the *intent* (e.g., "Display the score", "Calculate the total", "Update the state", "GameScreen updates content", "Component updates layout").
- For component interactions, use: "Trigger", "Dispatch", "Request", or "Pass data to" (e.g. "Trigger GameEngine update", NOT "Call GameEngine.update").


**Supported Control Structures**:
- \`IF...THEN...ELSE\`
- \`FOR EACH...IN\`
- \`WHILE condition\`
- \`TRY...CATCH\`
- \`BRANCH: [conditions]\`

### Rule 5: Role Separation
- **Presentation**: MUST define visual appearance. MUST NOT implement business logic.
- **Backend**: MUST define API contracts. MUST NOT define visual properties.

### Rule 6: Content Semantics (Structural Composition)
The \`📦 Content\` section defines the **Structural Composition** of the component.
- **For Leaf Components**: Describes visual elements (buttons, text, inputs).
- **For Container Components**: Lists the **Child Components** included in this view.
  - **Usage**: Use this section to declare *what* is rendered (e.g., "Contains \`Header\` and \`Footer\`"), NOT the \`Flow\` section.
  - **Layout**: Describe how children are arranged (e.g., "Sidebar on left, Grid on right").

### Rule 7: Entry Point Autonomy
The Root/Entry Point component (usually \`Main\`) MUST be **Autonomous**.
- **Signature**: MUST be Void (no arguments), unless explicitly required by requirements.
- It is responsible for instantiating dependencies (Composition Root), not receiving them.

### Rule 8: Abstraction Level (Input & Events)
ISL describes **Intent**, not Syntax.
- **Input**: Describe physical actions or intents, NOT specific event properties.
  - ✅ "On Physical Key 'Space' Press", "When User clicks Submit"
  - ⛔ "IF event.key === ' '", "onClick(e)"
- **Implementation Agnostic**: Do not mention specific browser/runtime APIs (e.g., \`window.addEventListener\`) unless wrapping them in a Capability.

### Rule 9: Units & Precision
All numeric values in Domain or Logic MUST specify **Units of Measurement**.
- ✅ \`speed: 300 (px/s)\`, \`timeout: 500 (ms)\`, \`angle: 90 (deg)\`
- ⛔ \`speed: 5\`, \`timeout: 500\`

### Rule 10: Real-Time & Continuous Logic
For systems involving time (Games, Simulations, Animations):
- **Separation**: Distinguish between **Discrete Input** (Events) and **Continuous Logic** (Update Loop).
- **Input**: Should typically update State Flags (e.g., \`isMovingLeft = true\`).
- **Update Loop**: Logic involving movement or physics MUST be described as a function of **Time** (DeltaTime), not just discrete steps.

### Rule 11: References & Dependencies
- **Declaration**: All external dependencies (Types, Components, Enums) MUST be declared at the top of the file, immediately after the metadata block, using the syntax: \`> **Reference**: [Type] in [Path]\`.
- **Usage**: Inside the document body (Signatures, Flows, Properties), refer to these types using the \`@\` prefix (e.g., \`@User\`, \`@Order\`). DO NOT use the full reference syntax in the body.

## Document Structure
   - # Project: [Name]
   - **Version**: [Version]
   - **ISL Version**: [Version]
   - **Implementation**: [Path]
   - ---
   - > **Reference**: [Type] in [Path]
   - ## Domain Concepts (Optional IF exist must be exported and accessible for capabilities)
   - ## Component: [Name]
     - ### Role: [Presentation | Backend | Business Logic]
     - **Signature**: [Input Props / Constructor Args]
     - ### 📐 Appearance (Only for Presentation)
     - ### 📦 Content (Only for Presentation)
     - ### ⚡ Capabilities
       - #### [capabilityName]
         - **Contract**: [Description]
         - **Signature**: Input/Output
         - **Trigger**: [Event]
         - **Flow** (if logic is complex)
         - **Side Effects**
         - **Cleanup**
         - **💡 Implementation Hint**
         - **🚨 Constraint**
         - **✅ Acceptance Criteria**
         - **🧪 Test Scenarios**
     - ### 💡 Global Hints
     - ### 🚨 Global Constraints
     - ### ✅ Acceptance Criteria
     - ### 🧪 Test Scenarios

## RFC 2119 Keywords
- **MUST**: Absolute requirement
- **MUST NOT**: Absolute prohibition
- **SHOULD**: Strong preference
`;
