import React, { useState } from 'react';
import axios from 'axios'; // Import axios if using it

const DjProfileForm = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // To track message type (success or error)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear message on submit

    try {
      const response = await axios.post('http://localhost:5000/api/djs', {
        name,
        bio,
        link,
      });

      if (response.data.success) {
        setMessage('DJ profile created successfully!');
        setMessageType('success'); // Set message type to success
        setName('');
        setBio('');
        setLink('');
      }
    } catch (error) {
      setMessage('Failed to create DJ profile. Please try again.');
      setMessageType('error'); // Set message type to error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your DJ Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            DJ Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your DJ name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write a short bio"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">
            Profile Link
          </label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter a link to your profile"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
        {message && (
          <p className={`mt-4 text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default DjProfileForm;

