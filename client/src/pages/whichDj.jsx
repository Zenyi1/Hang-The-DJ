import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const displayedDjs = searchTerm
    ? filteredDjs
    : showAll
      ? djs
      : djs.slice(0, 5);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">Find Your DJ</h1>
      <input
        type="text"
        placeholder="Search DJ by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-1/2 max-w-lg p-3 mb-4 rounded-lg border-2 border-yellow-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {searchTerm ? (
        filteredDjs.length === 0 ? (
          <p className="text-gray-400">No DJs found matching "{searchTerm}"</p>
        ) : (
          <h3 className="text-xl text-gray-300">Search Results ({filteredDjs.length} DJs found)</h3>
        )
      ) : (
        <h3 className="text-xl text-gray-300">{showAll ? 'All DJs' : 'Featured DJs'}</h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {displayedDjs.map(dj => (
          <div key={dj._id} className="bg-gray-800 p-4 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold">{dj.name}</h2>
            <button onClick={() => handleTip(dj._id)} className="mt-4 w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-green-500 transition">
              Tip DJ
            </button>
          </div>
        ))}
      </div>

      {!searchTerm && !showAll && djs.length > 5 && (
        <button onClick={() => setShowAll(true)} className="mt-4 bg-transparent text-yellow-400 border-2 border-yellow-400 py-2 px-4 rounded-lg transition hover:bg-yellow-400 hover:text-black">
          Show All DJs ({djs.length})
        </button>
      )}

      {!searchTerm && showAll && (
        <button onClick={() => setShowAll(false)} className="mt-4 bg-transparent text-yellow-400 border-2 border-yellow-400 py-2 px-4 rounded-lg transition hover:bg-yellow-400 hover:text-black">
          Show Less
        </button>
      )}
    </div>
  );
};

export default ChoosePage;
