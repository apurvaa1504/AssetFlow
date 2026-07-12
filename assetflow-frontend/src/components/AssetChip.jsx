// Signature element: every module (Booking, Maintenance, Audit) references
// an asset. This chip is the one consistent way an asset ever appears
// anywhere in the app — mono tag + name, so "AF-0114" always reads the
// same whether you're in the allocation screen or the maintenance kanban.

export default function AssetChip({ tag, name }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-2 py-1">
      <span className="font-mono text-[11px] font-medium tracking-tight text-primary">{tag}</span>
      {name && <span className="text-sm text-ink">{name}</span>}
    </span>
  );
}
