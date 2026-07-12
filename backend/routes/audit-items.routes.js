const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/audit.controller');

router.patch('/:id', requireAuth, c.updateAuditItem);

module.exports = router;
