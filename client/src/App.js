import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login'; // Adjust the path as needed
import VerifyLogin from './components/Verification'; // Adjust the path as needed
import DjProfileForm from './components/DjProfileForm';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<DjProfileForm />} /> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/verify" element={<VerifyLogin/>}/>
      </Routes>
    </Router>
  );
};

export default App;
