const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /reports/maintenance-frequency
async function getMaintenanceFrequency(req, res) {
  try {
    const categories = await prisma.assetCategory.findMany({
      include: {
        assets: {
          include: { maintenanceRequests: true },
        },
      },
    });

    const result = categories.map((c) => ({
      category: c.name,
      count: c.assets.reduce((sum, a) => sum + a.maintenanceRequests.length, 0),
    }));

    res.json(result);
  } catch (err) {
    console.error('getMaintenanceFrequency error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /reports/booking-heatmap
async function getBookingHeatmap(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: { not: 'cancelled' } },
      select: { startTime: true },
    });

    const hourMap = {};
    for (let h = 9; h <= 17; h++) {
      const label = h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`;
      hourMap[h] = { hour: label, bookings: 0 };
    }

    bookings.forEach((b) => {
      const h = new Date(b.startTime).getHours();
      if (hourMap[h]) hourMap[h].bookings++;
    });

    res.json(Object.values(hourMap));
  } catch (err) {
    console.error('getBookingHeatmap error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /reports/department-allocation
async function getDepartmentAllocation(req, res) {
  try {
    const departments = await prisma.department.findMany({
      include: { allocations: { where: { status: 'active' } } },
    });

    const result = departments.map((d) => ({
      department: d.name,
      allocated: d.allocations.length,
    }));

    res.json(result);
  } catch (err) {
    console.error('getDepartmentAllocation error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMaintenanceFrequency, getBookingHeatmap, getDepartmentAllocation };
