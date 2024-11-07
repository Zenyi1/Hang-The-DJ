import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sample from '../resources/DJ.mp4';

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
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

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        {/* Logo/Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg hover:text-yellow-400 cursor-pointer transition duration-300"
            onClick={() => navigate('/')}>
          Hang The DJ
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button
            onClick={() => navigate('/about')}
            className="text-white hover:text-yellow-400 transition duration-300"
          >
            About Us
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="text-white hover:text-yellow-400 transition duration-300"
          >
            Contact Us
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 bg-black bg-opacity-90 rounded-lg py-2 px-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  navigate('/about');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-yellow-400 transition duration-300 py-2"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  navigate('/contact');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-yellow-400 transition duration-300 py-2"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col gap-4">
          <button
            className="bg-black hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => navigate('/register')}
          >
            I'm a DJ
          </button>
          <button 
            className="bg-black hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => navigate('/choose')}
          >
            Tip or Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
