"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { ArrowRight, CheckCircle2, Chrome, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button, LinkButton } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth-state";
import { firebaseConfigReady, getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";

export function LoginPanel() {
  const { user, isAuthLoading } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, getGoogleProvider());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login Google gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signOut(getFirebaseAuth());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Logout gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Secure workspace
            </div>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl">
              CLEAN CODE CHECKER
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300">
              Masuk untuk menyimpan workflow pemeriksaan kode, membuka akses pembayaran, dan
              melanjutkan analisis Java dari satu tempat.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/" variant="secondary">
                Home
              </LinkButton>
              <LinkButton href="/payment" icon={<ArrowRight className="h-4 w-4" />}>
                Payment
              </LinkButton>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.06] text-cyan-100">
              <Chrome className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Login dengan Google</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Gunakan akun Google yang sudah diaktifkan di Firebase Authentication.
            </p>

            {!firebaseConfigReady && (
              <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                Firebase belum dikonfigurasi. Isi variabel `NEXT_PUBLIC_FIREBASE_*` di file
                `.env.local`, lalu jalankan ulang server development.
              </div>
            )}

            {isAuthLoading ? (
              <Button
                className="mt-6 w-full"
                disabled
                icon={<Loader2 className="h-4 w-4 animate-spin" />}
                variant="secondary"
              >
                Memuat sesi login...
              </Button>
            ) : user ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" />
                    <div>
                      <p className="text-sm font-semibold text-white">Sudah login</p>
                      <p className="mt-1 text-sm text-slate-300">{user.displayName || user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <LinkButton href="/analyzer" icon={<ArrowRight className="h-4 w-4" />}>
                    Open Checker
                  </LinkButton>
                  <Button
                    disabled={isLoading}
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={handleSignOut}
                    variant="secondary"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="mt-6 w-full"
                disabled={!firebaseConfigReady || isLoading}
                icon={<Chrome className="h-4 w-4" />}
                onClick={handleGoogleLogin}
              >
                {isLoading ? "Menghubungkan..." : "Continue with Google"}
              </Button>
            )}

            {message && (
              <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm leading-6 text-rose-100">
                {message}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
