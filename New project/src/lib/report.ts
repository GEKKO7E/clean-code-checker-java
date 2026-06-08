import type { JavaCodeAnalysis } from "@/types/analysis";

export function downloadJsonReport(analysis: JavaCodeAnalysis, filename: string) {
  const blob = new Blob([JSON.stringify(analysis, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${safeBaseName(filename)}-analysis.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdfReport(analysis: JavaCodeAnalysis, filename: string) {
  const lines = buildReportLines(analysis, filename);
  const pdf = createSimplePdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${safeBaseName(filename)}-analysis.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyReport(analysis: JavaCodeAnalysis) {
  await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
}

function safeBaseName(filename: string) {
  return filename.replace(/\.java$/i, "").replace(/[^a-z0-9-_]+/gi, "-") || "java-code";
}

function buildReportLines(analysis: JavaCodeAnalysis, filename: string) {
  const lines = [
    "CLEAN CODE CHECKER Report",
    `File: ${filename}`,
    "",
    `Overall Score: ${analysis.overallScore}/100`,
    `Quality: ${analysis.qualityScore} | Security: ${analysis.securityScore} | Performance: ${analysis.performanceScore} | Maintainability: ${analysis.maintainabilityScore}`,
    "",
    "Summary",
    analysis.summary,
    "",
    "Issues",
  ];

  if (analysis.issues.length === 0) {
    lines.push("No issues reported.");
  }

  analysis.issues.forEach((issue) => {
    lines.push(
      `${issue.severity} - ${issue.category}${issue.line ? ` - line ${issue.line}` : ""}: ${issue.title}`,
      issue.description,
      "",
    );
  });

  lines.push("Suggestions");
  analysis.suggestions.forEach((suggestion) => lines.push(`- ${suggestion}`));
  lines.push("", "Complexity", `${analysis.complexity.estimatedLevel}: ${analysis.complexity.notes}`);

  return wrapLines(lines, 92);
}

function wrapLines(lines: string[], maxLength: number) {
  return lines.flatMap((line) => {
    if (line.length <= maxLength) return [line];
    const words = line.split(" ");
    const wrapped: string[] = [];
    let current = "";

    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLength) {
        wrapped.push(current);
        current = word;
      } else {
        current = next;
      }
    });

    if (current) wrapped.push(current);
    return wrapped;
  });
}

function createSimplePdf(lines: string[]) {
  const pageLineLimit = 42;
  const pages = chunk(lines, pageLineLimit);
  const objects: string[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(`<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`);

  pages.forEach((pageLines, pageIndex) => {
    const pageObject = 3 + pageIndex * 2;
    const contentObject = pageObject + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents ${contentObject} 0 R >>`);
    const stream = [
      "BT",
      "/F1 11 Tf",
      "44 748 Td",
      "14 TL",
      ...pageLines.map((line, index) => `${index === 0 ? "" : "T* "}${pdfText(line)}`),
      "ET",
    ].join("\n");
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = header.length + body.length;
  const xref = [
    `xref`,
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefStart),
    "%%EOF",
  ].join("\n");

  return `${header}${body}${xref}`;
}

function pdfText(text: string) {
  return `(${text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")}) Tj`;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
