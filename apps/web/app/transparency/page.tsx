"use client";

import { useState } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Flame,
  Globe2,
  Landmark,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";

type WardScore = {
  rank: number;
  ward: string;
  name: string;
  zone: string;
  compositeScore: number;
  verifiedResolution: string;
  mttr: string;
  disputeRate: string;
  activeTickets: number;
  budgetUtilization: string;
  status: "LEADER" | "STABLE" | "NEEDS_ATTENTION";
};

const wardData: WardScore[] = [
  {
    rank: 1,
    ward: "Ward 12",
    name: "Arera Colony / 10 No. Market",
    zone: "Zone 3",
    compositeScore: 94.6,
    verifiedResolution: "96.4%",
    mttr: "3.2 hrs",
    disputeRate: "2.1%",
    activeTickets: 8,
    budgetUtilization: "94.2%",
    status: "LEADER",
  },
  {
    rank: 2,
    ward: "Ward 07",
    name: "TT Nagar / Stadium Zone",
    zone: "Zone 2",
    compositeScore: 92.1,
    verifiedResolution: "93.8%",
    mttr: "3.8 hrs",
    disputeRate: "3.4%",
    activeTickets: 12,
    budgetUtilization: "91.0%",
    status: "LEADER",
  },
  {
    rank: 3,
    ward: "Ward 10",
    name: "MP Nagar / Commercial Central",
    zone: "Zone 2",
    compositeScore: 89.4,
    verifiedResolution: "91.2%",
    mttr: "4.4 hrs",
    disputeRate: "4.8%",
    activeTickets: 19,
    budgetUtilization: "88.5%",
    status: "STABLE",
  },
  {
    rank: 4,
    ward: "Ward 11",
    name: "Shahpura Lake Promenade",
    zone: "Zone 3",
    compositeScore: 87.8,
    verifiedResolution: "89.5%",
    mttr: "4.9 hrs",
    disputeRate: "5.2%",
    activeTickets: 15,
    budgetUtilization: "86.0%",
    status: "STABLE",
  },
  {
    rank: 5,
    ward: "Ward 14",
    name: "Kolar Road Residential Corridor",
    zone: "Zone 4",
    compositeScore: 81.2,
    verifiedResolution: "82.4%",
    mttr: "6.8 hrs",
    disputeRate: "9.6%",
    activeTickets: 34,
    budgetUtilization: "78.2%",
    status: "NEEDS_ATTENTION",
  },
  {
    rank: 6,
    ward: "Ward 18",
    name: "Govindpura Industrial Estate",
    zone: "Zone 5",
    compositeScore: 78.5,
    verifiedResolution: "79.1%",
    mttr: "7.4 hrs",
    disputeRate: "11.2%",
    activeTickets: 41,
    budgetUtilization: "72.4%",
    status: "NEEDS_ATTENTION",
  },
];

export default function TransparencyPage() {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = wardData.filter((item) => {
    const matchesSearch =
      !search ||
      item.ward.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesZone = zoneFilter === "all" || item.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <PortalFrame>
      <div className="space-y-6">
        {/* Header Ribbon */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 shadow-xl">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <Landmark size={13} /> PUBLIC CIVIC SCORECARD
                </span>
                <span className="telemetry-tag bg-sky-500/15 text-sky-500 border border-sky-500/30">
                  NIC SOVEREIGN INTEGRITY AUDIT
                </span>
              </div>
              <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight md:text-3xl text-[var(--text-primary)]">
                Bhopal Ward Health & Resolution Transparency Portal
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
                Independent public oversight of municipal speed, resolution authenticity, and citizen dispute rates
                across all 85 Bhopal Municipal Corporation wards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast("Exported NIC-Verified Sovereign Ward Scorecard dataset (CSV).")}
                className="btn-secondary !px-4 !py-2.5 !text-xs font-mono"
              >
                <Download size={14} /> Export Ward Audit CSV
              </button>
            </div>

            {toast && (
              <div role="status" className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500 text-slate-950 px-4 py-3 font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 size={16} />
                <span>{toast}</span>
              </div>
            )}
          </div>
        </section>

        {/* High-Level Overview Bento */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Wards Monitored
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--text-primary)]">
              85 / 85
            </p>
            <p className="mt-1 font-mono text-[10px] text-amber-500">1,420 IoT Nodes Active</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Citizen Verified Closure
              </span>
              <span className="font-mono text-[9px] text-[var(--text-muted)]">GAP: 7.2%</span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-secondary)]">
              91.2%
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">Dept Claim: 98.4%</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Avg Resolution MTTR
              </span>
              <span className="telemetry-tag bg-sky-500/10 text-sky-500">&lt;6h SLA</span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-tertiary)]">
              4.8 hrs
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--color-secondary)]">-18% vs Last Quarter</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Disputed Closures
              </span>
              <span className="telemetry-tag bg-rose-500/15 text-rose-500">AUTO-AUDIT</span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-rose-500">
              8.8%
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">Escalated to Field Audit</p>
          </div>
        </div>

        {/* Resolution Authenticity Breakdown Bar */}
        <section className="surface p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Citywide Resolution Authenticity Distribution
              </h2>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                Based on 2,840 authenticated citizen verifications this quarter
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <span className="size-2 rounded-full bg-emerald-500" /> 72% Flawless Confirmed
              </span>
              <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                <span className="size-2 rounded-full bg-amber-500" /> 19% Reworked
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                <span className="size-2 rounded-full bg-rose-500" /> 9% Dispute Redress
              </span>
            </div>
          </div>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div className="bg-emerald-500 h-full" style={{ width: "72%" }} />
            <div className="bg-amber-500 h-full" style={{ width: "19%" }} />
            <div className="bg-rose-500 h-full" style={{ width: "9%" }} />
          </div>
        </section>

        {/* Ward Leaderboard Table */}
        <section className="surface overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Ward Composite Health Leaderboard</h2>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                Weighted index of response speed, citizen sign-off rate, and capex efficiency
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search ward or locality..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="field !w-56 !py-1.5 !pl-9 text-xs"
                />
              </div>

              <select
                aria-label="Filter by municipal zone"
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="field !w-32 !py-1.5 text-xs font-mono"
              >
                <option value="all">All Zones</option>
                <option value="Zone 2">Zone 2</option>
                <option value="Zone 3">Zone 3</option>
                <option value="Zone 4">Zone 4</option>
                <option value="Zone 5">Zone 5</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] font-mono text-[10px] uppercase text-[var(--text-muted)]">
                <tr>
                  <th className="py-3 pl-6 pr-3">Rank</th>
                  <th className="py-3 px-3">Ward & Locality</th>
                  <th className="py-3 px-3">Composite Health</th>
                  <th className="py-3 px-3">Verified Resolution</th>
                  <th className="py-3 px-3">Avg MTTR</th>
                  <th className="py-3 px-3">Dispute Rate</th>
                  <th className="py-3 px-3">Active Cases</th>
                  <th className="py-3 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((w) => (
                  <tr key={w.ward} className="transition-colors hover:bg-[var(--bg-surface-subtle)]">
                    <td className="py-4 pl-6 pr-3 font-mono font-bold">
                      <span
                        className={`grid size-6 place-items-center rounded-lg text-xs font-bold ${
                          w.rank === 1
                            ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                            : w.rank === 2
                            ? "bg-slate-300 text-slate-950 dark:bg-slate-700 dark:text-white"
                            : w.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]"
                        }`}
                      >
                        {w.rank}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-bold text-[var(--text-primary)]">{w.ward}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{w.name}</p>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
                          {w.compositeScore}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                          <div
                            className={`h-full rounded-full ${
                              w.compositeScore >= 90
                                ? "bg-emerald-500"
                                : w.compositeScore >= 80
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${w.compositeScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-mono font-semibold text-[var(--color-secondary)]">
                      {w.verifiedResolution}
                    </td>
                    <td className="py-4 px-3 font-mono text-[var(--text-primary)]">{w.mttr}</td>
                    <td className="py-4 px-3 font-mono text-rose-500">{w.disputeRate}</td>
                    <td className="py-4 px-3 font-mono text-[var(--text-muted)]">{w.activeTickets}</td>
                    <td className="py-4 pr-6 text-right">
                      <span
                        className={`telemetry-tag ${
                          w.status === "LEADER"
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : w.status === "STABLE"
                            ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                            : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                        }`}
                      >
                        {w.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PortalFrame>
  );
}
