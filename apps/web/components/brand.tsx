import Link from "next/link";
import { Activity, Shield } from "lucide-react";

export function Brand({
  compact = false,
  light = false,
  href = "/",
}: {
  compact?: boolean;
  light?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3" aria-label="JAN-SUTRA AI home">
      <div className="relative">
        <span
          className={`grid size-10 place-items-center rounded-xl transition-transform group-hover:scale-105 ${
            light
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
              : "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
          }`}
        >
          <Activity size={20} strokeWidth={2.4} />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--bg-canvas)] bg-emerald-500 animate-pulse" />
      </div>
      {!compact && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-tight">
            <span
              className={`text-[15px] font-extrabold tracking-[0.14em] font-['Plus_Jakarta_Sans',sans-serif] ${
                light ? "text-white" : "text-[var(--text-primary)]"
              }`}
            >
              JAN-SUTRA AI
            </span>
            <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[9px] font-semibold text-amber-500">
              जन-सूत्र
            </span>
          </div>
          <span
            className={`mt-0.5 text-[9px] font-semibold tracking-[0.18em] font-mono ${
              light ? "text-white/60" : "text-[var(--text-muted)]"
            }`}
          >
            MUNICIPAL SOVEREIGN MATRIX
          </span>
        </div>
      )}
    </Link>
  );
}
