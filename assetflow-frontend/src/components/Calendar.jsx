// Simple single-day time-slot strip (9am–6pm) for a resource's bookings.
// Not a full calendar lib — fast to build, and it's exactly enough to
// visually demonstrate the overlap-rejection rule during the demo.

const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9am..5pm start hours

function toHour(iso) {
  return new Date(iso).getHours() + new Date(iso).getMinutes() / 60;
}

export default function Calendar({ bookings }) {
  const live = bookings.filter((b) => b.status !== 'cancelled');

  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-card">
      <div className="grid grid-cols-[60px_1fr] gap-2">
        {HOURS.map((hour) => {
          const slotBookings = live.filter((b) => {
            const start = toHour(b.start_time);
            const end = toHour(b.end_time);
            return start < hour + 1 && end > hour;
          });

          return (
            <div key={hour} className="contents">
              <div className="py-2 text-right text-xs text-muted">
                {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}
              </div>
              <div className="min-h-[36px] border-b border-line py-1">
                {slotBookings.map((b) => (
                  <div
                    key={b.id}
                    className="mb-1 flex items-center justify-between rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    <span className="font-medium">{b.asset_name}</span>
                    <span className="text-muted">{b.booked_by}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
