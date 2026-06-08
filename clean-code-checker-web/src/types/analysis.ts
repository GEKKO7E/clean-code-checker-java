export type Severity = "Critical" | "High" | "Medium" | "Low";

export type AnalysisIssue = {
  severity: Severity;
  line: number | null;
  title: string;
  description: string;
  category: "Security" | "Performance" | "Bug" | "Quality" | "Maintainability" | "Design";
};

export type ComplexityEstimate = {
  estimatedLevel: "Low" | "Medium" | "High" | "Very High";
  notes: string;
};

export type JavaCodeAnalysis = {
  overallScore: number;
  qualityScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  issues: AnalysisIssue[];
  suggestions: string[];
  complexity: ComplexityEstimate;
  summary: string;
};

export type AnalyzeRequest = {
  filename: string;
  code: string;
};

export type AnalyzeResponse =
  | {
      ok: true;
      analysis: JavaCodeAnalysis;
      model: string;
    }
  | {
      ok: false;
      error: string;
      code?: "VALIDATION_ERROR" | "RATE_LIMITED" | "OPENAI_ERROR" | "CONFIG_ERROR";
    };
