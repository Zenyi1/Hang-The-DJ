import React from 'react';
import { useNavigate } from 'react-router-dom';
import sample from '../resources/DJ.mp4';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center">
      <video
        className="absolute inset-0 min-w-full min-h-full object-cover z-[-1]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={sample} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
      <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg mb-10 animate-bounce">
        Hang The DJ
      </h1>
      <div className="flex flex-col gap-4">
        <button
          className="bg-black hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate('/register')}
        >
          I'm a DJ
        </button>
        <form className="bg-black hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
          <button type="submit" onClick={() => navigate('/choose')}>
            Tip or Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;