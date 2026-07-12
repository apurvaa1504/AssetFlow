// All shapes here mirror the actual Postgres columns from Member 1's schema.
// When Member 1's API is live, the service files in src/services/ return
// exactly this shape from the real endpoint — no remapping needed on pages.

export const currentUser = {
  id: 'u-003',
  name: 'You',
  role: 'employee', // 'admin' | 'asset_manager' | 'department_head' | 'employee'
};

// ---- bookings (Screen 6) ----------------------------------------------
export const dummyBookings = [
  {
    id: 'bk-1',
    asset_id: 'a-room-b2',
    asset_name: 'Room B2',
    asset_tag: 'AF-ROOM-B2',
    booked_by: 'Priya Shah',
    start_time: '2026-07-13T09:00:00+05:30',
    end_time: '2026-07-13T10:00:00+05:30',
    purpose: 'Sprint planning',
    status: 'upcoming', // upcoming | ongoing | completed | cancelled
  },
  {
    id: 'bk-2',
    asset_id: 'a-projector-1',
    asset_name: 'Projector 1',
    asset_tag: 'AF-0087',
    booked_by: 'Raj Mehta',
    start_time: '2026-07-13T12:00:00+05:30',
    end_time: '2026-07-13T13:00:00+05:30',
    purpose: 'Client demo',
    status: 'ongoing',
  },
  {
    id: 'bk-3',
    asset_id: 'a-room-b2',
    asset_name: 'Room B2',
    asset_tag: 'AF-ROOM-B2',
    booked_by: 'Ananya Iyer',
    start_time: '2026-07-12T15:00:00+05:30',
    end_time: '2026-07-12T16:00:00+05:30',
    purpose: 'Retro',
    status: 'completed',
  },
];

export const bookableAssets = [
  { id: 'a-room-b2', name: 'Room B2', asset_tag: 'AF-ROOM-B2' },
  { id: 'a-projector-1', name: 'Projector 1', asset_tag: 'AF-0087' },
  { id: 'a-ev-car', name: 'EV Pool Car', asset_tag: 'AF-0142' },
];

// ---- maintenance_requests (Screen 7) -----------------------------------
export const dummyMaintenance = [
  {
    id: 'mr-1',
    asset_id: 'a-0114',
    asset_name: 'Laptop',
    asset_tag: 'AF-0114',
    raised_by: 'Priya Shah',
    issue_description: 'Broken screen, top-left corner cracked',
    priority: 'high', // low | medium | high | critical
    status: 'pending', // pending | approved | rejected | technician_assigned | in_progress | resolved
    assigned_technician: null,
    created_at: '2026-07-11T10:20:00+05:30',
  },
  {
    id: 'mr-2',
    asset_id: 'a-0021',
    asset_name: 'Office Chair',
    asset_tag: 'AF-0021',
    raised_by: 'Raj Mehta',
    issue_description: 'Hydraulic lift not holding height',
    priority: 'medium',
    status: 'technician_assigned',
    assigned_technician: 'Suresh (Facilities)',
    created_at: '2026-07-10T09:00:00+05:30',
  },
  {
    id: 'mr-3',
    asset_id: 'a-0142',
    asset_name: 'EV Pool Car',
    asset_tag: 'AF-0142',
    raised_by: 'Ananya Iyer',
    issue_description: 'AC not cooling',
    priority: 'critical',
    status: 'in_progress',
    assigned_technician: 'CarCare Services',
    created_at: '2026-07-09T14:00:00+05:30',
  },
  {
    id: 'mr-4',
    asset_id: 'a-0087',
    asset_name: 'Projector 1',
    asset_tag: 'AF-0087',
    raised_by: 'Priya Shah',
    issue_description: 'Bulb dim, needs replacement',
    priority: 'low',
    status: 'resolved',
    assigned_technician: 'Suresh (Facilities)',
    created_at: '2026-07-05T11:00:00+05:30',
  },
];

export const MAINTENANCE_COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'technician_assigned', label: 'Technician Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

// ---- audit_cycles / audit_items (Screen 8) -----------------------------
export const dummyAuditCycles = [
  {
    id: 'ac-1',
    name: 'Q3 audit — Engineering dept, 1–15 Jul',
    scope_department: 'Engineering',
    start_date: '2026-07-01',
    end_date: '2026-07-15',
    status: 'active', // planned | active | closed
    auditors: ['Ananya Iyer'],
  },
  {
    id: 'ac-2',
    name: 'Q2 audit — Facilities, 1–10 Apr',
    scope_department: 'Facilities',
    start_date: '2026-04-01',
    end_date: '2026-04-10',
    status: 'closed',
    auditors: ['Raj Mehta'],
  },
];

export const dummyAuditItems = [
  { id: 'ai-1', audit_cycle_id: 'ac-1', asset_name: 'Laptop', asset_tag: 'AF-0114', expected_location: 'Desk 4B', verification_status: 'verified' },
  { id: 'ai-2', audit_cycle_id: 'ac-1', asset_name: 'Monitor', asset_tag: 'AF-0203', expected_location: 'Desk 4B', verification_status: 'pending' },
  { id: 'ai-3', audit_cycle_id: 'ac-1', asset_name: 'Office Chair', asset_tag: 'AF-0021', expected_location: 'Desk 4C', verification_status: 'missing' },
  { id: 'ai-4', audit_cycle_id: 'ac-1', asset_name: 'Projector 1', asset_tag: 'AF-0087', expected_location: 'Conf Room A', verification_status: 'damaged' },
];

// ---- dashboard KPIs (Screen 2) ------------------------------------------
export const dummyKpis = {
  assets_available: 145,
  assets_allocated: 93,
  maintenance_today: 8,
  active_bookings: 14,
  pending_transfers: 3,
  upcoming_returns: 6,
};

export const dummyOverdueReturns = [
  { id: 'ov-1', asset_tag: 'AF-0114', asset_name: 'Laptop', holder: 'Priya Shah', expected_return_date: '2026-07-08' },
  { id: 'ov-2', asset_tag: 'AF-0055', asset_name: 'Camera Kit', holder: 'Raj Mehta', expected_return_date: '2026-07-10' },
];

export const dummyUpcomingReturns = [
  { id: 'up-1', asset_tag: 'AF-0201', asset_name: 'Tablet', holder: 'Ananya Iyer', expected_return_date: '2026-07-15' },
];

// ---- reports (Screen 9) --------------------------------------------------
export const dummyMaintenanceFrequency = [
  { category: 'Electronics', count: 18 },
  { category: 'Furniture', count: 9 },
  { category: 'Vehicles', count: 5 },
  { category: 'IT Equipment', count: 12 },
];

export const dummyBookingHeatmap = [
  { hour: '9am', bookings: 4 },
  { hour: '10am', bookings: 9 },
  { hour: '11am', bookings: 11 },
  { hour: '12pm', bookings: 6 },
  { hour: '1pm', bookings: 3 },
  { hour: '2pm', bookings: 8 },
  { hour: '3pm', bookings: 12 },
  { hour: '4pm', bookings: 7 },
];

export const dummyDeptAllocationSummary = [
  { department: 'Engineering', allocated: 41 },
  { department: 'Sales', allocated: 22 },
  { department: 'Facilities', allocated: 18 },
  { department: 'HR', allocated: 12 },
];
