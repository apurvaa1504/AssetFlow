import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import AssetChip from '../components/AssetChip.jsx';
import { getMyAllocations } from '../services/allocationService.js';

export default function MyAssets() {
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyAllocations()
      .then(setMyAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">My Assets</h1>
        <p className="mt-1 text-sm text-muted">A list of assets currently checked out or assigned to you.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Assigned Hardware</h2>

        {loading ? (
          <p className="text-sm text-muted">Loading assigned assets…</p>
        ) : (
          <Table
            emptyLabel="You do not have any assets assigned."
            columns={[
              { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.tag} name={r.name} /> },
              { key: 'category', label: 'Category' },
              { key: 'allocatedDate', label: 'Allocated On' },
              { key: 'returnDue', label: 'Due for Return' },
            ]}
            rows={myAssets}
          />
        )}
      </div>
    </div>
  );
}

