const createCheckoutSession = async (req, res) => {
  const { djId } = req.body;
  
  try {
    const djProfile = await DjProfile.findById(djId);

    if (!djProfile || !djProfile.stripeAccountId) {
      return res.status(404).json({ message: 'DJ not found or Stripe account not linked' });
    }

    console.log('DJ Stripe Account ID:', djProfile.stripeAccountId);

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

    res.json({ url: session.url });
  } catch (error) {
    console.error('Full error object:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { createCheckoutSession };