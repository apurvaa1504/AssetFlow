import { useState, useEffect } from 'react';
import AssetChip from '../components/AssetChip.jsx';
import ApprovalModal from '../components/ApprovalModal.jsx';
import { getMaintenanceRequests, approveMaintenance, rejectMaintenance } from '../services/maintenanceService.js';

const MAINTENANCE_COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'technician_assigned', label: 'Technician Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [modalRequest, setModalRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMaintenanceRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(reason) {
    await approveMaintenance(modalRequest.id, reason);
    setRequests((prev) =>
      prev.map((r) => (r.id === modalRequest.id ? { ...r, status: 'approved' } : r))
    );
    setModalRequest(null);
  }

  async function handleReject(reason) {
    if (!reason) return;
    await rejectMaintenance(modalRequest.id, reason);
    setRequests((prev) =>
      prev.map((r) => (r.id === modalRequest.id ? { ...r, status: 'rejected' } : r))
    );
    setModalRequest(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Maintenance</h1>
        <p className="mt-1 text-sm text-muted">
          Pending → Approved/Rejected → Technician Assigned → In Progress → Resolved.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading requests…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {MAINTENANCE_COLUMNS.map((col) => {
            const items = requests.filter((r) => r.status === col.key);
            return (
              <div key={col.key} className="min-w-0">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{col.label}</h2>
                  <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map((r) => (
                    <div key={r.id} className="rounded-card border border-line bg-surface p-4 shadow-card">
                      <AssetChip tag={r.asset_tag} name={r.asset_name} />
                      <p className="mt-2 text-sm text-ink">{r.issue_description}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted">{r.raised_by}</span>
                      </div>
                      {r.assigned_technician && (
                        <p className="mt-2 text-xs text-muted">Tech: {r.assigned_technician}</p>
                      )}
                      {r.status === 'pending' && (
                        <button
                          onClick={() => setModalRequest(r)}
                          className="mt-3 w-full rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-bg"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-card border border-dashed border-line p-4 text-center text-xs text-muted">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ApprovalModal
        open={!!modalRequest}
        title="Review Maintenance Request"
        subject={
          modalRequest
            ? `${modalRequest.asset_name} (${modalRequest.asset_tag}) — ${modalRequest.issue_description}`
            : ''
        }
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={() => setModalRequest(null)}
      />
    </div>
  );
}
