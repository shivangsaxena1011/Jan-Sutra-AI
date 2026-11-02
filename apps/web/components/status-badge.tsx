export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case "resolved":
      case "citizen_confirmed":
        return "bg-emerald-50 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30";
      case "in_progress":
      case "investigating":
        return "bg-amber-50 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30";
      case "acknowledged":
      case "open":
      case "submitted":
        return "bg-sky-50 text-sky-800 ring-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30";
      case "reopened":
      case "disputed":
        return "bg-rose-50 text-rose-800 ring-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30";
      default:
        return "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
    }
  };

  const isLive = ["in_progress", "investigating", "submitted"].includes(normalized);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${getStyle()}`}
    >
      {isLive && <span className="size-1.5 rounded-full bg-current animate-pulse" />}
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const isP1 = priority === "P1";
  const isP2 = priority === "P2";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold font-mono tracking-wider ring-1 ring-inset ${
        isP1
          ? "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:ring-rose-500/40"
          : isP2
          ? "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/40"
          : "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
      }`}
    >
      {isP1 && <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />}
      {priority}
    </span>
  );
}
