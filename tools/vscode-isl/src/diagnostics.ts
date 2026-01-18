import * as vscode from "vscode";
import { ISLValidator, ValidationIssue } from "./validator";

export class ISLDiagnostics {
  constructor(
    private validator: ISLValidator,
    private diagnosticCollection: vscode.DiagnosticCollection,
  ) {}

  updateDiagnostics(document: vscode.TextDocument): void {
    const issues = this.validator.validate(document.getText());
    const diagnostics: vscode.Diagnostic[] = [];

    issues.forEach((issue) => {
      const line = document.lineAt(issue.line);
      const range = new vscode.Range(
        issue.line,
        issue.column,
        issue.line,
        line.text.length,
      );

      const severity = this.getSeverity(issue.severity);
      const diagnostic = new vscode.Diagnostic(
        range,
        `[${issue.rule}] ${issue.message}`,
        severity,
      );

      diagnostic.source = "ISL";
      diagnostic.code = issue.rule;

      diagnostics.push(diagnostic);
    });

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private getSeverity(severity: string): vscode.DiagnosticSeverity {
    switch (severity) {
      case "error":
        return vscode.DiagnosticSeverity.Error;
      case "warning":
        return vscode.DiagnosticSeverity.Warning;
      case "info":
        return vscode.DiagnosticSeverity.Information;
      default:
        return vscode.DiagnosticSeverity.Hint;
    }
  }
}
