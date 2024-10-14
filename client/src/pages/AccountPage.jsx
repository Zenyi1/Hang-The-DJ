import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStripeConnect } from "../hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('No token found. Please login first.');
        navigate('/login');
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
        console.error('Error details:', error);
        
        // Handle different types of errors appropriately
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 401 || error.response.status === 403) {
            setMessage('Session expired. Please login again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setMessage(`Error: ${error.response.data.message || 'Failed to fetch account details'}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          setMessage('No response from server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setMessage('An error occurred. Please try again later.');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <p className="text-center text-red-500">{message}</p>
          {message.includes('login') && (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <p className="text-center">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome, {userData.email}!
        </h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700">Account Details</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-gray-600">
                <span className="font-medium">Email:</span> {userData.email}
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Account ID:</span> {userData.id}
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Bio:</span> {userData.bio || 'No bio available'}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
      <div className="banner">
        <h2>HangTheDJ</h2>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {connectedAccountId && !stripeConnectInstance && <h2>Add information to start accepting money</h2>}
        {!connectedAccountId && <p>Rocket Rides is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>}
        {!accountCreatePending && !connectedAccountId && (
          <div>
            <button
              onClick={async () => {
                setAccountCreatePending(true);
                setError(false);
                fetch("http://localhost:5000/accountsetup", {
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountCreatePending(false);
                    const { account, error } = json;

                    if (account) {
                      setConnectedAccountId(account);
                    }

                    if (error) {
                      setError(true);
                    }
                  });
              }}
            >
              Sign up
            </button>
          </div>
        )}
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={() => setOnboardingExited(true)}
            />
          </ConnectComponentsProvider>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || onboardingExited) && (
          <div className="dev-callout">
            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {onboardingExited && <p>The Account Onboarding component has exited</p>}
          </div>
        )}
        <div className="info-callout">
          <p>
            This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AccountPage;