import * as fs from "fs";
import * as path from "path";
import { LLMClient, LLMProvider } from "./llm-client";
import { ISLLogicAuditor } from "./isl-logic-test/auditor";

function getFilesRecursively(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== "build" &&
        entry.name !== "bin" &&
        entry.name !== "logic-test" &&
        !entry.name.startsWith(".")
      ) {
        getFilesRecursively(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      if (
        entry.name.endsWith(".isl.md") &&
        !entry.name.endsWith(".test.isl.md") &&
        !entry.name.endsWith(".report.md")
      ) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function main() {
  const args = process.argv.slice(2);
  const useGemini = args.includes("--gemini");
  const isCriticalOnly = args.includes("--critical");
  const positionalArgs = args.filter((a) => !a.startsWith("--"));
  const pathArg = positionalArgs[0];

  const provider: LLMProvider = useGemini ? "gemini" : "openai";
  const client = new LLMClient(provider);
  const auditor = new ISLLogicAuditor(client);

  const reports: string[] = [];
  const startDir =
    pathArg && !pathArg.endsWith(".isl.md") ? pathArg : process.cwd();
  const reportDir = path.join(startDir, "logic-test", "report");
  const reportPath = path.join(reportDir, "audit-summary.report.md");

  let files: string[] = [];
  if (pathArg && pathArg.endsWith(".isl.md")) {
    files = [path.resolve(pathArg)];
  } else {
    console.log(`🔍 Searching ISL files in: ${startDir}...`);
    files = getFilesRecursively(startDir);
  }

  if (isCriticalOnly && fs.existsSync(reportPath)) {
    console.log(
      `🎯 --critical active: filtering files from previous summary...`,
    );
    const reportContent = fs.readFileSync(reportPath, "utf-8");
    const sections = reportContent.split("## Audit Report for:").slice(1);
    const criticalFilenames = sections
      .filter((s) => s.includes("[CRITICAL]"))
      .map((s) => s.split("\n")[0].trim());

    files = files.filter((f) => criticalFilenames.includes(path.basename(f)));
    console.log(
      `📂 Found ${files.length} files with critical issues to re-audit.`,
    );
  }

  for (const file of files) {
    const report = await auditor.runAudit(file);
    if (report) reports.push(report);
  }

  if (reports.length > 0) {
    const combinedReport = `# Global ISL Audit Report\n\nGenerated on: ${new Date().toLocaleString()}\n\n${reports.join("\n")}`;
    fs.writeFileSync(reportPath, combinedReport);

    console.log(`\n📊 Global audit report generated: ${reportPath}`);
    const hasIssues = reports.some((r) => !r.includes("ALL TESTS PASSED"));
    if (hasIssues) {
      console.warn(
        "⚠️ Issues found in some files. Check the report for REPAIR_PAYLOADs.",
      );
    } else {
      console.log("✅ All files audited successfully.");
    }
  }
}

if (require.main === module) {
  main();
}
