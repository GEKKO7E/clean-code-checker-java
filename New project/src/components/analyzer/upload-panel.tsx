"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FileCode2, Loader2, Play, RotateCcw, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CodeViewer = dynamic(
  () => import("@/components/analyzer/code-viewer").then((module) => module.CodeViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[24rem] items-center justify-center rounded-lg border border-white/10 bg-black/20 text-sm text-slate-500">
        Preparing Java preview...
      </div>
    ),
  },
);

type UploadPanelProps = {
  filename: string;
  code: string;
  error: string | null;
  hasCode: boolean;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onClear: () => void;
  onDemo: () => void;
  onFile: (file: File) => void;
  onCodeChange: (code: string) => void;
};

export function UploadPanel({
  filename,
  code,
  error,
  hasCode,
  isAnalyzing,
  onAnalyze,
  onClear,
  onDemo,
  onFile,
  onCodeChange,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files.item(0);

    if (file) {
      onFile(file);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (file) {
      onFile(file);
      event.target.value = "";
    }
  };

  return (
    <section className="space-y-4">
      <div
        className={cn(
          "glass-panel rounded-lg p-5 transition",
          isDragging && "border-cyan-300/60 bg-cyan-300/10",
        )}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
      >
        <input
          accept=".java,text/x-java-source,text/plain"
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Upload Java source</h1>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Drag and drop a .java file, or select one from your computer. Maximum size: 5MB.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => inputRef.current?.click()} variant="secondary">
              Choose File
            </Button>
            <Button onClick={onDemo} variant="ghost">
              View Demo
            </Button>
          </div>
        </div>

        {filename && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
            <FileCode2 className="h-4 w-4 text-emerald-200" />
            {filename}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-lg p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Code Viewer</h2>
            <p className="text-sm text-slate-400">Java syntax highlighting with line numbers.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={!hasCode || isAnalyzing} icon={<RotateCcw className="h-4 w-4" />} onClick={onClear} variant="secondary">
              Clear
            </Button>
            <Button
              disabled={!hasCode || isAnalyzing}
              icon={isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              onClick={onAnalyze}
            >
              {isAnalyzing ? "Analyzing" : "Analyze"}
            </Button>
          </div>
        </div>
        <CodeViewer code={code} />
        <textarea
          aria-label="Editable Java code"
          className="focus-ring mt-4 min-h-32 w-full resize-y rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-sm leading-6 text-slate-200 placeholder:text-slate-600"
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="Paste Java code here..."
          spellCheck={false}
          value={code}
        />
      </div>
    </section>
  );
}
