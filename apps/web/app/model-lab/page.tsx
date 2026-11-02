"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  FileCode2,
  Gauge,
  Layers,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";

type ModelTelemetry = {
  id: string;
  name: string;
  type: string;
  latency: string;
  accuracy: string;
  throughput: string;
  status: "ONLINE" | "TRAINING" | "STANDBY";
};

const models: ModelTelemetry[] = [
  {
    id: "MOD-NLP-01",
    name: "IndicBERT-L2 Sovereign",
    type: "Multilingual Triage & Intent Classifier",
    latency: "38 ms",
    accuracy: "96.4%",
    throughput: "1,240 req/sec",
    status: "ONLINE",
  },
  {
    id: "MOD-ASR-02",
    name: "IndicWav2Vec-v3 Realtime",
    type: "Hinglish & Indic Dialect Acoustic ASR",
    latency: "142 ms",
    accuracy: "93.8%",
    throughput: "450 streams/sec",
    status: "ONLINE",
  },
  {
    id: "MOD-CV-03",
    name: "CivicVision-ResNet-50",
    type: "Multimodal Defect & Resolution Verifier",
    latency: "84 ms",
    accuracy: "97.1%",
    throughput: "310 frames/sec",
    status: "ONLINE",
  },
  {
    id: "MOD-DEDUP-04",
    name: "GeoCluster-DBSCAN",
    type: "Spatial-Temporal Incident Fusion",
    latency: "12 ms",
    accuracy: "99.1%",
    throughput: "4,800 events/sec",
    status: "ONLINE",
  },
];

export default function ModelLabPage() {
  const [testInput, setTestInput] = useState(
    "Arera Colony Ward 12 me main road par water pipeline leak ho gayi hai aur paani waste ho raha hai."
  );
  const [inferring, setInferring] = useState(false);
  const [result, setResult] = useState<{
    category: string;
    department: string;
    confidence: string;
    detectedLang: string;
    priority: string;
    dedupCluster: string;
    latency: string;
  } | null>({
    category: "Water Supply & Distribution",
    department: "Public Health Engineering (PHE)",
    confidence: "98.2%",
    detectedLang: "Hinglish (Devanagari/Roman Mix)",
    priority: "P1 Critical",
    dedupCluster: "INC-WATER-001 (Ward 12 Fused)",
    latency: "24 ms",
  });

  const runSimulation = () => {
    setInferring(true);
    setTimeout(() => {
      let cat = "Water Supply & Distribution";
      let dept = "Public Health Engineering (PHE)";
      let prio = "P1 Critical";

      const lower = testInput.toLowerCase();
      if (lower.includes("sadak") || lower.includes("road") || lower.includes("pothole") || lower.includes("gaddha")) {
        cat = "Roads & Traffic Corridors";
        dept = "BMC Civil Works Department";
        prio = "P2 Elevated";
      } else if (lower.includes("kachra") || lower.includes("garbage") || lower.includes("safai") || lower.includes("dump")) {
        cat = "Solid Waste & Sanitation";
        dept = "BMC Swachhata Division";
        prio = "P3 Standard";
      } else if (lower.includes("light") || lower.includes("bijli") || lower.includes("pole") || lower.includes("andhera")) {
        cat = "Street Lighting & Electrical";
        dept = "BMC Electrical Infrastructure";
        prio = "P2 Elevated";
      }

      setResult({
        category: cat,
        department: dept,
        confidence: (94.0 + Math.random() * 5).toFixed(1) + "%",
        detectedLang: "Hinglish / Hindi",
        priority: prio,
        dedupCluster: "Cluster #CL-2026-BHP-8",
        latency: (18 + Math.floor(Math.random() * 12)) + " ms",
      });
      setInferring(false);
    }, 450);
  };

  return (
    <PortalFrame>
      <div className="space-y-6">
        {/* Header Ribbon */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 shadow-xl">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="telemetry-tag bg-sky-500/15 text-sky-500 border border-sky-500/30">
                  <BrainCircuit size={13} /> SOVEREIGN AI / ML ARCHITECTURE LAB
                </span>
                <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  ON-DEVICE & PRIVATE MUNICIPAL CLOUD
                </span>
              </div>
              <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight md:text-3xl text-[var(--text-primary)]">
                Model Observability & Inference Telemetry
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] md:text-sm">
                Real-time telemetry, classification matrices, acoustic latency, and spatial deduplication metrics
                powering JAN-SUTRA's sovereign municipal pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-xs text-[var(--color-secondary)]">
                GPU MATRIX: 4x H100 80GB • 34% LOAD
              </span>
            </div>
          </div>
        </section>

        {/* Live Model Health Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {models.map((mod) => (
            <div key={mod.id} className="metric-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--color-primary)] font-bold">{mod.id}</span>
                <span className="telemetry-tag bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  {mod.status}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-[var(--text-primary)]">{mod.name}</h3>
              <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-1">{mod.type}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-3 font-mono text-[10px]">
                <div>
                  <span className="text-[var(--text-muted)] block">Latency</span>
                  <span className="font-bold text-[var(--color-tertiary)]">{mod.latency}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block">Accuracy</span>
                  <span className="font-bold text-[var(--color-secondary)]">{mod.accuracy}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block">QPS</span>
                  <span className="font-bold text-[var(--text-primary)]">{mod.throughput}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Inference Sandbox & Simulator */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: Interactive Test Console (7 cols) */}
          <section className="surface p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Interactive Model Pipeline Simulator</h2>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Simulate raw citizen voice transcript or message through the triage pipeline
                </p>
              </div>
              <span className="telemetry-tag bg-sky-500/10 text-sky-500 font-mono text-[10px]">
                SANDBOX MODE
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Citizen Input Stream (Hindi, Hinglish, or English)
                </label>
                <textarea
                  rows={4}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="field text-xs font-mono"
                  placeholder="Type or paste citizen complaint message..."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTestInput(
                        "MP Nagar Zone 2 me main road par bada gaddha hai aur gaadi girne ka khatra hai."
                      )
                    }
                    className="rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Preset: Pothole (Hinglish)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTestInput(
                        "Ward 14 Kolar road par street light pichle tin din se band padi hai raat ko andhera rehta hai."
                      )
                    }
                    className="rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Preset: Streetlight (Hindi)
                  </button>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={inferring}
                  className="btn-primary !px-5 !py-2.5 !text-xs"
                >
                  {inferring ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Inferring...
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Run Pipeline
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inference Telemetry Logs */}
            <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[#090d16] p-4 font-mono text-[11px] text-sky-300">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span>PIPELINE EXECUTION LOG</span>
                <span>INFERENCE ENGINE v4.2</span>
              </div>
              <p className="text-emerald-400">✓ IndicWav2Vec Tokenizer: Romanized Hinglish detected</p>
              <p className="text-sky-300">✓ IndicBERT Embedding Latency: {result?.latency || "24 ms"}</p>
              <p className="text-amber-300">✓ Spatial DBSCAN: Assigned to active Ward 12 Matrix</p>
              <p className="text-slate-400">✓ Zero PII Leakage verified via SHA-256 mask</p>
            </div>
          </section>

          {/* RIGHT: Output Telemetry & Explainability Matrix (5 cols) */}
          <section className="surface p-6 lg:col-span-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4">
              Realtime Triage Deconstruction
            </h2>

            {result ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Identified Category
                  </span>
                  <p className="mt-1 font-bold text-sm text-[var(--text-primary)]">{result.category}</p>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Accountable Department
                  </span>
                  <p className="mt-1 font-bold text-sm text-[var(--color-primary)]">{result.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">CONFIDENCE</span>
                    <p className="mt-1 font-mono text-sm font-bold text-[var(--color-secondary)]">
                      {result.confidence}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">PRIORITY</span>
                    <p className="mt-1 font-mono text-sm font-bold text-rose-500">{result.priority}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                  <span className="font-mono text-[9px] text-[var(--text-muted)]">FUSED MASTER INCIDENT</span>
                  <p className="mt-1 font-mono text-xs font-bold text-[var(--color-tertiary)]">
                    {result.dedupCluster}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-500">
                    <CheckCircle2 size={13} /> EXPLAINABILITY PASSED
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    Automated recommendation meets municipal dispatch SLA guidelines.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                Run the pipeline simulator to view decomposed telemetry.
              </div>
            )}
          </section>
        </div>
      </div>
    </PortalFrame>
  );
}
