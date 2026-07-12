import { apiFetch } from './api.js';

// GET /audit-cycles  (includes items)
export async function getAuditCycles() {
  return apiFetch('/audit-cycles');
}

// POST /audit-cycles
export async function createAuditCycle(payload) {
  return apiFetch('/audit-cycles', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      scope_department: payload.scope_department,
      start_date: payload.start_date,
      end_date: payload.end_date,
    }),
  });
}

// PATCH /audit-items/:id
export async function setAuditItemStatus(itemId, status, notes) {
  return apiFetch(`/audit-items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ verification_status: status, notes }),
  });
}

// POST /audit-cycles/:id/close
export async function closeAuditCycle(cycleId) {
  return apiFetch(`/audit-cycles/${cycleId}/close`, { method: 'POST' });
}
