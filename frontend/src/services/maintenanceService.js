import { apiFetch } from './api.js';

// GET /maintenance
export async function getMaintenanceRequests() {
  return apiFetch('/maintenance');
}

// POST /maintenance
export async function raiseMaintenanceRequest(payload) {
  return apiFetch('/maintenance', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PATCH /maintenance/:id/approve
export async function approveMaintenance(id, notes) {
  return apiFetch(`/maintenance/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  });
}

// PATCH /maintenance/:id/reject
export async function rejectMaintenance(id, reason) {
  return apiFetch(`/maintenance/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

// PATCH /maintenance/:id/assign
export async function assignTechnician(id, technician) {
  return apiFetch(`/maintenance/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ technician }),
  });
}

// PATCH /maintenance/:id/resolve
export async function resolveMaintenance(id, resolutionNotes) {
  return apiFetch(`/maintenance/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ resolution_notes: resolutionNotes }),
  });
}
