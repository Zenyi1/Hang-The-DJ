const DjProfile = require('../models/DjProfileForm');

const createCheckoutSession = async (req, res) => {
  console.log('Endpoint hit!', new Date().toISOString());
  console.log('Request body:', req.body);
  const { djId, amount } = req.body; // Add amount to destructuring
  console.log('1. Received DJ ID:', djId);
  console.log('1a. Received amount:', amount); // Log the received amount

  // Validate amount
  const validatedAmount = parseInt(amount);
  if (isNaN(validatedAmount) || validatedAmount < 0) {
    console.error('Invalid amount received:', amount);
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const fanId = req.user ? req.user.id : 'Anonymous';


  //If Dj allows pay what you think its worth, 0 is allowed and move them to the success page
  /*
  if (validatedAmount == 0 && isItFree == True) {

  }
  */

 
  // Add this check
  if (!process.env.CLIENT_URL) {
    console.error('CLIENT_URL is not defined in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET);
  console.log('2. Stripe Secret Key:', process.env.STRIPE_SECRET);

  try {
    const djProfile = await DjProfile.findById(djId);
    console.log('3. Found DJ Profile:', djProfile);

    if (!djProfile || !djProfile.stripeAccountId) {
      console.log('4. DJ Profile validation failed:', { 
        profileExists: !!djProfile, 
        hasStripeAccount: !!djProfile?.stripeAccountId 
      });
      return res.status(404).json({ message: 'DJ not found or Stripe account not linked' });
    }

    console.log('5. DJ Stripe Account ID:', djProfile.stripeAccountId);

    // Calculate application fee (5%)
    const applicationFeeAmount = Math.round(validatedAmount * 0.05);

    // Log the checkout session parameters
    console.log('6. Creating checkout session with params:', {
      destination: djProfile.stripeAccountId,
      amount: validatedAmount,
      applicationFee: applicationFeeAmount,
      currency: 'gbp'
    });

    console.log('Creating checkout session with URLs:', {
      success: `${process.env.CLIENT_URL}/success`,
      cancel: `${process.env.CLIENT_URL}/cancel`
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Tip for ${djProfile.name}`,
            },
            unit_amount: validatedAmount, // Use the validated amount from frontend
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        message: req.body.message,
        fanId: fanId,
        djId: req.body.djId,
      },
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount, // Dynamic fee based on amount
        transfer_data: {
          destination: djProfile.stripeAccountId,
        },
      },
    });

    console.log('7. Checkout session created:', session);
    res.json({ url: session.url });
  } catch (error) {
    console.error('8. Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      raw: error.raw
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCheckoutSession };
