import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = ({ djId }) => {
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

  return (
    <div>
      <h3>Inbox</h3>
      <div>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id}>
              <p>{msg.content}</p>
              <small>From: {msg.fanId} | Amount: {msg.amountPaid}</small>
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;
