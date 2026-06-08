import {
  Activity,
  Bug,
  Gauge,
  GitBranch,
  Lock,
  ScanSearch,
} from "lucide-react";

const features = [
  {
    title: "Bug Detection",
    description: "Find risky branches, unsafe assumptions, and likely runtime failures.",
    icon: Bug,
  },
  {
    title: "Performance Analysis",
    description: "Identify avoidable loops, slow queries, and inefficient collection usage.",
    icon: Gauge,
  },
  {
    title: "Security Scanning",
    description: "Surface injection risks, weak validation, and unsafe resource handling.",
    icon: Lock,
  },
  {
    title: "Clean Code Review",
    description: "Review readability, naming, duplication, and method responsibilities.",
    icon: ScanSearch,
  },
  {
    title: "Complexity Estimation",
    description: "Estimate code complexity and explain the key maintainability drivers.",
    icon: Activity,
  },
  {
    title: "SOLID Principle Validation",
    description: "Detect design pressure around coupling, abstractions, and class roles.",
    icon: GitBranch,
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8" id="features">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Capabilities</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Deep Java review, packaged for clean decisions.
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article className="glass-panel rounded-lg p-5 transition hover:border-cyan-300/25" key={feature.title}>
            <feature.icon className="h-5 w-5 text-cyan-200" />
            <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
