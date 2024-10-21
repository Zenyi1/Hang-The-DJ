import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChoosePage = () => {
  const [djs, setDjs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDjs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/api/djs');
        setDjs(response.data);
      } catch (error) {
        console.error('Error fetching DJs:', error);
      }
    };
    fetchDjs();
  }, []);

  const handleTip = (djId) => {
    navigate(`/pay/${djId}`);
  };

  return (
    <div>
      <h1>Choose a DJ to Tip</h1>
      <ul>
        {djs.map(dj => (
          <li key={dj._id}>
            {dj.name} - <button onClick={() => handleTip(dj._id)}>Tip</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChoosePage;
