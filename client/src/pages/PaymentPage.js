import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { djId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(5); // Default amount
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const predefinedAmounts = [2.5, 5, 10, 20, 50];

  const createCheckoutSession = async () => {
    setLoading(true);
    console.log('Attempting to create checkout session for DJ:', djId);
    try {
      const finalAmount = isCustomAmount ? parseFloat(customAmount) : amount;
      const response = await axios.post('http://localhost:5000/api/create-checkout-session', {
        djId,
        amount: finalAmount * 100 // Convert to cents for Stripe
      });
      console.log('Response received:', response.data);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error.response || error);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Choose Tip Amount</h2>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setAmount(preset);
                setIsCustomAmount(false);
              }}
              className={`p-2 rounded ${
                amount === preset && !isCustomAmount 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ${preset}
            </button>
          ))}
          <button
            onClick={() => setIsCustomAmount(true)}
            className={`p-2 rounded ${
              isCustomAmount 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Custom
          </button>
        </div>

        {isCustomAmount && (
          <input
            type="number"
            min="1"
            step="0.50"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter amount"
          />
        )}

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <button
          onClick={createCheckoutSession}
          disabled={loading || (isCustomAmount && !customAmount)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Tip $${isCustomAmount ? customAmount || '0' : amount}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
