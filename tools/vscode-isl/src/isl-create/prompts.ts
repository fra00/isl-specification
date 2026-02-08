import { ChatMessage } from "../llm-client";
import { buildDesignPrompt } from "./strategies/design";
import { buildReversePrompt } from "./strategies/reverse";

export function buildISLCreatePrompt(
  mode: "REVERSE" | "DESIGN",
  inputContent: string,
  sourceFileName?: string,
): ChatMessage[] {
  if (mode === "REVERSE") {
    if (!sourceFileName) {
      throw new Error(
        "Source file name is required for Reverse Engineering mode.",
      );
    }
    return buildReversePrompt(inputContent, sourceFileName);
  } else {
    return buildDesignPrompt(inputContent);
  }
}
