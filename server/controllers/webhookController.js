const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Message = require('../models/MessageForm');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log('Stripe Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET);

  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Here you can retrieve the data you need from the session and save it to your Message
      await Message.create({
        content: session.metadata.message, // Make sure you set this in the metadata when creating the session
        fanId: session.metadata.fanId, // Save any relevant data
        toDJId: session.metadata.djId,
        amountPaid: session.amount_total / 100, // Stripe returns in cents
      });

      console.log('Payment received for session:', session.id);
      break;
    // Add more cases to handle other events if necessary

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
