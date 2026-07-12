import { apiFetch } from './api.js';

// GET /reports/maintenance-frequency
export async function getMaintenanceFrequency() {
  return apiFetch('/reports/maintenance-frequency');
}

// GET /reports/booking-heatmap
export async function getBookingHeatmap() {
  return apiFetch('/reports/booking-heatmap');
}

// GET /reports/department-allocation
export async function getDepartmentAllocationSummary() {
  return apiFetch('/reports/department-allocation');
}
