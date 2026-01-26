import * as https from "https";

export type LLMProvider = "openai" | "gemini";

export class LLMClient {
  constructor(
    private provider: LLMProvider = "openai",
    private model?: string,
  ) {
    if (!this.model) {
      this.model = this.provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o";
    }
  }

  public async generateRaw(prompt: string): Promise<string> {
    let rawOutput = "";

    if (this.provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (apiKey) {
        console.log(`   (Calling OpenAI ${this.model}... 📡)`);
        try {
          rawOutput = await this.callOpenAI(apiKey, prompt);
        } catch (error: any) {
          console.error(`   ❌ LLM Call Failed: ${error.message}`);
          console.log(`   (Falling back to simulation...)`);
          rawOutput = await this.simulate(prompt);
        }
      } else {
        console.log(`   (Simulating LLM call [No OpenAI Key]... ⏳)`);
        rawOutput = await this.simulate(prompt);
      }
    } else if (this.provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        console.log(`   (Calling Gemini ${this.model}... 📡)`);
        try {
          rawOutput = await this.callGemini(apiKey, prompt);
        } catch (error: any) {
          console.error(`   ❌ LLM Call Failed: ${error.message}`);
          console.log(`   (Falling back to simulation...)`);
          rawOutput = await this.simulate(prompt);
        }
      } else {
        console.log(`   (Simulating LLM call [No Gemini Key]... ⏳)`);
        rawOutput = await this.simulate(prompt);
      }
    }

    return rawOutput;
  }

  public async generateCode(prompt: string): Promise<string> {
    const rawOutput = await this.generateRaw(prompt);
    return this.extractCode(rawOutput);
  }

  private async simulate(prompt: string): Promise<string> {
    // Simulazione di delay di rete
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `// Generated Code for ${prompt.split("\n")[0]}\n// Timestamp: ${new Date().toISOString()}\n\nexport const Placeholder = () => {};`;
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

  private callOpenAI(apiKey: string, prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert software engineer. Generate code based on the ISL specification provided. Output only the code inside markdown code blocks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      });

      const options = {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
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

  private callGemini(apiKey: string, prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      });

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
