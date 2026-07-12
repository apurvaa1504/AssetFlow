const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /dashboard/kpis
async function getKpis(req, res) {
  try {
    const [assetsAvailable, assetsAllocated, maintenanceToday, activeBookings, pendingTransfers] =
      await Promise.all([
        prisma.asset.count({ where: { status: 'available' } }),
        prisma.asset.count({ where: { status: 'allocated' } }),
        prisma.maintenanceRequest.count({
          where: {
            status: { in: ['pending', 'approved', 'technician_assigned', 'in_progress'] },
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        prisma.booking.count({ where: { status: { in: ['upcoming', 'ongoing'] } } }),
        prisma.transferRequest.count({ where: { status: 'requested' } }),
      ]);

    const upcomingReturns = await prisma.allocation.count({
      where: {
        status: 'active',
        expectedReturnDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.json({
      assets_available: assetsAvailable,
      assets_allocated: assetsAllocated,
      maintenance_today: maintenanceToday,
      active_bookings: activeBookings,
      pending_transfers: pendingTransfers,
      upcoming_returns: upcomingReturns,
    });
  } catch (err) {
    console.error('getKpis error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /dashboard/overdue-returns
async function getOverdueReturns(req, res) {
  try {
    const allocations = await prisma.allocation.findMany({
      where: {
        status: 'active',
        expectedReturnDate: { lt: new Date() },
      },
      include: { asset: true },
      orderBy: { expectedReturnDate: 'asc' },
    });

    const result = allocations.map((a) => ({
      id: a.id,
      asset_tag: a.asset.assetTag,
      asset_name: a.asset.name,
      holder: a.employeeId || 'Unassigned',
      expected_return_date: a.expectedReturnDate
        ? a.expectedReturnDate.toISOString().slice(0, 10)
        : null,
    }));

    res.json(result);
  } catch (err) {
    console.error('getOverdueReturns error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /dashboard/upcoming-returns
async function getUpcomingReturns(req, res) {
  try {
    const allocations = await prisma.allocation.findMany({
      where: {
        status: 'active',
        expectedReturnDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: { asset: true },
      orderBy: { expectedReturnDate: 'asc' },
    });

    const result = allocations.map((a) => ({
      id: a.id,
      asset_tag: a.asset.assetTag,
      asset_name: a.asset.name,
      holder: a.employeeId || 'Unassigned',
      expected_return_date: a.expectedReturnDate
        ? a.expectedReturnDate.toISOString().slice(0, 10)
        : null,
    }));

    res.json(result);
  } catch (err) {
    console.error('getUpcomingReturns error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getKpis, getOverdueReturns, getUpcomingReturns };
