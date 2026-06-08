"use client";

import {
  Activity,
  AlertTriangle,
  Bug,
  ClipboardCopy,
  Download,
  FileJson,
  Gauge,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import { ResultSection } from "@/components/analyzer/result-section";
import { ScoreCard } from "@/components/analyzer/score-card";
import { Button } from "@/components/ui/button";
import { copyReport, downloadJsonReport, downloadPdfReport } from "@/lib/report";
import { cn } from "@/lib/utils";
import type { AnalysisIssue, JavaCodeAnalysis, Severity } from "@/types/analysis";

type AnalysisDashboardProps = {
  analysis: JavaCodeAnalysis | null;
  filename: string;
  model: string | null;
  isAnalyzing: boolean;
};

const severityClasses: Record<Severity, string> = {
  Critical: "border-red-300/30 bg-red-300/10 text-red-100",
  High: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Low: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
};

export function AnalysisDashboard({ analysis, filename, model, isAnalyzing }: AnalysisDashboardProps) {
  const [copied, setCopied] = useState(false);

  if (!analysis) {
    return (
      <aside className="glass-panel sticky top-6 rounded-lg p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.06] text-cyan-100">
          <Sparkles className={cn("h-6 w-6", isAnalyzing && "animate-pulse")} />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-white">
          {isAnalyzing ? "Analysis in progress" : "Analysis Dashboard"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Upload a Java file and run the analyzer to generate scores, issue severity,
          line-level findings, and refactoring guidance.
        </p>
        <div className="mt-6 grid gap-3">
          {["Overall Score", "Security Report", "Performance Report", "Suggestions"].map((item) => (
            <div className="h-12 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-500" key={item}>
              {item}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  const securityIssues = filterIssues(analysis.issues, "Security");
  const performanceIssues = filterIssues(analysis.issues, "Performance");
  const bugIssues = filterIssues(analysis.issues, "Bug");
  const qualityIssues = analysis.issues.filter((issue) =>
    ["Quality", "Maintainability", "Design"].includes(issue.category),
  );

  const handleCopy = async () => {
    await copyReport(analysis);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside className="space-y-4">
      <div className="glass-panel rounded-lg p-5">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm text-slate-400">Code Review</p>
            <h2 className="text-xl font-semibold text-white">{filename || "Java Source"}</h2>
            {model && <p className="mt-1 text-xs text-slate-500">Model: {model}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
            <Button icon={<ClipboardCopy className="h-4 w-4" />} onClick={handleCopy} variant="secondary">
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button icon={<Download className="h-4 w-4" />} onClick={() => downloadPdfReport(analysis, filename)} variant="secondary">
              PDF
            </Button>
            <Button icon={<FileJson className="h-4 w-4" />} onClick={() => downloadJsonReport(analysis, filename)} variant="secondary">
              JSON
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ScoreCard icon={Activity} label="Overall Score" tone="cyan" value={analysis.overallScore} />
          <ScoreCard icon={ShieldCheck} label="Code Quality Score" tone="emerald" value={analysis.qualityScore} />
          <ScoreCard icon={ShieldAlert} label="Security Score" tone="rose" value={analysis.securityScore} />
          <ScoreCard icon={Gauge} label="Performance Score" tone="amber" value={analysis.performanceScore} />
          <div className="sm:col-span-2">
            <ScoreCard icon={Wrench} label="Maintainability Score" tone="violet" value={analysis.maintainabilityScore} />
          </div>
        </div>
      </div>

      <div className="glass-panel space-y-3 rounded-lg p-4">
        <ResultSection icon={Sparkles} title="Review Summary">
          <p className="text-sm leading-6 text-slate-300">{analysis.summary}</p>
        </ResultSection>

        <ResultSection icon={ShieldAlert} title="Security Report">
          <IssueList empty="No security issues were reported." issues={securityIssues} />
        </ResultSection>

        <ResultSection icon={Gauge} title="Performance Report">
          <IssueList empty="No performance issues were reported." issues={performanceIssues} />
        </ResultSection>

        <ResultSection icon={Bug} title="Bug Report">
          <IssueList empty="No likely bugs were reported." issues={bugIssues} />
        </ResultSection>

        <ResultSection icon={AlertTriangle} title="Code Quality Report">
          <IssueList empty="No quality or design issues were reported." issues={qualityIssues} />
        </ResultSection>

        <ResultSection icon={Lightbulb} title="Suggestions">
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            {analysis.suggestions.map((suggestion) => (
              <li className="rounded-lg border border-white/10 bg-black/15 px-3 py-2" key={suggestion}>
                {suggestion}
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection icon={Activity} title="Complexity Analysis">
          <div className="rounded-lg border border-white/10 bg-black/15 p-3">
            <div className="text-sm font-semibold text-white">
              Estimated Level: {analysis.complexity.estimatedLevel}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{analysis.complexity.notes}</p>
          </div>
        </ResultSection>
      </div>
    </aside>
  );
}

function IssueList({ issues, empty }: { issues: AnalysisIssue[]; empty: string }) {
  if (issues.length === 0) {
    return <p className="text-sm text-slate-400">{empty}</p>;
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <div className="rounded-lg border border-white/10 bg-black/15 p-3" key={`${issue.title}-${index}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-md border px-2 py-1 text-xs font-medium", severityClasses[issue.severity])}>
              {issue.severity}
            </span>
            <span className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-slate-300">
              {issue.category}
            </span>
            {issue.line && <span className="text-xs text-slate-500">Line {issue.line}</span>}
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">{issue.title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-400">{issue.description}</p>
        </div>
      ))}
    </div>
  );
}

function filterIssues(issues: AnalysisIssue[], category: AnalysisIssue["category"]) {
  return issues.filter((issue) => issue.category === category);
}
