"use client";

import { useCallback, useMemo, useState } from "react";

import { DEMO_JAVA_CODE, MAX_JAVA_FILE_BYTES } from "@/lib/constants";
import { containsBinaryBytes, validateJavaFilename, validateJavaSource } from "@/lib/validation";
import { requestAnalysis } from "@/services/analyzer-client";
import type { JavaCodeAnalysis } from "@/types/analysis";

type AnalyzerState = {
  filename: string;
  uploadedCode: string;
  pastedCode: string;
  analysis: JavaCodeAnalysis | null;
  model: string | null;
  error: string | null;
  isAnalyzing: boolean;
};

const initialState: AnalyzerState = {
  filename: "",
  uploadedCode: "",
  pastedCode: "",
  analysis: null,
  model: null,
  error: null,
  isAnalyzing: false,
};

export function useJavaAnalyzer() {
  const [state, setState] = useState<AnalyzerState>(initialState);

  const loadDemo = useCallback(() => {
    setState((current) => ({
      ...current,
      filename: "UserRepository.java",
      uploadedCode: DEMO_JAVA_CODE,
      pastedCode: "",
      analysis: null,
      error: null,
      model: null,
    }));
  }, []);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  const setCode = useCallback((code: string) => {
    setState((current) => ({
      ...current,
      pastedCode: code,
      analysis: null,
      error: null,
      model: null,
    }));
  }, []);

  const readFile = useCallback(async (file: File) => {
    const filenameError = validateJavaFilename(file.name);

    if (filenameError) {
      setState((current) => ({ ...current, error: filenameError }));
      return;
    }

    if (file.size > MAX_JAVA_FILE_BYTES) {
      setState((current) => ({ ...current, error: "The Java file must be 5MB or smaller." }));
      return;
    }

    const code = await file.text();

    if (containsBinaryBytes(code)) {
      setState((current) => ({
        ...current,
        error: "Binary files are not supported. Upload readable Java source code.",
      }));
      return;
    }

    setState((current) => ({
      ...current,
      filename: file.name,
      uploadedCode: code,
      analysis: null,
      error: null,
      model: null,
    }));
  }, []);

  const analyze = useCallback(async () => {
    const code = state.pastedCode.trim() ? state.pastedCode : state.uploadedCode;
    const filename = state.pastedCode.trim() ? "PastedCode.java" : state.filename;
    const validationError = validateJavaSource(filename, code);

    if (validationError) {
      setState((current) => ({ ...current, error: validationError }));
      return;
    }

    setState((current) => ({ ...current, error: null, isAnalyzing: true }));

    try {
      const response = await requestAnalysis(filename, code);

      setState((current) => ({
        ...current,
        analysis: response.analysis,
        model: response.model,
        isAnalyzing: false,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : "Unable to analyze the file.",
        isAnalyzing: false,
      }));
    }
  }, [state.filename, state.pastedCode, state.uploadedCode]);

  const code = useMemo(
    () => (state.pastedCode.trim() ? state.pastedCode : state.uploadedCode),
    [state.pastedCode, state.uploadedCode],
  );
  const filename = useMemo(
    () => (state.pastedCode.trim() ? "PastedCode.java" : state.filename),
    [state.filename, state.pastedCode],
  );
  const hasCode = useMemo(() => code.trim().length > 0, [code]);

  return {
    ...state,
    code,
    filename,
    hasCode,
    analyze,
    clear,
    loadDemo,
    readFile,
    setCode,
  };
}
