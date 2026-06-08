import type { AnalyzeResponse } from "@/types/analysis";

export async function requestAnalysis(filename: string, code: string) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, code }),
  });

  const payload = (await response.json()) as AnalyzeResponse;

  if (!payload.ok) {
    throw new Error(payload.error);
  }

  return payload;
}
