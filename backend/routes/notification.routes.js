const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/notification.controller');

router.get('/', requireAuth, c.getNotifications);
router.patch('/:id/read', requireAuth, c.markAsRead);

module.exports = router;
