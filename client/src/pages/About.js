import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-yellow-400 hover:text-yellow-300"
      >
        ← Back to Home
      </button>
      <h1 className="text-4xl font-bold mb-6">About Hang The DJ</h1>
      <div className="max-w-3xl">
        <p className="mb-4">
          Are you a DJ?
          Make some extra cash, your supporter and/or fans will be able to tip and interact with you.
        </p>
        <p className="mb-4">
          Are you a fan?
          HangTheDJ is the best way to communicate directly with your favorite performer, do you want to request a song during a live performance? Ask them to check out your soundcloud? Tell them their current set is s**t, or simply support them. Hang The Dj is the best way to do it, simply scan the QR code or visit their link.
          You know how fans interact with streamers and send them money for tts? This is the same but for your favorite artists. Why is it better you ask? Don't worry about it just take our word for it.
        </p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default About;
