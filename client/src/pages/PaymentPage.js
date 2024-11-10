import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const PaymentCard = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
  color: #1DB954;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(29, 185, 84, 0.3);
`;

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AmountButton = styled.button`
  background: ${props => props.selected ? '#1DB954' : '#333'};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.selected ? '#1ed760' : '#444'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const CustomInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  background-color: #333;
  border: 2px solid ${props => props.error ? '#ff4444' : '#1DB954'};
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(29, 185, 84, 0.3);
  }

  &::placeholder {
    color: #888;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #1ed760;
    box-shadow: 0 0 20px rgba(29, 185, 84, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  color: #1DB954;
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
`;

const PaymentPage = () => {
  const { djId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [message, setMessage] = useState('');
  const [fanId, setFanId] = useState(''); // Initialize state for fan name

  


  const predefinedAmounts = [2.5, 5, 10, 20, 50];

  const createCheckoutSession = async () => {
    setLoading(true);
    try {
      const finalAmount = isCustomAmount ? parseFloat(customAmount) : amount;
      const response = await axios.post('http://localhost:5000/api/create-checkout-session', {
        djId,
        amount: finalAmount * 100,
        message,
        fanId: fanId,
      });
      window.location.href = response.data.url;
    } catch (error) {
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner>Processing your request...</LoadingSpinner>;

  return (
    <Container>
      <PaymentCard>
        <Title>Choose Your Tip Amount</Title>
        
        <AmountGrid>
          {predefinedAmounts.map((preset) => (
            <AmountButton
              key={preset}
              selected={amount === preset && !isCustomAmount}
              onClick={() => {
                setAmount(preset);
                setIsCustomAmount(false);
              }}
            >
              ${preset}
            </AmountButton>
          ))}
          <AmountButton
            selected={isCustomAmount}
            onClick={() => setIsCustomAmount(true)}
          >
            Custom
          </AmountButton>
        </AmountGrid>

        {isCustomAmount && (
          <CustomInput
            type="number"
            min="1"
            step="0.50"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount"
            error={error}
          />
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Input for the fan's name */}
        <CustomInput
          type="text"
          maxLength="20" // Limit to 20 characters
          value={fanId}
          onChange={(e) => setFanId(e.target.value)} // Handle name changes
          placeholder="Your name (max 20 characters)"
        />

        {/* Message input field */}
        <CustomInput
          type="text"
          maxLength="250"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update message state
          placeholder="Optional message for the DJ"
        />

        <SubmitButton
          onClick={createCheckoutSession}
          disabled={loading || (isCustomAmount && !customAmount)}
        >
          {loading ? 'Processing...' : `Tip $${isCustomAmount ? customAmount || '0' : amount}`}
        </SubmitButton>
      </PaymentCard>

    </Container>
  );
};

export default PaymentPage;
