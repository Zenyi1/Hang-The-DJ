import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email });
      if (response.data.message) {
        setMessage('Verification code sent! Please check your email.');
      }
    } catch (error) {
        console.error(error)
      setMessage('Failed to send verification code. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Verification Code</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
