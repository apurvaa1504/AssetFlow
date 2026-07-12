import { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notificationService.js';

const TYPE_TO_TITLE = {
  asset_assigned: 'Asset Assigned',
  maintenance_approved: 'Maintenance Approved',
  maintenance_rejected: 'Maintenance Rejected',
  booking_confirmed: 'Booking Confirmed',
  booking_cancelled: 'Booking Cancelled',
  transfer_requested: 'Transfer Requested',
  transfer_approved: 'Transfer Approved',
  overdue_return: 'Overdue Return',
  audit_discrepancy_flagged: 'Audit Discrepancy Flagged'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Stay updated with system activities, request updates, and notifications.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading notifications…</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const title = TYPE_TO_TITLE[n.type] || n.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
            return (
              <div
                key={n.id}
                onClick={() => !n.read && handleMarkAsRead(n.id)}
                className={`rounded-card border border-line bg-surface p-5 shadow-card flex justify-between items-start gap-4 transition-all ${
                  !n.read ? 'border-l-4 border-l-primary cursor-pointer hover:bg-bg' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-ink">{title}</span>
                    {!n.read && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted">{n.message}</p>
                </div>
                <span className="text-[10px] text-muted whitespace-nowrap">{n.date}</span>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">
              All caught up! No notifications.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

