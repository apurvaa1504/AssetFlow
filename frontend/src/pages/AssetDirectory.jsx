import { useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import AssetChip from '../components/AssetChip.jsx';

export default function AssetDirectory() {
  const [assets] = useState([]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Asset Directory</h1>
        <p className="mt-1 text-sm text-muted">Complete master registry of all physical and digital hardware assets.</p>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">All Assets</h2>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
            + Register Asset
          </button>
        </div>

        <Table
          emptyLabel="No assets found."
          columns={[
            { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.tag} name={r.name} /> },
            { key: 'category', label: 'Category' },
            { key: 'location', label: 'Location' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={assets}
        />
      </div>
    </div>
  );
}
