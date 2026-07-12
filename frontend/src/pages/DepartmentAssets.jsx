import { useState } from 'react';
import Table from '../components/Table.jsx';
import AssetChip from '../components/AssetChip.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function DepartmentAssets() {
  const [deptAssets] = useState([]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Department Assets</h1>
        <p className="mt-1 text-sm text-muted">Overview of assets allocated under your department's cost center.</p>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Department Cost Center Inventory</h2>

        <Table
          emptyLabel="No department assets found."
          columns={[
            { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.tag} name={r.name} /> },
            { key: 'category', label: 'Category' },
            { key: 'assignedTo', label: 'Assigned To' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={deptAssets}
        />
      </div>
    </div>
  );
}
