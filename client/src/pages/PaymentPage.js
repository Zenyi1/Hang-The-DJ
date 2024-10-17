import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { djId } = useParams();
  const [djProfile, setDjProfile] = useState(null);

  useEffect(() => {
    const fetchDjProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pay/${djId}`);
        setDjProfile(response.data);
      } catch (error) {
        console.error('Error fetching DJ profile:', error);
      }
    };

    fetchDjProfile();
  }, [djId]);

  if (!djProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Tip {djProfile.djName}</h2>
      <form action="http://localhost:5000/create-checkout-session" method="POST">
      <button type="submit">Checkout</button>
    </form>
      <button onClick={() => window.location.href = djProfile.url}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
