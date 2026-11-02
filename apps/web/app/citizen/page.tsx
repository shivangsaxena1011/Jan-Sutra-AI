"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FilePlus,
  MapPin,
  MessageCircle,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { api, getComplaints, getOverview } from "@/lib/api";
import type { Complaint, Overview } from "@/lib/types";

const fallbackComplaints: Complaint[] = [
  {
    id: 1,
    complaint_code: "BHP-2026-CR-0891",
    incident_id: 1,
    title: "Chronic Main Pipeline Depressurization & Pavement Leakage",
    description:
      "Hamare area Ward 12 Arera Colony E-Sector me main water supply line se tezi se paani beh raha hai aur low pressure issue throughout the street.",
    original_language: "Hinglish",
    category: "Water Supply & Distribution",
    department: "Public Health Engineering (PHE)",
    ward: "Ward 12",
    address: "E-7/42 Arera Colony, near community park",
    priority: "P1",
    status: "resolved",
    confidence: 0.98,
    routing_reason: "High pressure pipeline failure matching master incident #INC-WATER-001",
    citizen_verification: "pending",
    resolution_note: "Field crew replaced collar section and sealed bitumen pavement.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    citizen_name: "Shiv Narayan Sharma",
  },
  {
    id: 2,
    complaint_code: "BHP-2026-CR-0895",
    incident_id: 2,
    title: "Streetlight Feeder Loop Outage at Main Crossing",
    description: "Pichle tin din se crossroad ki light band hai aur andhera rehta hai raat me.",
    original_language: "Hinglish",
    category: "Street Lighting & Electrical",
    department: "BMC Electrical Infrastructure",
    ward: "Ward 12",
    address: "Crossroad 4, 10 No. Market, Arera Colony",
    priority: "P2",
    status: "in_progress",
    confidence: 0.94,
    routing_reason: "Feeder breaker trip reported across 3 poles",
    citizen_verification: "none",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    citizen_name: "Shiv Narayan Sharma",
  },
];

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [cases, stats] = await Promise.all([getComplaints(true), getOverview()]);
      setComplaints(cases.length > 0 ? cases : fallbackComplaints);
      setOverview(stats);
      setError("");
    } catch {
      // Fallback demo data
      setComplaints(fallbackComplaints);
      setOverview({
        total_complaints: 2,
        active_complaints: 1,
        awaiting_verification: 1,
        closed_complaints: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function verify(id: number, result: "confirmed" | "disputed" | "partial") {
    setActionMessage("Submitting your response...");
    try {
      await api(`/complaints/${id}/verify`, {
        method: "POST",
        body: JSON.stringify({
          result,
          note: `Citizen verification: ${result}`,
        }),
      });
      await refresh();
      setActionMessage(
        result === "confirmed"
          ? "Resolution confirmed! Ticket officially closed in sovereign ledger."
          : "Dispute recorded. Case reopened and escalated to field supervisor."
      );
    } catch {
      // Fallback state update for offline demo
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                citizen_verification: result,
                status: result === "confirmed" ? "closed" : "reopened",
              }
            : c
        )
      );
      setActionMessage(
        result === "confirmed"
          ? "Resolution confirmed! Ticket closed."
          : "Dispute noted. Reopened."
      );
    }
  }

  return (
    <PortalFrame requiredRole="citizen">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="telemetry-tag bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Sparkles size={13} /> CITIZEN INTELLIGENCE PORTAL
              </span>
              <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                BHOPAL CORRIDOR
              </span>
            </div>
            <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight md:text-3xl text-[var(--text-primary)]">
              Welcome back. Let's keep your ward moving forward.
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
              Track your reported grievances in real-time, audit municipal proof of resolution, and review 72-hour
              predictive risk advisories.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/submit" className="btn-primary !py-2.5 !px-4 !text-xs font-mono">
              <FilePlus size={15} /> Report New Issue
            </Link>
          </div>
        </div>

        {actionMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-500">
            {actionMessage}
          </div>
        )}

        {/* 4 Metric Bento Cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                My Total Reports
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <ClipboardCheck size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--text-primary)]">
              {overview?.total_complaints ?? complaints.length}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">All Submissions</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Active in Field
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-tertiary-soft)] text-[var(--color-tertiary)]">
                <Clock3 size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-tertiary)]">
              {overview?.active_complaints ?? 1}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">Crew Dispatched</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Awaiting My Verification
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                <ShieldCheck size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-amber-500">
              {overview?.awaiting_verification ?? 1}
            </p>
            <p className="mt-1 font-mono text-[10px] text-amber-500 font-bold">Action Required</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Confirmed Closed
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-secondary)]">
              {overview?.closed_complaints ?? 0}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">Citizen Confirmed</p>
          </div>
        </div>

        {/* Civic Quick Navigation Ribbon */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/submit"
            className="surface group flex items-center justify-between p-4 transition-all hover:border-[var(--color-primary)]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold">
                <MessageCircle size={18} />
              </span>
              <div>
                <p className="font-bold text-xs text-[var(--text-primary)]">BhashaBridge Grievance Hub</p>
                <p className="text-[11px] text-[var(--text-muted)]">Speak or type in Hindi/Hinglish</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)]" />
          </Link>

          <Link
            href="/radar"
            className="surface group flex items-center justify-between p-4 transition-all hover:border-sky-400"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-sky-500/20 text-sky-400 font-bold">
                <Radar size={18} />
              </span>
              <div>
                <p className="font-bold text-xs text-[var(--text-primary)]">CivicPulse 72h Radar</p>
                <p className="text-[11px] text-[var(--text-muted)]">Monsoon & water cut advisories</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-[var(--text-muted)] group-hover:text-sky-400" />
          </Link>

          <Link
            href="/transparency"
            className="surface group flex items-center justify-between p-4 transition-all hover:border-emerald-400"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                <BarChart3 size={18} />
              </span>
              <div>
                <p className="font-bold text-xs text-[var(--text-primary)]">Ward 12 Health Score</p>
                <p className="text-[11px] text-[var(--text-muted)]">Rank #1 • 96.4% Resolution</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-[var(--text-muted)] group-hover:text-emerald-400" />
          </Link>
        </div>

        {/* Main Content Split: Complaints Stream & Verification Action */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT: Recent Reports Stream (8 cols) */}
          <section className="surface overflow-hidden xl:col-span-8">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-5">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Your Civic Report Dossier</h2>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Cryptographically verified history of issues you have logged
                </p>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  void refresh();
                }}
                className="grid size-8 place-items-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Refresh reports"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                <div className="h-16 animate-pulse rounded-xl bg-[var(--bg-surface-subtle)]" />
                <div className="h-16 animate-pulse rounded-xl bg-[var(--bg-surface-subtle)]" />
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xs text-[var(--text-muted)]">No reports yet.</p>
                <Link href="/submit" className="btn-primary mt-4 !text-xs">
                  Submit your first issue
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {complaints.map((item) => (
                  <article key={item.id} className="p-5 transition-colors hover:bg-[var(--bg-surface-subtle)]/40">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                          <span className="font-bold text-[var(--color-primary)]">{item.complaint_code}</span>
                          <PriorityBadge priority={item.priority} />
                          <span className="text-[var(--text-muted)]">{item.ward}</span>
                        </div>

                        <h3 className="mt-2 text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px]">
                          <span className="flex items-center gap-1 text-[var(--text-muted)]">
                            <MapPin size={12} className="text-[var(--color-tertiary)]" /> {item.address}
                          </span>
                          <Link
                            href={`/complaints/${item.id}`}
                            className="font-mono text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                          >
                            Inspect Proof of Resolution →
                          </Link>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
                        <StatusBadge status={item.status} />
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Pending Verification Banner */}
                    {item.status === "resolved" && item.citizen_verification === "pending" && (
                      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                          <ShieldCheck size={16} /> Field crew has reported resolution. Has the work been completed?
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                          {item.resolution_note || "Repairs finished on site. Awaiting your sign-off to close ticket."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => void verify(item.id, "confirmed")}
                            className="btn-emerald !py-1.5 !px-3 !text-xs font-mono"
                          >
                            ✓ Yes, Confirmed
                          </button>
                          <button
                            onClick={() => void verify(item.id, "disputed")}
                            className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-rose-700 hover:bg-rose-50 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800"
                          >
                            Still Unresolved
                          </button>
                          <Link
                            href={`/complaints/${item.id}`}
                            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)]"
                          >
                            View Before/After Photos
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: BhashaBridge & Sovereign Trust Card (4 cols) */}
          <aside className="space-y-4 xl:col-span-4">
            <div className="surface p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="telemetry-tag bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Sparkles size={12} /> JANSAHAYAK ASSISTANT
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Tell us what is happening in your lane.
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                Speak or type in Hinglish, Hindi, or English. You do not need to figure out which municipal ward or
                department is accountable.
              </p>
              <Link href="/submit" className="btn-primary !w-full !py-2.5 !text-xs font-mono">
                Launch BhashaBridge Triage <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4 text-xs leading-relaxed text-[var(--text-muted)]">
              <strong className="text-[var(--text-primary)] block mb-1">Your Case, Your Verified Voice</strong>
              A municipal update does not automatically mean an issue is closed. Under the JAN-SUTRA Sovereign Matrix,
              your digital confirmation is required.
            </div>
          </aside>
        </div>
      </div>
    </PortalFrame>
  );
}
