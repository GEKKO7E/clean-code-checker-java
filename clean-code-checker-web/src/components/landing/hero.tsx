"use client";

import { motion } from "framer-motion";
import { ArrowRight, CreditCard, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

import { AuthStatusLink } from "@/components/auth/auth-status-link";
import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade bg-[size:44px_44px] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-6 py-24 sm:px-8">
        <nav className="absolute left-6 right-6 top-6 flex items-center justify-between sm:left-8 sm:right-8">
          <span className="text-sm font-semibold tracking-[0.18em] text-white">CLEAN CODE CHECKER</span>
          <div className="flex gap-2">
            <AuthStatusLink className="h-9 px-3" variant="ghost">
              Login
            </AuthStatusLink>
            <LinkButton className="h-9 px-3" href="/payment" icon={<CreditCard className="h-4 w-4" />} variant="secondary">
              Payment
            </LinkButton>
          </div>
        </nav>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Java clean-code review
          </div>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-8xl">
            CLEAN CODE CHECKER
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl">
            Upload your Java source code and receive instant security insights, performance
            recommendations, and clean-code suggestions.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton className="h-11" href="/analyzer" icon={<ArrowRight className="h-4 w-4" />}>
              Check Code
            </LinkButton>
            <LinkButton
              className="h-11"
              href="/analyzer?demo=true"
              icon={<PlayCircle className="h-4 w-4" />}
              variant="secondary"
            >
              View Demo
            </LinkButton>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 grid gap-4 lg:grid-cols-[1fr_0.78fr]"
          initial={{ opacity: 0, y: 26 }}
          transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
        >
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
              </div>
              <span className="text-xs text-slate-400">UserRepository.java</span>
            </div>
            <pre className="overflow-hidden text-sm leading-7 text-slate-300">
              <code>{`String sql = "SELECT * FROM users WHERE email = '" + email + "'";
Statement statement = connection.createStatement();
ResultSet resultSet = statement.executeQuery(sql);

if (resultSet.next()) {
  user.setName(resultSet.getString("name").trim());
}`}</code>
            </pre>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-300/12 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Security finding</p>
                <h2 className="text-lg font-semibold text-white">SQL injection risk</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ["Security", 64, "bg-rose-300"],
                ["Maintainability", 78, "bg-cyan-300"],
                ["Performance", 82, "bg-emerald-300"],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
