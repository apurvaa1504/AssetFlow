import { apiFetch } from './api.js';

// GET /dashboard/kpis
export async function getDashboardKpis() {
  return apiFetch('/dashboard/kpis');
}

// GET /dashboard/overdue-returns
export async function getOverdueReturns() {
  return apiFetch('/dashboard/overdue-returns');
}

// GET /dashboard/upcoming-returns
export async function getUpcomingReturns() {
  return apiFetch('/dashboard/upcoming-returns');
}
