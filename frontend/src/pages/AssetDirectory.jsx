import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import AssetChip from '../components/AssetChip.jsx';
import { getAssets, createAsset } from '../services/assetService.js';
import { getCategories } from '../services/orgService.js';

export default function AssetDirectory() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Modal / Form fields
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('available');

  function loadData() {
    setLoading(true);
    Promise.all([getAssets(), getCategories()])
      .then(([assetData, catData]) => {
        setAssets(assetData);
        setCategories(catData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (!name || !assetTag || !categoryId) return;
    setSubmitting(true);
    setError('');
    try {
      await createAsset({
        name,
        assetTag,
        categoryId,
        location: location || null,
        status,
      });
      setModalOpen(false);
      setName('');
      setAssetTag('');
      setCategoryId('');
      setLocation('');
      setStatus('available');
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Asset Directory</h1>
          <p className="mt-1 text-sm text-muted">Complete master registry of all physical and digital hardware assets.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          + Register Asset
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">All Assets</h2>

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

      {/* Register Asset Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <form onSubmit={handleRegisterSubmit} className="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Register New Asset</h3>
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Asset Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MacBook Pro 16"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink bg-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Asset Tag</label>
              <input
                type="text"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                placeholder="e.g. AF-0114"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink bg-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm bg-surface text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. HQ - Floor 3"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink bg-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm bg-surface text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
                <option value="reserved">Reserved</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="lost">Lost</option>
                <option value="retired">Retired</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? 'Registering...' : 'Register Asset'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
