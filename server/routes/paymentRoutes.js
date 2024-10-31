const express = require('express');
const router = express.Router();
const DjProfile = require('../models/DjProfileForm'); // Add this import
const { createCheckoutSession } = require('../controllers/paymentcontroller');

console.log('Payment routes initialized'); // Add this log

router.post('/create-checkout-session', (req, res) => {
  console.log('Route hit!'); // Add this log
  createCheckoutSession(req, res);
});
// Route to display payment form for a specific DJ
router.get('/pay/:djId', async (req, res) => {
    const { djId } = req.params;
  
    try {
      // Fetch the DJ's profile from the database
      const djProfile = await DjProfile.findById(djId);
  
      if (!djProfile) {
        return res.status(404).send('DJ not found');
      }
  
      // Render the payment form (you can also serve an HTML page here)
      res.json({ djName: djProfile.name, djId: djProfile._id });
      
    } catch (error) {
      console.error('Error fetching DJ profile:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;
