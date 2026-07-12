// Maps to: bookings table (Screen 6)
// GET    /bookings?asset_id=
// POST   /bookings
// PATCH  /bookings/:id/cancel
//
// Every function currently resolves to null/undefined so pages fall back
// to dummy data (see src/data/dummyData.js). Once Member 2/1's API is live,
// uncomment the axios calls — no page code needs to change, since pages
// already treat a null response as "keep using local state."

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getBookings(assetId) {
  // const res = await axios.get(`${API_BASE}/bookings`, { params: { asset_id: assetId } });
  // return res.data;
  return null;
}

export async function createBooking(booking) {
  // const res = await axios.post(`${API_BASE}/bookings`, booking);
  // return res.data;
  return null;
}

export async function cancelBooking(bookingId) {
  // const res = await axios.patch(`${API_BASE}/bookings/${bookingId}/cancel`);
  // return res.data;
  return null;
}
