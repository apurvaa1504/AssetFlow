// Maps every status enum in the schema (asset_status, booking_status,
// maintenance_status, verification_status, transfer_status) to one
// consistent color language, used everywhere so a red dot always means
// the same thing regardless of which module you're looking at.

const STATUS_MAP = {
  // asset_status
  available: { label: 'Available', tone: 'good' },
  allocated: { label: 'Allocated', tone: 'primary' },
  reserved: { label: 'Reserved', tone: 'violet' },
  under_maintenance: { label: 'Under Maintenance', tone: 'warn' },
  lost: { label: 'Lost', tone: 'danger' },
  retired: { label: 'Retired', tone: 'muted' },
  disposed: { label: 'Disposed', tone: 'muted' },
  // booking_status
  upcoming: { label: 'Upcoming', tone: 'primary' },
  ongoing: { label: 'Ongoing', tone: 'good' },
  completed: { label: 'Completed', tone: 'muted' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
  // maintenance_status
  pending: { label: 'Pending', tone: 'warn' },
  approved: { label: 'Approved', tone: 'good' },
  rejected: { label: 'Rejected', tone: 'danger' },
  technician_assigned: { label: 'Technician Assigned', tone: 'primary' },
  in_progress: { label: 'In Progress', tone: 'warn' },
  resolved: { label: 'Resolved', tone: 'good' },
  // verification_status
  verified: { label: 'Verified', tone: 'good' },
  missing: { label: 'Missing', tone: 'danger' },
  damaged: { label: 'Damaged', tone: 'warn' },
  // transfer_status / audit_cycle_status
  requested: { label: 'Requested', tone: 'warn' },
  active: { label: 'Active', tone: 'good' },
  planned: { label: 'Planned', tone: 'primary' },
  closed: { label: 'Closed', tone: 'muted' },
  // priority
  low: { label: 'Low', tone: 'muted' },
  medium: { label: 'Medium', tone: 'primary' },
  high: { label: 'High', tone: 'warn' },
  critical: { label: 'Critical', tone: 'danger' },
};

const TONE_CLASSES = {
  good: 'bg-good-light text-good',
  primary: 'bg-primary/10 text-primary',
  warn: 'bg-warn-light text-warn',
  danger: 'bg-danger-light text-danger',
  muted: 'bg-line text-muted',
  violet: 'bg-[#F1ECFB] text-[#7B5CC7]',
};

const DOT_CLASSES = {
  good: 'bg-good',
  primary: 'bg-primary',
  warn: 'bg-warn',
  danger: 'bg-danger',
  muted: 'bg-muted',
  violet: 'bg-[#7B5CC7]',
};

export default function StatusBadge({ status }) {
  const entry = STATUS_MAP[status] || { label: status, tone: 'muted' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[entry.tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[entry.tone]}`} />
      {entry.label}
    </span>
  );
}
