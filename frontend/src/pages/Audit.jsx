import { useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import AssetChip from '../components/AssetChip.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import { dummyAuditCycles, dummyAuditItems } from '../data/dummyData.js';
import { createAuditCycle, setAuditItemStatus, closeAuditCycle } from '../services/auditService.js';

export default function Audit() {
  const [cycles, setCycles] = useState(dummyAuditCycles);
  const [items, setItems] = useState(dummyAuditItems);
  const [activeCycleId, setActiveCycleId] = useState(dummyAuditCycles[0].id);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [auditor, setAuditor] = useState('');

  const activeCycle = cycles.find((c) => c.id === activeCycleId);
  const cycleItems = items.filter((i) => i.audit_cycle_id === activeCycleId);
  const discrepancyCount = cycleItems.filter((i) => i.verification_status !== 'verified' && i.verification_status !== 'pending').length;

  async function handleCreateCycle(e) {
    e.preventDefault();
    if (!name || !dept) return;
    const newCycle = {
      id: `ac-${Date.now()}`,
      name,
      scope_department: dept,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      status: 'planned',
      auditors: auditor ? [auditor] : [],
    };
    await createAuditCycle(newCycle);
    setCycles((prev) => [newCycle, ...prev]);
    setName('');
    setDept('');
    setAuditor('');
  }

  async function markItem(itemId, status) {
    await setAuditItemStatus(itemId, status);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, verification_status: status } : i)));
  }

  async function handleCloseCycle() {
    await closeAuditCycle(activeCycleId);
    setCycles((prev) => prev.map((c) => (c.id === activeCycleId ? { ...c, status: 'closed' } : c)));
    setCloseConfirmOpen(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Asset Audit</h1>
        <p className="mt-1 text-sm text-muted">
          Structured verification cycles with auto-generated discrepancy reports.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <form onSubmit={handleCreateCycle} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Create Audit Cycle</h2>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Cycle Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Q3 audit — Engineering"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Department</label>
            <input
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="Engineering"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Assign Auditor</label>
            <input
              value={auditor}
              onChange={(e) => setAuditor(e.target.value)}
              placeholder="Auditor name"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Create
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {cycles.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCycleId(c.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  c.id === activeCycleId ? 'bg-primary text-white' : 'border border-line text-muted hover:bg-bg'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {activeCycle && (
            <div className="flex items-center justify-between rounded-card border border-line bg-surface p-4 shadow-card">
              <div>
                <p className="text-sm font-medium text-ink">{activeCycle.name}</p>
                <p className="text-xs text-muted">
                  {activeCycle.start_date} → {activeCycle.end_date} · Auditors: {activeCycle.auditors.join(', ') || '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activeCycle.status} />
                {activeCycle.status !== 'closed' && (
                  <button
                    onClick={() => setCloseConfirmOpen(true)}
                    className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-bg"
                  >
                    Close Cycle
                  </button>
                )}
                {discrepancyCount > 0 && (
                  <button className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-primary hover:bg-bg">
                    Export Discrepancy Report ({discrepancyCount})
                  </button>
                )}
              </div>
            </div>
          )}

          <Table
            columns={[
              { key: 'asset', label: 'Asset', render: (r) => <AssetChip tag={r.asset_tag} name={r.asset_name} /> },
              { key: 'expected_location', label: 'Expected Location' },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.verification_status} /> },
              {
                key: 'actions',
                label: 'Mark',
                render: (r) => (
                  <div className="flex gap-1.5">
                    <button onClick={() => markItem(r.id, 'verified')} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-good-light hover:text-good">
                      Verified
                    </button>
                    <button onClick={() => markItem(r.id, 'missing')} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-danger-light hover:text-danger">
                      Missing
                    </button>
                    <button onClick={() => markItem(r.id, 'damaged')} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-warn-light hover:text-warn">
                      Damaged
                    </button>
                  </div>
                ),
              },
            ]}
            rows={cycleItems}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={closeConfirmOpen}
        title="Close this audit cycle?"
        description="This locks the cycle and flips missing items to Lost. This can't be undone."
        confirmLabel="Close Cycle"
        tone="danger"
        onConfirm={handleCloseCycle}
        onCancel={() => setCloseConfirmOpen(false)}
      />
    </div>
  );
}
