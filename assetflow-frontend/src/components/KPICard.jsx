export default function KPICard({ label, value, tone = 'default', hint }) {
  const toneClasses = {
    default: 'text-ink',
    danger: 'text-danger',
    warn: 'text-warn',
    good: 'text-good',
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${toneClasses[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
