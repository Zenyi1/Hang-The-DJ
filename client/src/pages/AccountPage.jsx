import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStripeConnect } from "../hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { FaEnvelope } from 'react-icons/fa'; // Import an icon library (like react-icons)
import HomePage from './HomePage';
import {QRCodeCanvas} from 'qrcode.react';  // Import the QR Code component
import { jsPDF } from "jspdf"; // Import jsPDF



const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // State to show/hide the QR code
  const [qrCodeUrl, setQRCodeUrl] = useState(''); // State for the QR code URL
  const [editForm, setEditForm] = useState({
    name: '',
    bio: ''
  });

  // State for account creation and onboarding
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  //const [profilePicture, setProfilePicture] = useState(null);
  const stripeConnectInstance = useStripeConnect(connectedAccountId);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const qrCodeRef = useRef(null);  // Ref to capture QR code SVG


  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (connectedAccountId && userData?.isStripeOnboarded) {
        try {
          // Only fetch payment history, remove dashboard link fetch
          const historyResponse = await axios.get(`http://localhost:5000/api/payment-history/${connectedAccountId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          });
          setPaymentHistory(historyResponse.data.payments);
        } catch (error) {
          console.error('Error fetching payment details:', error);
          setMessage('Failed to load payment details');
        }
      }
    };
  
    fetchPaymentDetails();
  }, [connectedAccountId, userData?.isStripeOnboarded]);
  
  

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
        console.log('Fetched user data:', response.data); // Add this log
        setUserData(response.data);
        setEditForm({
          name: response.data.name || '',
          bio: response.data.bio || ''
        });
      } catch (error) {
        console.error('Error details:', error);
        // ... rest of your error handling
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const checkStripeStatus = async () => {
      if (userData?.id) {
        try {
          const response = await fetch(`http://localhost:5000/api/check-account-status/${userData.id}`);
          const data = await response.json();
          if (data.accountId) {
            setConnectedAccountId(data.accountId);
            // Update the userData with onboarding status
            setUserData(prev => ({
              ...prev,
              isStripeOnboarded: data.isOnboarded
            }));
          }
        } catch (error) {
          console.error('Error checking Stripe status:', error);
        }
      }
    };
  
    checkStripeStatus();
  }, [userData?.id]);
  
  const handleQRCodeGeneration = () => {
    const paymentLink = `${window.location.origin}/pay/${userData.id}`;
    setQRCodeUrl(paymentLink);
    setShowQRCode(true);
  };
  
  
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrCodeCanvas');
  
    if (canvas) {
      const imgData = canvas.toDataURL('image/png'); // Convert the canvas to PNG data URL
  
      // Create a new PDF document
      const doc = new jsPDF();
  
      // Add the username at the top in bold yellow
      doc.setTextColor(255, 215, 0); // Set color to yellow
      doc.setFontSize(150);
      doc.text(userData.name || 'DJ', 0, 50); // Add username

  
      // Add the generated image (PNG) to the PDF
      doc.addImage(imgData, 'PNG', 60, 100, 100, 100); // 100x100 is the size of the image
      doc.save(`payment-link-${userData.id}.pdf`); // Save the PDF with the DJ's ID
    } else {
      console.error('QR Code canvas not found');
    }
  };

const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      console.log('Submitting edit form:', editForm); // Add this log
      const response = await axios.put(
        'http://localhost:5000/account',
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Update response:', response.data); // Add this log
      
      // Update the userData state with the response data
      setUserData(prev => ({
        ...prev,
        ...response.data
      }));
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error); // Add this log
      setMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
};



  const handleOnboardingSuccess = async (accountId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/update-stripe-account', {
        userId: userData.id, // Assuming userData contains the user's ID
        stripeAccountId: accountId,
      });
      if (response.data.message) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error saving Stripe account ID:', error);
    }
  };

  const onOnboardingComplete = async (accountId) => {
    setConnectedAccountId(accountId);
    try {
      const response = await axios.post('http://localhost:5000/api/update-stripe-account', {
        userId: userData.id,
        stripeAccountId: accountId,
        isOnboarded: true  // Add this line
      });
      if (response.data.message) {
        console.log(response.data.message);
        // Update local state to reflect onboarding completion
        setUserData(prev => ({
          ...prev,
          isStripeOnboarded: true
        }));
      }
    } catch (error) {
      console.error('Error saving Stripe account ID:', error);
    }
  };
  
/*
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('email', userData.email);
      axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        const fullUrl = `http://localhost:5000${response.data.url}`;
        setProfilePicture(fullUrl);
        setUserData(prev => ({ ...prev, profilePicture: fullUrl }));
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setMessage('Failed to upload profile picture. Please try again.');
      });
    }
  }; */

  if (message && message.includes('login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <p className="text-center text-red-500">{message}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Go to Login
          </button>
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex">

        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 w-2/3">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(`/inbox/${userData.id}`)}
        >
          <FaEnvelope size={24} />
        </button>
        {message && !message.includes('login') && (
          <div 
            className={`mb-4 p-3 rounded ${
              message.includes('Failed') 
                ? 'bg-red-100 text-red-700' 
                : message.includes('successfully') 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
            }`}
          >
            {message}
          </div>
        )}
  
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome, {userData.name}!
        </h2>

        
        <div className="space-y-4">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Account Details</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
            <ul className="mt-2 space-y-2">
              <li className="text-gray-600">
                <span className="font-medium">Email:</span> {userData.email}
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Name:</span> {' '}
                {userData.name ? userData.name : 'Not set'}
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Bio:</span> {userData.bio || 'No bio available'}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Payment Setup Section */}
      <div className="max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg p-8">
        <h3 className="text-xl font-bold mb-4">Payment Setup</h3>
        <div className="container">
          <div className="content">
            {connectedAccountId ? (
              <div>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p>
                    Your connected account ID:{" "}
                    <code className="font-bold">{connectedAccountId}</code>
                  </p>
                  {userData.isStripeOnboarded ? (
                    <p className="text-green-600 mt-2">✓ Your account is fully set up</p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-yellow-600 mb-2">⚠️ Please complete your account setup</p>
                      {stripeConnectInstance && (
                        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                          <ConnectAccountOnboarding
                            onExit={() => setOnboardingExited(true)}
                            onComplete={(accountId) => onOnboardingComplete(accountId)}
                          />
                        </ConnectComponentsProvider>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2>Get ready for take off</h2>
                <p>Join our team of DJs to start accepting payments for your services.</p>
                {!accountCreatePending && (
                  <button
                    onClick={async () => {
                      setAccountCreatePending(true);
                      setError(false);
                      try {
                        const response = await fetch("http://localhost:5000/api/create-stripe-account", {
                          method: "POST",
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            userId: userData.id
                          })
                        });
                      
                        const data = await response.json();
                        
                        if (data.accountId) {
                          setAccountCreatePending(false);
                          setConnectedAccountId(data.accountId);
                        } else {
                          setError(true);
                          setAccountCreatePending(false);
                        }
                      } catch (error) {
                        console.error('Error setting up Stripe:', error);
                        setError(true);
                        setAccountCreatePending(false);
                      }
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
                  >
                    Set Up Payments
                  </button>
                )}
              </div>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {error && (
              <p className="text-red-500 mt-2">Something went wrong!</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      {userData?.isStripeOnboarded && connectedAccountId && (
        <div className="max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Payment History</h3>
          </div>
          
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {paymentHistory.slice(0, showAllPayments ? paymentHistory.length : 5).map((payment) => (
                <div 
                  key={payment.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                   <div className="flex justify-between">
                    <span className="font-medium">
                      ${(payment.amount / 100).toFixed(2)}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(payment.created * 1000).toLocaleDateString()}
                  </div>
                  {payment.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {payment.description}
                    </div>
                  )}
                </div>
              ))}
              {!showAllPayments && paymentHistory.length > 5 && (
                <button 
                  onClick={() => setShowAllPayments(true)} 
                  className="mt-4 text-blue-500 hover:underline"
                >
                  View All Payments
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No payment history available yet
            </p>
          )}
        </div>
      )}

      {/* Payment Link Section */}
      {userData?.isStripeOnboarded && connectedAccountId && (
        <div className="max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Your Payment Link</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Share this link to receive payments:</p>
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                readOnly
                value={`${window.location.origin}/pay/${userData.id}`}
                className="flex-1 p-2 border rounded bg-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/pay/${userData.id}`);
                  setMessage('Link copied to clipboard!');
                  setTimeout(() => setMessage(''), 3000);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
          <button
                onClick={handleQRCodeGeneration}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                GET QR
              </button>
              {showQRCode && qrCodeUrl && (
                <div className="mt-4">
                  <QRCodeCanvas id="qrCodeCanvas" value={qrCodeUrl} size={128} />
                  <button
                    onClick={handleDownloadQRCode}
                    className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download QR
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  </div>
);
};
export default AccountPage;