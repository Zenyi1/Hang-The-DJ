import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/cool-background.png')" }} 
    >
      <h1 className="text-7xl md:text-8xl font-extrabold text-white drop-shadow-lg mb-10 animate-pulse">
        Hang The DJ
      </h1>
      <div className="flex flex-col gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate('/dj-profile')} // Navigate to DJ Profile form
        >
          I'm a DJ
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
          Tip or Request
        </button>
      </div>
    </div>
  );
};

export default HomePage;
