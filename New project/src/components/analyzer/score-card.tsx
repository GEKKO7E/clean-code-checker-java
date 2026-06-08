import type { LucideIcon } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";

type ScoreCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "violet";
};

export function ScoreCard({ label, value, icon: Icon, tone = "cyan" }: ScoreCardProps) {
  return (
    <article className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-2xl font-semibold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-slate-300">{label}</h3>
      <div className="mt-3">
        <ProgressBar tone={tone} value={value} />
      </div>
    </article>
  );
}
