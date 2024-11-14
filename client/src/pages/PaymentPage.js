import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { djId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] =

useState(false);
const [message, setMessage] = useState('');
const [fanId, setFanId] = useState('');

const predefinedAmounts = [2.5, 5, 10, 20, 50];

const createCheckoutSession = async () => {
  setLoading(true);
  try {
    const finalAmount = isCustomAmount ? parseFloat(customAmount) : amount;
    const response = await axios.post('http://localhost:5000/api/create-checkout-session', {
      djId,
      amount: finalAmount * 100,
      message,
      fanId
    });
    window.location.href = response.data.url;
  } catch (error) {
    setError('Failed to create checkout session. Please try again.');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6">
    {loading && <div className="text-yellow-400">Processing your request...</div>}

    <div className="bg-black rounded-lg p-6 max-w-md w-full shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Choose Your Tip Amount</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {predefinedAmounts.map((preset) => (
          <button
            key={preset}
            className={`flex-1 p-3 rounded-lg font-bold text-black transition ${amount === preset && !isCustomAmount ? 'bg-yellow-400' : 'bg-white'} hover:bg-yellow-400`}
            onClick={() => {
              setAmount(preset);
              setIsCustomAmount(false);
            }}
          >
            £{preset}
          </button>
        ))}
        <button
          className={`flex-1 p-3 rounded-lg font-bold text-black transition ${isCustomAmount ? 'bg-yellow-400' : 'bg-white'} hover:bg-yellow-400`}
          onClick={() => setIsCustomAmount(true)}
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
          placeholder="Enter amount"
          className="w-full p-3 mb-4 rounded-lg border-2 border-yellow-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      )}

      {error && <div className="text-red-500 text-center mb-3">{error}</div>}

      <input
        type="text"
        maxLength="20"
        value={fanId}
        onChange={(e) => setFanId(e.target.value)}
        placeholder="Your name (max 20 characters)"
        className="w-full p-3 mb-4 rounded-lg border-2 border-yellow-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="text"
        maxLength="250"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Optional message for the DJ"
        className="w-full p-3 mb-4 rounded-lg border-2 border-yellow-400 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        onClick={createCheckoutSession}
        disabled={loading || (isCustomAmount && !customAmount)}
        className="w-full p-3 bg-yellow-400 text-black font-bold rounded-lg transition hover:bg-green-500 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Tip £${isCustomAmount ? customAmount || '0' : amount}`}
      </button>
    </div>
  </div>
);
};

export default PaymentPage;
