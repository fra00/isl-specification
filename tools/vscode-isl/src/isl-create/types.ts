export interface ArchitectFileEntry {
  filename: string;
  role: "Presentation" | "Backend" | "Business Logic" | "Domain";
  description: string;
  dependencies: string[]; // Elenco filenames da cui dipende
}

export interface ArchitectPlan {
  projectName: string;
  files: ArchitectFileEntry[];
}

// Helper per ordinamento topologico (da implementare nel runner)
export type BuildQueue = ArchitectFileEntry[];
