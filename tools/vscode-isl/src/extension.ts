import * as vscode from "vscode";
import { ISLValidator } from "./validator";
import { ISLDiagnostics } from "./diagnostics";
import { ISLCodeActionProvider } from "./codeActions";
import { ISLCompiler } from "./compiler";

let diagnosticCollection: vscode.DiagnosticCollection;
let validator: ISLValidator;
let diagnosticsProvider: ISLDiagnostics;

export function activate(context: vscode.ExtensionContext) {
  console.log("ISL Extension activated");

  // Initialize components
  diagnosticCollection = vscode.languages.createDiagnosticCollection("isl");
  validator = new ISLValidator();
  diagnosticsProvider = new ISLDiagnostics(validator, diagnosticCollection);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("isl.validate", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && isISLFile(editor.document)) {
        diagnosticsProvider.updateDiagnostics(editor.document);
        vscode.window.showInformationMessage("ISL validation completed");
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("isl.createComponent", async () => {
      await createComponentSnippet();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("isl.createCapability", async () => {
      await createCapabilitySnippet();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("isl.compile", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No ISL file open.");
        return;
      }

      try {
        const compiledContent = ISLCompiler.resolveReferences(editor.document.uri.fsPath);
        const newDoc = await vscode.workspace.openTextDocument({
          content: compiledContent,
          language: "markdown",
        });
        await vscode.window.showTextDocument(newDoc);
        vscode.window.showInformationMessage("ISL Compiled successfully!");
      } catch (error) {
        vscode.window.showErrorMessage(`Compilation error: ${error}`);
      }
    }),
  );

  // Register Code Action Provider
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { pattern: "**/*.isl.md" },
      new ISLCodeActionProvider(),
      {
        providedCodeActionKinds: ISLCodeActionProvider.providedCodeActionKinds,
      },
    ),
  );

  // Validation on document change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const config = vscode.workspace.getConfiguration("isl");
      if (config.get("validation.enabled") && isISLFile(event.document)) {
        diagnosticsProvider.updateDiagnostics(event.document);
      }
    }),
  );

  // Validation on document save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      const config = vscode.workspace.getConfiguration("isl");
      if (config.get("validation.onSave") && isISLFile(document)) {
        diagnosticsProvider.updateDiagnostics(document);
      }
    }),
  );

  // Validate all open ISL files on startup
  vscode.workspace.textDocuments.forEach((document) => {
    if (isISLFile(document)) {
      diagnosticsProvider.updateDiagnostics(document);
    }
  });

  // Status bar item
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBar.text = "$(checklist) ISL";
  statusBar.tooltip = "ISL Validation Active";
  statusBar.command = "isl.validate";
  statusBar.show();
  context.subscriptions.push(statusBar);
}

export function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}

function isISLFile(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith(".isl.md") || document.languageId === "isl";
}

async function createComponentSnippet() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const componentName = await vscode.window.showInputBox({
    prompt: "Component name",
    placeHolder: "e.g., UserService, LoginButton",
  });

  if (!componentName) return;

  const role = await vscode.window.showQuickPick(["Backend", "Presentation"], {
    placeHolder: "Select component role",
  });

  if (!role) return;

  const snippet = `
## Component: ${componentName}

[Component description]

### Role: ${role}

### 🔍 ${role === "Backend" ? "Interface" : "Appearance"}

${
  role === "Backend"
    ? "- HTTP Method:\n- Route:\n- Request Schema:\n- Response Schema:"
    : "- Visual properties\n- Layout\n- Styling"
}

### ⚡ Capabilities / Methods

#### methodName

**Signature:**
- **input**: {params}
- **output**: type

**Contract**: [What this method promises to do]

**Flow:**
1. [Step 1]
2. [Step 2]

**🚨 Constraint:**
- MUST [requirement]

**✅ Acceptance Criteria:**
- [ ] [Criterion 1]
`;

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, snippet);
  });
}

async function createCapabilitySnippet() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const capabilityName = await vscode.window.showInputBox({
    prompt: "Capability/Method name",
    placeHolder: "e.g., execute, authenticate, render",
  });

  if (!capabilityName) return;

  const snippet = `
#### ${capabilityName}

**Signature:**
- **input**: {params}
- **output**: type

**Contract**: [Promise]

**Trigger**: [Event or condition]

**Flow:**
1. [Step 1]
2. IF [condition] THEN
   a. [Branch A]
   ELSE
   b. [Branch B]

**Side Effect:**
- [State changes]

**🚨 Constraint:**
- MUST [requirement]
- MUST NOT [prohibition]

**✅ Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**🧪 Test Scenarios:**
1. **Scenario Name**:
   - Input: [data]
   - Expected: [result]
`;

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, snippet);
  });
}
