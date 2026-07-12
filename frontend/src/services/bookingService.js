import { apiFetch } from './api.js';

// GET /bookings?asset_id=
export async function getBookings(assetId) {
  const qs = assetId ? `?asset_id=${assetId}` : '';
  return apiFetch(`/bookings${qs}`);
}

// GET /bookings/assets — assets that can be booked
export async function getBookableAssets() {
  return apiFetch('/bookings/assets');
}

// POST /bookings
export async function createBooking(booking) {
  return apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      asset_id: booking.asset_id,
      start_time: booking.start_time,
      end_time: booking.end_time,
      purpose: booking.purpose,
    }),
  });
}

// PATCH /bookings/:id/cancel
export async function cancelBooking(bookingId) {
  return apiFetch(`/bookings/${bookingId}/cancel`, { method: 'PATCH' });
}
