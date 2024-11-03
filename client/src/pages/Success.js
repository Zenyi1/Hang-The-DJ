import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Succesful
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was approved, you will be redirected to the artist's page in 10 seconds
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          HangTheDJ
        </button>
      </div>
    </div>
  );
};

export default Success;
