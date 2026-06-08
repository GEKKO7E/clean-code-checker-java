import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "violet";
};

const tones = {
  cyan: "from-cyan-300 to-blue-400",
  emerald: "from-emerald-300 to-teal-400",
  amber: "from-amber-300 to-orange-400",
  rose: "from-rose-300 to-red-400",
  violet: "from-violet-300 to-indigo-400",
};

export function ProgressBar({ value, tone = "cyan" }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", tones[tone])}
        style={{ width }}
      />
    </div>
  );
}
