import { useState } from 'react';
import Table from '../components/Table.jsx';
import Calendar from '../components/Calendar.jsx';
import AssetChip from '../components/AssetChip.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { dummyBookings, bookableAssets } from '../data/dummyData.js';
import { createBooking } from '../services/bookingService.js';

// Client-side overlap pre-check so the rejection is instant in the demo.
// The real guarantee still lives in Postgres (EXCLUDE USING gist) — this
// just avoids a round trip for the common case.
function overlaps(newStart, newEnd, existing) {
  return existing.some(
    (b) =>
      b.status !== 'cancelled' &&
      newStart < new Date(b.end_time) &&
      newEnd > new Date(b.start_time)
  );
}

export default function Booking() {
  const [bookings, setBookings] = useState(dummyBookings);
  const [assetId, setAssetId] = useState(bookableAssets[0].id);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [purpose, setPurpose] = useState('');
  const [conflictMsg, setConflictMsg] = useState(null);

  const selectedAsset = bookableAssets.find((a) => a.id === assetId);
  const assetBookings = bookings.filter((b) => b.asset_id === assetId);

  async function handleSubmit(e) {
    e.preventDefault();
    setConflictMsg(null);
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      setConflictMsg('End time must be after start time.');
      return;
    }

    if (overlaps(startDate, endDate, assetBookings)) {
      setConflictMsg(
        `${selectedAsset.name} is already booked during that window. Pick a slot that doesn't overlap an existing booking.`
      );
      return;
    }

    const newBooking = {
      id: `bk-${Date.now()}`,
      asset_id: assetId,
      asset_name: selectedAsset.name,
      asset_tag: selectedAsset.asset_tag,
      booked_by: 'You',
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      purpose,
      status: 'upcoming',
    };

    // Swap point: once the backend is live, createBooking() posts to the
    // real /bookings endpoint and this optimistic update goes away.
    await createBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setStart('');
    setEnd('');
    setPurpose('');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Resource Booking</h1>
        <p className="mt-1 text-sm text-muted">
          Book shared resources by time slot. Overlapping requests are rejected automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-card">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Select Resource</label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
            >
              {bookableAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.asset_tag})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted">Start Time</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted">End Time</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Sprint planning, client demo, etc."
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>

          {conflictMsg && (
            <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
              {conflictMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Book
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {selectedAsset.name} — Today
          </h2>
          <Calendar bookings={assetBookings} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">All Bookings</h2>
        <Table
          columns={[
            { key: 'asset', label: 'Resource', render: (r) => <AssetChip tag={r.asset_tag} name={r.asset_name} /> },
            { key: 'booked_by', label: 'Booked By' },
            {
              key: 'window',
              label: 'Window',
              render: (r) =>
                `${new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(
                  r.end_time
                ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            },
            { key: 'purpose', label: 'Purpose' },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={bookings}
        />
      </div>
    </div>
  );
}
