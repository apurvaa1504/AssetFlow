import { useState, useEffect } from 'react';
import Table from '../components/Table.jsx';
import Calendar from '../components/Calendar.jsx';
import AssetChip from '../components/AssetChip.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { getBookings, getBookableAssets, createBooking } from '../services/bookingService.js';

function overlaps(newStart, newEnd, existing) {
  return existing.some(
    (b) =>
      b.status !== 'cancelled' &&
      newStart < new Date(b.end_time) &&
      newEnd > new Date(b.start_time)
  );
}

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [purpose, setPurpose] = useState('');
  const [conflictMsg, setConflictMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getBookableAssets(), getBookings()])
      .then(([assetData, bookingData]) => {
        setAssets(assetData);
        setBookings(bookingData);
        if (assetData.length > 0) setAssetId(assetData[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedAsset = assets.find((a) => a.id === assetId);
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
        `${selectedAsset?.name} is already booked during that window.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const created = await createBooking({
        asset_id: assetId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        purpose,
      });
      setBookings((prev) => [created, ...prev]);
      setStart('');
      setEnd('');
      setPurpose('');
    } catch (err) {
      setConflictMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading bookings…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Resource Booking</h1>
        <p className="mt-1 text-sm text-muted">
          Book shared resources by time slot. Overlapping requests are rejected automatically.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="rounded-card border border-dashed border-line p-6 text-center text-sm text-muted">
          No bookable assets found. Add assets with status "available" or "reserved" to the database.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-card">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted">Select Resource</label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
              >
                {assets.map((a) => (
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
              disabled={submitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? 'Booking…' : 'Book'}
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {selectedAsset?.name ?? ''} — Today
            </h2>
            <Calendar bookings={assetBookings} />
          </div>
        </div>
      )}

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
