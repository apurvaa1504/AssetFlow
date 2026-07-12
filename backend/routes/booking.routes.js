const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const c = require('../controllers/booking.controller');

router.get('/assets', requireAuth, c.getBookableAssets);
router.get('/', requireAuth, c.getBookings);
router.post('/', requireAuth, c.createBooking);
router.patch('/:id/cancel', requireAuth, c.cancelBooking);

module.exports = router;
