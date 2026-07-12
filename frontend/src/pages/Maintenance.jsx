import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AssetChip from '../components/AssetChip.jsx';
import ApprovalModal from '../components/ApprovalModal.jsx';
import {
  getMaintenanceRequests,
  approveMaintenance,
  rejectMaintenance,
  raiseMaintenanceRequest,
  assignTechnician,
  resolveMaintenance,
} from '../services/maintenanceService.js';
import { apiFetch } from '../services/api.js';

const MAINTENANCE_COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'technician_assigned', label: 'Technician Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function Maintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [modalRequest, setModalRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Modals/Forms State
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const [assignRequest, setAssignRequest] = useState(null);
  const [technicianName, setTechnicianName] = useState('');

  const [resolveRequest, setResolveRequest] = useState(null);
  const [resNotes, setResNotes] = useState('');

  const role = user?.role ? user.role.toUpperCase() : 'EMPLOYEE';
  const canRaise = role === 'EMPLOYEE' || role === 'ADMIN';
  const canManage = role === 'ASSET_MANAGER' || role === 'ADMIN';

  useEffect(() => {
    fetchRequests();
    if (canRaise) {
      apiFetch('/bookings/assets')
        .then(setAssets)
        .catch(() => {});
    }
  }, [canRaise]);

  function fetchRequests() {
    setLoading(true);
    getMaintenanceRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

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

  async function handleRaiseSubmit(e) {
    e.preventDefault();
    if (!selectedAssetId || !issueDescription) return;
    try {
      await raiseMaintenanceRequest({
        asset_id: selectedAssetId,
        issue_description: issueDescription,
      });
      setRaiseOpen(false);
      setSelectedAssetId('');
      setIssueDescription('');
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAssignSubmit(e) {
    e.preventDefault();
    if (!technicianName) return;
    try {
      await assignTechnician(assignRequest.id, technicianName);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === assignRequest.id
            ? { ...r, status: 'technician_assigned', assigned_technician: technicianName }
            : r
        )
      );
      setAssignRequest(null);
      setTechnicianName('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResolveSubmit(e) {
    e.preventDefault();
    try {
      await resolveMaintenance(resolveRequest.id, resNotes);
      setRequests((prev) =>
        prev.map((r) => (r.id === resolveRequest.id ? { ...r, status: 'resolved' } : r))
      );
      setResolveRequest(null);
      setResNotes('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Maintenance</h1>
          <p className="mt-1 text-sm text-muted">
            Pending → Approved/Rejected → Technician Assigned → In Progress → Resolved.
          </p>
        </div>
        {canRaise && (
          <button
            onClick={() => setRaiseOpen(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Raise Request
          </button>
        )}
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
                        <p className="mt-2 text-xs text-muted font-medium text-ink">Tech: {r.assigned_technician}</p>
                      )}
                      
                      {/* Role-based action button rendering */}
                      {r.status === 'pending' && canManage && (
                        <button
                          onClick={() => setModalRequest(r)}
                          className="mt-3 w-full rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-bg transition-colors"
                        >
                          Review
                        </button>
                      )}

                      {r.status === 'approved' && canManage && (
                        <button
                          onClick={() => setAssignRequest(r)}
                          className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark transition-colors"
                        >
                          Assign Tech
                        </button>
                      )}

                      {(r.status === 'technician_assigned' || r.status === 'in_progress') && canManage && (
                        <button
                          onClick={() => setResolveRequest(r)}
                          className="mt-3 w-full rounded-md bg-good px-3 py-1.5 text-xs font-medium text-white hover:bg-[#257C4A] transition-colors"
                        >
                          Resolve
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

      {/* Review Request Modal */}
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

      {/* Raise Maintenance Request Modal */}
      {raiseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <form onSubmit={handleRaiseSubmit} className="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Raise Maintenance Request</h3>
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Select Asset</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm bg-surface text-ink"
                required
              >
                <option value="">-- Choose Asset --</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.assetTag})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Issue Description</label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink"
                rows={3}
                placeholder="Describe the issue..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRaiseOpen(false)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Technician Modal */}
      {assignRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <form onSubmit={handleAssignSubmit} className="w-full max-w-sm rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Assign Technician</h3>
            <p className="text-xs text-muted">
              Request: {assignRequest.asset_name} ({assignRequest.asset_tag})
            </p>
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Technician Name</label>
              <input
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="e.g. John Mechanic"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignRequest(null)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resolve Request Modal */}
      {resolveRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <form onSubmit={handleResolveSubmit} className="w-full max-w-sm rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink">Resolve Maintenance</h3>
            <p className="text-xs text-muted">
              Request: {resolveRequest.asset_name} ({resolveRequest.asset_tag})
            </p>
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Resolution Notes</label>
              <textarea
                value={resNotes}
                onChange={(e) => setResNotes(e.target.value)}
                placeholder="Resolution details..."
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResolveRequest(null)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-good px-4 py-2 text-sm font-medium text-white hover:bg-[#257C4A]"
              >
                Mark Resolved
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

