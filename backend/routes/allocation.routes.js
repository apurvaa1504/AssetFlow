const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/allocation.controller');

router.get('/my', requireAuth, c.getMyAllocations);
router.get('/department', requireAuth, c.getDepartmentAllocations);

module.exports = router;
