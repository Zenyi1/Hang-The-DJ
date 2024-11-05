import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const StyledContainer = styled.div`
  background-color: #121212;
  min-height: 100vh;
  color: #fff;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #1DB954;
  text-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
`;

const DjList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DjCard = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border-radius: 15px;
  padding: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(29, 185, 84, 0.3);
  }
`;

const DjName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const TipButton = styled.button`
  background-color: #1DB954;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1ed760;
    box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
  }
`;

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
    <StyledContainer>
      <Title>Choose Your DJ</Title>
      <DjList>
        {djs.map(dj => (
          <DjCard key={dj._id}>
            <DjName>{dj.name}</DjName>
            <TipButton onClick={() => handleTip(dj._id)}>
              Tip DJ
            </TipButton>
          </DjCard>
        ))}
      </DjList>
    </StyledContainer>
  );
};

export default ChoosePage;
