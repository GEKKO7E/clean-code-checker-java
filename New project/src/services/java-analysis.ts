import { analysisJsonSchema } from "@/lib/analysis-schema";
import { OPENAI_MODEL } from "@/lib/constants";
import { getOpenAIClient } from "@/lib/openai";
import { clampScore } from "@/lib/utils";
import type { JavaCodeAnalysis } from "@/types/analysis";

const SYSTEM_PROMPT = `You are an expert senior Java code reviewer and secure coding analyst.

Analyze Java source code for production risks and return JSON only.
Evaluate:
1. Code Quality
2. Potential Bugs
3. Security Issues
4. Performance Issues
5. Memory Issues
6. SOLID Violations
7. Design Problems
8. Refactoring Suggestions
9. Complexity Estimate
10. Best Practices

Rules:
- Use precise, practical language suitable for a developer report.
- Include line numbers when reasonably possible; otherwise use null.
- Severity must be one of Critical, High, Medium, Low.
- Category must be one of Security, Performance, Bug, Quality, Maintainability, Design.
- Scores must be integers from 0 to 100.
- Suggestions should be concise and actionable.
- Do not invent code that is not present.`;

export async function analyzeJavaCode(filename: string, code: string) {
  const openai = getOpenAIClient();
  const model = OPENAI_MODEL;

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Analyze this Java source file.

Filename: ${filename}

\`\`\`java
${code}
\`\`\``,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "java_code_analysis",
        strict: true,
        schema: analysisJsonSchema,
      },
    },
  });

  const parsed = JSON.parse(response.output_text) as JavaCodeAnalysis;

  return {
    model,
    analysis: normalizeAnalysis(parsed),
  };
}

function normalizeAnalysis(analysis: JavaCodeAnalysis): JavaCodeAnalysis {
  return {
    ...analysis,
    overallScore: clampScore(analysis.overallScore),
    qualityScore: clampScore(analysis.qualityScore),
    securityScore: clampScore(analysis.securityScore),
    performanceScore: clampScore(analysis.performanceScore),
    maintainabilityScore: clampScore(analysis.maintainabilityScore),
    issues: analysis.issues.map((issue) => ({
      ...issue,
      line: typeof issue.line === "number" && issue.line > 0 ? issue.line : null,
    })),
  };
}
