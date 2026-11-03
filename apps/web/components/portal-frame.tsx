"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Cpu,
  FilePlus,
  Globe2,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Radar,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-provider";

const citizenLinks = [
  { href: "/citizen", label: "Citizen Hub", icon: LayoutDashboard },
  { href: "/submit", label: "Report Issue (BhashaBridge)", icon: FilePlus },
  { href: "/radar", label: "CivicPulse Radar", icon: Radar },
  { href: "/transparency", label: "Ward Health Scores", icon: BarChart3 },
];

const staffLinks = [
  { href: "/officer", label: "Operations Queue", icon: LayoutDashboard },
  { href: "/incidents", label: "Incident Fusion & Twin", icon: Layers },
  { href: "/radar", label: "Predictive Risk Radar", icon: Radar },
  { href: "/model-lab", label: "AI/ML Model Lab", icon: Cpu },
  { href: "/transparency", label: "Public Transparency", icon: BarChart3 },
];

export function PortalFrame({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "citizen" | "staff";
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (requiredRole === "citizen" && user.role !== "citizen") router.replace("/officer");
    else if (requiredRole === "staff" && user.role === "citizen") router.replace("/citizen");
  }, [loading, user, requiredRole, router]);

  if (
    loading ||
    !user ||
    (requiredRole === "citizen" && user.role !== "citizen") ||
    (requiredRole === "staff" && user.role === "citizen")
  ) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg-canvas)]">
        <div className="flex flex-col items-center gap-3 text-sm text-[var(--text-muted)]">
          <div className="relative size-10">
            <span className="absolute inset-0 size-10 animate-ping rounded-full bg-[var(--color-primary)] opacity-30" />
            <span className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-bold text-xs">
              JS
            </span>
          </div>
          <span className="font-mono text-xs tracking-wider">SECURING CIVIC MATRIX...</span>
        </div>
      </div>
    );
  }

  const links = user.role === "citizen" ? citizenLinks : staffLinks;
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200 lg:flex">
      {/* Sovereign Left Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-6 shadow-sm lg:flex">
        <Brand />

        <div className="mt-8">
          <div className="flex items-center justify-between px-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Command Vector
            </p>
            <span className="rounded bg-[var(--color-secondary-soft)] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[var(--color-secondary)]">
              LIVE
            </span>
          </div>
          <nav className="mt-3 space-y-1.5">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${
                  active(href)
                    ? "!bg-[var(--color-primary-soft)] !text-[var(--color-primary-text)] font-bold shadow-sm"
                    : "hover:bg-[var(--bg-surface-subtle)]"
                }`}
              >
                <Icon size={18} className={active(href) ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Security & Audit Telemetry Hash */}
        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] p-3.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--text-muted)]">SECURITY AUDIT</span>
              <span className="text-[var(--color-secondary)] font-bold">NIC-VERIFIED</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)] truncate">
              SHA256: 9e0b12a8...c29f
            </p>
            <div className="mt-2.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px]">
              <span className="text-[var(--text-muted)]">Protocol SLA</span>
              <span className="font-mono font-bold text-[var(--color-primary)]">99.98% OK</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <ThemeToggle compact />
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            >
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="min-w-0 flex-1 lg:pl-72">
        {/* Top Sovereign Command Bar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface-glass)] px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Brand compact href={user.role === "citizen" ? "/citizen" : "/officer"} />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold tracking-wide">
              JAN-SUTRA
            </span>
          </div>

          {/* Context breadcrumb & jurisdiction telemetry */}
          <div className="hidden lg:flex items-center gap-6">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {user.role === "citizen" ? "CITIZEN SERVICES HUB" : "MUNICIPAL OPERATIONS GRID"}
              </p>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                {pathname === "/citizen"
                  ? "Civic Overview & Submissions"
                  : pathname === "/submit"
                  ? "BhashaBridge Grievance Triage"
                  : pathname === "/incidents"
                  ? "Incident Fusion & Digital Twin"
                  : pathname === "/radar"
                  ? "CivicPulse 72-Hour Predictive Radar"
                  : pathname === "/model-lab"
                  ? "AI/ML Sovereign Architecture Lab"
                  : pathname === "/transparency"
                  ? "Ward Health Transparency Portal"
                  : "Department Work Queue"}
              </h2>
            </div>

            <div className="hidden xl:flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-3 py-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <MapPin size={13} className="text-[var(--color-tertiary)]" />
                <span className="font-semibold text-[var(--text-primary)]">
                  {user.ward || "Ward 12"} · BMC Zone-3
                </span>
              </div>
              <span className="text-[var(--border-strong)]">|</span>
              <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                <span className="size-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                <span className="font-bold">LIVE MATRIX</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Language Selector, Theme Switcher, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-2.5 py-1">
              <Globe2 size={14} className="text-[var(--text-muted)]" />
              <select
                id="portal-language"
                name="portal-language"
                aria-label="Select portal language"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent font-mono text-[11px] font-semibold text-[var(--text-secondary)] focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  English
                </option>
                <option value="hi" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  हिंदी (Hindi)
                </option>
                <option value="hinglish" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  Hinglish
                </option>
              </select>
            </div>

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            {/* Notifications Alert */}
            <button
              type="button"
              aria-label="View civic alerts and notifications"
              className="relative grid size-9 place-items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              title="Civic telemetry notifications"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-surface)]" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-1.5 pl-2.5">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold leading-none text-[var(--text-primary)]">{user.name}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-primary)]">
                  {user.role} {user.ward ? `• ${user.ward}` : ""}
                </p>
              </div>
              <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 text-xs font-black shadow-sm">
                {user.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="mx-auto max-w-[1520px] p-5 pb-24 md:p-8 md:pb-24">{children}</main>

        {/* Mobile Fixed Bottom Navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-glass)] px-3 py-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-around">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[9px] font-bold ${
                  active(href)
                    ? "text-[var(--color-primary)] font-extrabold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={18} />
                <span className="truncate max-w-[70px]">{label.split(" ")[0]}</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[9px] font-bold text-rose-500/70 hover:text-rose-500"
            >
              <LogOut size={18} />
              <span>Exit</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] px-6 py-6 text-center font-mono text-[11px] text-[var(--text-muted)] md:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span>JAN-SUTRA AI • Municipal Sovereign Matrix • Bhopal Corridor</span>
            <span className="text-[10px]">NIC-Verified Cryptographic Protocol • Demonstrator System</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
