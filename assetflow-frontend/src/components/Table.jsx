// columns: [{ key, label, render?(row) }]
export default function Table({ columns, rows, emptyLabel = 'Nothing here yet.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-bg/60">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-line last:border-0 hover:bg-bg/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
