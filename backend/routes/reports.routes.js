const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/reports.controller');

router.get('/maintenance-frequency', requireAuth, c.getMaintenanceFrequency);
router.get('/booking-heatmap', requireAuth, c.getBookingHeatmap);
router.get('/department-allocation', requireAuth, c.getDepartmentAllocation);

module.exports = router;
