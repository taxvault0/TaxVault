import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = ['user', 'ca'] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default PrivateRoute;



