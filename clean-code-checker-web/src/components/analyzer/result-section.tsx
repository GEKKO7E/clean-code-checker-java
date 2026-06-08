"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ResultSectionProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function ResultSection({ title, icon: Icon, children, defaultOpen = true }: ResultSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045]">
      <button
        className="focus-ring flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-white">
          <Icon className="h-4 w-4 text-cyan-200" />
          {title}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="border-t border-white/10 px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
