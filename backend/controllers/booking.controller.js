const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /bookings?asset_id=
async function getBookings(req, res) {
  try {
    const where = {};
    if (req.query.asset_id) where.assetId = req.query.asset_id;

    const bookings = await prisma.booking.findMany({
      where,
      include: { asset: true },
      orderBy: { startTime: 'desc' },
    });

    res.json(
      bookings.map((b) => ({
        id: b.id,
        asset_id: b.assetId,
        asset_name: b.asset.name,
        asset_tag: b.asset.assetTag,
        booked_by: b.bookedBy,
        start_time: b.startTime,
        end_time: b.endTime,
        purpose: b.purpose,
        status: b.status,
      }))
    );
  } catch (err) {
    console.error('getBookings error:', err);
    res.status(500).json({ error: err.message });
  }
}

// POST /bookings
async function createBooking(req, res) {
  try {
    const { asset_id, start_time, end_time, purpose } = req.body;
    if (!asset_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'asset_id, start_time, end_time are required' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (endTime <= startTime) {
      return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    // Overlap check
    const conflict = await prisma.booking.findFirst({
      where: {
        assetId: asset_id,
        status: { notIn: ['cancelled', 'completed'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'Asset is already booked during that window' });
    }

    const booking = await prisma.booking.create({
      data: {
        assetId: asset_id,
        bookedBy: req.user.userId,
        startTime,
        endTime,
        purpose: purpose || null,
        status: 'upcoming',
      },
      include: { asset: true },
    });

    res.status(201).json({
      id: booking.id,
      asset_id: booking.assetId,
      asset_name: booking.asset.name,
      asset_tag: booking.asset.assetTag,
      booked_by: booking.bookedBy,
      start_time: booking.startTime,
      end_time: booking.endTime,
      purpose: booking.purpose,
      status: booking.status,
    });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /bookings/:id/cancel
async function cancelBooking(req, res) {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });
    res.json({ id: booking.id, status: booking.status });
  } catch (err) {
    console.error('cancelBooking error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /bookings/assets  — list assets that can be booked
async function getBookableAssets(req, res) {
  try {
    const assets = await prisma.asset.findMany({
      where: { status: { in: ['available', 'reserved'] } },
      select: { id: true, name: true, assetTag: true },
      orderBy: { name: 'asc' },
    });

    res.json(assets.map((a) => ({ id: a.id, name: a.name, asset_tag: a.assetTag })));
  } catch (err) {
    console.error('getBookableAssets error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getBookings, createBooking, cancelBooking, getBookableAssets };
