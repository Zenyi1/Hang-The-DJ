const DjProfile = require('../models/DjProfileForm'); // Add this at the top


const createCheckoutSession = async (req, res) => {
  console.log('Endpoint hit!', new Date().toISOString());
  console.log('Request body:', req.body);
  const { djId } = req.body;
  console.log('1. Received DJ ID:', djId); // Log the incoming DJ ID

  // Add this check
  if (!process.env.CLIENT_URL) {
    console.error('CLIENT_URL is not defined in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET);
  console.log('2. Stripe Secret Key:', process.env.STRIPE_SECRET); // Log the Stripe key (careful with security!)




  try {
    const djProfile = await DjProfile.findById(djId);
    console.log('3. Found DJ Profile:', djProfile); // Log the entire DJ profile


    if (!djProfile || !djProfile.stripeAccountId) {
      console.log('4. DJ Profile validation failed:', { 
                profileExists: !!djProfile, 
                hasStripeAccount: !!djProfile?.stripeAccountId 
      });
      return res.status(404).json({ message: 'DJ not found or Stripe account not linked' });
    }


    console.log('5. DJ Stripe Account ID:', djProfile.stripeAccountId);

     // Log the checkout session parameters
     console.log('6. Creating checkout session with params:', {
      destination: djProfile.stripeAccountId,
      amount: 500,
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
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      payment_intent_data: {
        application_fee_amount: 50,
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