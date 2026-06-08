"use client";

type CodeViewerProps = {
  code: string;
};

const javaKeywords = new Set([
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",
]);

export function CodeViewer({ code }: CodeViewerProps) {
  if (!code) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 text-sm text-slate-500">
        Java source preview will appear here.
      </div>
    );
  }

  return (
    <div className="code-scrollbar max-h-[31rem] overflow-auto rounded-lg border border-white/10 bg-[#0b1020]">
      <pre className="min-h-[24rem] p-4 font-mono text-[0.86rem] leading-6 text-slate-200">
        {code.split("\n").map((line, index) => (
          <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3" key={`${index}-${line}`}>
            <span className="select-none text-right text-slate-500">{index + 1}</span>
            <code className="whitespace-pre-wrap break-words">{highlightJava(line)}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

function highlightJava(line: string) {
  const tokenPattern =
    /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[{}()[\].,;:+\-*/%=!<>?&|]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  line.replace(tokenPattern, (token, _match, offset: number) => {
    if (offset > lastIndex) {
      parts.push(line.slice(lastIndex, offset));
    }

    parts.push(
      <span className={tokenClass(token)} key={`${offset}-${token}`}>
        {token}
      </span>,
    );
    lastIndex = offset + token.length;
    return token;
  });

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

function tokenClass(token: string) {
  if (token.startsWith("//")) return "text-slate-500";
  if (token.startsWith("\"") || token.startsWith("'")) return "text-emerald-300";
  if (/^\d/.test(token)) return "text-amber-300";
  if (javaKeywords.has(token)) return "text-cyan-300";
  if (/^[{}()[\].,;:+\-*/%=!<>?&|]+$/.test(token)) return "text-slate-400";
  if (/^[A-Z]/.test(token)) return "text-violet-300";
  return "text-slate-200";
}
