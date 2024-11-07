const express = require('express');
const router = express.Router();
const DjProfile = require('../models/DjProfileForm');
const { createCheckoutSession } = require('../controllers/paymentcontroller');
const { getPaymentHistory, createLoginLink } = require('../controllers/paymentHistoryController');
const authMiddleware = require('../authMiddleware');

console.log('Payment routes initialized');

router.post('/create-checkout-session', (req, res) => {
  console.log('Route hit!');
  createCheckoutSession(req, res);
});

// Protected routes with authentication
router.get('/payment-history/:accountId', authMiddleware, getPaymentHistory);
router.post('/create-login-link', authMiddleware, createLoginLink);

router.get('/pay/:djId', async (req, res) => {
  const { djId } = req.params;
  try {
    const djProfile = await DjProfile.findById(djId);
    if (!djProfile) {
      return res.status(404).send('DJ not found');
    }
    res.json({ djName: djProfile.name, djId: djProfile._id });
  } catch (error) {
    console.error('Error fetching DJ profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
