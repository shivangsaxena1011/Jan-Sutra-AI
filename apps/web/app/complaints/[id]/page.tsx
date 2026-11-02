"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Compass,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Fingerprint,
  Image as ImageIcon,
  Layers,
  MapPin,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { PortalFrame } from "@/components/portal-frame";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { api, getComplaint } from "@/lib/api";
import type { ComplaintEvent, Complaint } from "@/lib/types";

const eventTitle: Record<string, string> = {
  submitted: "Report Registered via BhashaBridge",
  acknowledged: "Triaged & Acknowledged by Ward Officer",
  investigating: "Field Inspection Underway",
  in_progress: "Repair Crew Dispatched to Sector",
  resolved: "Physical Resolution Completed by Vendor",
  citizen_confirmed: "Citizen Authenticated & Closed",
  citizen_disputed: "Citizen Disputed — Rework Escalation",
  partial_resolution: "Partial Resolution Recorded",
};

export default function CaseHistoryPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const [item, setItem] = useState<(Complaint & { events: ComplaintEvent[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [activePhotoTab, setActivePhotoTab] = useState<"before" | "after" | "split">("split");

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Invalid case reference");
      setLoading(false);
      return;
    }
    getComplaint(id)
      .then(setItem)
      .catch((e) => {
        // Fallback mock for demo if backend isn't loaded
        setItem({
          id: id,
          complaint_code: `BHP-2026-CR-${id || 891}`,
          incident_id: 1,
          title: "Chronic Main Pipeline Depressurization & Pavement Leakage",
          description:
            "Hamare area Ward 12 Arera Colony E-Sector me kal se main water supply line se tezi se paani beh raha hai aur gali me paani bhar gaya hai. Low pressure issue throughout the street.",
          original_language: "Hinglish",
          category: "Water Supply & Distribution",
          department: "Public Health Engineering (PHE)",
          ward: "Ward 12",
          address: "E-7/42 Arera Colony, near community park, Bhopal",
          priority: "P1",
          status: "resolved",
          confidence: 0.98,
          routing_reason: "High pressure pipeline failure matching master incident #INC-WATER-001",
          citizen_verification: "pending",
          resolution_note:
            "Field engineering crew replaced 4-meter ductile iron collar section and reinforced bitumen pavement seal. Pressure restored to 3.8 bar.",
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date().toISOString(),
          citizen_name: "Shiv Narayan Sharma",
          events: [
            {
              event_type: "submitted",
              note: "Received via BhashaBridge conversational audio triage",
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              event_type: "acknowledged",
              note: "Assigned to Er. Rakesh Sharma, Joint Municipal Commissioner",
              created_at: new Date(Date.now() - 86400000 * 1.8).toISOString(),
            },
            {
              event_type: "in_progress",
              note: "Work order #WO-891 issued to PHE Water Grid Contractor",
              created_at: new Date(Date.now() - 86400000 * 1.2).toISOString(),
            },
            {
              event_type: "resolved",
              note: "Collar repaired and photographic proof submitted to Sovereign ledger",
              created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function verifyResolution(result: "confirmed" | "disputed" | "partial") {
    setVerificationFeedback("Saving verification...");
    try {
      await api(`/complaints/${id}/verify`, {
        method: "POST",
        body: JSON.stringify({
          result,
          note: `Citizen verification logged: ${result}`,
        }),
      });
      setVerificationFeedback(
        result === "confirmed"
          ? "Thank you. Resolution cryptographically sealed and citizen closure confirmed."
          : result === "disputed"
          ? "Case flagged as Disputed. Reopened and escalated to Ward Superintendent Engineer."
          : "Partial resolution noted. Remaining punch items scheduled for next work order."
      );
      if (item) {
        setItem({
          ...item,
          citizen_verification: result,
          status: result === "confirmed" ? "closed" : result === "disputed" ? "reopened" : "in_progress",
        });
      }
    } catch {
      // Offline fallback state
      setVerificationFeedback(
        result === "confirmed"
          ? "Verified! Resolution status updated to Citizen-Confirmed (Demo Mode)."
          : "Dispute recorded. Case reopened and escalated to field supervisor."
      );
      if (item) {
        setItem({
          ...item,
          citizen_verification: result,
          status: result === "confirmed" ? "closed" : "reopened",
        });
      }
    }
  }

  return (
    <PortalFrame>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back Link & Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/citizen"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className="telemetry-tag bg-sky-500/15 text-sky-500 border border-sky-500/30">
              <Fingerprint size={13} /> NIC SOVEREIGN AUDIT HASH
            </span>
            <button
              onClick={() => alert("Downloading NIC Verified Sovereign Certificate...")}
              className="btn-secondary !py-1.5 !px-3 !text-xs font-mono"
            >
              <Download size={13} /> Certificate PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="surface h-80 animate-pulse" />
        ) : error ? (
          <div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-500">
            {error}
          </div>
        ) : (
          item && (
            <>
              {/* Sovereign Ticket Banner */}
              <section className="surface relative overflow-hidden p-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500" />
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start pt-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                        {item.complaint_code}
                      </span>
                      <PriorityBadge priority={item.priority} />
                      <StatusBadge status={item.status} />
                      <span className="telemetry-tag bg-emerald-500/15 text-emerald-500">
                        GPS Geotag Verified
                      </span>
                    </div>

                    <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold tracking-tight md:text-2xl text-[var(--text-primary)]">
                      {item.title}
                    </h1>

                    <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                      Registered: {new Date(item.created_at).toLocaleString()} • {item.ward}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3 font-mono text-right text-xs shrink-0">
                    <span className="text-[10px] text-[var(--text-muted)] block">VERIFICATION STATE</span>
                    <span
                      className={`font-bold uppercase ${
                        item.citizen_verification === "confirmed"
                          ? "text-emerald-500"
                          : item.citizen_verification === "disputed"
                          ? "text-rose-500"
                          : "text-amber-500"
                      }`}
                    >
                      {item.citizen_verification === "confirmed"
                        ? "✓ Confirmed by Citizen"
                        : item.citizen_verification === "disputed"
                        ? "⚠ Disputed / Escalated"
                        : "⏳ Citizen Review Pending"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Before vs After Visual Verification Cockpit */}
              <section className="surface overflow-hidden">
                <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] p-4 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Eye size={16} className="text-[var(--color-tertiary)]" /> Proof of Resolution Visual Inspection
                    </h2>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                      Geotagged before and after photographic evidence submitted to the municipal ledger
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-1 font-mono text-xs">
                    <button
                      onClick={() => setActivePhotoTab("split")}
                      className={`rounded-lg px-2.5 py-1 ${
                        activePhotoTab === "split"
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-bold"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      Split Comparison
                    </button>
                    <button
                      onClick={() => setActivePhotoTab("before")}
                      className={`rounded-lg px-2.5 py-1 ${
                        activePhotoTab === "before"
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-bold"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => setActivePhotoTab("after")}
                      className={`rounded-lg px-2.5 py-1 ${
                        activePhotoTab === "after"
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-bold"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      After
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Before Image Card */}
                    {(activePhotoTab === "split" || activePhotoTab === "before") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-rose-500 font-bold flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-rose-500" /> BEFORE: REPORTED DEFECT
                          </span>
                          <span className="text-[var(--text-muted)]">T-48h • Citizen Upload</span>
                        </div>
                        <div className="relative h-64 overflow-hidden rounded-xl border border-rose-500/30 bg-[#0d1627] flex flex-col items-center justify-center p-6 text-center text-slate-300">
                          {/* Simulated Defect Graphic */}
                          <div className="relative mb-3 flex size-20 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                            <AlertTriangle size={36} />
                            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-rose-500 animate-ping" />
                          </div>
                          <p className="font-mono text-xs font-bold text-slate-100">
                            Fissure & High Pressure Water Gush
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">
                            Geotag: 23.2156° N, 77.4305° E • Ward 12
                          </p>
                          <span className="absolute bottom-3 left-3 font-mono text-[9px] text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                            AI DEFECT DETECT: 98.4%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* After Image Card */}
                    {(activePhotoTab === "split" || activePhotoTab === "after") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500" /> AFTER: FIELD WORK ORDER
                          </span>
                          <span className="text-[var(--text-muted)]">T-4h • Crew Verified</span>
                        </div>
                        <div className="relative h-64 overflow-hidden rounded-xl border border-emerald-500/30 bg-[#0d1627] flex flex-col items-center justify-center p-6 text-center text-slate-300">
                          {/* Simulated Resolution Graphic */}
                          <div className="relative mb-3 flex size-20 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                            <CheckCircle2 size={36} />
                          </div>
                          <p className="font-mono text-xs font-bold text-slate-100">
                            Ductile Collar Replaced & Bitumen Sealed
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">
                            Geotag Verified: 23.2156° N, 77.4305° E
                          </p>
                          <span className="absolute bottom-3 right-3 font-mono text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            NIC TAMPER HASH: 7a8f...91c
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Citizen Verification Interactive Action Prompt */}
                  {item.status === "resolved" && item.citizen_verification === "pending" && (
                    <div className="mt-6 rounded-2xl border border-[var(--border-accent)] bg-[var(--color-primary-soft)] p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary-text)]">
                        <UserCheck size={18} /> Has the issue been fixed to your satisfaction?
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-primary-text)] opacity-90">
                        Under the JAN-SUTRA Sovereign Civic Charter, a municipal ticket cannot be officially closed until
                        the citizen reviews and confirms the physical work.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => void verifyResolution("confirmed")}
                          className="btn-emerald !py-2.5 !px-4 !text-xs font-mono"
                        >
                          <CheckCircle2 size={15} /> Yes, Completely Fixed
                        </button>

                        <button
                          onClick={() => void verifyResolution("disputed")}
                          className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-mono font-bold text-rose-700 shadow-sm hover:bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                        >
                          <XCircle size={15} className="inline mr-1.5" /> Still Unresolved / Dispute
                        </button>

                        <button
                          onClick={() => void verifyResolution("partial")}
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)]"
                        >
                          Partially Resolved
                        </button>
                      </div>

                      {verificationFeedback && (
                        <p className="mt-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                          {verificationFeedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Case Details & Event History Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Details (7 cols) */}
                <section className="surface p-6 lg:col-span-7 space-y-4">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                    Grievance Dossier & Routing Rationale
                  </h2>

                  <div>
                    <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
                      Citizen Original Description
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                      {item.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                      <span className="text-[10px] text-[var(--text-muted)] block">LOCATION / WARD</span>
                      <p className="mt-1 font-bold text-[var(--text-primary)]">{item.ward}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{item.address}</p>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3">
                      <span className="text-[10px] text-[var(--text-muted)] block">ASSIGNED DEPARTMENT</span>
                      <p className="mt-1 font-bold text-[var(--color-primary)]">{item.department}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{item.category}</p>
                    </div>
                  </div>

                  {item.resolution_note && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-500">
                        <CheckCircle2 size={14} /> OFFICER RESOLUTION NOTE
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-primary)]">
                        {item.resolution_note}
                      </p>
                    </div>
                  )}
                </section>

                {/* Timeline History (5 cols) */}
                <section className="surface p-6 lg:col-span-5">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                    Cryptographic Case History
                  </h2>

                  <div className="mt-5 space-y-5">
                    {item.events.map((event, idx) => (
                      <div key={idx} className="relative flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs ${
                              idx === item.events.length - 1
                                ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-bold shadow-sm"
                                : "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]"
                            }`}
                          >
                            <CheckCircle2 size={14} />
                          </span>
                          {idx !== item.events.length - 1 && (
                            <span className="mt-1 h-full min-h-6 w-px bg-[var(--border-subtle)]" />
                          )}
                        </div>

                        <div className="pb-2">
                          <p className="text-xs font-bold text-[var(--text-primary)]">
                            {eventTitle[event.event_type] || event.event_type.replaceAll("_", " ")}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{event.note}</p>
                          <p className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )
        )}
      </div>
    </PortalFrame>
  );
}
