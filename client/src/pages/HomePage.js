import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sample from '../resources/DJ.mp4';

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10 bg-opacity-70 bg-black pb-6">
        <h1
          className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg hover:text-yellow-400 cursor-pointer transition duration-300"
          onClick={() => navigate('/')}
        >
          Hang The DJ
        </h1>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

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
      <div className="relative flex flex-col md:flex-row items-center justify-center p-4 space-y-6 md:space-y-0  md:space-x-6 mt-20">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex-1 md:max-w-xl">
          <video className="w-full rounded" autoPlay loop muted playsInline>
            <source src={sample} type="video/mp4" />
          </video>
        </div>
        <div className="flex-1 max-w-md">
          <div className="flex flex-col space-y-6">
            <button
              className="bg-black hover:bg-yellow-400 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate('/register')}
            >
              I'm a DJ
            </button>
            <button
              className="bg-black hover:bg-yellow-400 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate('/choose')}
            >
              Tip or Request
            </button>
          </div>
        </div>
      </div>
            {/* Description Card */}
            <div className="bg-black text-white p-6 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1 px-4">
          <p className="text-lg text-justify">
          <b>Are you a DJ? </b><br />
          Make some extra cash, your supporter and/or fans will be able to tip and interact with you.
          </p>
        </div>
        <div className="flex-1">
          <img src="/audience.jpg" alt="Audience" className="w-full h-auto rounded-lg shadow-md" />
        </div>
      </div>
       {/* Description Card */}
       <div className="bg-black text-white p-6 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
       <div className="flex-1">
          <img src="/audience2.jpg" alt="Audience" className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div className="flex-1 px-4">
          <p className="text-lg text-justify">
          <b>Are you a fan? </b><br />
          HangTheDJ is the best way to communicate directly with your favorite performer, do you want to request a song during a live performance? Ask them to check out your soundcloud? Tell them their current set is s**t, or simply support them. Hang The Dj is the best way to do it, simply scan the QR code or visit their link.
          You know how fans interact with streamers and send them money for tts? This is the same but better and for your favorite artists. Why is it better you ask? Don't worry about it just take our word for it.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-80 py-4 text-center text-white">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm border-b border-gray-600 pb-px mb-2 md:mb-0 md:border-none">
            © {new Date().getFullYear()} Hang The DJ. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-yellow-400 transition duration-300">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms')} className="ml-auto hover:text-yellow-400 transition duration-300">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

    
