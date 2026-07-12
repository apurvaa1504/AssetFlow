import { useState } from 'react';

export default function Notifications() {
  const [notifications] = useState([
    { id: 1, title: 'Asset Audit Required', message: 'The Q3 engineering department audit cycle is closing in 3 days.', date: '2026-07-12', read: false },
    { id: 2, title: 'Maintenance Request Resolved', message: 'Your maintenance request for MacBook Pro (AST-001) has been resolved.', date: '2026-07-10', read: true },
    { id: 3, title: 'Booking Confirmation', message: 'Your booking request for Conference Room B has been approved.', date: '2026-07-09', read: true },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Stay updated with system activities, request updates, and notifications.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-card border border-line bg-surface p-5 shadow-card flex justify-between items-start gap-4 transition-all ${
              !n.read ? 'border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-ink">{n.title}</span>
                {!n.read && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    New
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">{n.message}</p>
            </div>
            <span className="text-[10px] text-muted whitespace-nowrap">{n.date}</span>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">
            All caught up! No notifications.
          </div>
        )}
      </div>
    </div>
  );
}
