const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /audit-cycles
async function getAuditCycles(req, res) {
  try {
    const cycles = await prisma.auditCycle.findMany({
      include: { items: { include: { asset: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      cycles.map((c) => ({
        id: c.id,
        name: c.name,
        scope_department: c.departmentId || null,
        start_date: c.startDate.toISOString().slice(0, 10),
        end_date: c.endDate.toISOString().slice(0, 10),
        status: c.status,
        auditors: [],
        items: c.items.map((i) => ({
          id: i.id,
          audit_cycle_id: i.auditCycleId,
          asset_name: i.asset.name,
          asset_tag: i.asset.assetTag,
          verification_status: i.verificationStatus,
          notes: i.notes,
        })),
      }))
    );
  } catch (err) {
    console.error('getAuditCycles error:', err);
    res.status(500).json({ error: err.message });
  }
}

// POST /audit-cycles
async function createAuditCycle(req, res) {
  try {
    const { name, scope_department, start_date, end_date } = req.body;
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ error: 'name, start_date, and end_date are required' });
    }

    const cycle = await prisma.auditCycle.create({
      data: {
        name,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        status: 'planned',
      },
    });

    res.status(201).json({
      id: cycle.id,
      name: cycle.name,
      scope_department: null,
      start_date: cycle.startDate.toISOString().slice(0, 10),
      end_date: cycle.endDate.toISOString().slice(0, 10),
      status: cycle.status,
      auditors: [],
      items: [],
    });
  } catch (err) {
    console.error('createAuditCycle error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /audit-items/:id
async function updateAuditItem(req, res) {
  try {
    const { verification_status, notes } = req.body;
    const item = await prisma.auditItem.update({
      where: { id: req.params.id },
      data: {
        verificationStatus: verification_status,
        notes: notes || null,
      },
    });
    res.json({ id: item.id, verification_status: item.verificationStatus });
  } catch (err) {
    console.error('updateAuditItem error:', err);
    res.status(500).json({ error: err.message });
  }
}

// POST /audit-cycles/:id/close
async function closeAuditCycle(req, res) {
  try {
    const cycle = await prisma.auditCycle.update({
      where: { id: req.params.id },
      data: { status: 'closed' },
    });
    res.json({ id: cycle.id, status: cycle.status });
  } catch (err) {
    console.error('closeAuditCycle error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAuditCycles, createAuditCycle, updateAuditItem, closeAuditCycle };
