const allocationService = require("../services/allocation.service");
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /allocations/my
async function getMyAllocations(req, res) {
  try {
    const allocations = await prisma.allocation.findMany({
      where: {
        employeeId: req.user.userId,
        status: 'active',
      },
      include: {
        asset: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        allocatedDate: 'desc',
      },
    });

    const result = allocations.map((a) => ({
      id: a.id,
      tag: a.asset.assetTag,
      name: a.asset.name,
      category: a.asset.category.name,
      allocatedDate: a.allocatedDate ? a.allocatedDate.toISOString().slice(0, 10) : null,
      returnDue: a.expectedReturnDate ? a.expectedReturnDate.toISOString().slice(0, 10) : null,
    }));

    res.json(result);
  } catch (err) {
    console.error('getMyAllocations error:', err);
    res.status(500).json({ error: err.message });
  }
}

// GET /allocations/department
async function getDepartmentAllocations(req, res) {
  try {
    const allocations = await prisma.allocation.findMany({
      where: {
        departmentId: { not: null },
        status: 'active',
      },
      include: {
        asset: {
          include: {
            category: true,
          },
        },
        department: true,
      },
      orderBy: {
        allocatedDate: 'desc',
      },
    });

    const result = allocations.map((a) => ({
      id: a.id,
      tag: a.asset.assetTag,
      name: a.asset.name,
      category: a.asset.category.name,
      department: a.department.name,
      status: 'allocated', // consistent with StatusBadge status options
    }));

    res.json(result);
  } catch (err) {
    console.error('getDepartmentAllocations error:', err);
    res.status(500).json({ error: err.message });
  }
}
async function createAllocation(req, res) {
    try {
        const allocation = await allocationService.createAllocation(req.body);

        res.status(201).json(allocation);

    } catch (err) {

        if (err.message === "Asset already allocated") {
            return res.status(409).json({
                message: err.message,
            });
        }

        if (err.message === "Asset not found") {
            return res.status(404).json({
                message: err.message,
            });
        }

        res.status(500).json({
            error: err.message,
        });
    }
}

async function returnAsset(req, res) {
    try {
        const allocation = await allocationService.returnAsset(req.params.id);

        res.json(allocation);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
  getMyAllocations,
  getDepartmentAllocations,
  createAllocation,
  returnAsset,
};
