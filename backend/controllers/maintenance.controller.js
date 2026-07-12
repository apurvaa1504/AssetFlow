const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /maintenance
async function getMaintenanceRequests(req, res) {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      requests.map((r) => ({
        id: r.id,
        asset_id: r.assetId,
        asset_name: r.asset.name,
        asset_tag: r.asset.assetTag,
        raised_by: r.raisedBy,
        issue_description: r.issueDescription,
        status: r.status,
        assigned_technician: r.assignedTechnician,
        resolution_notes: r.resolutionNotes,
        created_at: r.createdAt,
      }))
    );
  } catch (err) {
    console.error('getMaintenanceRequests error:', err);
    res.status(500).json({ error: err.message });
  }
}

// POST /maintenance
async function createMaintenanceRequest(req, res) {
  try {
    const { asset_id, issue_description } = req.body;
    if (!asset_id || !issue_description) {
      return res.status(400).json({ error: 'asset_id and issue_description are required' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        assetId: asset_id,
        raisedBy: req.user.userId,
        issueDescription: issue_description,
        status: 'pending',
      },
      include: { asset: true },
    });

    res.status(201).json({
      id: request.id,
      asset_id: request.assetId,
      asset_name: request.asset.name,
      asset_tag: request.asset.assetTag,
      raised_by: request.raisedBy,
      issue_description: request.issueDescription,
      status: request.status,
      assigned_technician: request.assignedTechnician,
      created_at: request.createdAt,
    });
  } catch (err) {
    console.error('createMaintenanceRequest error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /maintenance/:id/approve
async function approveMaintenance(req, res) {
  try {
    const updated = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: { status: 'approved', resolutionNotes: req.body.notes || null },
    });
    res.json({ id: updated.id, status: updated.status });
  } catch (err) {
    console.error('approveMaintenance error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /maintenance/:id/reject
async function rejectMaintenance(req, res) {
  try {
    const updated = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: { status: 'rejected', resolutionNotes: req.body.reason || null },
    });
    res.json({ id: updated.id, status: updated.status });
  } catch (err) {
    console.error('rejectMaintenance error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /maintenance/:id/assign
async function assignTechnician(req, res) {
  try {
    const updated = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: {
        assignedTechnician: req.body.technician,
        status: 'technician_assigned',
      },
    });
    res.json({ id: updated.id, status: updated.status, assigned_technician: updated.assignedTechnician });
  } catch (err) {
    console.error('assignTechnician error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /maintenance/:id/resolve
async function resolveMaintenance(req, res) {
  try {
    const updated = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'resolved',
        resolutionNotes: req.body.resolution_notes || null,
      },
    });
    res.json({ id: updated.id, status: updated.status });
  } catch (err) {
    console.error('resolveMaintenance error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMaintenanceRequests,
  createMaintenanceRequest,
  approveMaintenance,
  rejectMaintenance,
  assignTechnician,
  resolveMaintenance,
};
