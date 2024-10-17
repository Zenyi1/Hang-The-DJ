const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { djId } = req.body;
  const djProfile = await DjProfile.findById(djId);

  if (!djProfile || !djProfile.stripeAccountId) {
    return res.status(404).json({ message: 'DJ not found or Stripe account not linked' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'DJ Service',
            },
            unit_amount: 5000, // Example amount, adjust as needed
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://your-app.com/success`,
      cancel_url: `https://your-app.com/cancel`,
    }, {
      stripeAccount: djProfile.stripeAccountId,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCheckoutSession };
