const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/audit.controller');

router.get('/', requireAuth, c.getAuditCycles);
router.post('/', requireAuth, c.createAuditCycle);
router.post('/:id/close', requireAuth, c.closeAuditCycle);

module.exports = router;
