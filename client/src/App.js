import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DjProfileForm from './components/DjProfileForm' // Import your form component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dj-profile" element={<DjProfileForm />} /> {/* DJ Profile form route */}
      </Routes>
    </Router>
  );
};

export default App;
