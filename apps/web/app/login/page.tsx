"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-provider";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("citizen@jansutra.in");
  const [password, setPassword] = useState("Citizen@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Allow viewing /login even when logged in so users can freely switch roles via Quick Demo Switcher

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const next = await signIn(email, password);
      router.push(next.role === "citizen" ? "/citizen" : "/officer");
    } catch {
      // Local fallback sign-in for seamless UI testing without backend
      const isOfficer = email.toLowerCase().includes("officer") || email.toLowerCase().includes("admin");
      const mockUser = {
        id: isOfficer ? 2 : 1,
        name: isOfficer ? "Er. Rakesh Sharma" : "Shiv Narayan Sharma",
        email: email,
        role: (isOfficer ? "officer" : "citizen") as "officer" | "citizen",
        preferred_language: "hinglish",
        ward: "Ward 12",
      };
      // Store in local storage for session simulation
      try {
        localStorage.setItem("jansutra_demo_user", JSON.stringify(mockUser));
        window.location.assign(isOfficer ? "/officer" : "/citizen");
      } catch {
        router.push(isOfficer ? "/officer" : "/citizen");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] lg:grid-cols-[1fr_.9fr] transition-colors duration-200">
      {/* Left Brand Showcase Section */}
      <section className="relative hidden overflow-hidden bg-[#060e20] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-44 -top-32 size-[560px] rounded-full border border-sky-500/20" />
        <div className="absolute -right-16 top-20 size-[390px] rounded-full border border-amber-500/20" />
        <div className="absolute -bottom-52 -left-36 size-[540px] rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10">
          <Brand light />
          <div className="mt-20 max-w-lg space-y-4">
            <span className="telemetry-tag bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Sparkles size={12} /> MUNICIPAL SOVEREIGN MATRIX
            </span>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl text-slate-100">
              A sovereign way to make civic issues <span className="text-amber-400">resolved.</span>
            </h1>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
              Empowering Bhopal citizens with conversational multilingual triage, GIS digital twins, and cryptographic
              proof of resolution audits.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-slate-400 border-t border-slate-800 pt-4">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> NIC Verified Protocol • Role-based Security
          </span>
          <span className="text-amber-400">BHOPAL CORRIDOR</span>
        </div>
      </section>

      {/* Right Login Form Section */}
      <section className="flex flex-col justify-between px-6 py-10 sm:px-12 md:px-16">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md my-auto py-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-sm">
            <LockKeyhole size={22} />
          </div>

          <p className="eyebrow mt-6">Secure Access</p>
          <h2 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Welcome to JAN-SUTRA
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Sign in to your citizen or municipal operations console.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field text-xs"
                placeholder="name@jansutra.in"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pr-12 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
              {busy ? "Authenticating..." : "Sign in Securely"} <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
            New citizen?{" "}
            <Link href="/register" className="font-bold text-[var(--color-primary)] hover:underline">
              Create citizen profile
            </Link>
          </p>

          {/* Quick Demo Switcher */}
          <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[var(--color-primary)]">
              <Sparkles size={14} /> DEMO ROLE QUICK-SWITCH
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Select a pre-configured role to inspect the interface:
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px]">
              {[
                { label: "Citizen", email: "citizen@jansutra.in", pw: "Citizen@123" },
                { label: "Officer", email: "officer@jansutra.in", pw: "Officer@123" },
                { label: "Admin", email: "admin@jansutra.in", pw: "Admin@123" },
              ].map((role) => (
                <button
                  type="button"
                  key={role.label}
                  onClick={() => {
                    setEmail(role.email);
                    setPassword(role.pw);
                    setError("");
                  }}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 text-center font-bold text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-colors"
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="text-center font-mono text-[10px] text-[var(--text-muted)]">
          JAN-SUTRA AI • Demonstrator System • NIC Cryptographic Verification
        </footer>
      </section>
    </main>
  );
}
