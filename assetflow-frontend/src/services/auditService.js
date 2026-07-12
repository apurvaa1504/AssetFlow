// Maps to: audit_cycles, audit_cycle_auditors, audit_items, audit_discrepancies
// POST   /audit-cycle
// GET    /audit-cycle
// PATCH  /audit-item/:id
// POST   /audit-cycle/:id/close
// GET    /audit-cycle/:id/discrepancy-report (CSV/PDF export)

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getAuditCycles() {
  return null;
}

export async function createAuditCycle(payload) {
  return null;
}

export async function setAuditItemStatus(itemId, status) {
  // const res = await axios.patch(`${API_BASE}/audit-item/${itemId}`, { verification_status: status });
  // return res.data;
  return null;
}

export async function closeAuditCycle(cycleId) {
  // const res = await axios.post(`${API_BASE}/audit-cycle/${cycleId}/close`);
  // return res.data;
  return null;
}

export async function getDiscrepancyReport(cycleId) {
  return null;
}
