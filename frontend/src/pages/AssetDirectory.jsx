import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import AssetChip from '../components/AssetChip.jsx';
import { getAssets } from '../services/assetService.js';

export default function AssetDirectory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Asset Directory</h1>
        <p className="mt-1 text-sm text-muted">Complete master registry of all physical and digital hardware assets.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">All Assets</h2>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
            + Register Asset
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading assets…</p>
        ) : (
          <Table
            emptyLabel="No assets found."
            columns={[
              { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.assetTag} name={r.name} /> },
              { key: 'category', label: 'Category', render: (r) => r.category?.name || '—' },
              { key: 'location', label: 'Location', render: (r) => r.location || '—' },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={assets}
          />
        )}
      </div>
    </div>
  );
}

