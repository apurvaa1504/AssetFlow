import { useState } from 'react';

// Used anywhere something needs Approve/Reject with an optional reason:
// maintenance requests, transfer requests, audit discrepancy resolution.
export default function ApprovalModal({ open, title, subject, onApprove, onReject, onClose }) {
  const [reason, setReason] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {subject && <p className="mt-1 text-sm text-muted">{subject}</p>}

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
          Reason / notes (required if rejecting)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-accent"
          placeholder="Optional for approval, required for rejection"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(reason)}
            className="rounded-md border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-danger-light"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(reason)}
            className="rounded-md bg-good px-4 py-2 text-sm font-medium text-white hover:bg-[#257C4A]"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
