import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const InboxPage = () => {
  const { djId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${djId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages: ', error);
    }
  };

  useEffect(() => {
    fetchMessages(); // fetch messages initially

    // Set up polling every 5 seconds (adjust as necessary)
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, [djId]);

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(prev => prev.filter(msg => msg._id !== msgId));
    } catch (error) {
      console.error('Unable to delete message:', error);
      // Optionally, show a message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <button 
        className="mb-5 px-4 py-2 bg-white hover:bg-yellow-400 rounded"
        onClick={() => navigate(-1)}
      >
        <b>Back</b>
      </button>
      <h3 className="text-3xl text-white font-bold mb-5">Inbox</h3>
      <div className="w-full max-w-md">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className="p-4 rounded-lg shadow-lg mb-4 ml-4 mr-4 transform transition bg-white hover:bg-yellow-400 hover:scale-105"
            >
              <p className="text-black text-lg mb-2">{msg.content}</p>
              <small className="text-gray-500">From: {msg.fanId} | Amount: ${msg.amountPaid.toFixed(2)}</small>
              <div className="mt-2">
                <button 
                  onClick={() => handleDelete(msg._id)} 
                  className="px-3 py-1 bg-black text-white rounded hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
