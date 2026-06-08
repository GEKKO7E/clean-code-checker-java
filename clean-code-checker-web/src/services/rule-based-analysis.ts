import { clampScore } from "@/lib/utils";
import type { AnalysisIssue, JavaCodeAnalysis } from "@/types/analysis";

type Rule = {
  pattern: RegExp;
  title: string;
  description: string;
  category: AnalysisIssue["category"];
  severity: AnalysisIssue["severity"];
  scoreImpact: number;
};

const rules: Rule[] = [
  {
    pattern: /SELECT\s+.*\+|WHERE\s+.*\+/i,
    title: "Potential SQL injection risk",
    description:
      "SQL queries appear to be built with string concatenation. Use prepared statements with bound parameters.",
    category: "Security",
    severity: "High",
    scoreImpact: 14,
  },
  {
    pattern: /\bStatement\s+\w+|createStatement\s*\(/,
    title: "Raw Statement usage",
    description:
      "Raw JDBC Statement usage can make query handling less safe. Prefer PreparedStatement for user-provided values.",
    category: "Security",
    severity: "Medium",
    scoreImpact: 8,
  },
  {
    pattern: /Runtime\.getRuntime\(\)\.exec|ProcessBuilder\s*\(/,
    title: "Command execution detected",
    description:
      "Executing operating-system commands from Java needs strict input validation and allow-listing.",
    category: "Security",
    severity: "Critical",
    scoreImpact: 18,
  },
  {
    pattern: /catch\s*\([^)]*Exception[^)]*\)\s*\{\s*\}/,
    title: "Empty exception handler",
    description:
      "An empty catch block can hide runtime failures and make debugging production issues difficult.",
    category: "Bug",
    severity: "Medium",
    scoreImpact: 8,
  },
  {
    pattern: /for\s*\([^)]*\)\s*\{[\s\S]{0,500}\.add\s*\(|while\s*\([^)]*\)\s*\{[\s\S]{0,500}\.add\s*\(/,
    title: "Collection growth inside loop",
    description:
      "Growing collections inside loops is normal, but large data sets may need pagination, streaming, or pre-sizing.",
    category: "Performance",
    severity: "Low",
    scoreImpact: 4,
  },
  {
    pattern: /for\s*\([^)]*\)\s*\{[\s\S]{0,500}\+\=|while\s*\([^)]*\)\s*\{[\s\S]{0,500}\+\=/,
    title: "Repeated string concatenation in loop",
    description:
      "Repeated concatenation in loops can create unnecessary objects. Consider StringBuilder for larger loops.",
    category: "Performance",
    severity: "Medium",
    scoreImpact: 8,
  },
  {
    pattern: /System\.gc\s*\(/,
    title: "Manual garbage collection call",
    description:
      "Manual garbage collection can hurt throughput and usually should be left to the JVM.",
    category: "Performance",
    severity: "Medium",
    scoreImpact: 7,
  },
  {
    pattern: /public\s+class\s+\w+[\s\S]{2500,}/,
    title: "Large class body",
    description:
      "This class appears large. Splitting responsibilities can improve readability and maintainability.",
    category: "Maintainability",
    severity: "Medium",
    scoreImpact: 8,
  },
];

export function analyzeJavaCodeWithRules(filename: string, code: string) {
  const issues = findIssues(code);
  const securityImpact = totalImpact(issues, "Security");
  const performanceImpact = totalImpact(issues, "Performance");
  const qualityImpact = totalImpact(issues, "Quality") + totalImpact(issues, "Bug");
  const maintainabilityImpact = totalImpact(issues, "Maintainability") + totalImpact(issues, "Design");
  const lineCount = code.split(/\r?\n/).length;
  const complexity = estimateComplexity(code, lineCount);
  const complexityPenalty = complexity.estimatedLevel === "Very High" ? 12 : complexity.estimatedLevel === "High" ? 8 : 0;

  const analysis: JavaCodeAnalysis = {
    overallScore: clampScore(92 - totalImpact(issues) - complexityPenalty),
    qualityScore: clampScore(90 - qualityImpact - complexityPenalty),
    securityScore: clampScore(94 - securityImpact),
    performanceScore: clampScore(92 - performanceImpact),
    maintainabilityScore: clampScore(90 - maintainabilityImpact - complexityPenalty),
    issues,
    suggestions: buildSuggestions(issues, complexity.estimatedLevel),
    complexity,
    summary:
      issues.length > 0
        ? `Rule-based demo analysis found ${issues.length} item(s) in ${filename}. Review the security, performance, and maintainability notes below.`
        : `Rule-based demo analysis did not find major risks in ${filename}. Continue reviewing naming, tests, and edge cases before release.`,
  };

  return {
    model: "Demo Mode",
    analysis,
  };
}

function findIssues(code: string) {
  const detectedIssues = rules.flatMap((rule) => {
    const match = code.match(rule.pattern);
    if (!match) return [];

    return [
      {
        severity: rule.severity,
        line: findLine(code, match.index ?? 0),
        title: rule.title,
        description: rule.description,
        category: rule.category,
      },
    ];
  });

  return ensureDemoReportSections(detectedIssues);
}

function ensureDemoReportSections(issues: AnalysisIssue[]) {
  const nextIssues = [...issues];

  if (!nextIssues.some((issue) => issue.category === "Security")) {
    nextIssues.push({
      severity: "Low",
      line: null,
      title: "Security review completed",
      description:
        "The fallback analyzer did not detect common high-risk security patterns in this code sample.",
      category: "Security",
    });
  }

  if (!nextIssues.some((issue) => issue.category === "Performance")) {
    nextIssues.push({
      severity: "Low",
      line: null,
      title: "Performance review completed",
      description:
        "The fallback analyzer did not detect common performance hotspots in this code sample.",
      category: "Performance",
    });
  }

  return nextIssues;
}

function findLine(code: string, index: number) {
  return code.slice(0, index).split(/\r?\n/).length;
}

function totalImpact(issues: AnalysisIssue[], category?: AnalysisIssue["category"]) {
  return issues.reduce((total, issue) => {
    if (category && issue.category !== category) return total;
    const rule = rules.find((candidate) => candidate.title === issue.title);
    return total + (rule?.scoreImpact ?? 4);
  }, 0);
}

function estimateComplexity(code: string, lineCount: number): JavaCodeAnalysis["complexity"] {
  const branchCount = (code.match(/\b(if|for|while|switch|case|catch)\b/g) ?? []).length;
  const level =
    branchCount > 24 || lineCount > 700
      ? "Very High"
      : branchCount > 14 || lineCount > 350
        ? "High"
        : branchCount > 6 || lineCount > 120
          ? "Medium"
          : "Low";

  return {
    estimatedLevel: level,
    notes: `Detected ${lineCount} line(s) and ${branchCount} branch or control-flow marker(s).`,
  };
}

function buildSuggestions(issues: AnalysisIssue[], level: JavaCodeAnalysis["complexity"]["estimatedLevel"]) {
  const suggestions = new Set<string>();

  if (issues.some((issue) => issue.category === "Security")) {
    suggestions.add("Use prepared statements and validate all user-controlled input.");
  }

  if (issues.some((issue) => issue.category === "Performance")) {
    suggestions.add("Review loop-heavy sections and avoid unnecessary object allocation.");
  }

  if (issues.some((issue) => ["Bug", "Quality"].includes(issue.category))) {
    suggestions.add("Add focused tests for null, empty, and failure-path scenarios.");
  }

  if (level === "High" || level === "Very High") {
    suggestions.add("Break large methods or classes into smaller responsibilities.");
  }

  suggestions.add("Keep method names explicit and keep each method focused on one responsibility.");

  return Array.from(suggestions);
}
