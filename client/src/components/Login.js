import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email });
      if (response.data.message) {
        setMessage('Verification code sent! Please check your email.');
        navigate('/verify', {state: {email}}); //pass email as a state so the user doesnt have to retype it

      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to send verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('../../public/mobile-background.jpg')] md:bg-[url('../../public/desktop-background.jpg')]">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Send Verification Code
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
