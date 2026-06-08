import { ShieldCheck } from "lucide-react";

import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          CLEAN CODE CHECKER
        </span>
      </footer>
    </main>
  );
}
