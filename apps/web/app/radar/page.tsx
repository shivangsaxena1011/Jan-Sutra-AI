"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CloudRain,
  Compass,
  Filter,
  Gavel,
  HelpCircle,
  Layers,
  MapPin,
  Radar,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Waves,
  Zap,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";

type Hotspot = {
  id: string;
  ward: string;
  zone: string;
  category: string;
  riskScore: number;
  failureProbability: string;
  estImpact: string;
  forecastWindow: string;
  primaryStress: string;
  recommendedAction: string;
  coordinates: string;
  status: "CRITICAL" | "ELEVATED" | "MONITORING";
};

const initialHotspots: Hotspot[] = [
  {
    id: "RAD-2026-081",
    ward: "Ward 12",
    zone: "BMC Zone-3 (Arera Colony)",
    category: "Water Pipeline & Pressure",
    riskScore: 94,
    failureProbability: "88.4%",
    estImpact: "14,200 Citizens / 3 Wards",
    forecastWindow: "Within 18-24 Hours",
    primaryStress: "Recurring Pressure Spike + Aging Ductile Joint",
    recommendedAction: "Pre-emptive valve throttling & dispatch rapid welding crew",
    coordinates: "23.2156° N, 77.4305° E",
    status: "CRITICAL",
  },
  {
    id: "RAD-2026-084",
    ward: "Ward 10",
    zone: "BMC Zone-2 (MP Nagar)",
    category: "Stormwater Drainage & Siltation",
    riskScore: 82,
    failureProbability: "74.1%",
    estImpact: "8,500 Commuters / Commercial Hub",
    forecastWindow: "Pre-Monsoon 48 Hours",
    primaryStress: "78% Silt Accumulation at Main Outfall Canal",
    recommendedAction: "Dispatch automated desilting suction truck",
    coordinates: "23.2324° N, 77.4328° E",
    status: "CRITICAL",
  },
  {
    id: "RAD-2026-089",
    ward: "Ward 14",
    zone: "BMC Zone-4 (Kolar Road)",
    category: "Road & Surface Subsidences",
    riskScore: 68,
    failureProbability: "62.0%",
    estImpact: "Traffic Corridor B-4",
    forecastWindow: "Next 72 Hours",
    primaryStress: "Sub-base water seepage from storm drain crack",
    recommendedAction: "Seal sub-base fissure & patch bitumen layer",
    coordinates: "23.1892° N, 77.4180° E",
    status: "ELEVATED",
  },
  {
    id: "RAD-2026-092",
    ward: "Ward 11",
    zone: "BMC Zone-3 (Shahpura)",
    category: "Streetlight Feeder Loop",
    riskScore: 49,
    failureProbability: "41.5%",
    estImpact: "3 Major Avenues",
    forecastWindow: "Next 5 Days",
    primaryStress: "Voltage oscillation on Feeder-7 transformer",
    recommendedAction: "Replace thermal capacitor unit at Junction Box 4",
    coordinates: "23.2011° N, 77.4255° E",
    status: "MONITORING",
  },
];

export default function RadarPage() {
  const [hotspots] = useState<Hotspot[]>(initialHotspots);
  const [selectedId, setSelectedId] = useState<string>("RAD-2026-081");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [radarTimeframe, setRadarTimeframe] = useState<string>("72h");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const selected = hotspots.find((h) => h.id === selectedId) || hotspots[0];

  const filtered = hotspots.filter((h) => {
    if (activeFilter === "critical") return h.status === "CRITICAL";
    if (activeFilter === "elevated") return h.status === "ELEVATED";
    return true;
  });

  return (
    <PortalFrame>
      <div className="space-y-6">
        {/* Radar Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-surface-elevated)] p-6 shadow-xl">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="telemetry-tag bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Radar size={13} className="animate-spin text-amber-500" style={{ animationDuration: "6s" }} />
                  CIVICPULSE AI PREDICTIVE RADAR
                </span>
                <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                  72-HOUR SATELLITE & SENSOR RECURRENCE ENGINE
                </span>
              </div>
              <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight md:text-3xl text-[var(--text-primary)]">
                Pre-empt infrastructure breakdowns <span className="text-amber-500">before</span> citizens call.
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
                Combining historical grievance recurrence, GIS topological stress models, and monsoon water level
                telemetry to project localized failure probabilities across Bhopal Municipal Corporation wards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 text-xs font-mono">
                {["24h", "48h", "72h", "7d"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setRadarTimeframe(tf)}
                    className={`rounded-lg px-3 py-1 font-bold transition-all ${
                      radarTimeframe === tf
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => showToast("Pre-emptive work order WO-PRE-412 dispatched to Ward 12 Water Division.")}
                className="btn-primary !px-4 !py-2.5 !text-xs"
              >
                <Zap size={14} /> Authorize Rapid Pre-emption
              </button>
            </div>
          </div>
        </section>

        {/* Telemetry Metrics Ribbon */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Monitored Nodes
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-tertiary-soft)] text-[var(--color-tertiary)]">
                <Compass size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--text-primary)]">
              1,482
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--color-secondary)]">99.4% Sensor Uptime</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Incidents Prevented
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-secondary)]">
              219
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">₹41.2L Est. Capex Saved</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Critical Hotspots
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-rose-500/15 text-rose-500">
                <ShieldAlert size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-rose-500">
              3 Clusters
            </p>
            <p className="mt-1 font-mono text-[10px] text-amber-500">Intervention Mandated</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Vendor Audit Flags
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                <Gavel size={16} />
              </span>
            </div>
            <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--text-primary)]">
              4 Contractors
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">Defect SLA Penalties</p>
          </div>
        </div>

        {/* Main Cockpit Split: Interactive Radar Matrix (Left) + Detail & AI Prescription (Right) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT: Hotspot Queue & Heatmap Simulator (7 cols) */}
          <section className="surface flex flex-col overflow-hidden xl:col-span-7">
            <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
                  Predictive Failure Heatmap & Clusters
                </h2>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Ranked by dynamic infrastructure vulnerability score
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    activeFilter === "all"
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-subtle)]"
                  }`}
                >
                  All (4)
                </button>
                <button
                  onClick={() => setActiveFilter("critical")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    activeFilter === "critical"
                      ? "bg-rose-500 text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-subtle)]"
                  }`}
                >
                  Critical (2)
                </button>
                <button
                  onClick={() => setActiveFilter("elevated")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    activeFilter === "elevated"
                      ? "bg-amber-500 text-slate-950"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-subtle)]"
                  }`}
                >
                  Elevated (1)
                </button>
              </div>
            </div>

            {/* Simulated GIS Radar Screen */}
            <div className="relative min-h-[260px] overflow-hidden bg-[#060e20] p-4 text-white">
              {/* Radar sweep lines */}
              <div className="absolute inset-0 grid-paper opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-64 rounded-full border border-sky-500/20 animate-ping opacity-25" />
                <div className="absolute size-44 rounded-full border border-amber-500/30" />
                <div className="absolute size-24 rounded-full border border-sky-400/40" />
              </div>

              {/* Pin markers */}
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-sky-400">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE SATELLITE RADAR: BHOPAL CENTRAL
                  </span>
                  <span>ZOOM: 1:12,500</span>
                </div>

                <div className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        selectedId === item.id
                          ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                          : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold text-amber-400">{item.ward}</span>
                        <span
                          className={`size-2 rounded-full ${
                            item.status === "CRITICAL"
                              ? "bg-rose-500 animate-ping"
                              : item.status === "ELEVATED"
                              ? "bg-amber-400"
                              : "bg-sky-400"
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-xs font-bold truncate text-slate-100">{item.category}</p>
                      <div className="mt-2 flex items-baseline justify-between font-mono text-[10px]">
                        <span className="text-slate-400">Risk</span>
                        <span className="font-bold text-amber-300">{item.riskScore}/100</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-900/90 px-3 py-1.5 font-mono text-[10px] text-slate-400">
                  <span>LAT/LON: 23.2599° N, 77.4126° E</span>
                  <span className="text-emerald-400">PREDICTIVE CONVERGENCE: 96.8%</span>
                </div>
              </div>
            </div>

            {/* Hotspot List */}
            <div className="divide-y divide-[var(--border-subtle)]">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex cursor-pointer items-start justify-between gap-4 p-4 transition-colors ${
                    selectedId === item.id
                      ? "bg-[var(--color-primary-soft)]"
                      : "hover:bg-[var(--bg-surface-subtle)]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[var(--color-primary)]">
                        {item.id}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {item.ward} · {item.zone}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                          item.status === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-500"
                            : item.status === "ELEVATED"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-sky-500/20 text-sky-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-1 text-xs font-bold text-[var(--text-primary)]">{item.category}</h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--text-muted)]">
                      {item.primaryStress}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-bold text-rose-500">
                      {item.failureProbability}
                    </div>
                    <div className="font-mono text-[9px] text-[var(--text-muted)]">{item.forecastWindow}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: AI Diagnostic & Root Cause Prescription (5 cols) */}
          <section className="surface flex flex-col p-6 xl:col-span-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="telemetry-tag bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Sparkles size={12} /> AI ROOT CAUSE DECONSTRUCTION
                </span>
                <h2 className="mt-2 text-base font-bold text-[var(--text-primary)]">
                  {selected.ward} — {selected.category}
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-rose-500 bg-rose-500/15 rounded-lg px-2 py-1">
                Risk {selected.riskScore}/100
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Primary Failure Mode
                </span>
                <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                  {selected.primaryStress}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 font-mono text-[10px]">
                  <span className="text-[var(--text-muted)]">Coordinates</span>
                  <span className="text-[var(--color-tertiary)] font-bold">{selected.coordinates}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                  <span className="font-mono text-[9px] text-[var(--text-muted)]">EST. CITIZEN IMPACT</span>
                  <p className="mt-1 font-mono text-xs font-bold text-[var(--text-primary)]">
                    {selected.estImpact}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                  <span className="font-mono text-[9px] text-[var(--text-muted)]">FORECAST HORIZON</span>
                  <p className="mt-1 font-mono text-xs font-bold text-amber-500">
                    {selected.forecastWindow}
                  </p>
                </div>
              </div>

              {/* Prescribed Operational Order */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                  <Zap size={15} /> Prescribed Pre-emptive Action
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-primary)] font-medium">
                  "{selected.recommendedAction}"
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => showToast(`Pre-emptive dispatched for ${selected.ward} successfully!`)}
                    className="btn-primary !w-full !py-2.5 !text-xs"
                  >
                    Dispatch Action Order
                  </button>
                </div>
              </div>

              {toast && (
                <div role="status" className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500 text-slate-950 px-4 py-3 font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CheckCircle2 size={16} />
                  <span>{toast}</span>
                </div>
              )}

              {/* Monsoon & Flood Vulnerability Index */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[var(--color-tertiary)]">
                    <CloudRain size={14} /> MONSOON SOIL SATURATION INDEX
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)]">74% LEVEL</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-500" style={{ width: "74%" }} />
                </div>
                <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                  Rainfall forecast: +14mm expected within 24h. Storm line capacity at 65%.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PortalFrame>
  );
}
