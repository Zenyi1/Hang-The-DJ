const express = require('express');
const DjProfile = require('./models/DjProfileForm');
const router = express.Router();

// Create a DJ profile
router.post('/djs', async (req, res) => {
  const { name, bio, email } = req.body;

  try {
    const newDj = new DjProfile({ name, bio, email });
    await newDj.save();

    console.log('DJ Profile Created:', { name, bio, email });
    res.status(201).json({ success: true, message: 'DJ profile created!' });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

router.post('/create-stripe-account', async (req, res) => {
  try {
    // First check if user already has a Stripe account
    const user = await DjProfile.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user already has a Stripe account, return it
    if (user.stripeAccountId) {
      return res.json({ 
        accountId: user.stripeAccountId,
        existing: true
      });
    }

    // Create new Stripe account
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      country: 'GB',
      business_type: 'individual',
    });

    // Save the account ID
    user.stripeAccountId = account.id;
    user.isStripeOnboarded = false;
    await user.save();

    res.json({ 
      accountId: account.id,
      existing: false
    });
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this route in djRoutes.js
router.get('/check-account-status/:userId', async (req, res) => {
  try {
    const user = await DjProfile.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.stripeAccountId) {
      // Get latest account details from Stripe
      const account = await stripe.accounts.retrieve(user.stripeAccountId);
      
      // Update onboarding status if details are submitted
      if (account.details_submitted && !user.isStripeOnboarded) {
        user.isStripeOnboarded = true;
        await user.save();
      }

      return res.json({
        accountId: user.stripeAccountId,
        isOnboarded: user.isStripeOnboarded
      });
    }

    res.json({ accountId: null, isOnboarded: false });
  } catch (error) {
    console.error('Error checking account status:', error);
    res.status(500).json({ message: error.message });
  }
});


// Get all DJs endpoint
router.get('/api/djs', async (req, res) => {
  try {
    const djs = await DjProfile.find({ stripeAccountId: { $exists: true, $ne: null }, isStripeOnboarded: true })
      .select('name _id');
    res.json(djs);
  } catch (error) {
    console.error('Error fetching DJs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
