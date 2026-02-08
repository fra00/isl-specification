import * as https from "https";
import * as http from "http";
import * as url from "url";

export type LLMProvider = "openai" | "gemini" | "lm-studio";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class LLMClient {
  private baseUrl: string;

  constructor(
    private provider: LLMProvider = "openai",
    private model?: string,
    baseUrl?: string,
  ) {
    // Default Base URLs
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else if (this.provider === "lm-studio") {
      this.baseUrl = process.env.LLM_BASE_URL || "http://localhost:1234/v1";
    } else {
      this.baseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
    }

    // Default Models
    if (!this.model) {
      if (this.provider === "gemini") this.model = "gemini-2.5-flash";
      else if (this.provider === "lm-studio")
        this.model = "local-model"; // LM Studio often ignores model name or uses loaded one
      else this.model = "gpt-4o";
    }
  }

  public async generateRaw(input: string | ChatMessage[]): Promise<string> {
    let rawOutput = "";

    if (this.provider === "openai" || this.provider === "lm-studio") {
      const apiKey =
        process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || "lm-studio"; // Fallback for local
      if (apiKey) {
        console.log(
          `   (Calling ${this.provider} [${this.model}] at ${this.baseUrl}... 📡)`,
        );
        try {
          rawOutput = await this.callOpenAICompatible(apiKey, input);
        } catch (error: any) {
          console.error(`   ❌ LLM Call Failed: ${error.message}`);
          console.log(`   (Falling back to simulation...)`);
          rawOutput = await this.simulate(input);
        }
      } else {
        console.log(`   (Simulating LLM call [No OpenAI Key]... ⏳)`);
        rawOutput = await this.simulate(input);
      }
    } else if (this.provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        console.log(`   (Calling Gemini ${this.model}... 📡)`);
        try {
          rawOutput = await this.callGemini(apiKey, input);
        } catch (error: any) {
          console.error(`   ❌ LLM Call Failed: ${error.message}`);
          console.log(`   (Falling back to simulation...)`);
          rawOutput = await this.simulate(input);
        }
      } else {
        console.log(`   (Simulating LLM call [No Gemini Key]... ⏳)`);
        rawOutput = await this.simulate(input);
      }
    }

    return rawOutput;
  }

  public async generateCode(prompt: string): Promise<string> {
    const rawOutput = await this.generateRaw(prompt);
    return this.extractCode(rawOutput);
  }

  private async simulate(input: string | ChatMessage[]): Promise<string> {
    // Simulazione di delay di rete
    const promptText =
      typeof input === "string"
        ? input
        : input.map((m) => m.content).join("\n");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `// Generated Code for ${promptText.split("\n")[0]}\n// Timestamp: ${new Date().toISOString()}\n\nexport const Placeholder = () => {};`;
  }

  private extractCode(markdown: string): string {
    // Estrae il contenuto tra i backticks ```typescript ... ```
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
    const match = markdown.match(codeBlockRegex);
    if (match) {
      return match[1].trim();
    }
    return markdown;
  }

  private callOpenAICompatible(
    apiKey: string,
    input: string | ChatMessage[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const messages =
        typeof input === "string"
          ? [
              {
                role: "system",
                content:
                  "You are an expert software engineer. Generate code based on the ISL specification provided. Output only the code inside markdown code blocks.",
              },
              { role: "user", content: input },
            ]
          : input;

      const data = JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.2,
      });

      const parsedUrl = url.parse(this.baseUrl);
      const isHttps = parsedUrl.protocol === "https:";
      const client = isHttps ? https : http;

      // Ensure path ends with /chat/completions. Handle trailing slash in baseUrl.
      const basePath =
        parsedUrl.path && parsedUrl.path !== "/" ? parsedUrl.path : "";
      const endpoint = `${basePath.replace(/\/$/, "")}/chat/completions`;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = client.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const response = JSON.parse(body);
            resolve(response.choices[0].message.content);
          } else {
            reject(new Error(`Status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on("error", (e) => reject(e));
      req.write(data);
      req.end();
    });
  }

  private callGemini(
    apiKey: string,
    input: string | ChatMessage[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let contents: any[] = [];
      let systemInstruction: any = undefined;

      if (typeof input === "string") {
        contents = [{ parts: [{ text: input }] }];
      } else {
        const systemMsg = input.find((m) => m.role === "system");
        if (systemMsg) {
          systemInstruction = { parts: [{ text: systemMsg.content }] };
        }
        contents = input
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));
      }

      const requestBody: any = {
        contents,
        generationConfig: {
          temperature: 0.2,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = systemInstruction;
      }

      const data = JSON.stringify(requestBody);

      const options = {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/${this.model}:generateContent?key=${apiKey}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const response = JSON.parse(body);
            // Gemini response structure
            const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              resolve(content);
            } else {
              reject(new Error("No content in Gemini response"));
            }
          } else {
            reject(new Error(`Status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on("error", (e) => reject(e));
      req.write(data);
      req.end();
    });
  }
}
