import { NextResponse } from "next/server";

import { analyzeJavaCode } from "@/services/java-analysis";
import { analyzeJavaCodeWithRules } from "@/services/rule-based-analysis";
import type { AnalyzeRequest, AnalyzeResponse } from "@/types/analysis";
import { validateJavaSource } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeRequest>;
    const filename = typeof body.filename === "string" ? body.filename : "";
    const code = typeof body.code === "string" ? body.code : "";
    const validationError = validateJavaSource(filename, code);

    if (validationError) {
      return json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          error: validationError,
        },
        400,
      );
    }

    const result = await analyzeWithFallback(filename, code);

    return json({
      ok: true,
      analysis: result.analysis,
      model: result.model,
    });
  } catch {
    const body = await safeRequestBody(request);
    const filename = typeof body.filename === "string" ? body.filename : "PastedCode.java";
    const code = typeof body.code === "string" ? body.code : "";
    const result = analyzeJavaCodeWithRules(filename || "PastedCode.java", code);

    return json({
      ok: true,
      analysis: result.analysis,
      model: result.model,
    });
  }
}

function json(payload: AnalyzeResponse, status = 200) {
  return NextResponse.json(payload, { status });
}

async function analyzeWithFallback(filename: string, code: string) {
  try {
    return await analyzeJavaCode(filename, code);
  } catch {
    return analyzeJavaCodeWithRules(filename, code);
  }
}

async function safeRequestBody(request: Request) {
  try {
    return (await request.json()) as Partial<AnalyzeRequest>;
  } catch {
    return {};
  }
}
