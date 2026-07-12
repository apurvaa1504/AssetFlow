// Maps to: maintenance_requests table (Screen 7)
// POST   /maintenance
// GET    /maintenance
// PATCH  /maintenance/:id/approve
// PATCH  /maintenance/:id/reject
// PATCH  /maintenance/:id/assign
// PATCH  /maintenance/:id/resolve

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getMaintenanceRequests() {
  return null;
}

export async function raiseMaintenanceRequest(payload) {
  return null;
}

export async function approveMaintenance(id, notes) {
  // const res = await axios.patch(`${API_BASE}/maintenance/${id}/approve`, { notes });
  // return res.data;
  return null;
}

export async function rejectMaintenance(id, reason) {
  // const res = await axios.patch(`${API_BASE}/maintenance/${id}/reject`, { reason });
  // return res.data;
  return null;
}

export async function assignTechnician(id, technician) {
  return null;
}

export async function resolveMaintenance(id, resolutionNotes) {
  return null;
}
