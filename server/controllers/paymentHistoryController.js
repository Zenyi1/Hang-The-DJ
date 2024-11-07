const stripe = require('stripe')(process.env.STRIPE_SECRET);
const jwt = require('jsonwebtoken');

exports.getPaymentHistory = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Verify authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // Verify Stripe API key exists
    if (!process.env.STRIPE_SECRET) {
      console.error('Stripe API key is not configured');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    // First get transfers to this connected account
    const transfers = await stripe.transfers.list({
      destination: accountId,
      limit: 10,
      expand: ['data.destination_payment']
    });

    // Calculate actual amounts after all fees
    const payments = transfers.data.map(transfer => {
        const originalAmount = transfer.amount + transfer.amount_reversed || 0;
        const stripeFee = Math.round(originalAmount * 0.029 + 30); // 2.9% + 30¢
        const platformFee = Math.round(originalAmount * 0.05); // Your 5% fee
        const djAmount = transfer.amount - stripeFee - platformFee;
  
        return {
          id: transfer.id,
          amount: djAmount, // This is now the actual amount after all fees
          originalAmount: originalAmount,
          status: transfer.status,
          created: transfer.created,
          description: transfer.description || `Payment of $${(originalAmount / 100).toFixed(2)}`
        };
      });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

exports.createLoginLink = async (req, res) => {
  try {
    const { accountId } = req.body;
    
    // Verify authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // Verify Stripe API key exists
    if (!process.env.STRIPE_SECRET) {
      console.error('Stripe API key is not configured');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }
    
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    
    res.json({ url: loginLink.url });
  } catch (error) {
    console.error('Error creating login link:', error);
    res.status(500).json({ error: 'Failed to create login link' });
  }
};
