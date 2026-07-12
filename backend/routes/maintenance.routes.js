const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/maintenance.controller');

router.get('/', requireAuth, c.getMaintenanceRequests);
router.post('/', requireAuth, c.createMaintenanceRequest);
router.patch('/:id/approve', requireAuth, c.approveMaintenance);
router.patch('/:id/reject', requireAuth, c.rejectMaintenance);
router.patch('/:id/assign', requireAuth, c.assignTechnician);
router.patch('/:id/resolve', requireAuth, c.resolveMaintenance);

module.exports = router;
