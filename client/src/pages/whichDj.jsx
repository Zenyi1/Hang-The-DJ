import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChoosePage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleTip = () => {
    // Redirect to payment page with the DJ's username
    navigate(`/pay/${username}`);
  };

  return (
    <div>
      <h1>Welcome to Hang the DJ</h1>
      <input
        type="text"
        placeholder="Enter DJ's username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleTip}>Tip DJ</button>
    </div>
  );
};

export default ChoosePage;
