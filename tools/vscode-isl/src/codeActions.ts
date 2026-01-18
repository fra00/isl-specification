import * as vscode from "vscode";

export class ISLCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    context.diagnostics.forEach((diagnostic) => {
      if (diagnostic.code === "ISL-021") {
        actions.push(this.createAddRoleAction(document, diagnostic));
      }
      if (diagnostic.code === "ISL-030") {
        actions.push(this.createAddContractAction(document, diagnostic));
      }
    });

    return actions;
  }

  private createAddRoleAction(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Add Role section",
      vscode.CodeActionKind.QuickFix,
    );

    action.edit = new vscode.WorkspaceEdit();
    const line = diagnostic.range.start.line + 1;
    const position = new vscode.Position(line, 0);

    action.edit.insert(document.uri, position, "\n### Role: Backend\n");

    action.diagnostics = [diagnostic];
    action.isPreferred = true;

    return action;
  }

  private createAddContractAction(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Add Contract field",
      vscode.CodeActionKind.QuickFix,
    );

    action.edit = new vscode.WorkspaceEdit();
    const line = diagnostic.range.start.line + 1;
    const position = new vscode.Position(line, 0);

    action.edit.insert(
      document.uri,
      position,
      "\n**Contract**: [Describe what this capability promises to do]\n",
    );

    action.diagnostics = [diagnostic];
    action.isPreferred = true;

    return action;
  }
}
