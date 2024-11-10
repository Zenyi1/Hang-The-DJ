// client/src/pages/InboxPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/InboxPage.css'; // Import the CSS file

const InboxPage = () => {
  const { djId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`http://localhost:5000/api/messages/${djId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    };

    fetchMessages();
  }, [djId]);

  const handleDelete = async (msgId) => {
    // Uncomment the following line when ready to implement deletion functionality
    // await axios.delete(`http://localhost:5000/api/messages/${msgId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setMessages(prev => prev.filter(msg => msg._id !== msgId));
  };

  return (
    <div className="inbox-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Back Button */}
      <h3>Inbox</h3>
      <div>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="message-card">
              <p>{msg.content}</p>
              <small>From: {msg.fanId} | Amount: {msg.amountPaid}</small>
              <button onClick={() => handleDelete(msg._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
