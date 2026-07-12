import { useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import AssetChip from '../components/AssetChip.jsx';

export default function AssetDirectory() {
  const [assets] = useState([
    { id: 1, tag: 'AST-001', name: 'MacBook Pro 16"', category: 'Laptops', status: 'allocated', location: 'HQ - Floor 3' },
    { id: 2, tag: 'AST-002', name: 'Dell UltraSharp 27"', category: 'Monitors', status: 'available', location: 'HQ - Floor 3' },
    { id: 3, tag: 'AST-003', name: 'iPad Pro 11"', category: 'Tablets', status: 'maintenance', location: 'IT Lab' },
    { id: 4, tag: 'AST-004', name: 'iPhone 15 Pro', category: 'Phones', status: 'available', location: 'HQ - Vault' },
  ]);

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
