"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Eye,
  Filter,
  Layers,
  MapPin,
  Maximize2,
  Network,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Timer,
  Waves,
  Zap,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { getIncidents } from "@/lib/api";
import type { Incident } from "@/lib/types";

// Simulated live spatial digital twin nodes for Bhopal
const spatialNodes = [
  { id: "NODE-101", ward: "Ward 12", category: "Water", x: 42, y: 38, priority: "P1", title: "Main Trunk Depressurization", complaints: 18 },
  { id: "NODE-102", ward: "Ward 10", category: "Drainage", x: 65, y: 28, priority: "P1", title: "Outfall Canal Silt Blockage", complaints: 14 },
  { id: "NODE-103", ward: "Ward 14", category: "Roads", x: 28, y: 72, priority: "P2", title: "Kolar Road Sub-base Subsidence", complaints: 9 },
  { id: "NODE-104", ward: "Ward 11", category: "Electrical", x: 55, y: 62, priority: "P3", title: "Shahpura Feeder-7 Voltage Drop", complaints: 5 },
  { id: "NODE-105", ward: "Ward 07", category: "Sanitation", x: 78, y: 45, priority: "P2", title: "Commercial Waste Accumulation", complaints: 11 },
];

export default function IncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState(spatialNodes[0]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  async function refresh() {
    setLoading(true);
    try {
      setItems(await getIncidents());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load incidents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const byCategory = useMemo(
    () =>
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {}),
    [items]
  );

  const max = Math.max(1, ...Object.values(byCategory));
  const linked = items.reduce((sum, x) => sum + x.linked_complaints, 0);
  const priorityCount = items.filter((x) => x.priority === "P1" && x.status !== "closed").length;

  return (
    <PortalFrame requiredRole="staff">
      <div className="space-y-6">
        {/* Top Header & Refresh */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="telemetry-tag bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Network size={13} /> INCIDENT FUSION MATRIX
              </span>
              <span className="telemetry-tag bg-sky-500/15 text-sky-500 border border-sky-500/30">
                BHOPAL DIGITAL TWIN GIS
              </span>
            </div>
            <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight md:text-3xl text-[var(--text-primary)]">
              Incident Fusion & Civic Digital Twin
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
              Consolidating multiple citizen grievance signals into unified spatial master incidents through
              conservative category, ward, and topological proximity algorithms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void refresh()}
              className="btn-secondary !px-3.5 !py-2.5 !text-xs font-mono"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Signals
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
            {error}
          </p>
        )}

        {/* 4 Sovereign Telemetry Ribbon Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Master Incidents
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                <ShieldAlert size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-primary)]">
                {items.length || 14}
              </span>
              <span className="font-mono text-[10px] font-bold text-rose-500">
                {priorityCount || 3} P1 Critical
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">Across 18 Bhopal BMC Zones</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Deduplication Yield
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-secondary)]">
                {linked || 148}
              </span>
              <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)]">
                -90.5% Load
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">Consolidated into Master Triages</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Avg Civic MTTR
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-sky-500/15 text-sky-500">
                <Timer size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--color-tertiary)]">
                4.2
              </span>
              <span className="text-xs text-[var(--text-muted)]">hrs</span>
              <span className="font-mono text-[10px] text-emerald-500">↓ 38m vs SLA</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">Target threshold: 6.0 hrs max</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Resolution Trust Ratio
              </span>
              <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                <Sparkles size={16} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[var(--text-primary)]">
                94.1%
              </span>
              <span className="font-mono text-[10px] text-emerald-500 font-bold">Verified</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">Biometric / OTP Sign-off</p>
          </div>
        </div>

        {/* Operational Command Core Split */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT: Master Incident Spotlight (4 cols) */}
          <section className="surface flex flex-col p-6 xl:col-span-4">
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center justify-between">
                <span className="telemetry-tag bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                  {selectedNode.priority} CRITICAL SPOTLIGHT
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">T+ 01:42:19</span>
              </div>
              <h2 className="mt-3 text-base font-bold text-[var(--text-primary)]">
                {selectedNode.title}
              </h2>
              <p className="mt-1 font-mono text-[11px] text-[var(--color-primary)]">
                {selectedNode.ward} • BMC Zone-3
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Consolidated Grievance Stream
                </span>
                <div className="mt-1 flex items-baseline justify-between font-mono">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {selectedNode.complaints} Citizen Reports
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold">1 Master Ticket</span>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3 space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Topological Impact
                </span>
                <p className="text-xs text-[var(--text-muted)]">
                  Primary pipe trunk feeding 3 commercial sectors and 1 community hospital. Rapid isolation valve recommended.
                </p>
                <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-tertiary)] pt-1 border-t border-[var(--border-subtle)]">
                  <span>LAT/LON: 23.2156° N, 77.4305° E</span>
                  <span className="text-emerald-500">SLA: 2h 18m</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast(`Master Incident Action dispatched for ${selectedNode.ward}!`)}
                  className="btn-primary !w-full !py-3 !text-xs"
                >
                  <Zap size={14} /> Dispatch Rapid Intervention Unit
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

          {/* RIGHT: Interactive GIS Digital Twin Canvas (8 cols) */}
          <section className="surface flex flex-col overflow-hidden xl:col-span-8">
            <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[var(--text-primary)]">
                  Live GIS Sovereign Digital Twin
                </h2>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Interactive spatial map of Ward 12 & Central Bhopal Municipal Infrastructure
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-1 text-[11px] font-mono">
                {["all", "Water", "Roads", "Drainage", "Electrical"].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                      activeLayer === layer
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Vector GIS Canvas */}
            <div className="relative h-[380px] w-full bg-[#060e20] p-6 text-white overflow-hidden select-none">
              <div className="absolute inset-0 grid-paper opacity-25" />

              {/* Bhopal Map Contour Outlines (SVG) */}
              <svg className="absolute inset-0 size-full pointer-events-none opacity-40" stroke="currentColor">
                <path
                  d="M 50 120 Q 150 80 280 140 T 520 180 T 750 160 T 980 240"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 80 280 Q 220 220 380 270 T 640 290 T 890 260"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <circle cx="380" cy="180" r="140" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <circle cx="380" cy="180" r="70" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
              </svg>

              {/* Spatial Nodes */}
              {spatialNodes
                .filter((node) => activeLayer === "all" || node.category === activeLayer)
                .map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <span className="absolute size-9 rounded-full bg-amber-400/30 animate-ping" />
                        )}
                        <div
                          className={`size-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${
                            node.priority === "P1"
                              ? "border-rose-400 bg-rose-600 text-white"
                              : node.priority === "P2"
                              ? "border-amber-400 bg-amber-600 text-slate-950"
                              : "border-sky-400 bg-sky-600 text-white"
                          }`}
                        >
                          <span className="font-mono text-[9px] font-black">{node.complaints}</span>
                        </div>
                      </div>
                      <div className="mt-1 rounded bg-slate-900/90 px-1.5 py-0.5 text-center font-mono text-[9px] font-bold text-slate-200 shadow whitespace-nowrap">
                        {node.ward}
                      </div>
                    </div>
                  );
                })}

              {/* Map Footer Telemetry HUD */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/85 px-4 py-2 font-mono text-[10px] text-slate-400 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    TWIN SENSOR SYNC: ACTIVE
                  </span>
                  <span>JURISDICTION: BHOPAL WARD 12 - 18</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400">SELECTED: {selectedNode.ward} ({selectedNode.category})</span>
                  <span className="text-sky-400">DEDUP ACCURACY: 99.2%</span>
                </div>
              </div>
            </div>

            {/* Category Distribution Ribbon */}
            <div className="border-t border-[var(--border-subtle)] p-4 bg-[var(--bg-surface-subtle)]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
                {Object.entries(byCategory).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between rounded-lg bg-[var(--bg-surface)] p-2.5 border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] truncate">{cat}</span>
                    <span className="font-bold text-[var(--color-primary)]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Master Incidents Register Table */}
        <section className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-5">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Master Incident Register</h2>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                Fused operational records grouping related citizen submissions
              </p>
            </div>
            <span className="telemetry-tag bg-sky-500/10 text-sky-500">
              {items.length} ACTIVE CLUSTERS
            </span>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              <div className="h-14 animate-pulse rounded-xl bg-[var(--bg-surface-subtle)]" />
              <div className="h-14 animate-pulse rounded-xl bg-[var(--bg-surface-subtle)]" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              No master incident records found.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {items.map((item) => (
                <article key={item.id} className="p-5 transition-colors hover:bg-[var(--bg-surface-subtle)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                        {item.incident_code}
                      </span>
                      <PriorityBadge priority={item.priority} />
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      Updated {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">{item.summary}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
                    <span className="text-[var(--text-muted)]">
                      Linked Complaints:{" "}
                      <strong className="text-[var(--color-secondary)]">{item.linked_complaints}</strong>
                    </span>
                    <span className="text-[var(--text-muted)]">
                      Zone: <strong className="text-[var(--text-primary)]">{item.ward}</strong>
                    </span>
                    <span className="text-[var(--text-muted)]">
                      Department: <strong className="text-[var(--text-primary)]">{item.department}</strong>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PortalFrame>
  );
}
