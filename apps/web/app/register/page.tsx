"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-provider";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState("Ward 12");
  const [language, setLanguage] = useState("hinglish");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signUp({ name, email, password, ward, preferred_language: language });
      router.replace("/citizen");
    } catch {
      // Offline fallback profile
      router.replace("/citizen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] lg:grid-cols-[.9fr_1fr] transition-colors duration-200">
      <section className="relative hidden overflow-hidden bg-[#060e20] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-40 -top-32 size-[540px] rounded-full border border-sky-500/20" />
        <div className="absolute -left-20 bottom-10 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10">
          <Brand light />
          <div className="mt-24 max-w-md space-y-4">
            <span className="telemetry-tag bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={12} /> CITIZEN SOVEREIGNTY
            </span>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl text-slate-100">
              Your voice matters in the <span className="text-emerald-400">conversation.</span>
            </h1>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
              Register as an active citizen to submit grievances, follow real-time work orders, and certify municipal
              completion.
            </p>
          </div>
        </div>
        <p className="relative z-10 font-mono text-[11px] text-slate-400 border-t border-slate-800 pt-4">
          Citizen Access • Multilingual BhashaBridge Triage • Transparent Case History
        </p>
      </section>

      <section className="flex flex-col justify-between px-6 py-10 sm:px-12 md:px-16">
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md my-auto py-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <UserPlus size={22} />
          </div>

          <p className="eyebrow mt-6">Citizen Registration</p>
          <h2 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Create Your Account
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Join the Bhopal Municipal Civic Intelligence Network.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className="field text-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="e.g. Shiv Narayan Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                className="field text-xs"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                autoComplete="new-password"
                className="field text-xs"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1" htmlFor="ward">
                  Ward Jurisdiction
                </label>
                <select
                  id="ward"
                  className="field text-xs font-mono"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option>Ward 12</option>
                  <option>Ward 10</option>
                  <option>Ward 11</option>
                  <option>Ward 14</option>
                  <option>Ward 07</option>
                  <option>Ward 18</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1" htmlFor="language">
                  Preferred Dialect
                </label>
                <select
                  id="language"
                  className="field text-xs font-mono"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="hinglish">Hinglish</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary !w-full !py-3 !text-xs font-mono"
            >
              {busy ? "Registering in Sovereign Matrix..." : "Create Citizen Profile"} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <footer className="text-center font-mono text-[10px] text-[var(--text-muted)]">
          JAN-SUTRA AI • Demonstrator System • Bhopal Municipal Corporation
        </footer>
      </section>
    </main>
  );
}
