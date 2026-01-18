# ISL for VS Code

Official VS Code support for **Intent Specification Language (ISL) v1.6.1**.

This extension provides language support, snippets, validation, and tooling to write deterministic, intent-first specifications for LLM code generation.

> **ISL is a language, not a template.**
> Writing ISL-compliant documents requires understanding its canonical rules and grammar.

## Features

### 🎨 Syntax Highlighting

Full syntax highlighting for `.isl.md` files, including:

- Semantic Emojis (⚡, 🚨, ✅, 🧪, etc.)
- RFC 2119 Keywords (MUST, SHOULD, MAY)
- ISL Structure (Project, Component, Domain Concepts)

### 🧩 Intelligent Snippets

Scaffolding for common ISL patterns. Type the prefix to trigger:

| Prefix           | Description                                                          |
| :--------------- | :------------------------------------------------------------------- |
| `isl-base`       | **Full Template**: Generates a complete ISL file structure (v1.6.1). |
| `isl-project`    | **Project Header**: Standard header with versioning.                 |
| `isl-component`  | **Component**: New Component block with Role.                        |
| `isl-cap`        | **Capability**: Capability block with Contract and Flow.             |
| `isl-constraint` | **Constraint**: Normative block for rules.                           |
| `isl-test`       | **Test Scenarios**: Template for test cases.                         |
| `isl-ref`        | **Reference**: Syntax for importing shared domains.                  |
| `isl-rules`      | **Canonical Rules**: Inserts ISL rules summary.                      |
| `isl-appearance` | **Appearance**: UI visual properties section.                        |
| `isl-interface`  | **Interface**: API/Interface definition section.                     |
| `isl-security`   | **Security**: Security considerations section.                       |

### ✅ Real-time Validation (Linting)

The extension validates your specification as you type:

- **Structure**: Checks for Project Header, Domain Concepts, and Components.
- **Completeness**: Ensures Components have a `Role` and Capabilities have a `Contract`.
- **Semantics**: Validates correct usage of Section Emojis.
- **Normative Language**: Warns if Constraints lack RFC 2119 keywords.
- **Integrity**: Checks for references to undefined Domain Entities.

### 💡 Quick Fixes (Code Actions)

Automatically fix common errors:

- Add missing `Role` to Component.
- Add missing `Contract` to Capability.

### 📦 Modular Compilation

Merge multiple ISL files into a single prompt for LLMs.

1. Use `> **Reference**: ... in ./file.isl.md` to link files.
2. Run command **ISL: Compile to Prompt**.
3. A new file is generated with all references resolved inline.

### 🧙‍♂️ Interactive Wizards

- **ISL: Create New Component**: Prompts for name and role.
- **ISL: Create New Capability**: Prompts for name.

## Extension Settings

This extension contributes the following settings:

- `isl.validation.enabled`: Enable/disable real-time validation (default: `true`).
- `isl.validation.onSave`: Validate on file save (default: `true`).
- `isl.validation.strictMode`: Treat warnings as errors (default: `false`).

## Installation

### Build & Install (.vsix)

1. Ensure you have `vsce` installed: `npm install -g @vscode/vsce`
2. Run `npx vsce package` inside this folder to generate a `.vsix` file.
3. In VS Code, go to **Extensions** -> **...** -> **Install from VSIX...** and select the file.

### From Source (Development)

1. Open this folder in VS Code.
2. Run `npm install`.
3. Press `F5` to launch the **Extension Development Host**.

## Usage

1. Create a file with the extension `.isl.md` (e.g., `api-service.isl.md`).
2. Type `isl-base` to generate the initial structure.
3. Use the Command Palette (`Ctrl+Shift+P`) to access ISL commands.

📘 **Full Specification**:
👉 `Intent Specification Language (ISL)`.md)
