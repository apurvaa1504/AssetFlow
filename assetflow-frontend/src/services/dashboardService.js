// Maps to: KPI aggregation queries across assets, bookings, maintenance_requests,
// transfer_requests, allocations (Screen 2)
// GET /dashboard/kpis
// GET /dashboard/overdue-returns
// GET /dashboard/upcoming-returns

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getDashboardKpis() {
  // const res = await axios.get(`${API_BASE}/dashboard/kpis`);
  // return res.data;
  return null;
}

export async function getOverdueReturns() {
  return null;
}

export async function getUpcomingReturns() {
  return null;
}
