import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const StyledContainer = styled.div`
  background-color: #121212;
  min-height: 100vh;
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #ffee58;
  text-shadow: 0 0 10px rgba(255,238,88, 0.8);
`;

const SearchBar = styled.input`
  width: 50%;
  max-width: 500px;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 25px;
  border: 2px solid #ffee58;
  background-color: #2a2a2a;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 10px rgba(255,238,88, 0.5);
  }

  &::placeholder {
    color: #888;
  }
`;

const DjCard = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border-radius: 15px;
  padding: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 300px;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255,238,88, 0.8);
  }
`;

const DjName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
  text-align: center;
`;

const TipButton = styled.button`
  background-color: #ffee58;
  color: black;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
  width: 100%;
  
  &:hover {
    background-color: #1ed760;
    box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
  }
`;

const NoResults = styled.p`
  color: #888;
  font-size: 1.2rem;
  margin-top: 2rem;
  text-align: center;
`;

const SubTitle = styled.h3`
  color: #888;
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ShowMoreButton = styled.button`
  background-color: transparent;
  color: #ffee58;
  border: 2px solid #ffee58;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.2s;

  &:hover {
    background-color: #ffee58;
    color: black;
  }
`;

const ChoosePage = () => {
  const [djs, setDjs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
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

  const filteredDjs = djs.filter(dj =>
    dj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If there's a search term, show all filtered results
  // If not, show either top 5 or all depending on showAll state
  const displayedDjs = searchTerm
    ? filteredDjs
    : showAll
    ? djs
    : djs.slice(0, 5);

  return (
    <StyledContainer>
      <Title>Find Your DJ</Title>
      <SearchBar
        type="text"
        placeholder="Search DJ by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {searchTerm ? (
        filteredDjs.length === 0 ? (
          <NoResults>No DJs found matching "{searchTerm}"</NoResults>
        ) : (
          <SubTitle>Search Results ({filteredDjs.length} DJs found)</SubTitle>
        )
      ) : (
        <SubTitle>
          {showAll ? 'All DJs' : 'Featured DJs'}
        </SubTitle>
      )}

      {displayedDjs.map(dj => (
        <DjCard key={dj._id}>
          <DjName>{dj.name}</DjName>
          <TipButton onClick={() => handleTip(dj._id)}>
            Tip DJ
          </TipButton>
        </DjCard>
      ))}

      {!searchTerm && !showAll && djs.length > 5 && (
        <ShowMoreButton onClick={() => setShowAll(true)}>
          Show All DJs ({djs.length})
        </ShowMoreButton>
      )}

      {!searchTerm && showAll && (
        <ShowMoreButton onClick={() => setShowAll(false)}>
          Show Less
        </ShowMoreButton>
      )}
    </StyledContainer>
  );
};

export default ChoosePage;
