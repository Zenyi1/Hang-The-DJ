import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

      if (!token) {
        setMessage('No token found. Please login first.');
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        if (error.response.status === 403 || error.response.status === 401) {
          setMessage('Session expired. Please login again.');
          localStorage.removeItem('token'); // Clear the token
          navigate('/login'); // Redirect to login if token is invalid
        } else {
          console.error(error)
          setMessage('Failed to fetch account details. Please try again later.');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!userData) {
    return <div>Loading account details...</div>; // Loading state
  }

  return (
    <div className="account-page">
      <h2>Welcome, {userData.email}!</h2>
      <p>Your account details:</p>
      <ul>
        <li>Email: {userData.email}</li>
        <li>Account ID: {userData.id}</li>
        <li>Bio: {userData.bio}</li>
        {/* Add more account details as needed */}
      </ul>
    </div>
  );
};

export default AccountPage;
