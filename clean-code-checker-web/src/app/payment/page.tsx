"use client";

import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";

import { AuthStatusLink } from "@/components/auth/auth-status-link";
import { LinkButton } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth-state";

const plans = [
  {
    id: "free",
    name: "Gratis",
    price: "Rp0",
    total: "Rp0",
    description: "Selamanya Gratis",
    billing: "tanpa biaya",
    features: [
      "5 analisis kode per hari",
      "Skor kualitas kode dasar",
      "Deteksi bug dasar",
      "Maksimal 500 baris kode",
    ],
  },
  {
    id: "student-premium",
    name: "Premium Mahasiswa",
    price: "Rp19.900",
    total: "Rp19.900",
    description: "Pilihan terbaik untuk mahasiswa yang membutuhkan analisis kode lebih lengkap.",
    billing: "per bulan",
    features: [
      "Analisis hingga 5MB",
      "Analisis keamanan",
      "Analisis performa",
      "Review SOLID Principle",
      "Export PDF & JSON",
      "Riwayat analisis",
      "Prioritas pemrosesan AI",
      "Laporan maintainability lengkap",
    ],
    highlighted: true,
  },
];

export default function PaymentPage() {
  const [selectedPlanId, setSelectedPlanId] = useState("student-premium");
  const { user } = useAuthState();
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[1],
    [selectedPlanId],
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Pembayaran</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">CLEAN CODE CHECKER</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <AuthStatusLink variant="secondary">
              Masuk
            </AuthStatusLink>
            <LinkButton href="/" icon={<ArrowLeft className="h-4 w-4" />} variant="secondary">
              Beranda
            </LinkButton>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <button
                aria-pressed={selectedPlanId === plan.id}
                className={`rounded-lg border p-5 text-left transition ${
                  selectedPlanId === plan.id
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/10 bg-white/[0.04]"
                }`}
                key={plan.name}
                onClick={() => setSelectedPlanId(plan.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{plan.description}</p>
                  </div>
                  {plan.highlighted && (
                    <span className="rounded-md bg-cyan-300/15 px-2 py-1 text-xs font-medium text-cyan-100">
                      Paling Populer
                    </span>
                  )}
                </div>
                <p className="mt-6 text-3xl font-semibold text-white">{plan.price}</p>
                <p className="mt-1 text-sm text-slate-500">{plan.billing}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li className="flex gap-2 text-sm leading-6 text-slate-300" key={feature}>
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <aside className="glass-panel rounded-lg p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.06] text-cyan-100">
              <CreditCard className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Ringkasan Pembayaran</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Pilih paket yang sesuai, masuk dengan Google, lalu lanjutkan ke metode pembayaran
              yang tersedia.
            </p>

            <div className="mt-6 space-y-3 rounded-lg border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Paket</span>
                <span className="font-medium text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-medium text-white">{selectedPlan.total}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-slate-300">Total</span>
                <span className="text-lg font-semibold text-white">{selectedPlan.total}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {!user && (
                <LinkButton className="w-full" href="/login" icon={<LockKeyhole className="h-4 w-4" />}>
                  Masuk untuk Bayar
                </LinkButton>
              )}
              <LinkButton
                className="w-full"
                href="/analyzer"
                icon={<ReceiptText className="h-4 w-4" />}
                variant="secondary"
              >
                Coba Pemeriksa Kode
              </LinkButton>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Halaman ini siap dihubungkan ke Stripe, Midtrans, Xendit, atau gerbang pembayaran
              lain saat kredensial penyedia sudah tersedia.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
