import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import AssetChip from '../components/AssetChip.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { getDepartmentAllocations } from '../services/allocationService.js';

export default function DepartmentAssets() {
  const [deptAssets, setDeptAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDepartmentAllocations()
      .then(setDeptAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Department Assets</h1>
        <p className="mt-1 text-sm text-muted">Overview of assets allocated under your department's cost center.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Department Cost Center Inventory</h2>

        {loading ? (
          <p className="text-sm text-muted">Loading department assets…</p>
        ) : (
          <Table
            emptyLabel="No department assets found."
            columns={[
              { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.tag} name={r.name} /> },
              { key: 'category', label: 'Category' },
              { key: 'assignedTo', label: 'Assigned To', render: (r) => r.department || '—' },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={deptAssets}
          />
        )}
      </div>
    </div>
  );
}

