import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { djId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await axios.post('http://localhost:5000/create-checkout-session', { djId });
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        setError('Failed to create checkout session. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [djId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return null; // Component will redirect, so no need to render anything
};

export default PaymentPage;
