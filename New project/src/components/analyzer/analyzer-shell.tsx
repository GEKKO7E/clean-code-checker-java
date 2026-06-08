"use client";

import { useEffect } from "react";

import { AnalysisDashboard } from "@/components/analyzer/analysis-dashboard";
import { UploadPanel } from "@/components/analyzer/upload-panel";
import { AuthStatusLink } from "@/components/auth/auth-status-link";
import { LinkButton } from "@/components/ui/button";
import { useJavaAnalyzer } from "@/hooks/use-java-analyzer";

export function AnalyzerShell() {
  const analyzer = useJavaAnalyzer();
  const { loadDemo } = analyzer;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("demo") === "true") {
      loadDemo();
    }
  }, [loadDemo]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Code Checker</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">CLEAN CODE CHECKER</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <AuthStatusLink variant="secondary">
              Login
            </AuthStatusLink>
            <LinkButton href="/payment" variant="secondary">
              Payment
            </LinkButton>
            <LinkButton href="/" variant="secondary">
              Back Home
            </LinkButton>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <UploadPanel
            code={analyzer.code}
            error={analyzer.error}
            filename={analyzer.filename}
            hasCode={analyzer.hasCode}
            isAnalyzing={analyzer.isAnalyzing}
            onAnalyze={analyzer.analyze}
            onClear={analyzer.clear}
            onCodeChange={analyzer.setCode}
            onDemo={analyzer.loadDemo}
            onFile={analyzer.readFile}
          />
          <AnalysisDashboard
            analysis={analyzer.analysis}
            filename={analyzer.filename}
            isAnalyzing={analyzer.isAnalyzing}
            model={analyzer.model}
          />
        </div>
      </div>
    </main>
  );
}
