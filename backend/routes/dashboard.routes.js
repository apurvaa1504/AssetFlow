const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/dashboard.controller');

router.get('/kpis', requireAuth, c.getKpis);
router.get('/overdue-returns', requireAuth, c.getOverdueReturns);
router.get('/upcoming-returns', requireAuth, c.getUpcomingReturns);

module.exports = router;
