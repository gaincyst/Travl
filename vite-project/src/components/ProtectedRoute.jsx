import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      // User is not authenticated, redirect to home
      alert('Please login to access this page');
      navigate('/');
    }
  }, [navigate]);

  // If authenticated, render the children (protected page)
  return isAuthenticated() ? children : null;
};

export default ProtectedRoute;
