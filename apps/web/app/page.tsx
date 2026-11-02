"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck2,
  Globe2,
  Layers,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-provider";

const capabilities = [
  {
    icon: MessageSquareText,
    title: "BhashaBridge Multilingual Speech",
    text: "Report in Hindi, English, or conversational Hinglish. BhashaBridge preserves original citizen voice while structuring municipal telemetry.",
    tag: "Acoustic ASR + IndicBERT",
  },
  {
    icon: Layers,
    title: "Incident Fusion & Digital Twin",
    text: "Converts dozens of redundant complaints into a single master incident on Bhopal's sovereign GIS map. -90.5% triage overhead.",
    tag: "Spatial DBSCAN",
  },
  {
    icon: Radar,
    title: "CivicPulse 72h Predictive Radar",
    text: "Anticipate pipeline bursts, monsoon canal siltation, and streetlight feeder dropouts before citizens face outages.",
    tag: "Failure Probability",
  },
  {
    icon: ShieldCheck,
    title: "Proof of Resolution & Citizen Audit",
    text: "Work orders require before/after geotagged photo proof and cryptographic OTP confirmation before being stamped as closed.",
    tag: "NIC Sovereign Seal",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200 overflow-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-glass)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Brand />

          <nav className="hidden items-center gap-7 font-mono text-xs text-[var(--text-muted)] md:flex">
            <a href="#capabilities" className="hover:text-[var(--color-primary)] transition-colors">
              CAPABILITIES
            </a>
            <a href="#digital-twin" className="hover:text-[var(--color-primary)] transition-colors">
              DIGITAL TWIN
            </a>
            <a href="#accountability" className="hover:text-[var(--color-primary)] transition-colors">
              SOVEREIGN TRUST
            </a>
            <Link href="/transparency" className="hover:text-[var(--color-primary)] transition-colors">
              WARD HEALTH SCORES
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden font-mono text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link href="/login" className="btn-primary !py-2 !px-4 !text-xs font-mono">
              Launch Matrix <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 lg:px-10 lg:pt-24 lg:pb-32">
        {/* Glow Spheres */}
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-32 size-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Hero Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--color-primary-soft)] px-3.5 py-1.5 font-mono text-[11px] font-bold text-[var(--color-primary-text)]">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              SOVEREIGN CIVIC INTELLIGENCE & DIGITAL TWIN NETWORK
            </div>

            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-[var(--text-primary)] leading-[1.08]">
              Every grievance is a signal. <br />
              <span className="text-[var(--color-primary)]">Every signal</span> shapes a sovereign city.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              JAN-SUTRA AI merges <strong>BhashaBridge</strong> multilingual speech triage, <strong>GIS digital twin</strong> incident fusion,
              and <strong>verifiable before/after proof of resolution</strong> into an authoritative municipal command network.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/login" className="btn-primary !py-3.5 !px-6 !text-xs font-mono">
                Access Citizen Hub <ArrowRight size={15} />
              </Link>
              <Link href="/radar" className="btn-secondary !py-3.5 !px-5 !text-xs font-mono">
                Explore Predictive Radar
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 font-mono text-[11px] text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <Globe2 size={15} className="text-emerald-500" /> 22 Indic Languages + Hinglish
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-500" /> NIC Cryptographic Audit
              </span>
              <span className="flex items-center gap-2">
                <Activity size={15} className="text-sky-500" /> Live Bhopal BMC Matrix
              </span>
            </div>
          </div>

          {/* Hero Right Visual: Interactive Digital Twin Mockup (5 cols) */}
          <div className="relative lg:col-span-5">
            <div className="surface-elevated relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">JanSahayak • BhashaBridge</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)]">Live Sovereign Triage</p>
                  </div>
                </div>
                <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 font-mono text-[10px]">
                  ● ACTIVE
                </span>
              </div>

              {/* Chat Speech Mock */}
              <div className="my-4 space-y-3 font-mono text-xs">
                <div className="rounded-xl rounded-tr-none bg-[var(--color-primary-soft)] p-3.5 text-[var(--color-primary-text)] font-sans">
                  "Hamare Ward 12 Arera Colony me kal se main water supply line se tezi se paani beh raha hai..."
                  <span className="mt-1 block text-right font-mono text-[9px] opacity-70">10:42 AM • VOICE RECOGNIZED</span>
                </div>

                <div className="rounded-xl rounded-tl-none border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3.5 text-[var(--text-primary)]">
                  <div className="flex items-center justify-between text-[10px] text-amber-500 font-bold mb-1">
                    <span>AI TRIAGE COMPLETE (38ms)</span>
                    <span>CONFIDENCE: 98.2%</span>
                  </div>
                  <p className="font-sans text-[11px] leading-relaxed">
                    Identified: <strong>Water Supply & Distribution</strong>. Matched to Master Incident <strong>#INC-WATER-001</strong>. Dispatching PHE crew to Arera Colony.
                  </p>
                </div>
              </div>

              {/* Proof of Resolution Banner */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> SOVEREIGN AUDIT PROOF
                  </span>
                  <span className="text-[var(--text-muted)]">OTP SIGN-OFF</span>
                </div>
                <p className="mt-1 text-[11px] font-sans text-[var(--text-primary)]">
                  Geotagged Before/After imagery verified at 23.2156° N, 77.4305° E
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities 4-Grid */}
      <section id="capabilities" className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="eyebrow">Municipal Sovereign Matrix</span>
            <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Engineered for absolute institutional trust and citizen empowerment.
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
              Moving beyond static ticketing portals to an active, transparent civic intelligence grid.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="surface flex flex-col justify-between p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-primary)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold">
                        <Icon size={20} />
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[var(--text-muted)]">0{i + 1}</span>
                    </div>

                    <h3 className="mt-6 text-sm font-bold text-[var(--text-primary)]">{cap.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{cap.text}</p>
                  </div>

                  <div className="mt-6 border-t border-[var(--border-subtle)] pt-3">
                    <span className="telemetry-tag bg-sky-500/10 text-sky-500 font-mono text-[10px]">
                      {cap.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-[var(--border-subtle)] bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center sm:flex-row sm:text-left lg:px-10">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              Experience the Future of Civic Governance.
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              Sign in with local demo credentials or explore the public transparency scorecards.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/login" className="btn-primary !py-3 !px-6 !text-xs font-mono">
              Open JAN-SUTRA Matrix <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-8 font-mono text-xs text-[var(--text-muted)] lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Brand />
          <p>© 2026 JAN-SUTRA AI • Municipal Sovereign Intelligence Network • Demonstrator Environment</p>
          <div className="flex items-center gap-4">
            <Link href="/transparency" className="hover:text-[var(--text-primary)]">
              Ward Scores
            </Link>
            <Link href="/radar" className="hover:text-[var(--text-primary)]">
              72h Radar
            </Link>
            <Link href="/login" className="hover:text-[var(--text-primary)]">
              Portal Access
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
