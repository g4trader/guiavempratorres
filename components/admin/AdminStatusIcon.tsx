type StatusTone = "active" | "draft" | "paused" | "archived" | "inactive";

const statusConfig: Record<string, { label: string; symbol: string; tone: StatusTone }> = {
  active: { label: "Ativa", symbol: "✓", tone: "active" },
  published: { label: "Publicada", symbol: "✓", tone: "active" },
  draft: { label: "Rascunho", symbol: "✎", tone: "draft" },
  paused: { label: "Pausada", symbol: "Ⅱ", tone: "paused" },
  suspended: { label: "Suspensa", symbol: "Ⅱ", tone: "paused" },
  archived: { label: "Arquivada", symbol: "—", tone: "archived" },
  inactive: { label: "Inativa", symbol: "—", tone: "inactive" }
};

export function AdminStatusIcon({
  status,
  activeLabel,
  inactiveLabel
}: {
  status: string | boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  const normalized = typeof status === "boolean" ? (status ? "active" : "inactive") : status;
  const config = statusConfig[normalized] ?? statusConfig.inactive;
  const label =
    normalized === "active" && activeLabel
      ? activeLabel
      : normalized === "inactive" && inactiveLabel
        ? inactiveLabel
        : config.label;

  return (
    <span
      className={`admin-status-icon is-${config.tone}`}
      title={label}
      aria-label={label}
    >
      <span aria-hidden="true">{config.symbol}</span>
    </span>
  );
}
