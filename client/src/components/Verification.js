import React, { useState } from 'react';
import axios from 'axios';

const VerifyLogin = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/auth/verify', { email, verificationCode });
      if (response.data.success) {
        setMessage('Logged in successfully!');
      } else {
        setMessage('Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      setMessage('Failed to verify code. Please try again.');
    }
  };

  return (
    <div className="verify-container">
      <form onSubmit={handleSubmit} className="verify-form">
        <h2>Enter Verification Code</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter your verification code"
          value={verificationCode}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Verify Code</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default VerifyLogin;
