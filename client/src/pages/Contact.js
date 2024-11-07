import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-yellow-400 hover:text-yellow-300"
      >
        ← Back to Home
      </button>
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-3xl">
        <p className="mb-6">
          Is the platform buggy? Do you Hate it? Do you Love it? Let us know!!!
        </p>
        <p className="mb-6">
          This is the work of one solo developer so there will absolutely be bugs, please reach out if anything's not right and I will do my best to solve it right away. 
        </p>
        <div className="space-y-4">
          <p>Email: contact@hangthedj.com</p>
          <p>Phone: +44 7598******* </p>
          <p>Address: Somewhere in Aberdeen</p>
        </div>
        {/* Add contact form or additional information as needed */}
      </div>
    </div>
  );
};

export default Contact;
