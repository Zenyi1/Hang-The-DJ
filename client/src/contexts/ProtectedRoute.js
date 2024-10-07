import React from 'react';
import { Navigate } from 'react-router-dom';

// Higher Order Component to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected content
};

export default ProtectedRoute;