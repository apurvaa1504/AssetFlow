import { useState } from 'react';
import Table from '../components/Table.jsx';
import AssetChip from '../components/AssetChip.jsx';

export default function MyAssets() {
  const [myAssets] = useState([]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">My Assets</h1>
        <p className="mt-1 text-sm text-muted">A list of assets currently checked out or assigned to you.</p>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Assigned Hardware</h2>

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
      </div>
    </div>
  );
}
