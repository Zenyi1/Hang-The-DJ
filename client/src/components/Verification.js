import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyLogin = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/auth/verify', { email, verificationCode });
      if (response.data.success) {
        setMessage('Logged in successfully!');
        localStorage.setItem('token', response.data.token);
        navigate('/account');
      } else {
        setMessage('Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      setMessage('Failed to verify code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('../../public/mobile-background.jpg')] md:bg-[url('../../public/desktop-background.jpg')]">
      <div className='bg-white shadow-md rounded-lg p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Enter Verification Code</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your verification code"
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={verificationCode}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button 
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"

          >Verify Code</button>
          {message && <p className={`mt-4 text-center ${message.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyLogin;
