import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login'; // Adjust the path as needed
import VerifyLogin from './components/Verification'; // Adjust the path as needed
import DjProfileForm from './components/DjProfileForm';
import ProtectedRoute from './contexts/ProtectedRoute';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import ChoosePage from './pages/whichDj';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import About from './pages/About';
import Contact from './pages/Contact';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<DjProfileForm />} /> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/verify" element={<VerifyLogin/>}/>
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/pay/:djId" element={<PaymentPage/>}/>
        <Route path="/choose" element={<ChoosePage/>}/>
        <Route path="/success" element={<Success/>}/>
        <Route path="/cancel" element={<Cancel/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </Router>
  );
};

export default App;
